// --- Paramètres du programme de base (Simule les lignes 100-210 du BASIC) ---
const NP = 800;             // Dimension de la Fenêtre (simule la variable NP du BASIC)
const CENTRE = NP / 2;      // Centre de la Fenêtre
const NB_SPIRALES = 8;
const NB_TOURS = 6;
const POINTS_PAR_TOUR = 60;
const RAYON_MIN = 10;
const RAYON_MAX = 350;
const NB_RAYONS_GRILLE = 72;
// --------------------------------------------------------------------------

let pointsGlobaux = [];

function setup() {
    createCanvas(NP, NP);
    noLoop();
    colorMode(HSB, 360, 100, 100);
    noFill();
    background(10);
}

function draw() {

    let totalPoints = NB_TOURS * POINTS_PAR_TOUR;

    // --- 1. Génération des 8 Spirales et Tracé des Segments ---
    for (let s = 0; s < NB_SPIRALES; s++) {
        let angleOffset = (TWO_PI / NB_SPIRALES) * s;
        let Xprev = 0, Yprev = 0; // Coordonnées du point précédent pour le tracé (BASIC "D")

        for (let i = 0; i < totalPoints; i++) {
            let angle = (TWO_PI / POINTS_PAR_TOUR) * i + angleOffset;
            let rayon = map(i, 0, totalPoints, RAYON_MIN, RAYON_MAX);

            // Calcul des coordonnées centrées (Xc, Yc)
            let Xc = cos(angle) * rayon;
            let Yc = sin(angle) * rayon;

            // Conversion en coordonnées absolues entières (X, Y)
            let X = int(CENTRE + Xc);
            let Y = int(CENTRE - Yc); // INVERSION Y: Y=NP - Y_BASIC

            if (i > 0) {
                let hue = map(i, 0, totalPoints, 160, 280);
                stroke(hue, 80, 90);
                strokeWeight(1);
                line(Xprev, Yprev, X, Y);
            }

            // Stockage du point dans le tableau global (nécessaire pour la connexion finale)
            pointsGlobaux.push({x: X, y: Y});

            // Mise à jour du point précédent
            Xprev = X;
            Yprev = Y;
        }
    }

    // --- 2. Dessin de la Grille Radiale (Lignes droites du centre au bord) ---
    for (let i = 0; i < NB_RAYONS_GRILLE; i++) {
        let angle = (TWO_PI / NB_RAYONS_GRILLE) * i;

        // Calcul des coordonnées centrées
        let Xc2 = cos(angle) * RAYON_MAX;
        let Yc2 = sin(angle) * RAYON_MAX;

        // Conversion en coordonnées absolues entières
        let X2 = int(CENTRE + Xc2);
        let Y2 = int(CENTRE - Yc2);

        // Le point de départ (X1, Y1) est un rayon min fixé (50)
        let Xc1 = cos(angle) * 50;
        let Yc1 = sin(angle) * 50;
        let X1 = int(CENTRE + Xc1);
        let Y1 = int(CENTRE - Yc1);

        stroke(200 + i, 60, 70, 0.3); // Légère transparence pour la grille
        strokeWeight(0.5);
        line(X1, Y1, X2, Y2);
    }

    // --- 3. Connexion des points voisins (Réseau) ---
    const MAX_DISTANCE = 100;
    for (let i = 0; i < pointsGlobaux.length; i += 10) {
        for (let j = i + 50; j < i + 150 && j < pointsGlobaux.length; j += 25) {
            let d = dist(pointsGlobaux[i].x, pointsGlobaux[i].y, pointsGlobaux[j].x, pointsGlobaux[j].y);

            if (d < MAX_DISTANCE) {
                stroke(240, 70, 80, 0.2);
                strokeWeight(0.3);
                line(pointsGlobaux[i].x, pointsGlobaux[i].y, pointsGlobaux[j].x, pointsGlobaux[j].y);
            }
        }
    }

    // --- 4. Point Central ---
    stroke(180, 80, 100);
    strokeWeight(3);
    point(CENTRE, CENTRE);
}
