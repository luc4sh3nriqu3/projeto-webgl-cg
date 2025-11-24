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

  drawDino(FRONT);
  drawCacto();

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