/**
 * Funções agnósticas para geração de formas geométricas em WebGL
 */

/**
 * Cria um triângulo
 * @param {string|Array} color - Nome da cor ou array RGB [r, g, b]
 * @param {number} scale - Escala da forma (1.0 = tamanho padrão)
 * @param {Array} position - Posição [x, y] do centro da forma
 * @returns {Object} Objeto com vertices e cores
 */
function createTriangle(color = 'RED', scale = 1.0, position = [0.0, 0.0]) {
  const [x, y] = position;

  const vertices = [
    x + 0.0 * scale,  y + 0.5 * scale, 0.0,   // Vértice superior
    x - 0.5 * scale,  y - 0.5 * scale, 0.0,   // Vértice inferior esquerdo
    x + 0.5 * scale,  y - 0.5 * scale, 0.0    // Vértice inferior direito
  ];

  const colors = createColorArray(color, 3);

  return { vertices, colors };
}

/**
 * Cria um quadrado
 * @param {string|Array} color - Nome da cor ou array RGB [r, g, b]
 * @param {number} scale - Escala da forma (1.0 = tamanho padrão)
 * @param {Array} position - Posição [x, y] do centro da forma
 * @returns {Object} Objeto com vertices e cores
 */
function createSquare(color = 'BLUE', scale = 1.0, position = [0.0, 0.0]) {
  const [x, y] = position;

  const vertices = [
    // Primeiro triângulo
    x - 0.5 * scale,  y + 0.5 * scale, 0.0,
    x - 0.5 * scale,  y - 0.5 * scale, 0.0,
    x + 0.5 * scale,  y - 0.5 * scale, 0.0,

    // Segundo triângulo
    x - 0.5 * scale,  y + 0.5 * scale, 0.0,
    x + 0.5 * scale,  y - 0.5 * scale, 0.0,
    x + 0.5 * scale,  y + 0.5 * scale, 0.0
  ];

  const colors = createColorArray(color, 6);

  return { vertices, colors };
}

/**
 * Cria um círculo usando TRIANGLE_FAN
 * @param {string|Array} color - Nome da cor ou array RGB [r, g, b]
 * @param {number} scale - Escala da forma (1.0 = tamanho padrão)
 * @param {Array} position - Posição [x, y] do centro da forma
 * @param {number} segments - Número de segmentos do círculo
 * @returns {Object} Objeto com vertices e cores
 */
function createCircle(color = 'GREEN', scale = 1.0, position = [0.0, 0.0], segments = 32) {
  const [x, y] = position;
  const radius = 0.5 * scale;

  const vertices = [x, y, 0.0]; // Centro do círculo

  for (let i = 0; i <= segments; i++) {
    const angle = (i * 2 * Math.PI) / segments;
    const vx = x + radius * Math.cos(angle);
    const vy = y + radius * Math.sin(angle);
    vertices.push(vx, vy, 0.0);
  }

  const colors = createColorArray(color, segments + 2);

  return { vertices, colors };
}

/**
 * Cria um polígono regular usando TRIANGLE_FAN
 * @param {number} sides - Número de lados do polígono
 * @param {string|Array} color - Nome da cor ou array RGB [r, g, b]
 * @param {number} scale - Escala da forma (1.0 = tamanho padrão)
 * @param {Array} position - Posição [x, y] do centro da forma
 * @returns {Object} Objeto com vertices e cores
 */
function createPolygon(sides, color = 'YELLOW', scale = 1.0, position = [0.0, 0.0]) {
  const [x, y] = position;
  const radius = 0.5 * scale;

  const vertices = [x, y, 0.0]; // Centro do polígono

  for (let i = 0; i <= sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    const vx = x + radius * Math.cos(angle);
    const vy = y + radius * Math.sin(angle);
    vertices.push(vx, vy, 0.0);
  }

  const colors = createColorArray(color, sides + 2);

  return { vertices, colors };
}
