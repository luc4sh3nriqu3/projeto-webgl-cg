/**
 * Funções de transformação de matrizes para WebGL
 */

/**
 * Obtém matriz de transformação combinando rotações X e Y com escala
 * @param {number} angleX - Ângulo de rotação em X (radianos)
 * @param {number} angleY - Ângulo de rotação em Y (radianos)
 * @param {number} scale - Escala (padrão 1.0)
 * @returns {Array<number>} Matriz 4x4 de transformação
 */
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
