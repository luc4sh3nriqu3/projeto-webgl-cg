/**
 * Sistema de obstáculos
 */

class Obstacle {
    constructor(type, lane, speed) {
        this.type = type; // 'cacto', 'rock', 'bird'
        this.lane = lane; // 0, 1, ou 2
        this.lanes = [-1.0, 0.0, 1.0]; // Ampliado para 3D

        this.position = {
            x: this.lanes[lane],
            y: type === 'bird' ? 2.0 : 0.5, // Bird voa alto, outros acima do chão
            z: -15.0 // Começa mais longe para dar tempo de reação
        };

        this.speed = speed;
        this.active = true;
    }

    update() {
        this.position.z += this.speed;

        // Desativa quando passa do jogador
        if (this.position.z > 2.0) {
            this.active = false;
        }
    }

    getBoundingBox() {
        // Caixas de colisão baseadas no tipo de obstáculo - aumentadas para 3D
        const boxes = {
            'cacto': { width: 0.7, height: 1.5, depth: 0.7 },
            'rock': { width: 0.8, height: 0.8, depth: 0.8 },
            'bird': { width: 0.6, height: 0.6, depth: 0.6 }
        };

        const box = boxes[this.type] || boxes['cacto'];

        return {
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            ...box
        };
    }

    isActive() {
        return this.active;
    }

    getPosition() {
        return this.position;
    }

    getType() {
        return this.type;
    }
}

class ObstacleManager {
    constructor(gameSpeed = 0.08) { // Velocidade ligeiramente maior para 3D
        this.obstacles = [];
        this.gameSpeed = gameSpeed;
        this.spawnTimer = 0;
        this.spawnInterval = 80; // Mais frames entre spawns para dar tempo
        this.minSpawnInterval = 60;
        this.maxSpawnInterval = 120;

        // Probabilidades de spawn
        this.obstacleTypes = ['cacto', 'rock', 'bird'];
        this.obstacleWeights = [0.5, 0.3, 0.2]; // 50% cacto, 30% pedra, 20% pássaro
    }    update() {
        // Atualizar obstáculos existentes
        this.obstacles.forEach(obstacle => obstacle.update());

        // Remover obstáculos inativos
        this.obstacles = this.obstacles.filter(obs => obs.isActive());

        // Spawnar novos obstáculos
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnObstacle();
            this.spawnTimer = 0;
            // Variar intervalo de spawn
            this.spawnInterval = Math.floor(
                Math.random() * (this.maxSpawnInterval - this.minSpawnInterval) + this.minSpawnInterval
            );
        }
    }

    spawnObstacle() {
        // Escolher tipo de obstáculo baseado em probabilidades
        const rand = Math.random();
        let type = 'cacto';
        let cumulative = 0;

        for (let i = 0; i < this.obstacleTypes.length; i++) {
            cumulative += this.obstacleWeights[i];
            if (rand <= cumulative) {
                type = this.obstacleTypes[i];
                break;
            }
        }

        // Escolher pista aleatória
        const lane = Math.floor(Math.random() * 3);

        // Criar obstáculo
        const obstacle = new Obstacle(type, lane, this.gameSpeed);
        this.obstacles.push(obstacle);
    }

    getObstacles() {
        return this.obstacles;
    }

    clear() {
        this.obstacles = [];
        this.spawnTimer = 0;
    }

    increaseSpeed(amount = 0.005) {
        this.gameSpeed += amount;
        // Atualizar velocidade dos obstáculos existentes
        this.obstacles.forEach(obs => obs.speed = this.gameSpeed);
    }

    setSpeed(speed) {
        this.gameSpeed = speed;
    }
}
