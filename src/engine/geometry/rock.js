function drawRock(anglePreset) {
  const font = ANGLE_PRESETS.find(preset => preset.name === anglePreset);
  let angleX = font.angleX;
  let angleY = font.angleY;

  const base = createCube('GRAY', 0.8, [0.0, -0.5, 0.0], 0.2);
  draw3D(base.vertices, base.colors, base.indices, getTransformMatrix(angleX, angleY, 0.8));

  const meio1 = createCube('GRAY', 0.6, [0.0, -0.35, 0.0], 0.15);
  draw3D(meio1.vertices, meio1.colors, meio1.indices, getTransformMatrix(angleX, angleY, 0.8));

  const meio2 = createCube('GRAY', 0.45, [0.0, -0.24, 0.0], 0.12);
  draw3D(meio2.vertices, meio2.colors, meio2.indices, getTransformMatrix(angleX, angleY, 0.8));

  const lateral1 = createCube('GRAY', 0.3, [-0.25, -0.45, 0.0], 0.18);
  draw3D(lateral1.vertices, lateral1.colors, lateral1.indices, getTransformMatrix(angleX, angleY, 0.8));

  const lateral2 = createCube('GRAY', 0.25, [0.28, -0.42, 0.0], 0.16);
  draw3D(lateral2.vertices, lateral2.colors, lateral2.indices, getTransformMatrix(angleX, angleY, 0.8));

  const topo1 = createCube('GRAY', 0.3, [0.0, -0.15, 0.0], 0.1);
  draw3D(topo1.vertices, topo1.colors, topo1.indices, getTransformMatrix(angleX, angleY, 0.8));

  const detalhe2 = createCube('GRAY', 0.15, [0.18, -0.15, 0.15], 0.06);
  draw3D(detalhe2.vertices, detalhe2.colors, detalhe2.indices, getTransformMatrix(angleX, angleY, 0.8));
}
