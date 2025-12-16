# 🦖 Dino Runner 3D - Projeto WebGL

> Projeto de Computação Gráfica - Endless Runner 3D em WebGL Puro


## 🎮 Sobre o Projeto

Jogo endless runner 3D feito **do zero** em WebGL puro (sem bibliotecas).

**Características**:
- ✅ Pipeline WebGL completo com shaders customizados
- ✅ 3 modos de câmera alternáveis (teclas 1, 2, 3)
- ✅ Iluminação dinâmica (segue sol/lua)
- ✅ Ciclo dia/noite com movimento parabólico
- ✅ Matemática 3D implementada (matrizes, vetores)

**Controles**: ESPAÇO (pular) | 1,2,3 (câmeras) | R (reiniciar)

---

# 🎤 PARTE 1 - Pipeline WebGL

> - Arquitetura e Renderização

---

## 🏗️ Arquitetura

```
src/
├── engine/          # Motor gráfico (WebGL, shaders, câmera)
├── game/            # Lógica do jogo (loop, física)
└── math/            # Matrizes 4x4 e vetores 3D
```

## 🔄 Fluxo do Jogo

```javascript
1. INICIALIZAÇÃO
   └─> Criar WebGL + Compilar shaders + Criar câmera

2. GAME LOOP (60 FPS)
   ├─> updateDayNightCycle()
   ├─> game.update()
   └─> render()

3. RENDERIZAÇÃO
   ├─> Limpar tela
   ├─> Desenhar sol/lua
   ├─> Desenhar pista
   ├─> Desenhar dinossauro
   └─> Desenhar obstáculos
```

## 🎨 Pipeline WebGL

```
CPU (JavaScript)  →  GPU
  │
  ├─> Vértices    →  Vertex Shader (transforma pontos)
  ├─> Cores       →       ↓
  ├─> Normais     →  Rasterização (pontos → pixels)
  └─> Matrizes    →       ↓
                     Fragment Shader (pinta pixels)
                          ↓
                        TELA
```

## 📝 Shaders

**Vertex Shader** - Transforma cada vértice:
```glsl
void main() {
  // Transformação completa
  gl_Position = Projection × View × Model × Position;

  // Calcula iluminação
  vLighting = 0.25 + 0.75 * dot(normal, lightDirection);
}
```

**Fragment Shader** - Pinta cada pixel:
```glsl
void main() {
  gl_FragColor = vColor * vLighting;  // Cor × Luz
}
```

## ⚙️ Otimizações

- **Depth Test**: Objetos na ordem correta de profundidade
- **Face Culling**: Não desenha faces traseiras (~50% economia)

---

# 🎤 PARTE 2 - Transformações 3D

> Matemática e Sistema de Câmera

---

## 📐 Transformações Fundamentais

### Pipeline de Transformação

```
Posição Final = Projection × View × Model × Posição Original
```

### Model Matrix (Posicionar objetos)

**1. Translação** (mover):
```javascript
T = [1, 0, 0, 0,
     0, 1, 0, 0,
     0, 0, 1, 0,
     tx, ty, tz, 1]  // Posição X, Y, Z
```

**2. Escala** (redimensionar):
```javascript
S = [sx, 0, 0, 0,
     0, sy, 0, 0,
     0, 0, sz, 0,
     0, 0, 0, 1]
```

**3. Rotação** (girar):
```javascript
Ry(θ) = [cos(θ), 0, sin(θ), 0,
         0,      1, 0,      0,
        -sin(θ), 0, cos(θ), 0,
         0,      0, 0,      1]
```

**Composição**:
```javascript
ModelMatrix = Translação × Rotação × Escala
```

⚠️ **Ordem importa!** (A×B ≠ B×A)

## 📷 Sistema de Câmera (Look At)

**Calcula vetores da câmera**:
```javascript
zAxis = normalize(eye - target)     // Direção
xAxis = normalize(cross(up, zAxis)) // Direita
yAxis = cross(zAxis, xAxis)         // Cima
```

**Operações Vetoriais**:
- **Cross Product**: Perpendicular a dois vetores
- **Dot Product**: Mede ângulo entre vetores
- **Normalize**: Vetor com tamanho 1

## 🎮 3 Modos de Câmera (**DEMO AO VIVO!**)

**Modo 1** (tecla 1) - Follow Player:
```javascript
camera.position = player.position + offset(2, 5, 8)
camera.target = player.position
```
*Vista diagonal acima - melhor visão geral*

**Modo 2** (tecla 2) - Behind Player:
```javascript
camera.position = player.position + offset(0, 3, 6)
camera.target = player.position + forward
```
*Vista de terceira pessoa - imersiva*

**Modo 3** (tecla 3) - Side View:
```javascript
camera.position = offset(6, 4, 2)
camera.target = player.position
```
*Vista lateral - runner clássico*

---

# 🎤 PARTE 3 - Features do Jogo

> Iluminação, Ciclo Dia/Noite e Gameplay

---

## 💡 Iluminação Dinâmica

**Modelo Phong Simplificado**:
```glsl
Iluminação = 0.25 (ambiente) + 0.75 × (N·L) (difusa)
```

**Cálculo no Shader**:
```glsl
// Normal da superfície
vec3 normal = normalize(transformedNormal);

// Vetor da luz (vértice → fonte de luz)
vec3 lightVector = normalize(lightPosition - vertexPosition);

// Produto escalar (ângulo entre normal e luz)
float dotProduct = max(dot(normal, lightVector), 0.0);

// Intensidade final
vLighting = 0.25 + 0.75 * dotProduct;
```

**Dinâmica**: A luz segue o sol (dia) ou lua (noite)!

---

## 🌅 Ciclo Dia/Noite

### Conceito
```javascript
dayNightTime: 0.0 - 0.5 = Dia (sol)
              0.5 - 1.0 = Noite (lua)
```

### Movimento Parabólico

**Equação**: `y = 3 + 5(1 - x²)`

```
        y=8
         ☀️      ← Pico (meio-dia)
        /  \
       /    \
    ☀️        ☀️  ← Nascer/Pôr (y=3)
```

**Código**:
```javascript
// X move linearmente (-10 → +10)
x = -10 + 20 * time

// Y segue parábola
normalizedX = (x + 10) / 20
parabolaX = normalizedX * 2 - 1
y = 3 + 5 * (1 - parabolaX²)
```

### Transição de Cores

**Interpolação Linear (Lerp)**:
```javascript
lerpColor(c1, c2, t) = c1 + (c2 - c1) * t

Dia: [0.53, 0.81, 0.92]    // Azul claro
Noite: [0.05, 0.05, 0.15]  // Azul escuro
```

---

## 🎮 Gameplay

**Mecânica**:
- Dinossauro corre automaticamente
- Jogador pula (ESPAÇO) para desviar
- Obstáculos: cactos 🌵, pedras 🪨, pássaros 🐦

**Física Simplificada**:
```javascript
// Gravidade
velocityY -= 0.5

// Pulo
if (space && onGround) velocityY = jumpForce

// Chão
if (y <= ground) { y = ground; onGround = true }
```

**Pontuação**: Aumenta com tempo + velocidade do jogo acelera gradualmente

---

## 📊 Conceitos de CG Aplicados

✅ **Parte 1**: Pipeline gráfico, Shaders programáveis, Buffers
✅ **Parte 2**: Transformações 3D, Álgebra linear, Sistemas de coordenadas
✅ **Parte 3**: Iluminação dinâmica, Interpolação, Geometria procedimental

---

## 🚀 Como Executar

```bash
# Opção 1: Live Server (VS Code)
Instalar extensão → Clicar com direito em index.html → "Open with Live Server"

# Opção 2: Python
python -m http.server 8000

# Opção 3: Node
npx http-server -p 8000
```

Acesse: `http://localhost:8000`

---

## 💡 Perguntas Frequentes

**P: Por que WebGL puro?**
R: Para entender os fundamentos de CG do zero, sem abstrações.

**P: Ordem de multiplicação de matrizes importa?**
R: Sim! A×B ≠ B×A. A ordem define a sequência de transformações.

**P: Como funciona a iluminação dinâmica?**
R: A posição da luz muda para seguir o sol (dia) ou lua (noite).

**P: O que é a parábola do sol/lua?**
R: Equação matemática que cria o arco: `y = 3 + 5(1-x²)`.

---

## 🎓 Conclusão

**O que fizemos**:
1. Pipeline WebGL completo do zero
2. Matemática 3D (matrizes, vetores)
3. Iluminação dinâmica
4. 3 modos de câmera
5. Ciclo dia/noite realista

**Resultado**: Jogo 3D funcional em WebGL puro! ✅

---

**Boa apresentação! 🚀**
