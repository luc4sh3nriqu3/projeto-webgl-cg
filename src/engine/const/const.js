const ANGLE_PRESETS = [
  { name: 'front', angleX: 0, angleY: 0, degX: 0, degY: 0 },            // vista frontal
  { name: 'top', angleX: -Math.PI / 2, angleY: 0, degX: -90, degY: 0 },   // vista de cima
  { name: 'bottom', angleX: Math.PI / 2, angleY: 0, degX: 90, degY: 0 },  // vista de baixo
  { name: 'left', angleX: 0, angleY: -Math.PI / 2, degX: 0, degY: -90 },  // vista lateral esquerda
  { name: 'right', angleX: 0, angleY: Math.PI / 2, degX: 0, degY: 90 },   // vista lateral direita
  { name: 'back', angleX: 0, angleY: Math.PI, degX: 0, degY: 180 },       // vista traseira
  { name: 'iso', angleX: Math.PI / 6, angleY: Math.PI / 6, degX: 30, degY: 30 } // isométrica leve
];

const RIGTH = 'right';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';
const FRONT = 'front';
const BACK = 'back';
const ISO = 'iso';

const HITBOX_SCALE = 0.75;
