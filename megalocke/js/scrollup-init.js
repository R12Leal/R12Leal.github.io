$(function () {
  $.scrollUp({
    scrollName: 'scrollUp',      // ID del botón (se genera automáticamente)
    scrollDistance: 300,         // Mostrar al hacer scroll de 300px
    scrollFrom: 'top',           // 'top' o 'bottom'
    scrollSpeed: 400,            // Velocidad de scroll
    easingType: 'linear',        // Tipo de animación
    animation: 'fade',           // 'fade', 'slide', 'none'
    animationSpeed: 200,         // Velocidad de aparición/desaparición
    scrollText: '',             // Texto o ícono del botón
    zIndex: 2147483647           // Que esté por encima de todo
  });
});