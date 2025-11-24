const ANGLE_PRESETS = [
  { name: 'front', angleX: 0, angleY: 0, degX: 0, degY: 0 },            // vista frontal
  { name: 'top', angleX: -Math.PI / 2, angleY: 0, degX: -90, degY: 0 },   // vista de cima
  { name: 'bottom', angleX: Math.PI / 2, angleY: 0, degX: 90, degY: 0 },  // vista de baixo
  { name: 'left', angleX: 0, angleY: -Math.PI / 2, degX: 0, degY: -90 },  // vista lateral esquerda
  { name: 'right', angleX: 0, angleY: Math.PI / 2, degX: 0, degY: 90 },   // vista lateral direita
  { name: 'back', angleX: 0, angleY: Math.PI, degX: 0, degY: 180 },       // vista traseira
  { name: 'iso', angleX: Math.PI / 6, angleY: Math.PI / 6, degX: 30, degY: 30 } // isométrica leve
];

function createThorns(position, radius, height, count) {
    const [cx, cy, cz] = position;
    const vertices = [];
    const colors = [];
    const indices = [];
    const thornLength = 0.05; // Tamanho do espinho

    for (let i = 0; i < count; i++) {
        // Altura aleatória
        const hOffset = (Math.random() - 0.5) * height;
        const y = cy + hOffset;

        // Ângulo aleatório
        const theta = Math.random() * Math.PI * 2;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        // Ponto 1: Na casca do cacto
        vertices.push(cx + radius * cos, y, cz + radius * sin);
        // Ponto 2: Para fora (ponta do espinho)
        vertices.push(cx + (radius + thornLength) * cos, y, cz + (radius + thornLength) * sin);

        // Cor PRETA para os riscos
        colors.push(0.0, 0.0, 0.0,  0.0, 0.0, 0.0);

        // Índices para formar a linha
        indices.push(i * 2, i * 2 + 1);
    }

    return { vertices, colors, indices };
}

function drawCacto(x = 0.0, y = -0.5, z = 0.0) {
    // Modo de desenho de linhas no WebGL
    const GL_LINES = 1; 

    // Definir a rotação da câmera
    const font = ANGLE_PRESETS.find(preset => preset.name === 'front'); // ou 'iso' para ver melhor
    let angleX = font.angleX;
    let angleY = font.angleY;
    const modelMatrix = getTransformMatrix(angleX, angleY, 0.8);
    
    const cactoColor = 'GREEN'; 

    // --- 1. Tronco Principal ---
    const troncoScale = 0.23;
    const troncoHeight = 1.0;
    const troncoRadius = troncoScale * 0.5; // Raio é metade da escala
    
    // Corpo do tronco
    const tronco = createCylinder(cactoColor, troncoScale, [x, y, z], 12, troncoHeight);
    draw3D(tronco.vertices, tronco.colors, tronco.indices, modelMatrix);

    // >>> ESPINHOS DO TRONCO <<<
    const espinhosTronco = createThorns([x, y, z], troncoRadius, troncoHeight, 60);
    // Note o último parâmetro 'GL_LINES' (ou 1) para desenhar linhas
    draw3D(espinhosTronco.vertices, espinhosTronco.colors, espinhosTronco.indices, modelMatrix, GL_LINES);

    // Topo arredondado do tronco
    const topoTronco = createSphere(cactoColor, troncoScale, [x, y + (troncoHeight/2), z], 2);
    draw3D(topoTronco.vertices, topoTronco.colors, topoTronco.indices, modelMatrix);


    // --- 2. Braço Direito (Mais alto) ---
    const bracoScale = 0.25;
    const bracoHeight = 0.5;
    const offsetBracoDirY = 0.1; 
    const distBracoDir = 0.25; 
    
    // Conector horizontal
    const conectorDir = createCube(cactoColor, bracoScale, [x + distBracoDir -0.04, y + offsetBracoDirY + 0.019, z]);
    draw3D(conectorDir.vertices, conectorDir.colors, conectorDir.indices, modelMatrix);

    // Parte vertical do braço
    const posBracoDir = [x + distBracoDir + 0.04, y + offsetBracoDirY + (bracoHeight/2), z];
    const raioBracoDir = (bracoScale - 0.02) * 0.5;

    const bracoDir = createCylinder(cactoColor, bracoScale -0.02, posBracoDir, 8, bracoHeight);
    draw3D(bracoDir.vertices, bracoDir.colors, bracoDir.indices, modelMatrix);

    // >>> ESPINHOS BRAÇO DIREITO <<<
    const espinhosDir = createThorns(posBracoDir, raioBracoDir, bracoHeight, 20);
    draw3D(espinhosDir.vertices, espinhosDir.colors, espinhosDir.indices, modelMatrix, GL_LINES);

    const cotoveloBracoDir = createSphere(cactoColor, bracoScale - 0.017, [x + distBracoDir + 0.04 , y + offsetBracoDirY - 0.497 + bracoHeight, z], 1);
    draw3D(cotoveloBracoDir.vertices, cotoveloBracoDir.colors, cotoveloBracoDir.indices, modelMatrix);

    // Topo do braço direito
    const topoBracoDir = createSphere(cactoColor, bracoScale - 0.017, [x + distBracoDir + 0.04 , y + offsetBracoDirY + bracoHeight, z], 1);
    draw3D(topoBracoDir.vertices, topoBracoDir.colors, topoBracoDir.indices, modelMatrix);


    // --- 3. Braço Esquerdo (Mais baixo) ---
    const offsetBracoEsqY = -0.2; 
    const distBracoEsq = -0.25; 

    // Conector horizontal
    const conectorEsq = createCube(cactoColor, bracoScale-0.04, [x + distBracoEsq + 0.03, y + offsetBracoEsqY, z]);
    draw3D(conectorEsq.vertices, conectorEsq.colors, conectorEsq.indices, modelMatrix);

    // Parte vertical do braço
    const posBracoEsq = [x + distBracoEsq - 0.04, y + offsetBracoEsqY + (bracoHeight/2), z];
    const raioBracoEsq = (bracoScale - 0.015) * 0.5;

    const bracoEsq = createCylinder(cactoColor, bracoScale -0.015, posBracoEsq, 8, bracoHeight);
    draw3D(bracoEsq.vertices, bracoEsq.colors, bracoEsq.indices, modelMatrix);

    // >>> ESPINHOS BRAÇO ESQUERDO <<<
    const espinhosEsq = createThorns(posBracoEsq, raioBracoEsq, bracoHeight, 20);
    draw3D(espinhosEsq.vertices, espinhosEsq.colors, espinhosEsq.indices, modelMatrix, GL_LINES);

    const cotoveloEsq = createSphere(cactoColor, bracoScale - 0.015, [x + distBracoEsq - 0.04, y + offsetBracoEsqY + bracoHeight, z], 1);
    draw3D(cotoveloEsq.vertices, cotoveloEsq.colors, cotoveloEsq.indices, modelMatrix);

    // Topo do braço esquerdo
    const topoBracoEsq = createSphere(cactoColor, bracoScale - 0.015, [x + distBracoEsq - 0.04, y + offsetBracoEsqY + bracoHeight - 0.49, z], 1);
    draw3D(topoBracoEsq.vertices, topoBracoEsq.colors, topoBracoEsq.indices, modelMatrix);
}