/**
 * WebGL Utils atualizado para suporte completo a 3D
 */

function initWebGL3D(canvasId) {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('WebGL não está disponível no seu navegador!');
    return null;
  }

  // Shaders 3D com matrizes de view e projeção
  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    attribute vec3 aNormal;

    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    // MUDANÇA 1: Receber a Posição da Luz em vez da Direção
    uniform vec3 uLightPosition; 

    varying vec3 vColor;
    varying float vLighting;

    void main() {
      // Posição do vértice no mundo
      vec3 worldPos = (uModelMatrix * vec4(aPosition, 1.0)).xyz;

      // Transformação final
      gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);

      // Calcular iluminação Pontual
      vec3 normal = normalize((uModelMatrix * vec4(aNormal, 0.0)).xyz);
      
      // MUDANÇA 2: Calcular vetor da luz (Do vértice ATÉ a luz)
      vec3 lightVector = normalize(uLightPosition - worldPos);
      
      float dotProduct = max(dot(normal, lightVector), 0.0);
      vLighting = 0.25 + dotProduct * 0.75; 

      vColor = aColor;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vColor;
    varying float vLighting;

    void main() {
      gl_FragColor = vec4(vColor * vLighting, 1.0);
    }
  `;

  // Configurar viewport
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Compilar e criar programa
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Configurações padrão
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  // Variáveis para matrizes
  let viewMatrix = m4.identity();
  let projectionMatrix = m4.identity();

  // Função para definir matrizes de câmera
  function setCamera(view, projection) {
    viewMatrix = view;
    projectionMatrix = projection;
  }

  // Função de desenho 3D melhorada
  function draw3D(vertices, colors, indices, modelMatrix = null, normals = null, mode = gl.TRIANGLES) {
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

    // Buffer de normais (para iluminação)
    if (normals) {
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

      const aNormal = gl.getAttribLocation(program, 'aNormal');
      gl.enableVertexAttribArray(aNormal);
      gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    } else {
      // Usar normais padrão se não fornecidas
      const defaultNormals = generateNormals(vertices, indices);
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(defaultNormals), gl.STATIC_DRAW);

      const aNormal = gl.getAttribLocation(program, 'aNormal');
      gl.enableVertexAttribArray(aNormal);
      gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    }

    // Buffer de índices
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Usar programa
    gl.useProgram(program);

    // Definir matrizes
    const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
    const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    const uLightPositionLoc = gl.getUniformLocation(program, 'uLightPosition');
    //const uLightDirection = gl.getUniformLocation(program, 'uLightDirection');

    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix || m4.identity());
    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
    gl.uniform3fv(uLightPositionLoc, lightPosition);
    //gl.uniform3fv(uLightDirection, [-0.5, -1.0, -0.5]); // Luz vindo de cima

    gl.drawElements(mode, indices.length, gl.UNSIGNED_SHORT, 0);
  }

  // Gerar normais básicas para iluminação
  function generateNormals(vertices, indices) {
    const normals = new Array(vertices.length).fill(0);

    // Calcular normais de face
    for (let i = 0; i < indices.length; i += 3) {
      const i1 = indices[i] * 3;
      const i2 = indices[i + 1] * 3;
      const i3 = indices[i + 2] * 3;

      const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
      const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
      const v3 = [vertices[i3], vertices[i3 + 1], vertices[i3 + 2]];

      const edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
      const edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

      const normal = [
        edge1[1] * edge2[2] - edge1[2] * edge2[1],
        edge1[2] * edge2[0] - edge1[0] * edge2[2],
        edge1[0] * edge2[1] - edge1[1] * edge2[0]
      ];

      // Adicionar às normais dos vértices
      normals[i1] += normal[0]; normals[i1 + 1] += normal[1]; normals[i1 + 2] += normal[2];
      normals[i2] += normal[0]; normals[i2 + 1] += normal[1]; normals[i2 + 2] += normal[2];
      normals[i3] += normal[0]; normals[i3 + 1] += normal[1]; normals[i3 + 2] += normal[2];
    }

    // Normalizar
    for (let i = 0; i < normals.length; i += 3) {
      const length = Math.sqrt(normals[i] * normals[i] + normals[i + 1] * normals[i + 1] + normals[i + 2] * normals[i + 2]);
      if (length > 0) {
        normals[i] /= length;
        normals[i + 1] /= length;
        normals[i + 2] /= length;
      }
    }

    return normals;
  }

  let lightPosition = [0.0, 10.0, 0.0]; 

  // Função para atualizar a posição da luz (será chamada pelo main.js)
  function setLightPosition(x, y, z) {
    lightPosition = [x, y, z];
  }

  return {
    gl,
    program,
    canvas,
    draw3D,
    setCamera,
    setLightPosition,
    clear: (color = [0.53, 0.81, 0.92, 1.0]) => {
      gl.clearColor(...color);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
  };
}