let dxfData = [];

// Conversion pixels vers mm (794 pixels = 210mm)
const SCALE = 210 / 794;

function setup() {
    createCanvas(794, 794);
    noLoop();

    // Bouton d'export
    let btn = createButton('Télécharger DXF (210mm x 210mm)');
    btn.mousePressed(exportDXF);
    btn.style('margin', '20px');
    btn.style('padding', '15px 30px');
    btn.style('font-size', '16px');
}

function draw() {
    background(20);
    translate(width / 2, height / 2);

    // Nombre de rayons principaux
    let rayons = 24;

    noFill();

    // Cercles concentriques
    for (let i = 1; i <= 8; i++) {
        let rayon = i * 40;
        stroke(255);
        strokeWeight(2);
        addCircle(0, 0, rayon * 2);
        circle(0, 0, rayon * 2);
    }

    // Lignes radiales depuis le centre
    for (let i = 0; i < rayons; i++) {
        let angle = (TWO_PI / rayons) * i;
        let x = cos(angle) * 320;
        let y = sin(angle) * 320;

        stroke(255);
        strokeWeight(1.5);
        addLine(0, 0, x, y);
        line(0, 0, x, y);
    }

    // Lignes connectant les points sur les cercles
    for (let cercle = 1; cercle <= 8; cercle++) {
        let rayon = cercle * 40;
        stroke(0, 200, 255);
        strokeWeight(1);

        let vertices = [];
        for (let i = 0; i < rayons; i++) {
            let angle1 = (TWO_PI / rayons) * i;
            let x1 = cos(angle1) * rayon;
            let y1 = sin(angle1) * rayon;
            vertices.push({x: x1, y: y1});
        }
        addPolyline(vertices, true);

        for (let i = 0; i < rayons; i++) {
            let angle1 = (TWO_PI / rayons) * i;
            let angle2 = (TWO_PI / rayons) * (i + 1);

            let x1 = cos(angle1) * rayon;
            let y1 = sin(angle1) * rayon;
            let x2 = cos(angle2) * rayon;
            let y2 = sin(angle2) * rayon;

            line(x1, y1, x2, y2);
        }
    }

    // Lignes croisées pour créer des motifs
    stroke(255, 255, 255, 100);
    for (let i = 0; i < rayons; i++) {
        for (let j = i + 2; j < i + 6 && j < rayons; j++) {
            let angle1 = (TWO_PI / rayons) * i;
            let angle2 = (TWO_PI / rayons) * j;

            let rayon = 280;
            let x1 = cos(angle1) * rayon;
            let y1 = sin(angle1) * rayon;
            let x2 = cos(angle2) * rayon;
            let y2 = sin(angle2) * rayon;

            strokeWeight(0.5);
            addLine(x1, y1, x2, y2);
            line(x1, y1, x2, y2);
        }
    }

    // Point central
    stroke(255);
    strokeWeight(8);
    point(0, 0);
}

function addLine(x1, y1, x2, y2) {
    dxfData.push({
        type: 'LINE',
        x1: x1 * SCALE,
        y1: -y1 * SCALE,
        x2: x2 * SCALE,
        y2: -y2 * SCALE
    });
}

function addCircle(x, y, diameter) {
    dxfData.push({
        type: 'CIRCLE',
        x: x * SCALE,
        y: -y * SCALE,
        radius: (diameter / 2) * SCALE
    });
}

function addPolyline(vertices, closed) {
    dxfData.push({
        type: 'POLYLINE',
        vertices: vertices.map(v => ({
            x: v.x * SCALE,
            y: -v.y * SCALE
        })),
        closed: closed
    });
}

function exportDXF() {
    let dxf = generateDXF(dxfData);

    let blob = new Blob([dxf], { type: 'application/dxf' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'rosace_210x210mm.dxf';
    a.click();
    URL.revokeObjectURL(url);
}

function generateDXF(data) {
    let dxf = `0
SECTION
2
HEADER
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
ENTITIES
`;

    for (let entity of data) {
        if (entity.type === 'LINE') {
            dxf += `0
LINE
8
0
62
6
10
${entity.x1.toFixed(6)}
20
${entity.y1.toFixed(6)}
30
0.0
11
${entity.x2.toFixed(6)}
21
${entity.y2.toFixed(6)}
31
0.0
`;
        } else if (entity.type === 'CIRCLE') {
            dxf += `0
CIRCLE
8
0
62
6
10
${entity.x.toFixed(6)}
20
${entity.y.toFixed(6)}
30
0.0
40
${entity.radius.toFixed(6)}
`;
        } else if (entity.type === 'POLYLINE') {
            dxf += `0
LWPOLYLINE
8
0
62
6
90
${entity.vertices.length}
70
${entity.closed ? 1 : 0}
`;
            for (let v of entity.vertices) {
                dxf += `10
${v.x.toFixed(6)}
20
${v.y.toFixed(6)}
`;
            }
        }
    }

    dxf += `0
ENDSEC
0
EOF
`;
    return dxf;
}
