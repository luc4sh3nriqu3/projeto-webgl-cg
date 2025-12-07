function drawSun(position) {
    const [x, y, z] = position;
    // Cria uma esfera amarela, escala 2.0 (grande), na posição desejada
    const sol = createSphere('YELLOW', 2.0, [x, y, z], 3); // Detalhe 3 para ficar bem redonda
    
    // Desenhamos o objeto. 
    // Nota: A matriz de transformação será simples (apenas translação)
    // Se você quiser que o sol pulse ou gire, faria a matemática aqui.
    
    // Importante: No futuro, talvez precisemos de um shader especial para o sol 
    // "brilhar" (não ser afetado pela sombra), mas por enquanto, desenhá-lo assim funciona.
    draw3D(sol.vertices, sol.colors, sol.indices);
}