/**
 * Jogo Principal - Dino Runner WebGL 3D
 * Integração entre o sistema de jogo e renderização WebGL 3D
 */

let game;
let canvas;
let gl;
let webglContext;
let draw3D;
let camera;
let lastTime = 0;
let cameraMode = 1; // Câmera default
const sunPosition = [0, 10, -20]; // Posição fixa do sol no céu

// Função auxiliar para obter matriz de transformação compatível com drawDino/drawCacto
function getTransformMatrix(angleX, angleY, scale = 1.0, position = [0, 0, 0]) {
  const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
  const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
  const [x, y, z] = position;

  // Matriz de rotação Y * rotação X * escala + translação
  return [
    cosY * scale, sinX * sinY * scale, -cosX * sinY * scale, 0,
    0, cosX * scale, sinX * scale, 0,
    sinY * scale, -sinX * cosY * scale, cosX * cosY * scale, 0,
    x, y, z, 1
  ];
}

function initGame() {
    webglContext = initWebGL3D('webglCanvas');

    // Extrair variáveis do contexto
    gl = webglContext.gl;
    canvas = webglContext.canvas;
    draw3D = webglContext.draw3D;

    // Inicializar câmera 3D
    camera = new Camera3D(canvas);

    // Configurar WebGL
    setupWebGL();

    // Inicializar jogo
    game = new Game();

    // Iniciar loop do jogo
    requestAnimationFrame(gameLoop);
}

function setupWebGL() {
    // Configurar viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Habilitar depth test e face culling para melhor performance 3D
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Cor de fundo (céu azul claro)
    gl.clearColor(0.53, 0.81, 0.92, 1.0);
}

function gameLoop() {
    // Atualizar jogo
    game.update();

    const gameState = game.getGameState();


    window.addEventListener('keydown', (e) => {
    if (e.key === '1') cameraMode = 1;
    if (e.key === '2') cameraMode = 2;
    if (e.key === '3') cameraMode = 3;});

    if (cameraMode === 1) {
        // Vista 1: Padrão (descomente para testar)
        camera.followPlayer(gameState.player, { x: 2, y: 5, z: 8 });
    } 
    else if (cameraMode === 2) {
        // Vista 2: Atrás do jogador (descomente para testar)
        camera.behindPlayer(gameState.player, { x: 0, y: 3, z: 6 });
    }
    else if (cameraMode === 3) {
        // Vista 3: Lateral (descomente para testar)
        camera.sideView(gameState.player, { x: 6, y: 4, z: 2 });
    }

    webglContext.setCamera(camera.getViewMatrix(), camera.getProjectionMatrix());

    render(gameState);

    requestAnimationFrame(gameLoop);
}

function render(gameState) {
    // Limpar canvas
    webglContext.clear();

    // Renderizar pistas (chão)
    renderGround3D();

    // Renderizar jogador (dinossauro)
    renderPlayer3D(gameState.player);

    // Renderizar obstáculos
    gameState.obstacles.forEach(obstacle => {
        renderObstacle3D(obstacle);
    });

    // Renderizar UI
    updateUIElements(gameState);

    drawSun(sunPosition);
}

function renderGround3D() {
    // Renderizar chão infinito com textura de pista
    const groundColor = [0.76, 0.70, 0.50]; // Cor bege/areia
    const roadColor = [0.4, 0.4, 0.4]; // Cinza da estrada

    // Chão principal (mais largo) - ajustado para ser visível
    for (let z = -30; z <= 5; z += 3) {
        const groundMatrix = m4.multiply(
            m4.translation(0, -1.5, z), // Mais baixo
            m4.scaling(8, 0.2, 3)
        );
        const ground = createCube(groundColor, 1, [0, 0, 0]);
        draw3D(ground.vertices, ground.colors, ground.indices, groundMatrix);
    }

    // Pistas da estrada
    for (let i = 0; i < 3; i++) {
        const x = [-1.5, 0, 1.5][i];

        for (let z = -30; z <= 5; z += 3) {
            const roadMatrix = m4.multiply(
                m4.translation(x, -1.4, z), // Ligeiramente acima do chão
                m4.scaling(0.8, 0.1, 3)
            );
            const road = createCube(roadColor, 1, [0, 0, 0]);
            draw3D(road.vertices, road.colors, road.indices, roadMatrix);
        }
    }

    // Linhas divisórias (mais visíveis)
    for (let z = -30; z <= 5; z += 2) {
        // Linha esquerda
        const leftLineMatrix = m4.multiply(
            m4.translation(-0.75, -1.3, z),
            m4.scaling(0.1, 0.05, 1)
        );
        const leftLine = createCube([1, 1, 1], 1, [0, 0, 0]); // Branco
        draw3D(leftLine.vertices, leftLine.colors, leftLine.indices, leftLineMatrix);

        // Linha direita
        const rightLineMatrix = m4.multiply(
            m4.translation(0.75, -1.3, z),
            m4.scaling(0.1, 0.05, 1)
        );
        const rightLine = createCube([1, 1, 1], 1, [0, 0, 0]); // Branco
        draw3D(rightLine.vertices, rightLine.colors, rightLine.indices, rightLineMatrix);
    }
}

function renderPlayer3D(position) {
    // Configurar draw3D global para compatibilidade com drawDino
    if (!window.draw3D) {
        window.draw3D = webglContext.draw3D;
    }

    // Salvar a função getTransformMatrix original
    const originalTransform = window.getTransformMatrix;

    // Substituir temporariamente para aplicar posição do dinossauro
    window.getTransformMatrix = function(angleX, angleY, scale = 1.0) {
        // Calcular posição 3D do dinossauro - ajustada para ser bem visível
        const dinoX = position.x * 1.5;
        const dinoY = position.y + 0.5; // Elevar um pouco acima do chão
        const dinoZ = position.z;

        // Criar matriz base do dinossauro com posição e escala maior
        const translateMatrix = m4.translation(dinoX, dinoY, dinoZ);
        const scaleMatrix = m4.scaling(1.2, 1.2, 1.2); // Escala ainda maior
        const baseMatrix = m4.multiply(translateMatrix, scaleMatrix);

        // Aplicar rotação da função original
        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

        const rotationMatrix = [
            cosY * scale, sinX * sinY * scale, -cosX * sinY * scale, 0,
            0, cosX * scale, sinX * scale, 0,
            sinY * scale, -sinX * cosY * scale, cosX * cosY * scale, 0,
            0, 0, 0, 1
        ];

        return m4.multiply(baseMatrix, rotationMatrix);
    };

    drawDino(RIGTH);

    // Restaurar função original
    window.getTransformMatrix = originalTransform;
}

function renderObstacle3D(obstacle) {
    const pos = obstacle.getPosition();
    const type = obstacle.getType();

    // Criar matriz de transformação - ajustar Y para ficar acima do chão
    const translateMatrix = m4.translation(pos.x * 1.5, pos.y - 0.5, pos.z); // Y ajustado
    const scaleMatrix = m4.scaling(0.5, 0.5, 0.5);
    let matrix = m4.multiply(translateMatrix, scaleMatrix);

    // Renderizar baseado no tipo
    if (type === 'cacto') {
        renderCacto3D(matrix);
    } else if (type === 'rock') {
        renderRock3D(matrix);
    } else if (type === 'bird') {
        renderBird3D(matrix);
    }
}

function renderCacto3D(matrix) {
    // Configurar draw3D global para compatibilidade com drawCacto
    if (!window.draw3D) {
        window.draw3D = webglContext.draw3D;
    }

    // Extrair posição da matriz
    const x = matrix[12];
    const y = matrix[13];
    const z = matrix[14];

    // Salvar a função getTransformMatrix original
    const originalTransform = window.getTransformMatrix;

    // Substituir temporariamente para aplicar posição do obstáculo
    window.getTransformMatrix = function(angleX, angleY, scale = 1.0) {
        // Aplicar a matriz do obstáculo + rotação da função original
        const translateMatrix = m4.translation(x, y, z);
        const scaleMatrix = m4.scaling(0.5, 0.5, 0.5);
        const baseMatrix = m4.multiply(translateMatrix, scaleMatrix);

        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

        const rotationMatrix = [
            cosY * scale, sinX * sinY * scale, -cosX * sinY * scale, 0,
            0, cosX * scale, sinX * scale, 0,
            sinY * scale, -sinX * cosY * scale, cosX * cosY * scale, 0,
            0, 0, 0, 1
        ];

        return m4.multiply(baseMatrix, rotationMatrix);
    };

    // Chamar a função drawCacto original
    drawCacto(x, y, z);

    // Restaurar função original
    window.getTransformMatrix = originalTransform;
}

function renderRock3D(matrix) {
    // Configurar draw3D global para compatibilidade com drawRock
    if (!window.draw3D) {
        window.draw3D = webglContext.draw3D;
    }

    // Extrair posição da matriz
    const x = matrix[12];
    const y = matrix[13];
    const z = matrix[14];

    // Salvar a função getTransformMatrix original
    const originalTransform = window.getTransformMatrix;

    // Substituir temporariamente para aplicar posição do obstáculo
    window.getTransformMatrix = function(angleX, angleY, scale = 1.0) {
        // Aplicar a matriz do obstáculo + rotação da função original
        const translateMatrix = m4.translation(x, y, z);
        const scaleMatrix = m4.scaling(0.5, 0.5, 0.5);
        const baseMatrix = m4.multiply(translateMatrix, scaleMatrix);

        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

        const rotationMatrix = [
            cosY * scale, sinX * sinY * scale, -cosX * sinY * scale, 0,
            0, cosX * scale, sinX * scale, 0,
            sinY * scale, -sinX * cosY * scale, cosX * cosY * scale, 0,
            0, 0, 0, 1
        ];

        return m4.multiply(baseMatrix, rotationMatrix);
    };

    // Chamar a função drawRock original
    drawRock(FRONT);

    // Restaurar função original
    window.getTransformMatrix = originalTransform;
}

function renderBird3D(matrix) {
    // Configurar draw3D global para compatibilidade com drawBird
    if (!window.draw3D) {
        window.draw3D = webglContext.draw3D;
    }

    // Extrair posição da matriz
    const x = matrix[12];
    const y = matrix[13] + 2.0; // Pássaros voam mais alto
    const z = matrix[14];

    // Salvar a função getTransformMatrix original
    const originalTransform = window.getTransformMatrix;

    // Substituir temporariamente para aplicar posição do obstáculo
    window.getTransformMatrix = function(angleX, angleY, scale = 1.0) {
        // Aplicar a matriz do obstáculo + rotação da função original
        const translateMatrix = m4.translation(x, y, z);
        const scaleMatrix = m4.scaling(0.5, 0.5, 0.5);
        const baseMatrix = m4.multiply(translateMatrix, scaleMatrix);

        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

        // Adicionar animação de batida de asas
        const wingOffset = Math.sin(Date.now() * 0.01) * 0.1;

        const rotationMatrix = [
            cosY * scale, sinX * sinY * scale, -cosX * sinY * scale, 0,
            0, cosX * scale, sinX * scale, 0,
            sinY * scale, -sinX * cosY * scale, cosX * cosY * scale, 0,
            0, wingOffset, 0, 1
        ];

        return m4.multiply(baseMatrix, rotationMatrix);
    };

    // Chamar a função drawBird original()
    drawBird();

    // Restaurar função original
    window.getTransformMatrix = originalTransform;
}

function updateUIElements(gameState) {
    // Criar ou atualizar elementos de UI se não existirem
    let scoreElement = document.getElementById('gameScore');
    let gameStatusElement = document.getElementById('gameStatus');

    if (!scoreElement) {
        scoreElement = document.createElement('div');
        scoreElement.id = 'gameScore';
        scoreElement.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            z-index: 10;
        `;
        document.body.appendChild(scoreElement);
    }

    if (!gameStatusElement) {
        gameStatusElement = document.createElement('div');
        gameStatusElement.id = 'gameStatus';
        gameStatusElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 48px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(184, 63, 63, 0.8);
            text-align: center;
            z-index: 10;
            display: none;
        `;
        document.body.appendChild(gameStatusElement);
    }

    // Atualizar score
    scoreElement.textContent = `Score: ${gameState.score}`;

    // Atualizar status do jogo
    if (gameState.isGameOver) {
        gameStatusElement.style.display = 'block';
        gameStatusElement.style.color = 'red';
        gameStatusElement.innerHTML = `
            GAME OVER!<br>
            <span style="font-size: 24px; color: white;">Pressione R para reiniciar</span>
        `;
    } else if (gameState.isPaused) {
        gameStatusElement.style.display = 'block';
        gameStatusElement.style.color = 'yellow';
        gameStatusElement.textContent = 'PAUSADO';
    } else {
        gameStatusElement.style.display = 'none';
    }
}

// Inicializar quando a página carregar
window.addEventListener('load', initGame);
