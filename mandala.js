// --- Variables de Configuration Globales (Simulent les paramètres BASIC NP, N, T1, etc.) ---
const NP = 800;             // Dimension de la Fenêtre (simule la variable NP du BASIC)
const CENTRE = NP / 2;      // Coordonnée centrale (400)
const NB_SECTIONS = 16;     // Symétrie de rotation (simule les divisions angulaires)
const VITESSE_BASE = 0.005; // Vitesse de rotation de base (en radians/frame)

// Angle de rotation global (mis à jour dans draw)
let angle = 0;

// ---------------------------------

function setup() {
    createCanvas(NP, NP);
    frameRate(30);
    colorMode(HSB, 360, 100, 100, 1); // Utilisation de HSB
    noFill();
    background(5, 5, 16);
}

function draw() {
    // 1. Initialisation du cadre (lignes 50-200 du BASIC : LPRINT, N=..., etc.)
    background(5, 5, 16);
    // Positionne l'origine (0,0) au centre pour simplifier les rotations et les calculs radiaux
    translate(CENTRE, CENTRE);

    // Mise à jour de l'angle de rotation à chaque frame
    angle += VITESSE_BASE;

    // 2. Appel des fonctions de dessin (Chaque fonction représente une couche)
    // L'ordre d'appel détermine la superposition.
    dessinerConnexionsOpposees(angle * 0.3); // Arrière-plan (très lent)
    dessinerEtoilesPolygonales(angle * 0.5);
    dessinerCerclesDecoratifs(angle * 0.6);
    dessinerMotifsLosanges(-angle * 0.8);    // Rotation inverse
    dessinerLignesOndulees(angle * 1.2);
    dessinerCentreComplexe(-angle * 1.5);    // Premier plan (rotation inverse rapide)
}

/**
 * Couche 1: Dessine six polygones en forme d'étoile concentriques.
 * @param {number} rotationAngle - Angle de rotation.
 */
function dessinerEtoilesPolygonales(rotationAngle) {
    push(); // Enregistre le système de coordonnées actuel
    rotate(rotationAngle);

    for (let couche = 1; couche <= 6; couche++) {
        let rayonInterne = couche * 50;
        let rayonExterne = rayonInterne * 0.6;
        let points = NB_SECTIONS * 2;

        stroke(280 - couche * 20, 70, 85);
        strokeWeight(1.5);

        beginShape();
        for (let i = 0; i <= points; i++) {
            let anglePoint = (TWO_PI / points) * i;
            // Alternance des rayons
            let r = (i % 2 === 0) ? rayonInterne : rayonExterne;

            let x = cos(anglePoint) * r;
            let y = sin(anglePoint) * r;
            vertex(x, y); // Utilise les coordonnées du centre
        }
        endShape(CLOSE);
    }
    pop(); // Restaure le système de coordonnées
}

/**
 * Couche 2: Dessine des motifs en losange répétés dans chaque section radiale.
 * @param {number} rotationAngle - Angle de rotation.
 */
function dessinerMotifsLosanges(rotationAngle) {
    push();
    rotate(rotationAngle);

    for (let i = 0; i < NB_SECTIONS; i++) {
        push();
        rotate((TWO_PI / NB_SECTIONS) * i); // Rotation locale à la section

        stroke(160 + i * 5, 75, 90);
        strokeWeight(1);

        // Dessine le motif de 4 losanges, en utilisant des coordonnées locales
        for (let d = 80; d < 320; d += 40) {
            line(0, d, 30, d + 20);
            line(30, d + 20, 0, d + 40);
            line(0, d + 40, -30, d + 20);
            line(-30, d + 20, 0, d);
        }
        pop();
    }
    pop();
}

/**
 * Couche 3: Dessine des lignes radiales dont le tracé est déformé par une fonction sinusoïdale.
 * @param {number} rotationAngle - Angle de rotation.
 */
function dessinerLignesOndulees(rotationAngle) {
    push();
    rotate(rotationAngle);

    for (let i = 0; i < NB_SECTIONS; i++) {
        let angleBase = (TWO_PI / NB_SECTIONS) * i;

        stroke(200 + i * 3, 80, 95);
        strokeWeight(0.8);

        beginShape();
        noFill();
        for (let r = 0; r < 350; r += 5) {
            // L'onde est calculée perpendiculairement au rayon
            let wave = sin(r * 0.05) * 15;

            let x = cos(angleBase) * r + cos(angleBase + HALF_PI) * wave;
            let y = sin(angleBase) * r + sin(angleBase + HALF_PI) * wave;
            vertex(x, y);
        }
        endShape();
    }
    pop();
}

/**
 * Couche 4: Dessine des paires de cercles décoratifs positionnés sur des rayons spécifiques.
 * @param {number} rotationAngle - Angle de rotation.
 */
function dessinerCerclesDecoratifs(rotationAngle) {
    push();
    rotate(rotationAngle);

    for (let i = 0; i < NB_SECTIONS; i++) {
        let angle = (TWO_PI / NB_SECTIONS) * i;

        // Positionne les cercles à différentes distances du centre
        for (let r = 100; r < 320; r += 60) {
            let x = cos(angle) * r;
            let y = sin(angle) * r;

            stroke(240, 65, 88);
            strokeWeight(1);
            circle(x, y, 25); // Dessin autour du centre

            stroke(260, 55, 75);
            strokeWeight(0.5);
            circle(x, y, 15);
        }
    }
    pop();
}

/**
 * Couche 5: Relie des points sur des rayons opposés (180 degrés).
 * @param {number} rotationAngle - Angle de rotation.
 */
function dessinerConnexionsOpposees(rotationAngle) {
    push();
    rotate(rotationAngle);

    for (let i = 0; i < NB_SECTIONS / 2; i++) {
        let angle1 = (TWO_PI / NB_SECTIONS) * i;
        let angle2 = (TWO_PI / NB_SECTIONS) * (i + NB_SECTIONS / 2); // Angle opposé

        stroke(180, 50, 70, 0.4);
        strokeWeight(0.3);

        // Relie les points à différentes distances sur ces deux rayons opposés
        for (let r = 50; r < 300; r += 50) {
            let x1 = cos(angle1) * r;
            let y1 = sin(angle1) * r;
            let x2 = cos(angle2) * r;
            let y2 = sin(angle2) * r;
            line(x1, y1, x2, y2);
        }
    }
    pop();
}

/**
 * Couche 6: Dessine un ensemble de cercles concentriques très proches au centre.
 * @param {number} rotationAngle - Angle de rotation.
 */
function dessinerCentreComplexe(rotationAngle) {
    push();
    rotate(rotationAngle);

    stroke(220, 80, 100);
    strokeWeight(2);

    for (let i = 0; i < 8; i++) {
        circle(0, 0, (8 - i) * 10); // Dessin au centre (0, 0)
    }
    pop();
}
