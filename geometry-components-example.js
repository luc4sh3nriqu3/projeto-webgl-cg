// Inicializar WebGL
const webgl = initWebGL('webglCanvas');

if (!webgl) {
  console.error('Falha ao inicializar WebGL');
}

const { gl, program, draw, draw3D, clear } = webgl;

// Habilitar teste de profundidade para 3D
gl.enable(gl.DEPTH_TEST);

// Limpar tela
clear();

// Ângulos para uma perspectiva clara
const angleX = Math.PI / 8; // 22.5 graus - rotação suave em X
const angleY = Math.PI / 6; // 30 graus - rotação em Y

function getTransformMatrix(angleX, angleY, scale = 1.0) {
  const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
  const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

  // Matriz de rotação Y * rotação X * escala
  return [
    cosY * scale, sinX * sinY * scale, -cosX * sinY * scale, 0,
    0, cosX * scale, sinX * scale, 0,
    sinY * scale, -sinX * cosY * scale, cosX * cosY * scale, 0,
    0, 0, 0, 1
  ];
}

// ═══════════════════════════════════════════════════════════════════
// 🌐 EXEMPLO: Esfera Magenta 3D em perspectiva
// ═══════════════════════════════════════════════════════════════════
//console.log('🌐 Esfera magenta 3D com perspectiva');
// const sphere = createSphere('MAGENTA', 0.7, [0.0, 0.0, 0.0], 2); // Detalhe 2 para melhor definição
// draw3D(sphere.vertices, sphere.colors, sphere.indices, getTransformMatrix(angleX, angleY, 0.8));

// Aguardar e mostrar outras formas para comparação
// setTimeout(() => {
//   clear();
//   console.log('🧊 Cubo azul 3D em perspectiva para comparação');
//   const cube = createCube('BLUE', 0.6, [0.0, 0.0, 0.0]);
//   draw3D(cube.vertices, cube.colors, cube.indices, getTransformMatrix(angleX, angleY, 0.8));
// }, 3000);

// setTimeout(() => {
//   clear();
//   console.log('🥤 Cilindro cyan 3D em perspectiva');
//   const cylinder = createCylinder('CYAN', 0.5, [0.0, 0.0, 0.0], 16, 1.0); // 16 segmentos para suavidade
//   draw3D(cylinder.vertices, cylinder.colors, cylinder.indices, getTransformMatrix(angleX, angleY + Math.PI/8, 0.8));
// }, 6000);

// setTimeout(() => {
//   clear();
//   console.log('🎯 Comparação: Esfera, Cubo e Cilindro');

//   // Criar múltiplas formas para comparação
//   const sphere1 = createSphere('RED', 0.25, [-0.5, 0.0, 0.0], 2);
//   const cube1 = createCube('GREEN', 0.25, [0.0, 0.0, 0.0]);
//   const cylinder1 = createCylinder('BLUE', 0.2, [0.5, 0.0, 0.0], 12, 0.8);
//  drawDino();
    drawCacto();

  // Aplicar perspectivas ligeiramente diferentes
  // const matrix1 = getTransformMatrix(angleX, angleY - Math.PI/12, 0.7);
  // const matrix2 = getTransformMatrix(angleX, angleY, 0.7);
  // const matrix3 = getTransformMatrix(angleX, angleY + Math.PI/12, 0.7);

  // draw3D(sphere1.vertices, sphere1.colors, sphere1.indices, matrix1);
  // draw3D(cube1.vertices, cube1.colors, cube1.indices, matrix2);
  // draw3D(cylinder1.vertices, cylinder1.colors, cylinder1.indices, matrix3);
//}, 9000);

// Aguardar um pouco e mostrar outras formas
// setTimeout(() => {
//   clear();
//   console.log('🔺 Exemplo 3: Pirâmide amarela 3D em perspectiva');
//   const pyramid = createPyramid('YELLOW', 0.6, [0.0, 0.0, 0.0]);
//   draw3D(pyramid.vertices, pyramid.colors, pyramid.indices, getTransformMatrix(angleX, angleY + Math.PI/8, 0.8));
// }, 2000);

// setTimeout(() => {
//   clear();
//   console.log('🔷 Exemplo 4: Prisma triangular verde 3D em perspectiva');
//   const prism = createTriangularPrism('GREEN', 0.6, [0.0, 0.0, 0.0]);
//   draw3D(prism.vertices, prism.colors, prism.indices, getTransformMatrix(angleX + Math.PI/12, angleY, 0.8));
// }, 4000);

// setTimeout(() => {
//   clear();
//   console.log('🎯 Exemplo 5: Múltiplas formas 3D em perspectiva');
//   const cube1 = createCube('RED', 0.25, [-0.4, 0.2, 0.0]);
//   const pyramid1 = createPyramid('BLUE', 0.25, [0.4, 0.2, 0.0]);
//   const prism1 = createTriangularPrism('GREEN', 0.25, [0.0, -0.2, 0.0]);

//   const matrix1 = getTransformMatrix(angleX, angleY, 0.6);
//   const matrix2 = getTransformMatrix(angleX, angleY + Math.PI/6, 0.6);
//   const matrix3 = getTransformMatrix(angleX + Math.PI/8, angleY, 0.6);

//   draw3D(cube1.vertices, cube1.colors, cube1.indices, matrix1);
//   draw3D(pyramid1.vertices, pyramid1.colors, pyramid1.indices, matrix2);
//   draw3D(prism1.vertices, prism1.colors, prism1.indices, matrix3);
// }, 6000);

// ═══════════════════════════════════════════════════════════════════
// 🔴 EXEMPLO 1: Triângulo Vermelho 2D
// ═══════════════════════════════════════════════════════════════════
// console.log('🔴 Exemplo 1: Triângulo vermelho no centro');
// const triangle = createTriangle('RED');
// draw(triangle.vertices, triangle.colors);

// ═══════════════════════════════════════════════════════════════════
// 🧊 EXEMPLO 2: Cubo Azul 3D
// ═══════════════════════════════════════════════════════════════════
// console.log('🧊 Exemplo 2: Cubo azul 3D');
// clear();
// const cube = createCube('BLUE', 0.8, [0.0, 0.0, -0.5]);
// draw3D(cube.vertices, cube.colors, cube.indices);

// ═══════════════════════════════════════════════════════════════════
// � EXEMPLO 3: Pirâmide Amarela 3D
// ═══════════════════════════════════════════════════════════════════
// console.log('� Exemplo 3: Pirâmide amarela 3D');
// clear();
// const pyramid = createPyramid('YELLOW', 0.8, [0.0, 0.0, -0.5]);
// draw3D(pyramid.vertices, pyramid.colors, pyramid.indices);

// ═══════════════════════════════════════════════════════════════════
// � EXEMPLO 4: Prisma Triangular Verde 3D
// ═══════════════════════════════════════════════════════════════════
// console.log('� Exemplo 4: Prisma triangular verde 3D');
// clear();
// const prism = createTriangularPrism('GREEN', 0.8, [0.0, 0.0, -0.5]);
// draw3D(prism.vertices, prism.colors, prism.indices);

// ═══════════════════════════════════════════════════════════════════
// 🥤 EXEMPLO 5: Cilindro Cyan 3D
// ═══════════════════════════════════════════════════════════════════
// console.log('🥤 Exemplo 5: Cilindro cyan 3D');
// clear();
// const cylinder = createCylinder('CYAN', 0.6, [0.0, 0.0, -0.5], 12, 1.2);
// draw3D(cylinder.vertices, cylinder.colors, cylinder.indices);

// ═══════════════════════════════════════════════════════════════════
// � EXEMPLO 6: Esfera Magenta 3D
// ═══════════════════════════════════════════════════════════════════
// console.log('� Exemplo 6: Esfera magenta 3D');
// clear();
// const sphere = createSphere('MAGENTA', 0.8, [0.0, 0.0, -0.5], 1);
// draw3D(sphere.vertices, sphere.colors, sphere.indices);

// ═══════════════════════════════════════════════════════════════════
// 🎯 EXEMPLO 7: Múltiplas Formas 3D
// ═══════════════════════════════════════════════════════════════════
// console.log('🎯 Exemplo 7: Múltiplas formas 3D');
// clear();
// const cube1 = createCube('RED', 0.3, [-0.6, 0.3, -0.5]);
// const pyramid1 = createPyramid('BLUE', 0.3, [0.0, 0.3, -0.5]);
// const sphere1 = createSphere('GREEN', 0.3, [0.6, 0.3, -0.5], 1);
// const cylinder1 = createCylinder('ORANGE', 0.25, [0.0, -0.3, -0.5], 8, 0.6);
// draw3D(cube1.vertices, cube1.colors, cube1.indices);
// draw3D(pyramid1.vertices, pyramid1.colors, pyramid1.indices);
// draw3D(sphere1.vertices, sphere1.colors, sphere1.indices);
// draw3D(cylinder1.vertices, cylinder1.colors, cylinder1.indices);

// ═══════════════════════════════════════════════════════════════════
// 📋 INSTRUÇÕES DE USO 3D
// ═══════════════════════════════════════════════════════════════════
// Exemplos de formas 3D disponíveis:
// 1. Triângulo vermelho 2D (para comparação)
// 2. Cubo azul
// 3. Pirâmide amarela
// 4. Prisma triangular verde
// 5. Cilindro cyan
// 6. Esfera magenta
// 7. Múltiplas formas combinadas
//
// Funções 3D disponíveis:
// - createCube(cor, escala, posição)
// - createPyramid(cor, escala, posição)
// - createTriangularPrism(cor, escala, posição)
// - createCylinder(cor, escala, posição, segmentos, altura)
// - createSphere(cor, escala, posição, detalhe)
//
// Parâmetros 3D:
// - cor: 'RED', 'BLUE', 'GREEN', etc. ou [r, g, b]
// - escala: 1.0 = tamanho padrão
// - posição: [x, y, z] de -1.0 a 1.0