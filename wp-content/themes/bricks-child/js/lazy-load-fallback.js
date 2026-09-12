/**
 * [2026-09-12] Red de seguridad para la carga diferida nativa de Bricks.
 *
 * Verificado en vivo: los elementos con fondo "lazy" (clase
 * .bricks-lazy-hidden, ej. las cajas de categoría de la home) se quedan
 * con background-image:none forzado (regla !important del propio
 * Bricks) durante varios segundos tras cargar la página — el observador
 * que debería revelarlos en cuanto entran en pantalla no se dispara. Solo
 * se resuelven más tarde, por casualidad, cuando WooCommerce refresca los
 * fragmentos del carrito (ese sí dispara bricksLazyLoad() por su cuenta).
 * Confirmado con Lighthouse: esto es la causa casi entera del CLS de la
 * home en móvil (0,398 de 0,398).
 *
 * bricksLazyLoad() es una función global que ya expone el propio Bricks
 * (wp-content/themes/bricks/assets/js/frontend.js) — no hay ajuste nativo
 * para "no cargar en diferido este elemento", así que en vez de tocar el
 * mecanismo, simplemente lo volvemos a invocar nosotros mismos justo
 * después de cargar, como red de seguridad. Si Bricks ya lo resolvió
 * antes, esta llamada no cambia nada (los elementos ya resueltos no
 * vuelven a aparecer en el selector ".bricks-lazy-hidden").
 */
document.addEventListener( 'DOMContentLoaded', function () {
	if ( typeof window.bricksLazyLoad === 'function' ) {
		window.bricksLazyLoad();
	}
} );
