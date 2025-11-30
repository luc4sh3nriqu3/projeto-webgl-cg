/*
 * Simple dinosaur model composed from shapes3d helpers.
 * Exposes two functions:
 * - getDinoParts(options) -> returns array of { vertices, colors, indices, matrix }
 * - drawDino(options) -> attempts to draw parts using a global draw3D (if available)
 *
 * Options accepted: { angleX, angleY, scale }
 */

// Paleta: tons de verde (arrays RGB)
const G_VERY_DARK = [0.0, 0.18, 0.06];
const G_DARK = [0.0, 0.35, 0.12];
const G_MED = [0.0, 0.66, 0.18];
const G_MUTED = [0.23, 0.52, 0.26];
const G_LIGHT = [0.6, 0.9, 0.6];


function drawDino(anglePreset) {

    const font = ANGLE_PRESETS.find(preset => preset.name === anglePreset);
    let angleX = font.angleX;
    let angleY = font.angleY;
    const scale = 0.9;

    const torsoTop = createCube(G_MED, 0.7, [0.0, -0.17, 0.0]);
    draw3D(torsoTop.vertices, torsoTop.colors, torsoTop.indices, getTransformMatrix(angleX, angleY, scale));

    const torsoSegs = [
        createCube(G_MED, 0.65, [0.1, -0.08, 0.0]),
        createCube(G_MED, 0.6, [0.15, 0.0, 0.0]),
        createCube(G_MED, 0.55, [0.2, 0.10, 0.0]),
        createCube(G_MED, 0.5, [0.25, 0.17, 0.0]),
        createCube(G_MED, 0.45, [0.3, 0.3, 0.0]),
    ];
    torsoSegs.forEach(seg => { draw3D(seg.vertices, seg.colors, seg.indices, getTransformMatrix(angleX, angleY, scale)); });

   const head1 = createCube(G_DARK, 0.6, [0.35, 0.8, 0.0]);
   draw3D(head1.vertices, head1.colors, head1.indices, getTransformMatrix(angleX, angleY, scale));
   const head2 = createCube(G_DARK, 0.6, [0.45, 0.81, 0.0]);
   draw3D(head2.vertices, head2.colors, head2.indices, getTransformMatrix(angleX, angleY, scale));

    const tailSegs = [
        createCube(G_MED, 0.38, [-0.35, -0.1, 0.0]),
        createCube(G_MUTED, 0.32, [-0.5, -0.07, 0.0]),
        createCube(G_DARK, 0.26, [-0.62, -0.02, 0.0]),
        createCube(G_VERY_DARK, 0.18, [-0.72, 0.1, 0.0])
    ];
    tailSegs.forEach(seg => { draw3D(seg.vertices, seg.colors, seg.indices, getTransformMatrix(angleX, angleY, scale)); });

    const coxaEsq = createCube(G_VERY_DARK, 0.6, [0.0, -0.17, 0.15]);
    const coxaDir = createCube(G_VERY_DARK, 0.6, [0.0, -0.17, -0.15]);
    draw3D(coxaEsq.vertices, coxaEsq.colors, coxaEsq.indices, getTransformMatrix(angleX, angleY, scale));
    draw3D(coxaDir.vertices, coxaDir.colors, coxaDir.indices, getTransformMatrix(angleX, angleY, scale));

    const thighL = createSphere(G_MED, 0.25, [0.0, -0.55, 0.33], 2);
    const thighR = createSphere(G_MED, 0.25, [0.0, -0.55, -0.33], 2);
    draw3D(thighL.vertices, thighL.colors, thighL.indices, getTransformMatrix(angleX, angleY, scale));
    draw3D(thighR.vertices, thighR.colors, thighR.indices, getTransformMatrix(angleX, angleY, scale));

    const shinL = createCylinder(G_DARK, 0.15, [0.0, -0.65, 0.33], 20, 0.4);
    const shinR = createCylinder(G_DARK, 0.15, [0.0, -0.65, -0.33], 20, 0.4);
    draw3D(shinL.vertices, shinL.colors, shinL.indices, getTransformMatrix(angleX, angleY, scale));
    draw3D(shinR.vertices, shinR.colors, shinR.indices, getTransformMatrix(angleX, angleY, scale));

    const footL = createCube(G_VERY_DARK, 0.22, [0.0, -0.95, 0.33]);
    const footR = createCube(G_VERY_DARK, 0.22, [0.0, -0.95, -0.33]);
    draw3D(footL.vertices, footL.colors, footL.indices, getTransformMatrix(angleX, angleY, scale));
    draw3D(footR.vertices, footR.colors, footR.indices, getTransformMatrix(angleX, angleY, scale));

    const eyeWhiteL = createSphere([0.5, 0.5, 0.5], 0.08, [0.23, 0.92, 0.28], 1);
    const eyePupilL = createSphere(G_VERY_DARK, 0.05, [0.23, 0.92, 0.3], 1);
    draw3D(eyeWhiteL.vertices, eyeWhiteL.colors, eyeWhiteL.indices, getTransformMatrix(angleX, angleY, scale));
    draw3D(eyePupilL.vertices, eyePupilL.colors, eyePupilL.indices, getTransformMatrix(angleX, angleY, scale));

   const eyeWhiteR = createSphere([0.5, 0.5, 0.5], 0.08, [0.23, 0.92, -0.28], 1);
   const eyePupilR = createSphere(G_VERY_DARK, 0.05, [0.23, 0.92, -0.3], 1);
   draw3D(eyeWhiteR.vertices, eyeWhiteR.colors, eyeWhiteR.indices, getTransformMatrix(angleX, angleY, scale));
   draw3D(eyePupilR.vertices, eyePupilR.colors, eyePupilR.indices, getTransformMatrix(angleX, angleY, scale));

    const armJointL = createCube(G_MUTED, 0.12, [0.56, 0.14, 0.25]);
    const armL = createCube(G_MUTED, 0.12, [0.63, 0.14, 0.25]);
    const handL = createCube(G_MUTED, 0.12, [0.63, 0.10, 0.25]);
    draw3D(armJointL.vertices, armJointL.colors, armJointL.indices, getTransformMatrix(angleX, angleY, scale));
    draw3D(armL.vertices, armL.colors, armL.indices, getTransformMatrix(angleX, angleY, scale));
    draw3D(handL.vertices, handL.colors, handL.indices, getTransformMatrix(angleX, angleY, scale));

    const armJointR = createCube(G_MUTED, 0.12, [0.56, 0.14, -0.25]);
    const armR = createCube(G_MUTED, 0.12, [0.63, 0.14, -0.25]);
    const handR = createCube(G_MUTED, 0.12, [0.63, 0.10, -0.25]);
    draw3D(armJointR.vertices, armJointR.colors, armJointR.indices, getTransformMatrix(angleX, angleY, scale));
    draw3D(armR.vertices, armR.colors, armR.indices, getTransformMatrix(angleX, angleY, scale));
    draw3D(handR.vertices, handR.colors, handR.indices, getTransformMatrix(angleX, angleY, scale));

}