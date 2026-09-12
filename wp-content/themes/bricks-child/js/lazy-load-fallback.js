/**
 * [2026-09-12] Corrige el CLS de la home (Lighthouse: 0,40 en móvil, casi
 * entero atribuido a la sección de categorías).
 *
 * Causa real (confirmada probando la propia IntersectionObserver API en
 * directo): el observador de carga diferida de Bricks SÍ se crea
 * correctamente para estas cajas — no es que falle en arrancar (la
 * primera versión de este archivo, que solo repetía bricksLazyLoad(),
 * no servía de nada por eso: el elemento ya estaba en su lista de
 * "inicializados"). El problema es que, bajo limitación de CPU/red
 * (justo lo que usa Lighthouse para simular un móvil real), el aviso de
 * "ya está a la vista" de ese observador puede tardar varios segundos en
 * dispararse — y hasta que no se dispara, Bricks fuerza
 * background-image:none con !important vía la clase .bricks-lazy-hidden.
 *
 * Estas cajas están siempre a la vista nada más cargar la página (nunca
 * hace falta diferir su carga), así que no tiene sentido esperar al
 * observador: se les quita la clase directamente y sin rodeos.
 */
document.addEventListener( 'DOMContentLoaded', function () {
	document.querySelectorAll(
		'#brxe-lsc756.bricks-lazy-hidden, #brxe-lsc756 .bricks-lazy-hidden, #brxe-iktncc.bricks-lazy-hidden, #brxe-iktncc .bricks-lazy-hidden'
	).forEach( function ( el ) {
		el.classList.remove( 'bricks-lazy-hidden' );
	} );
} );
