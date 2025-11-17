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
    // --- 1. Dessin des Cercles Concentriques ---
    for (let i = 1; i <= NB_CERCLES; i++) {
        let rayon = i * ESPACEMENT_CERCLE;

        // Définition de la couleur (Alternance)
        stroke(i % 2 === 0 ? couleur1 : couleur2);
        strokeWeight(2);

        // Le dessin du cercle est centré (CENTRE, CENTRE)
        circle(CENTRE, CENTRE, rayon * 2);
    }

    // --- 2. Dessin des Lignes Radiales ---
    let rayonMax = NB_CERCLES * ESPACEMENT_CERCLE;

    for (let i = 0; i < NB_RAYONS; i++) {
        let angle = (TWO_PI / NB_RAYONS) * i;

        // Calcul des coordonnées centrées (Xc, Yc) et absolues (X, Y)
        let Xc = cos(angle) * rayonMax;
        let Yc = sin(angle) * rayonMax;

        let X = int(CENTRE + Xc);
        let Y = int(CENTRE - Yc); // INVERSION Y: Y=NP - Y_BASIC

        // Définition de la couleur
        stroke(i % 2 === 0 ? couleur1 : couleur2);
        strokeWeight(1.5);

        // Tracé Ligne : du centre (CENTRE, CENTRE) au point (X, Y)
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

            // Calcul Point 1
            let Xc1 = cos(angle1) * rayon;
            let Yc1 = sin(angle1) * rayon;
            let X1 = int(CENTRE + Xc1);
            let Y1 = int(CENTRE - Yc1);

            // Calcul Point 2
            let Xc2 = cos(angle2) * rayon;
            let Yc2 = sin(angle2) * rayon;
            let X2 = int(CENTRE + Xc2);
            let Y2 = int(CENTRE - Yc2);

            // Tracé Ligne : du point 1 au point 2
            line(X1, Y1, X2, Y2);
        }
    }

    // --- 4. Motif Entrelacé (Lignes Croisées) ---
    let rayonFixe = 280;
    stroke(255, 255, 255, 100); // Blanc transparent
    strokeWeight(0.5);

    for (let i = 0; i < NB_RAYONS; i++) {
        for (let j = i + 2; j < i + 6 && j < NB_RAYONS; j++) {
            let angle1 = (TWO_PI / NB_RAYONS) * i;
            let angle2 = (TWO_PI / NB_RAYONS) * j;

            // Calcul Point 1
            let Xc1 = cos(angle1) * rayonFixe;
            let Yc1 = sin(angle1) * rayonFixe;
            let X1 = int(CENTRE + Xc1);
            let Y1 = int(CENTRE - Yc1);

            // Calcul Point 2
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
