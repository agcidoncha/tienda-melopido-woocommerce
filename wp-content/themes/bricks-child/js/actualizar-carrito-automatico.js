/**
 * [2026-09-14] Actualiza el carrito automáticamente al cambiar la cantidad
 * de un producto, en vez de obligar a pulsar el botón "Actualizar carrito".
 * WooCommerce ya activa/desactiva ese botón de forma nativa al detectar un
 * cambio (ver "input_changed" en cart.js del plugin) y su AJAX ya bloquea
 * el formulario mientras actualiza -no hace falta ningún indicador propio-,
 * pero no lo envía solo, hay que pulsarlo a mano. Aquí se simula un clic
 * real sobre ese mismo botón tras una breve pausa sin más cambios
 * (debounce, para no lanzar una petición por cada paso del contador de
 * cantidad). Al ser un clic real sobre el botón nativo se reutiliza toda
 * su lógica de AJAX/bloqueo/eventos tal cual, sin duplicar nada de eso
 * aquí.
 *
 * Delegado en "document" (no en los inputs directamente) porque
 * WooCommerce sustituye el formulario entero por uno nuevo en cada
 * actualización AJAX (".woocommerce-cart-form".replaceWith(...) en
 * cart.js) -si el listener estuviera puesto en los inputs originales,
 * dejaría de funcionar después de la primera actualización.
 */
( function () {
	var TIEMPO_ESPERA_MS = 700;
	var temporizador = null;

	document.addEventListener( 'change', function ( evento ) {
		var input = evento.target;

		if ( ! input.classList || ! input.classList.contains( 'qty' ) ) {
			return;
		}

		var form = input.closest( '.woocommerce-cart-form' );
		if ( ! form ) {
			return;
		}

		clearTimeout( temporizador );
		temporizador = setTimeout( function () {
			var boton = form.querySelector( 'button[name="update_cart"], input[name="update_cart"]' );
			if ( boton && ! boton.disabled ) {
				boton.click();
			}
		}, TIEMPO_ESPERA_MS );
	} );
} )();
