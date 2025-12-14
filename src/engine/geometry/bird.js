function drawBird(anglePreset) {
    const font = ANGLE_PRESETS.find(preset => preset.name === anglePreset);
    let angleX = font.angleX;
    let angleY = font.angleY;

    //Perna 1
    const asa1 = createCube('BLACK', 0.2, [0, 0, -0.4]);
    draw3D(asa1.vertices, asa1.colors, asa1.indices, getTransformMatrix(angleX, angleY, 0.8));

    //Perna 2
    const asa2 = createCube('BLACK', 0.2, [0, 0.0, 0.4]);
    draw3D(asa2.vertices, asa2.colors, asa2.indices, getTransformMatrix(angleX, angleY, 0.8));
    //Corpo
    const corpo = createCube('BLUE', 0.6, [0.0, 0.0, 0.0], 0.5);
    draw3D(corpo.vertices, corpo.colors, corpo.indices, getTransformMatrix(angleX, angleY, 0.8));

    const cabeca = createSphere('YELLOW', 0.3, [-0.4, 0.0, 0.0],2);
    draw3D(cabeca.vertices, cabeca.colors, cabeca.indices, getTransformMatrix(angleX, angleY, 0.8));

    const cauda = createCube('GREEN', 0.2, [0.4, 0.0, 0.0]);
    draw3D(cauda.vertices, cauda.colors, cauda.indices, getTransformMatrix(angleX, angleY, 0.8));
}
