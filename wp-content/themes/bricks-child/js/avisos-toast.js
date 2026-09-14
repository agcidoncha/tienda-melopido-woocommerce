/**
 * [2026-09-14] Los avisos de éxito/información de WooCommerce ("Carrito
 * actualizado", "Producto añadido a la cesta", cambios guardados en Mi
 * cuenta, cupón aplicado...) pasan de quedarse fijos arriba de la página
 * -empujando el contenido, poco visibles sobre todo en móvil- a mostrarse
 * como una tarjeta flotante que aparece con una transición y desaparece
 * sola a los pocos segundos.
 *
 * Los errores (.woocommerce-error) se dejan tal cual, en su sitio: un
 * error normalmente está ligado a un campo o una acción concreta (login,
 * cupón inválido, datos de checkout) y hay que poder seguir viéndolo
 * hasta resolverlo, no que desaparezca solo.
 *
 * Sin control nativo en Bricks para esto: este marcado no lo genera un
 * elemento de Bricks, lo imprime WooCommerce directamente
 * (woocommerce_output_all_notices(), siempre dentro de
 * ".woocommerce-notices-wrapper", en cualquier página). Se usa un
 * MutationObserver sobre ese contenedor porque WooCommerce también
 * inserta avisos nuevos ahí por AJAX (actualizar carrito, aplicar
 * cupón...), no solo en la carga inicial de la página -y ese mismo
 * contenedor no se sustituye entero en esas actualizaciones, así que un
 * único observer puesto una vez sirve para toda la vida de la página.
 */
( function () {
	var DURACION_VISIBLE_MS = 4000;
	var DURACION_SALIDA_MS = 300;
	var SELECTOR_AVISO = '.woocommerce-message, .woocommerce-info';

	function activar( elemento ) {
		if ( elemento.dataset.melopidoToast ) {
			return;
		}
		elemento.dataset.melopidoToast = '1';

		requestAnimationFrame( function () {
			elemento.classList.add( 'melopido-toast-visible' );
		} );

		setTimeout( function () {
			elemento.classList.remove( 'melopido-toast-visible' );
			setTimeout( function () {
				elemento.remove();
			}, DURACION_SALIDA_MS );
		}, DURACION_VISIBLE_MS );
	}

	function procesarAvisosDentroDe( contenedor ) {
		contenedor.querySelectorAll( SELECTOR_AVISO ).forEach( activar );
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		var wrapper = document.querySelector( '.woocommerce-notices-wrapper' );
		if ( ! wrapper ) {
			return;
		}

		procesarAvisosDentroDe( wrapper );

		new MutationObserver( function ( cambios ) {
			cambios.forEach( function ( cambio ) {
				cambio.addedNodes.forEach( function ( nodo ) {
					if ( nodo.nodeType !== 1 ) {
						return;
					}
					if ( nodo.matches && nodo.matches( SELECTOR_AVISO ) ) {
						activar( nodo );
					} else if ( nodo.querySelectorAll ) {
						procesarAvisosDentroDe( nodo );
					}
				} );
			} );
		} ).observe( wrapper, { childList: true, subtree: true } );
	} );
} )();
