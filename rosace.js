// --- Paramètres du programme de base (Simule les lignes 100-210 du BASIC) ---
const NP = 800;             // Dimension de la Fenêtre (simule la variable NP du BASIC)
const CENTRE = NP / 2;      // Centre de la Fenêtre
const NB_RAYONS = 24;       // Nombre de divisions
const NB_CERCLES = 8;       // Nombre de cercles concentriques
const ESPACEMENT_CERCLE = 40; // Espacement (en "pas élémentaires")
// --------------------------------------------------------------------------

let couleur1, couleur2;

function setup() {
    createCanvas(NP, NP);
    noLoop(); // Statique
    colorMode(RGB);
    noFill();
    background(20);

    couleur1 = color(255, 255, 255); // Blanc
    couleur2 = color(0, 200, 255);   // Cyan
}

function draw() {
    dessinerRosace();
}

// --- Fonctions d'Export ---
function exporterPNG() {
    saveCanvas('rosace', 'png');
}

function exporterSVG() {
    // Générer le SVG manuellement
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${NP}" height="${NP}" viewBox="0 0 ${NP} ${NP}">
  <rect width="${NP}" height="${NP}" fill="rgb(20,20,20)"/>
  <g fill="none">
`;

    // Couleurs
    let c1 = 'rgb(255,255,255)';
    let c2 = 'rgb(0,200,255)';

    // 1. Cercles Concentriques
    for (let i = 1; i <= NB_CERCLES; i++) {
        let rayon = i * ESPACEMENT_CERCLE;
        let couleur = i % 2 === 0 ? c1 : c2;
        svgContent += `    <circle cx="${CENTRE}" cy="${CENTRE}" r="${rayon}" stroke="${couleur}" stroke-width="2"/>\n`;
    }

    // 2. Lignes Radiales
    let rayonMax = NB_CERCLES * ESPACEMENT_CERCLE;
    for (let i = 0; i < NB_RAYONS; i++) {
        let angle = (TWO_PI / NB_RAYONS) * i;
        let Xc = cos(angle) * rayonMax;
        let Yc = sin(angle) * rayonMax;
        let X = int(CENTRE + Xc);
        let Y = int(CENTRE - Yc);
        let couleur = i % 2 === 0 ? c1 : c2;
        svgContent += `    <line x1="${CENTRE}" y1="${CENTRE}" x2="${X}" y2="${Y}" stroke="${couleur}" stroke-width="1.5"/>\n`;
    }

    // 3. Connexions Polygonales
    for (let cercle = 1; cercle <= NB_CERCLES; cercle++) {
        let rayon = cercle * ESPACEMENT_CERCLE;

        for (let i = 0; i < NB_RAYONS; i++) {
            let angle1 = (TWO_PI / NB_RAYONS) * i;
            let angle2 = (TWO_PI / NB_RAYONS) * (i + 1);

            let Xc1 = cos(angle1) * rayon;
            let Yc1 = sin(angle1) * rayon;
            let X1 = int(CENTRE + Xc1);
            let Y1 = int(CENTRE - Yc1);

            let Xc2 = cos(angle2) * rayon;
            let Yc2 = sin(angle2) * rayon;
            let X2 = int(CENTRE + Xc2);
            let Y2 = int(CENTRE - Yc2);

            svgContent += `    <line x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}" stroke="${c2}" stroke-width="1"/>\n`;
        }
    }

    // 4. Motif Entrelacé
    let rayonFixe = 280;
    for (let i = 0; i < NB_RAYONS; i++) {
        for (let j = i + 2; j < i + 6 && j < NB_RAYONS; j++) {
            let angle1 = (TWO_PI / NB_RAYONS) * i;
            let angle2 = (TWO_PI / NB_RAYONS) * j;

            let Xc1 = cos(angle1) * rayonFixe;
            let Yc1 = sin(angle1) * rayonFixe;
            let X1 = int(CENTRE + Xc1);
            let Y1 = int(CENTRE - Yc1);

            let Xc2 = cos(angle2) * rayonFixe;
            let Yc2 = sin(angle2) * rayonFixe;
            let X2 = int(CENTRE + Xc2);
            let Y2 = int(CENTRE - Yc2);

            svgContent += `    <line x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}" stroke="rgba(255,255,255,0.39)" stroke-width="0.5"/>\n`;
        }
    }

    // 5. Point central
    svgContent += `    <circle cx="${CENTRE}" cy="${CENTRE}" r="4" fill="${c1}"/>\n`;

    svgContent += `  </g>
</svg>`;

    // Télécharger le SVG
    let blob = new Blob([svgContent], { type: 'image/svg+xml' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'rosace.svg';
    document.body.appendChild(a);
    a.click();

    // Nettoyer
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// Fonction séparée pour dessiner la rosace (utilisée par draw() et exporterSVG())
function dessinerRosace() {
    colorMode(RGB);
    noFill();
    background(20);

    // --- 1. Dessin des Cercles Concentriques ---
    for (let i = 1; i <= NB_CERCLES; i++) {
        let rayon = i * ESPACEMENT_CERCLE;
        stroke(i % 2 === 0 ? couleur1 : couleur2);
        strokeWeight(2);
        circle(CENTRE, CENTRE, rayon * 2);
    }

    // --- 2. Dessin des Lignes Radiales ---
    let rayonMax = NB_CERCLES * ESPACEMENT_CERCLE;

    for (let i = 0; i < NB_RAYONS; i++) {
        let angle = (TWO_PI / NB_RAYONS) * i;
        let Xc = cos(angle) * rayonMax;
        let Yc = sin(angle) * rayonMax;
        let X = int(CENTRE + Xc);
        let Y = int(CENTRE - Yc);
        stroke(i % 2 === 0 ? couleur1 : couleur2);
        strokeWeight(1.5);
        line(CENTRE, CENTRE, X, Y);
    }

    // --- 3. Dessin des Connexions Polygonales (Polyèdres) ---
    for (let cercle = 1; cercle <= NB_CERCLES; cercle++) {
        let rayon = cercle * ESPACEMENT_CERCLE;
        stroke(couleur2);
        strokeWeight(1);

        for (let i = 0; i < NB_RAYONS; i++) {
            let angle1 = (TWO_PI / NB_RAYONS) * i;
            let angle2 = (TWO_PI / NB_RAYONS) * (i + 1);

            let Xc1 = cos(angle1) * rayon;
            let Yc1 = sin(angle1) * rayon;
            let X1 = int(CENTRE + Xc1);
            let Y1 = int(CENTRE - Yc1);

            let Xc2 = cos(angle2) * rayon;
            let Yc2 = sin(angle2) * rayon;
            let X2 = int(CENTRE + Xc2);
            let Y2 = int(CENTRE - Yc2);

            line(X1, Y1, X2, Y2);
        }
    }

    // --- 4. Motif Entrelacé (Lignes Croisées) ---
    let rayonFixe = 280;
    stroke(255, 255, 255, 100);
    strokeWeight(0.5);

    for (let i = 0; i < NB_RAYONS; i++) {
        for (let j = i + 2; j < i + 6 && j < NB_RAYONS; j++) {
            let angle1 = (TWO_PI / NB_RAYONS) * i;
            let angle2 = (TWO_PI / NB_RAYONS) * j;

            let Xc1 = cos(angle1) * rayonFixe;
            let Yc1 = sin(angle1) * rayonFixe;
            let X1 = int(CENTRE + Xc1);
            let Y1 = int(CENTRE - Yc1);

            let Xc2 = cos(angle2) * rayonFixe;
            let Yc2 = sin(angle2) * rayonFixe;
            let X2 = int(CENTRE + Xc2);
            let Y2 = int(CENTRE - Yc2);

            line(X1, Y1, X2, Y2);
        }
    }

    // --- 5. Point central ---
    stroke(couleur1);
    strokeWeight(8);
    point(CENTRE, CENTRE);
}
