function drawDino() {
    let angleX = Math.PI / 10; // 30 graus - rotação em X
    let angleY = Math.PI / 8; // 30 graus - rotação em Y

    //Perna 1
    const perna1 = createCube('GREEN', 0.2, [-0., -0.9, -0.1]);
    draw3D(perna1.vertices, perna1.colors, perna1.indices, getTransformMatrix(angleX, angleY, 0.8));

    //Perna 2
    const perna2 = createCube('BLUE', 0.2, [0.0, -0.9, 0.1]);
    draw3D(perna2.vertices, perna2.colors, perna2.indices, getTransformMatrix(angleX, angleY, 0.8));

    //Corpo
    const corpo = createCylinder('RED', 0.5, [0.0, 0.0, 0.0], 10000, 1.5);
    draw3D(corpo.vertices, corpo.colors, corpo.indices, getTransformMatrix(angleX, angleY, 0.8));
    
}