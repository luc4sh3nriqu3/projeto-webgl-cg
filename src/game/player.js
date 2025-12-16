/**
 * Sistema de controle do jogador (Dinossauro)
 */

class Player {
    constructor() {
        // Posições das 3 pistas (esquerda, centro, direita) - ampliadas para 3D
        this.lanes = [-1.0, 0.0, 1.0];
        this.currentLane = 1; // Começa no centro

        // Posição do jogador
        this.position = {
            x: this.lanes[this.currentLane],
            y: 0.5, // Ligeiramente acima do chão
            z: 0.0
        };

        // Estado de pulo
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.jumpHeight = 0;
        this.gravity = -0.02; // Gravidade mais forte para 3D
        this.jumpPower = 0.4; // Pulo mais alto

        // Controles
        this.keys = {
            left: false,
            right: false,
            up: false
        };

        // Cooldown para troca de pista (evita trocas múltiplas)
        this.laneChangeCooldown = 0;
        this.laneChangeCooldownTime = 15; // frames (mais tempo para 3D)

        this.setupControls();
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.keys.left = true;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                case ' ': // Espaço também pode pular
                    this.keys.up = true;
                    e.preventDefault();
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
                case 'ArrowUp':
                case ' ':
                    this.keys.up = false;
                    break;
            }
        });
    }

    update() {
        // Atualizar cooldown
        if (this.laneChangeCooldown > 0) {
            this.laneChangeCooldown--;
        }

        // Trocar de pista
        if (this.laneChangeCooldown === 0) {
            if (this.keys.left && this.currentLane > 0) {
                this.currentLane--;
                this.laneChangeCooldown = this.laneChangeCooldownTime;
            } else if (this.keys.right && this.currentLane < 2) {
                this.currentLane++;
                this.laneChangeCooldown = this.laneChangeCooldownTime;
            }
        }

        // Interpolar suavemente para a nova pista
        const targetX = this.lanes[this.currentLane];
        this.position.x += (targetX - this.position.x) * 0.2;

        // Pulo
        if (this.keys.up && !this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = this.jumpPower;
        }

        // Física do pulo
        if (this.isJumping) {
            this.jumpVelocity += this.gravity;
            this.jumpHeight += this.jumpVelocity;

            // Pousar no chão
            if (this.jumpHeight <= 0) {
                this.jumpHeight = 0;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }

        this.position.y = 0.5 + this.jumpHeight;
    }

    getPosition() {
        return this.position;
    }

    getBoundingBox() {
        // Retorna caixa de colisão do dinossauro.
        // Dimensões reduzidas para melhorar a jogabilidade (menos "pegajoso").
        // Usa HITBOX_SCALE de `const.js` quando disponível.
        const defaultBox = { width: 0.4, height: 0.8, depth: 0.4 };
        const scale = (typeof HITBOX_SCALE !== 'undefined') ? HITBOX_SCALE : 0.8;

        return {
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            width: defaultBox.width * scale,
            height: defaultBox.height * scale,
            depth: defaultBox.depth * scale
        };
    }

    reset() {
        this.currentLane = 1;
        this.position.x = this.lanes[this.currentLane];
        this.position.y = 0.5;
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.jumpHeight = 0;
    }
}
