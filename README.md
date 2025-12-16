# 🦖 Dino Runner 3D - Projeto WebGL

> Projeto final da disciplina de Computação Gráfica  
> Implementação de um endless runner 3D utilizando WebGL puro


## 🎮 Visão Geral

**Dino Runner 3D** é um jogo endless runner implementado do zero usando WebGL puro, sem bibliotecas de terceiros. O jogador controla um dinossauro que corre por uma pista infinita, desviando de obstáculos (cactos, pedras e pássaros) enquanto o ambiente transita dinamicamente entre dia e noite.

### Tecnologias Utilizadas
- **WebGL 1.0** - API gráfica low-level
- **GLSL** - Shaders (vertex e fragment)
- **JavaScript ES6+** - Lógica do jogo
- **Matemática Linear** - Transformações 3D customizadas

### Características Técnicas
- ✅ Renderização 3D com pipeline completo
- ✅ Sistema de câmera com 3 modos de visualização
- ✅ Iluminação dinâmica pontual
- ✅ Ciclo dia/noite com transições suaves
- ✅ Geometria procedimental (esferas, cubos)
- ✅ Depth testing e face culling
- ✅ Matrizes de transformação customizadas

---

## 🎯 Core do Projeto

### Fluxo Principal de Execução

```javascript
1. INICIALIZAÇÃO (initGame)
   ├─> Criar contexto WebGL
   ├─> Compilar shaders (vertex + fragment)
   ├─> Inicializar câmera 3D
   ├─> Configurar WebGL (depth test, culling)
   └─> Criar instância do jogo

2. GAME LOOP (gameLoop - 60 FPS)
   ├─> updateDayNightCycle()      // Atualiza ciclo dia/noite
   ├─> game.update()              // Física e lógica do jogo
   ├─> camera.update()            // Atualiza posição da câmera
   ├─> render(gameState)          // Renderiza a cena
   └─> requestAnimationFrame()    // Próximo frame

3. RENDERIZAÇÃO (render)
   ├─> clear(currentSkyColor)     // Limpa buffers
   ├─> renderSun() ou renderMoon() // Corpo celeste
   ├─> renderGround3D()           // Pista infinita
   ├─> renderPlayer3D()           // Dinossauro
   └─> renderObstacles3D()        // Cactos, pedras, pássaros
```

### Componentes Principais

#### 1. **WebGL Context & Shaders** (`webgl-utils-3d.js`)
Responsável por:
- Inicializar contexto WebGL
- Compilar vertex e fragment shaders
- Configurar atributos e uniforms
- Gerenciar buffers (posição, cor, normal, índices)

#### 2. **Sistema de Câmera** (`camera3d.js`)
Implementa 3 modos de visualização:
- **Modo 1**: Follow Player (câmera atrás e acima)
- **Modo 2**: Behind Player (vista de terceira pessoa)
- **Modo 3**: Side View (vista lateral)

#### 3. **Biblioteca Matemática** (`m4.js`, `vec3.js`)
Operações fundamentais:
- Matrizes identidade, translação, rotação, escala
- Multiplicação de matrizes
- Produto vetorial (cross product)
- Produto escalar (dot product)
- Normalização de vetores

#### 4. **Game Logic** (`main.js`, `player.js`)
Gerencia:
- Física do jogador (gravidade, pulo)
- Spawning de obstáculos
- Detecção de colisão
- Sistema de pontuação

---

## 📐 Transformações Matemáticas

### 1. Pipeline de Transformação (Vertex Shader)

Cada vértice passa por uma sequência de transformações:

```glsl
gl_Position = ProjectionMatrix × ViewMatrix × ModelMatrix × Position
```

**Ordem de aplicação:**
1. **Model Matrix**: Espaço local → Espaço mundial
2. **View Matrix**: Espaço mundial → Espaço da câmera
3. **Projection Matrix**: Espaço da câmera → Espaço de clip

### 2. Model Matrix (Transformação de Objeto)

Combina 3 transformações fundamentais:

#### **Translação** (T)
Move o objeto no espaço 3D:

```javascript
T = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  tx, ty, tz, 1
]
```

Onde `(tx, ty, tz)` é o deslocamento.

#### **Escala** (S)
Redimensiona o objeto:

```javascript
S = [
  sx, 0,  0,  0,
  0,  sy, 0,  0,
  0,  0,  sz, 0,
  0,  0,  0,  1
]
```

Onde `(sx, sy, sz)` são fatores de escala em cada eixo.

#### **Rotação** (R)

**Rotação em Y** (mais usada no projeto):
```javascript
Ry(θ) = [
  cos(θ),  0, sin(θ), 0,
  0,       1, 0,      0,
  -sin(θ), 0, cos(θ), 0,
  0,       0, 0,      1
]
```

**Rotação em X**:
```javascript
Rx(θ) = [
  1, 0,       0,        0,
  0, cos(θ), -sin(θ),  0,
  0, sin(θ),  cos(θ),  0,
  0, 0,       0,        1
]
```

**Combinação de transformações:**
```javascript
ModelMatrix = T × Ry × Rx × S
```

### 3. View Matrix (Look At)

Matriz que posiciona a câmera no espaço:

```javascript
// Vetores da câmera
zAxis = normalize(eye - target)     // Direção da câmera
xAxis = normalize(cross(up, zAxis)) // Vetor direita
yAxis = cross(zAxis, xAxis)         // Vetor up real

ViewMatrix = [
  xAxis.x, yAxis.x, zAxis.x, 0,
  xAxis.y, yAxis.y, zAxis.y, 0,
  xAxis.z, yAxis.z, zAxis.z, 0,
  -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye), 1
]
```

**Operações auxiliares:**

**Cross Product** (produto vetorial):
```javascript
cross(a, b) = [
  a.y * b.z - a.z * b.y,
  a.z * b.x - a.x * b.z,
  a.x * b.y - a.y * b.x
]
```

**Dot Product** (produto escalar):
```javascript
dot(a, b) = a.x * b.x + a.y * b.y + a.z * b.z
```

**Normalize** (normalização):
```javascript
normalize(v) = v / length(v)
length(v) = sqrt(v.x² + v.y² + v.z²)
```

### 4. Projection Matrix (Perspectiva)

Cria o efeito de profundidade (objetos distantes ficam menores):

```javascript
f = tan(π/2 - FOV/2)
rangeInv = 1 / (near - far)

ProjectionMatrix = [
  f/aspect, 0, 0,                        0,
  0,        f, 0,                        0,
  0,        0, (near+far)*rangeInv,     -1,
  0,        0, near*far*rangeInv*2,      0
]
```

**Parâmetros:**
- `FOV` = π/3 (60°) - campo de visão
- `aspect` = largura/altura do canvas
- `near` = 0.1 - plano de corte próximo
- `far` = 200.0 - plano de corte distante

### 5. Multiplicação de Matrizes

Operação fundamental para combinar transformações:

```javascript
C = A × B

C[row][col] = Σ(A[row][k] × B[k][col])
```

**Implementação:**
```javascript
multiply(a, b) {
  result = []
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      result[i*4 + j] = 
        a[i*4+0]*b[0*4+j] + 
        a[i*4+1]*b[1*4+j] + 
        a[i*4+2]*b[2*4+j] + 
        a[i*4+3]*b[3*4+j]
    }
  }
  return result
}
```

⚠️ **IMPORTANTE**: A ordem importa! `A × B ≠ B × A`

---

## 🎨 Pipeline de Renderização

### Vertex Shader (Processamento de Vértices)

```glsl
attribute vec3 aPosition;  // Posição do vértice (entrada)
attribute vec3 aColor;     // Cor do vértice (entrada)
attribute vec3 aNormal;    // Normal para iluminação (entrada)

uniform mat4 uModelMatrix;      // Transformação do objeto
uniform mat4 uViewMatrix;       // Transformação da câmera
uniform mat4 uProjectionMatrix; // Projeção perspectiva
uniform vec3 uLightPosition;    // Posição da luz

varying vec3 vColor;       // Cor interpolada (saída)
varying float vLighting;   // Intensidade da luz (saída)

void main() {
  // 1. Transformar posição para espaço mundial
  vec3 worldPos = (uModelMatrix * vec4(aPosition, 1.0)).xyz;
  
  // 2. Aplicar todas as transformações
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
  
  // 3. Calcular iluminação (modelo de Phong simplificado)
  vec3 normal = normalize((uModelMatrix * vec4(aNormal, 0.0)).xyz);
  vec3 lightVector = normalize(uLightPosition - worldPos);
  float dotProduct = max(dot(normal, lightVector), 0.0);
  
  // 4. Intensidade = luz ambiente + luz difusa
  vLighting = 0.25 + dotProduct * 0.75;
  
  // 5. Passar cor para fragment shader
  vColor = aColor;
}
```

### Fragment Shader (Coloração de Pixels)

```glsl
precision mediump float;

varying vec3 vColor;      // Cor interpolada (entrada)
varying float vLighting;  // Iluminação interpolada (entrada)

void main() {
  // Cor final = cor do vértice × iluminação
  gl_FragColor = vec4(vColor * vLighting, 1.0);
}
```

### Fluxo de Dados

```
JAVASCRIPT → GPU
├─> Vertices (Float32Array)
├─> Colors (Float32Array)
├─> Normals (Float32Array)
├─> Indices (Uint16Array)
└─> Uniforms (Matrizes 4x4)

GPU PIPELINE
├─> Vertex Shader (por vértice)
│   ├─> Transformações
│   ├─> Cálculo de iluminação
│   └─> Posição em clip space
│
├─> Rasterização
│   └─> Converte triângulos em pixels
│
└─> Fragment Shader (por pixel)
    └─> Cor final = vColor × vLighting
```

---

## 📷 Sistema de Câmera

### Modos de Visualização

#### **Modo 1: Follow Player** (Tecla `1`)
Câmera segue o jogador com offset ajustável:

```javascript
followPlayer(player, offset = {x: 2, y: 5, z: 8}) {
  // Posição da câmera = posição do jogador + offset
  this.position.x = player.x * 1.5 + offset.x
  this.position.y = player.y + offset.y
  this.position.z = player.z + offset.z
  
  // Câmera olha para o jogador
  this.target.x = player.x * 1.5
  this.target.y = player.y
  this.target.z = player.z
}
```

#### **Modo 2: Behind Player** (Tecla `2`)
Vista de terceira pessoa clássica:

```javascript
behindPlayer(player, offset = {x: 0, y: 3, z: 6}) {
  // Câmera diretamente atrás do jogador
  this.position.x = player.x * 1.5 + offset.x
  this.position.y = player.y + offset.y
  this.position.z = player.z + offset.z
  
  // Olha para frente (na direção -Z)
  this.target.x = player.x * 1.5
  this.target.y = player.y + 1
  this.target.z = player.z - 5
}
```

#### **Modo 3: Side View** (Tecla `3`)
Vista lateral tipo runner clássico:

```javascript
sideView(player, offset = {x: 6, y: 4, z: 2}) {
  // Câmera ao lado do jogador
  this.position.x = offset.x
  this.position.y = player.y + offset.y
  this.position.z = player.z + offset.z
  
  // Olha para o jogador
  this.target.x = player.x * 1.5
  this.target.y = player.y + 1
  this.target.z = player.z
}
```

### Cálculo da View Matrix

```javascript
updateMatrices() {
  // Converter posições para arrays
  const eye = [this.position.x, this.position.y, this.position.z]
  const target = [this.target.x, this.target.y, this.target.z]
  const up = [this.up.x, this.up.y, this.up.z]
  
  // Criar view matrix (lookAt)
  this.viewMatrix = this.createLookAtMatrix(eye, target, up)
  
  // Criar projection matrix
  this.projectionMatrix = this.createPerspectiveMatrix(
    this.fieldOfView,  // π/3 (60°)
    this.aspect,       // largura/altura
    this.near,         // 0.1
    this.far           // 200.0
  )
}
```

---

## 💡 Sistema de Iluminação

### Modelo de Iluminação

Implementamos um modelo de **iluminação pontual simplificado** (baseado em Phong):

```glsl
Iluminação Total = Luz Ambiente + Luz Difusa

// Componentes:
Ambiente = 0.25           // 25% de luz constante
Difusa = 0.75 × N·L       // 75% depende da normal e direção da luz
```

### Cálculo da Iluminação (Vertex Shader)

```glsl
// 1. Transformar normal para espaço mundial
vec3 worldNormal = normalize((uModelMatrix * vec4(aNormal, 0.0)).xyz)

// 2. Calcular vetor da luz (do vértice até a luz)
vec3 lightVector = normalize(uLightPosition - worldPos)

// 3. Produto escalar (N·L)
float dotProduct = max(dot(worldNormal, lightVector), 0.0)

// 4. Intensidade final
float intensity = 0.25 + 0.75 * dotProduct
```

### Propriedades da Luz

```javascript
lightPosition = [x, y, z]  // Posição da luz no espaço 3D

// Durante o dia: luz = posição do sol
setLightPosition(sunPos.x, sunPos.y, sunPos.z)

// Durante a noite: luz = posição da lua
setLightPosition(moonPos.x, moonPos.y, moonPos.z)
```

### Normais de Superfície

Para cada face triangular, calculamos a normal usando **produto vetorial**:

```javascript
// Dados 3 vértices de um triângulo: v0, v1, v2
edge1 = v1 - v0
edge2 = v2 - v0

normal = normalize(cross(edge1, edge2))

// A normal aponta perpendicular à superfície
```

---

## 🌅 Ciclo Dia/Noite

### Conceito

O jogo possui um ciclo completo dia/noite com:
- ☀️ **Sol** (0.0 - 0.5) - céu azul claro
- 🌙 **Lua** (0.5 - 1.0) - céu azul escuro
- Transições suaves de cor
- Movimento parabólico dos corpos celestes

### Variáveis Principais

```javascript
let dayNightTime = 0         // 0.0 a 1.0 (ciclo completo)
const cycleSpeed = 0.00025   // Velocidade da transição

const skyColors = {
  day: [0.53, 0.81, 0.92],   // RGB - azul claro
  night: [0.05, 0.05, 0.15]  // RGB - azul escuro
}
```

### Movimento Parabólico (Sol e Lua)

Os corpos celestes seguem uma **trajetória parabólica**:

```javascript
function updateCelestialPosition(celestialPos, time) {
  // Parâmetros
  const startX = -10
  const endX = 10
  const peakHeight = 8    // Altura máxima no centro
  const baseHeight = 3    // Altura nas extremidades
  const fixedZ = -10      // Profundidade fixa
  
  // X se move linearmente
  celestialPos.x = startX + (endX - startX) * time
  
  // Normalizar X para [-1, 1]
  const normalizedX = (celestialPos.x - startX) / (endX - startX)
  const parabolaX = normalizedX * 2 - 1
  
  // Equação da parábola invertida: y = h + (H-h)(1-x²)
  celestialPos.y = baseHeight + (peakHeight - baseHeight) * (1 - parabolaX * parabolaX)
  
  // Z fixo
  celestialPos.z = fixedZ
}
```

**Explicação da Parábola:**
- Quando `time = 0`: x = -10, y = 3 (nascer)
- Quando `time = 0.5`: x = 0, y = 8 (pico - meio-dia)
- Quando `time = 1`: x = 10, y = 3 (pôr)

### Transição de Cores

Interpolação linear (lerp) entre cores:

```javascript
function lerpColor(color1, color2, t) {
  return [
    color1[0] + (color2[0] - color1[0]) * t,  // R
    color1[1] + (color2[1] - color1[1]) * t,  // G
    color1[2] + (color2[2] - color1[2]) * t   // B
  ]
}

// Transição acontece nos primeiros 25% de cada fase
const transitionProgress = Math.min(phaseTime * 4, 1)
currentSkyColor = lerpColor(nightColor, dayColor, transitionProgress)
```

### Atualização do Ciclo

```javascript
function updateDayNightCycle() {
  // 1. Incrementar tempo
  dayNightTime += cycleSpeed
  if (dayNightTime >= 1.0) dayNightTime = 0.0
  
  // 2. Determinar fase
  const isDaytime = dayNightTime < 0.5
  
  if (isDaytime) {
    // 3a. Atualizar sol (normalizar 0-0.5 para 0-1)
    updateCelestialPosition(sunPos, dayNightTime * 2)
    
    // 4a. Transição de cor (noite → dia)
    const t = Math.min(dayNightTime * 4, 1)
    currentSkyColor = lerpColor(skyColors.night, skyColors.day, t)
    
    // 5a. Posicionar luz no sol
    setLightPosition(sunPos.x, sunPos.y, sunPos.z)
  } else {
    // 3b. Atualizar lua (normalizar 0.5-1.0 para 0-1)
    updateCelestialPosition(moonPos, (dayNightTime - 0.5) * 2)
    
    // 4b. Transição de cor (dia → noite)
    const t = Math.min((dayNightTime - 0.5) * 4, 1)
    currentSkyColor = lerpColor(skyColors.day, skyColors.night, t)
    
    // 5b. Posicionar luz na lua
    setLightPosition(moonPos.x, moonPos.y, moonPos.z)
  }
  
  // 6. Atualizar cor de fundo do WebGL
  gl.clearColor(currentSkyColor[0], currentSkyColor[1], currentSkyColor[2], 1.0)
}
```

### Renderização Condicional

```javascript
function render(gameState) {
  // Limpar com cor atual
  webglContext.clear([...currentSkyColor, 1.0])
  
  const isDaytime = dayNightTime < 0.5
  
  if (isDaytime) {
    drawSun([sunPos.x, sunPos.y, sunPos.z])     // Esfera amarela
  } else {
    drawMoon([moonPos.x, moonPos.y, moonPos.z]) // Esfera branca
  }
  
  // ... resto da renderização
}
```

---

## 🚀 Como Executar

### Requisitos
- Navegador moderno com suporte a WebGL
- Servidor HTTP local (não funciona com `file://`)

### Opção 1: Live Server (VS Code)
```bash
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito em index.html
3. Selecione "Open with Live Server"
```

### Opção 2: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Acesse: http://localhost:8000
```

### Opção 3: Node.js HTTP Server
```bash
npx http-server -p 8000

# Acesse: http://localhost:8000
```

### Controles do Jogo
- **ESPAÇO** - Pular
- **R** - Reiniciar (quando game over)
- **1, 2, 3** - Alternar modos de câmera

---

## 📊 Estrutura de Dados

### Geometria (Exemplo: Esfera)

```javascript
{
  vertices: Float32Array[],  // Posições 3D (x, y, z)
  colors: Float32Array[],    // Cores RGB (r, g, b)
  normals: Float32Array[],   // Normais (nx, ny, nz)
  indices: Uint16Array[]     // Índices dos triângulos
}
```

### Estado do Jogo

```javascript
{
  player: { x, y, z },           // Posição do jogador
  obstacles: [                    // Array de obstáculos
    { x, y, z, type },
    ...
  ],
  score: number,                  // Pontuação
  isGameOver: boolean,            // Flag de game over
  isPaused: boolean               // Flag de pausa
}
```

---

## 🎓 Conceitos de Computação Gráfica Aplicados

### ✅ Transformações Geométricas
- Translação, rotação, escala
- Composição de transformações
- Hierarquia de transformações

### ✅ Sistemas de Coordenadas
- Espaço local (object space)
- Espaço mundial (world space)
- Espaço da câmera (view/camera space)
- Espaço de clip (clip space)

### ✅ Projeção
- Projeção em perspectiva
- Frustum de visualização
- Near/far clipping planes

### ✅ Iluminação
- Modelo de Phong simplificado
- Luz ambiente
- Luz difusa
- Normais de superfície

### ✅ Rasterização
- Conversão de triângulos em pixels
- Interpolação de atributos (cores, normais)
- Depth testing (Z-buffer)

### ✅ Shaders Programáveis
- Vertex shaders
- Fragment shaders
- Pipeline gráfico customizado

### ✅ Otimizações
- Face culling (backface culling)
- Indexed drawing (redução de vértices)
- Buffer reuso

---

