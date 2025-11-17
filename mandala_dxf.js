let dxfData = [];
let exportColor = "#FF00FF"; // Magenta par défaut

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
    background(5, 5, 16);
    translate(width / 2, height / 2);

    let angle = 0; // Frame fixe pour l'export

    colorMode(HSB);
    noFill();

    let sections = 16;

    // Étoiles polygonales concentriques
    push();
    rotate(angle * 0.5);
    for (let couche = 1; couche <= 6; couche++) {
        let rayon = couche * 50;
        let points = sections * 2;

        stroke(280 - couche * 20, 70, 85);
        strokeWeight(1.5);

        let vertices = [];
        for (let i = 0; i <= points; i++) {
            let ang = (TWO_PI / points) * i;
            let r = (i % 2 === 0) ? rayon : rayon * 0.6;
            let x = cos(ang) * r;
            let y = sin(ang) * r;
            vertices.push({x: x, y: y});
        }
        addPolyline(vertices, true);

        beginShape();
        for (let v of vertices) {
            vertex(v.x, v.y);
        }
        endShape(CLOSE);
    }
    pop();

    // Motifs en losange
    push();
    rotate(-angle * 0.8);
    for (let i = 0; i < sections; i++) {
        push();
        rotate((TWO_PI / sections) * i);

        stroke(160 + i * 5, 75, 90);
        strokeWeight(1);

        for (let d = 80; d < 320; d += 40) {
            addLine(0, d, 30, d + 20);
            addLine(30, d + 20, 0, d + 40);
            addLine(0, d + 40, -30, d + 20);
            addLine(-30, d + 20, 0, d);

            line(0, d, 30, d + 20);
            line(30, d + 20, 0, d + 40);
            line(0, d + 40, -30, d + 20);
            line(-30, d + 20, 0, d);
        }

        pop();
    }
    pop();

    // Lignes radiales ondulées
    push();
    rotate(angle * 1.2);
    for (let i = 0; i < sections; i++) {
        let ang = (TWO_PI / sections) * i;

        stroke(200 + i * 3, 80, 95);
        strokeWeight(0.8);

        let vertices = [];
        for (let r = 0; r < 350; r += 5) {
            let wave = sin(r * 0.05) * 15;
            let x = cos(ang) * r + cos(ang + HALF_PI) * wave;
            let y = sin(ang) * r + sin(ang + HALF_PI) * wave;
            vertices.push({x: x, y: y});
        }
        addPolyline(vertices, false);

        beginShape();
        noFill();
        for (let v of vertices) {
            vertex(v.x, v.y);
        }
        endShape();
    }
    pop();

    // Cercles décoratifs
    push();
    rotate(angle * 0.6);
    for (let i = 0; i < sections; i++) {
        let ang = (TWO_PI / sections) * i;

        for (let r = 100; r < 320; r += 60) {
            let x = cos(ang) * r;
            let y = sin(ang) * r;

            stroke(240, 65, 88);
            strokeWeight(1);
            addCircle(x, y, 25);
            circle(x, y, 25);

            stroke(260, 55, 75);
            strokeWeight(0.5);
            addCircle(x, y, 15);
            circle(x, y, 15);
        }
    }
    pop();

    // Connexions entre points opposés
    push();
    rotate(angle * 0.3);
    for (let i = 0; i < sections / 2; i++) {
        let angle1 = (TWO_PI / sections) * i;
        let angle2 = (TWO_PI / sections) * (i + sections / 2);

        stroke(180, 50, 70, 0.4);
        strokeWeight(0.3);

        for (let r = 50; r < 300; r += 50) {
            let x1 = cos(angle1) * r;
            let y1 = sin(angle1) * r;
            let x2 = cos(angle2) * r;
            let y2 = sin(angle2) * r;

            addLine(x1, y1, x2, y2);
            line(x1, y1, x2, y2);
        }
    }
    pop();

    // Centre complexe
    push();
    rotate(-angle * 1.5);
    stroke(220, 80, 100);
    strokeWeight(2);
    for (let i = 0; i < 8; i++) {
        addCircle(0, 0, (8 - i) * 10);
        circle(0, 0, (8 - i) * 10);
    }
    pop();
}

function addLine(x1, y1, x2, y2) {
    dxfData.push({
        type: 'LINE',
        x1: x1 * SCALE,
        y1: -y1 * SCALE, // Inverser Y pour DXF
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
    a.download = 'mandala_210x210mm.dxf';
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
