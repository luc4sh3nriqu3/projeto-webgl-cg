/**
 * Cores básicas para WebGL
 * Valores RGB normalizados (0.0 - 1.0)
 */

const COLORS = {
  // Cores primárias
  RED: [1.0, 0.0, 0.0],
  GREEN: [0.0, 1.0, 0.0],
  BLUE: [0.0, 0.0, 1.0],

  // Cores secundárias
  YELLOW: [1.0, 1.0, 0.0],
  CYAN: [0.0, 1.0, 1.0],
  MAGENTA: [1.0, 0.0, 1.0],

  // Cores neutras
  WHITE: [1.0, 1.0, 1.0],
  BLACK: [0.0, 0.0, 0.0],
  GRAY: [0.5, 0.5, 0.5],

  // Cores extras
  ORANGE: [1.0, 0.5, 0.0],
  PURPLE: [0.5, 0.0, 1.0],
  PINK: [1.0, 0.4, 0.7]
};

/**
 * Obtém uma cor pelo nome
 * @param {string} colorName - Nome da cor
 * @returns {Array<number>} Array RGB [r, g, b]
 */
function getColor(colorName) {
  const color = COLORS[colorName.toUpperCase()];
  if (!color) {
    console.warn(`Cor '${colorName}' não encontrada. Usando WHITE.`);
    return COLORS.WHITE;
  }
  return color;
}

/**
 * Cria um array de cores repetindo a mesma cor
 * @param {string|Array} color - Nome da cor ou array RGB
 * @param {number} count - Quantas vezes repetir a cor
 * @returns {Array<number>} Array com cores repetidas
 */
function createColorArray(color, count) {
  const colorArray = typeof color === 'string' ? getColor(color) : color;
  const result = [];

  for (let i = 0; i < count; i++) {
    result.push(...colorArray);
  }

  return result;
}
