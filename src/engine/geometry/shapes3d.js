/**
 * Funções para geração de formas geométricas 3D em WebGL
 */

/**
 * Cria um cubo (6 faces quadradas)
 * @param {string|Array} color - Nome da cor ou array RGB [r, g, b]
 * @param {number} scale - Escala da forma (1.0 = tamanho padrão)
 * @param {Array} position - Posição [x, y, z] do centro da forma
 * @returns {Object} Objeto com vertices, colors e indices
 */
function createCube(color = 'BLUE', scale = 1.0, position = [0.0, 0.0, 0.0]) {
  const [x, y, z] = position;
  const s = scale * 0.5; // metade do tamanho para centralizar

  // 8 vértices do cubo
  const vertices = [
    // Face frontal
    x - s, y - s, z + s,  // 0
    x + s, y - s, z + s,  // 1
    x + s, y + s, z + s,  // 2
    x - s, y + s, z + s,  // 3
    // Face traseira
    x - s, y - s, z - s,  // 4
    x + s, y - s, z - s,  // 5
    x + s, y + s, z - s,  // 6
    x - s, y + s, z - s   // 7
  ];

  // Índices para formar 12 triângulos (6 faces × 2 triângulos)
  const indices = [
    // Face frontal
    0, 1, 2,  0, 2, 3,
    // Face traseira
    4, 6, 5,  4, 7, 6,
    // Face esquerda
    4, 0, 3,  4, 3, 7,
    // Face direita
    1, 5, 6,  1, 6, 2,
    // Face inferior
    4, 5, 1,  4, 1, 0,
    // Face superior
    3, 2, 6,  3, 6, 7
  ];

  const colors = createColorArray(color, 8);

  return { vertices, colors, indices };
}

/**
 * Cria uma pirâmide (base quadrada + 4 faces triangulares)
 * @param {string|Array} color - Nome da cor ou array RGB [r, g, b]
 * @param {number} scale - Escala da forma
 * @param {Array} position - Posição [x, y, z] do centro da forma
 * @returns {Object} Objeto com vertices, colors e indices
 */
function createPyramid(color = 'YELLOW', scale = 1.0, position = [0.0, 0.0, 0.0]) {
  const [x, y, z] = position;
  const s = scale * 0.5;

  // 5 vértices da pirâmide
  const vertices = [
    // Base quadrada
    x - s, y - s, z + s,  // 0
    x + s, y - s, z + s,  // 1
    x + s, y - s, z - s,  // 2
    x - s, y - s, z - s,  // 3
    // Pico da pirâmide
    x, y + s, z           // 4
  ];

  // Índices para formar 6 triângulos (base + 4 faces)
  const indices = [
    // Base (2 triângulos)
    0, 2, 1,  0, 3, 2,
    // Faces laterais
    0, 1, 4,  // Face frontal
    1, 2, 4,  // Face direita
    2, 3, 4,  // Face traseira
    3, 0, 4   // Face esquerda
  ];

  const colors = createColorArray(color, 5);

  return { vertices, colors, indices };
}

/**
 * Cria um prisma triangular
 * @param {string|Array} color - Nome da cor ou array RGB [r, g, b]
 * @param {number} scale - Escala da forma
 * @param {Array} position - Posição [x, y, z] do centro da forma
 * @returns {Object} Objeto com vertices, colors e indices
 */
function createTriangularPrism(color = 'GREEN', scale = 1.0, position = [0.0, 0.0, 0.0]) {
  const [x, y, z] = position;
  const s = scale * 0.5;

  // 6 vértices do prisma triangular
  const vertices = [
    // Face frontal (triângulo)
    x, y + s, z + s,      // 0 - topo frontal
    x - s, y - s, z + s,  // 1 - base esquerda frontal
    x + s, y - s, z + s,  // 2 - base direita frontal
    // Face traseira (triângulo)
    x, y + s, z - s,      // 3 - topo traseiro
    x - s, y - s, z - s,  // 4 - base esquerda traseiro
    x + s, y - s, z - s   // 5 - base direita traseiro
  ];

  // Índices para formar 8 triângulos (2 faces triangulares + 3 faces retangulares)
  const indices = [
    // Face frontal
    0, 1, 2,
    // Face traseira
    3, 5, 4,
    // Face inferior
    1, 4, 5,  1, 5, 2,
    // Face esquerda
    0, 4, 1,  0, 3, 4,
    // Face direita
    0, 2, 5,  0, 5, 3
  ];

  const colors = createColorArray(color, 6);

  return { vertices, colors, indices };
}

/**
 * Cria um cilindro usando múltiplos segmentos
 * @param {string|Array} color - Nome da cor ou array RGB [r, g, b]
 * @param {number} scale - Escala da forma
 * @param {Array} position - Posição [x, y, z] do centro da forma
 * @param {number} segments - Número de segmentos do cilindro
 * @param {number} height - Altura do cilindro (padrão: 1.0)
 * @returns {Object} Objeto com vertices, colors e indices
 */
function createCylinder(color = 'CYAN', scale = 1.0, position = [0.0, 0.0, 0.0], segments = 16, height = 1.0) {
  const [x, y, z] = position;
  const radius = scale * 0.5;
  const h = height * 0.5;

  const vertices = [];
  const indices = [];

  // Centro da base inferior e superior
  vertices.push(x, y - h, z);  // 0 - centro base inferior
  vertices.push(x, y + h, z);  // 1 - centro base superior

  // Vértices das bordas das bases
  for (let i = 0; i < segments; i++) {
    const angle = (i * 2 * Math.PI) / segments;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Base inferior
    vertices.push(x + radius * cos, y - h, z + radius * sin);  // 2 + i
    // Base superior
    vertices.push(x + radius * cos, y + h, z + radius * sin);  // 2 + segments + i
  }

  // Índices para as bases
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;

    // Base inferior
    indices.push(0, 2 + i, 2 + next);

    // Base superior
    indices.push(1, 2 + segments + next, 2 + segments + i);

    // Face lateral (2 triângulos)
    indices.push(2 + i, 2 + segments + i, 2 + segments + next);
    indices.push(2 + i, 2 + segments + next, 2 + next);
  }

  const colors = createColorArray(color, vertices.length / 3);

  return { vertices, colors, indices };
}

/**
 * Cria uma esfera usando subdivisão de icosaedro (versão simplificada)
 * @param {string|Array} color - Nome da cor ou array RGB [r, g, b]
 * @param {number} scale - Escala da forma
 * @param {Array} position - Posição [x, y, z] do centro da forma
 * @param {number} detail - Nível de detalhe (1-3)
 * @returns {Object} Objeto com vertices, colors e indices
 */
function createSphere(color = 'MAGENTA', scale = 1.0, position = [0.0, 0.0, 0.0], detail = 1) {
  const [x, y, z] = position;
  const radius = scale * 0.5;

  // Criar uma esfera simples usando coordenadas esféricas
  const vertices = [];
  const indices = [];

  const latSegments = 8 * detail;
  const lonSegments = 16 * detail;

  // Gerar vértices
  for (let lat = 0; lat <= latSegments; lat++) {
    const theta = lat * Math.PI / latSegments;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= lonSegments; lon++) {
      const phi = lon * 2 * Math.PI / lonSegments;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const vx = x + radius * cosPhi * sinTheta;
      const vy = y + radius * cosTheta;
      const vz = z + radius * sinPhi * sinTheta;

      vertices.push(vx, vy, vz);
    }
  }

  // Gerar índices
  for (let lat = 0; lat < latSegments; lat++) {
    for (let lon = 0; lon < lonSegments; lon++) {
      const first = lat * (lonSegments + 1) + lon;
      const second = first + lonSegments + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  const colors = createColorArray(color, vertices.length / 3);

  return { vertices, colors, indices };
}
