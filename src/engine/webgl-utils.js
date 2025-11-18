/**
 * Funções utilitárias para WebGL
 */

/**
 * Compila um shader WebGL
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {string} source - Código fonte do shader
 * @param {number} type - Tipo do shader (gl.VERTEX_SHADER ou gl.FRAGMENT_SHADER)
 * @returns {WebGLShader} Shader compilado
 */
function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Erro ao compilar shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Cria um programa WebGL
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {string} vertexShaderSource - Código do vertex shader
 * @param {string} fragmentShaderSource - Código do fragment shader
 * @returns {WebGLProgram} Programa WebGL
 */
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Erro ao linkar programa:', gl.getProgramInfoLog(program));
    return null;
  }

  return program;
}

/**
 * Limpa a tela com uma cor
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {Array<number>} color - Cor RGBA [r, g, b, a]
 */
function clearCanvas(gl, color = [1.0, 1.0, 1.0, 1.0]) {
  gl.clearColor(...color);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * Desenha geometria no WebGL
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {WebGLProgram} program - Programa WebGL
 * @param {Array<number>} vertices - Array de vértices
 * @param {Array<number>} colors - Array de cores
 * @param {number} mode - Modo de desenho (gl.TRIANGLES, gl.TRIANGLE_FAN, etc.)
 */
function drawGeometry(gl, program, vertices, colors, mode = gl.TRIANGLES) {
  // Buffer de posição
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

  // Buffer de cor
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const aColor = gl.getAttribLocation(program, 'aColor');
  gl.enableVertexAttribArray(aColor);
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

  // Usar programa e desenhar
  gl.useProgram(program);
  gl.drawArrays(mode, 0, vertices.length / 3);
}

/**
 * Desenha geometria 3D no WebGL usando índices
 * @param {WebGLRenderingContext} gl - Contexto WebGL
 * @param {WebGLProgram} program - Programa WebGL
 * @param {Array<number>} vertices - Array de vértices
 * @param {Array<number>} colors - Array de cores
 * @param {Array<number>} indices - Array de índices
 * @param {number} mode - Modo de desenho (gl.TRIANGLES, etc.)
 */
function draw3DGeometry(gl, program, vertices, colors, indices, mode = gl.TRIANGLES) {
  // Buffer de posição
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

  // Buffer de cor
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const aColor = gl.getAttribLocation(program, 'aColor');
  gl.enableVertexAttribArray(aColor);
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

  // Buffer de índices
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  // Usar programa e desenhar
  gl.useProgram(program);
  gl.drawElements(mode, indices.length, gl.UNSIGNED_SHORT, 0);
}

/**
 * Inicializa o WebGL com configurações padrão
 * @param {string} canvasId - ID do elemento canvas
 * @returns {Object} Objeto com contexto WebGL e funções auxiliares
 */
function initWebGL(canvasId) {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('WebGL não está disponível no seu navegador!');
    return null;
  }

  // Shaders padrão com suporte a matriz de transformação
  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    uniform mat4 uModelMatrix;
    varying vec3 vColor;

    void main() {
      gl_Position = uModelMatrix * vec4(aPosition, 1.0);
      vColor = aColor;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vColor;

    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `;

  // Configurar viewport
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Compilar e criar programa
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Funções auxiliares
  function draw3D(vertices, colors, indices, modelMatrix = null, mode = gl.TRIANGLES) {
    // Buffer de posição
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    // Buffer de cor
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const aColor = gl.getAttribLocation(program, 'aColor');
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

    // Buffer de índices
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Usar programa
    gl.useProgram(program);

    // Matriz de transformação (identidade se não fornecida)
    const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    gl.uniformMatrix4fv(
      uModelMatrix,
      false,
      modelMatrix || [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
    );

    gl.drawElements(mode, indices.length, gl.UNSIGNED_SHORT, 0);
  }

  return {
    gl,
    program,
    canvas,
    draw: (vertices, colors, mode = gl.TRIANGLES) => {
      drawGeometry(gl, program, vertices, colors, mode);
    },
    draw3D,
    clear: (color = [1.0, 1.0, 1.0, 1.0]) => {
      clearCanvas(gl, color);
    }
  };
}
