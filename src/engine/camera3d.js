/**
 * Sistema de Câmera 3D otimizado para visualização do dinossauro
 * Criado com múltiplas opções de visualização
 */

class Camera3D {
    constructor(canvas) {
        this.canvas = canvas;

        // Posição inicial da câmera - configurada para ver bem o dinossauro
        this.position = { x: 0, y: 3, z: 8 };
        this.target = { x: 0, y: 0, z: 0 }; // Olhando para o centro
        this.up = { x: 0, y: 1, z: 0 }; // Vetor up padrão

        // Parâmetros de projeção otimizados
        this.fieldOfView = Math.PI / 3; // 60 graus - bom campo de visão
        this.aspect = canvas.width / canvas.height;
        this.near = 0.1;
        this.far = 200.0; // Distância maior para ver mais longe

        // Matrizes de transformação
        this.viewMatrix = this.createIdentityMatrix();
        this.projectionMatrix = this.createIdentityMatrix();

        // Atualizar matrizes iniciais
        this.updateMatrices();

        console.log('Camera3D iniciada - Posição:', this.position, 'Target:', this.target);
    }

    /**
     * Cria uma matriz identidade 4x4
     */
    createIdentityMatrix() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    /**
     * Cria matriz de projeção em perspectiva
     */
    createPerspectiveMatrix(fov, aspect, near, far) {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        const rangeInv = 1.0 / (near - far);

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    }

    /**
     * Cria matriz lookAt (view matrix)
     */
    createLookAtMatrix(eye, target, up) {
        // Calcular vetores da câmera
        const zAxis = this.normalize(this.subtract(eye, target)); // Direção da câmera
        const xAxis = this.normalize(this.cross(up, zAxis));      // Right vector
        const yAxis = this.cross(zAxis, xAxis);                  // Up vector real

        return [
            xAxis[0], yAxis[0], zAxis[0], 0,
            xAxis[1], yAxis[1], zAxis[1], 0,
            xAxis[2], yAxis[2], zAxis[2], 0,
            -this.dot(xAxis, eye), -this.dot(yAxis, eye), -this.dot(zAxis, eye), 1
        ];
    }

    /**
     * Operações matemáticas de vetores
     */
    subtract(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    }

    normalize(v) {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (length > 0.00001) {
            return [v[0] / length, v[1] / length, v[2] / length];
        }
        return [0, 0, 1]; // Fallback seguro
    }

    cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    /**
     * Atualiza as matrizes de view e projeção
     */
    updateMatrices() {
        // Atualizar aspect ratio
        this.aspect = this.canvas.width / this.canvas.height;

        // Matriz de projeção
        this.projectionMatrix = this.createPerspectiveMatrix(
            this.fieldOfView,
            this.aspect,
            this.near,
            this.far
        );

        // Matriz de view
        this.viewMatrix = this.createLookAtMatrix(
            [this.position.x, this.position.y, this.position.z],
            [this.target.x, this.target.y, this.target.z],
            [this.up.x, this.up.y, this.up.z]
        );
    }

    /**
     * Câmera em terceira pessoa - ideal para ver o dinossauro
     */
    followPlayer(playerPosition, offset = { x: 0, y: 4, z: 8 }) {
        this.position.x = playerPosition.x + offset.x;
        this.position.y = playerPosition.y + offset.y;
        this.position.z = playerPosition.z + offset.z;

        this.target.x = playerPosition.x;
        this.target.y = playerPosition.y + 1; // Ligeiramente acima do jogador
        this.target.z = playerPosition.z - 2; // Olhar um pouco à frente

        this.updateMatrices();
    }

    /**
     * Câmera atrás do jogador - estilo corrida
     */
    behindPlayer(playerPosition, offset = { x: 0, y: 3, z: 6 }) {
        // Posicionar câmera diretamente atrás
        this.position.x = playerPosition.x + offset.x;
        this.position.y = playerPosition.y + offset.y;
        this.position.z = playerPosition.z + offset.z;

        // Olhar para onde o jogador está indo
        this.target.x = playerPosition.x;
        this.target.y = playerPosition.y + 0.5;
        this.target.z = playerPosition.z - 5; // Olhar bem à frente

        this.updateMatrices();
    }

    /**
     * Câmera lateral - boa para ver animações
     */
    sideView(playerPosition, offset = { x: 6, y: 3, z: 2 }) {
        this.position.x = playerPosition.x + offset.x;
        this.position.y = playerPosition.y + offset.y;
        this.position.z = playerPosition.z + offset.z;

        this.target.x = playerPosition.x;
        this.target.y = playerPosition.y + 1;
        this.target.z = playerPosition.z;

        this.updateMatrices();
    }

    /**
     * Câmera fixa - para debug
     */
    setFixedPosition(position, target) {
        this.position = { ...position };
        this.target = { ...target };
        this.updateMatrices();
    }

    /**
     * Getters para as matrizes
     */
    getViewMatrix() {
        return this.viewMatrix;
    }

    getProjectionMatrix() {
        return this.projectionMatrix;
    }

    /**
     * Get combined view-projection matrix (se necessário)
     */
    getViewProjectionMatrix() {
        // Se m4 estiver disponível, usar ele
        if (typeof m4 !== 'undefined' && m4.multiply) {
            return m4.multiply(this.projectionMatrix, this.viewMatrix);
        }

        // Caso contrário, retornar as matrizes separadamente
        return {
            view: this.viewMatrix,
            projection: this.projectionMatrix
        };
    }

    /**
     * Debug: log posições da câmera
     */
    logCameraInfo() {
        console.log('Câmera - Posição:', this.position);
        console.log('Câmera - Target:', this.target);
        console.log('Câmera - FOV:', this.fieldOfView * 180 / Math.PI, 'graus');
    }
}