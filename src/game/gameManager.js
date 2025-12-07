/**
 * Gerenciador principal do jogo
 */

class Game {
    constructor() {
        this.player = new Player();
        this.obstacleManager = new ObstacleManager(0.05);

        this.score = 0;
        this.isGameOver = false;
        this.isPaused = false;

        // Dificuldade progressiva
        this.difficultyTimer = 0;
        this.difficultyInterval = 600; // Aumenta dificuldade a cada 10 segundos (60fps)

        this.setupGameControls();
    }

    setupGameControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'r' && this.isGameOver) {
                this.restart();
            }
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
        });
    }

    update() {
        if (this.isGameOver || this.isPaused) {
            return;
        }

        // Atualizar jogador
        this.player.update();

        // Atualizar obstáculos
        this.obstacleManager.update();

        // Verificar colisões
        this.checkCollisions();

        // Atualizar pontuação
        this.score++;

        // Aumentar dificuldade progressivamente
        this.difficultyTimer++;
        if (this.difficultyTimer >= this.difficultyInterval) {
            this.obstacleManager.increaseSpeed(0.003);
            this.difficultyTimer = 0;
        }
    }

    checkCollisions() {
        const playerBox = this.player.getBoundingBox();
        const obstacles = this.obstacleManager.getObstacles();

        for (let obstacle of obstacles) {
            const obsBox = obstacle.getBoundingBox();

            if (this.checkBoxCollision(playerBox, obsBox)) {
                this.gameOver();
                break;
            }
        }
    }

    checkBoxCollision(box1, box2) {
        // Colisão 3D simples (AABB)
        return (
            Math.abs(box1.x - box2.x) < (box1.width + box2.width) / 2 &&
            Math.abs(box1.y - box2.y) < (box1.height + box2.height) / 2 &&
            Math.abs(box1.z - box2.z) < (box1.depth + box2.depth) / 2
        );
    }

    gameOver() {
        this.isGameOver = true;
    }

    restart() {
        this.isGameOver = false;
        this.score = 0;
        this.difficultyTimer = 0;
        this.player.reset();
        this.obstacleManager.clear();
        this.obstacleManager.setSpeed(0.05);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    getScore() {
        return Math.floor(this.score / 10);
    }

    getGameState() {
        return {
            player: this.player.getPosition(),
            obstacles: this.obstacleManager.getObstacles(),
            score: this.getScore(),
            isGameOver: this.isGameOver,
            isPaused: this.isPaused
        };
    }

    
}
