/**
 * Al añadir al carrito, en vez de recargar la página o abrir un modal
 * aparte, se añade por AJAX (mismo endpoint que usa WooCommerce de forma
 * nativa) y el propio bloque de color/carrito —tanto en la tarjeta de
 * escritorio como en la barra fija móvil— cambia de contenido en el mismo
 * sitio: se oculta el selector normal y aparece la confirmación con lo
 * añadido, porque nunca hacen falta las dos cosas a la vez.
 *
 * Estructura (Bricks, nativa):
 * - ".carrito-estado-normal" / ".barra-confirmacion" viven dentro de la
 *   tarjeta de escritorio (bloque "Selector Color y Carrito").
 * - Dentro de la barra fija móvil hay un juego equivalente con prefijo
 *   "barra-".
 */
document.addEventListener( 'DOMContentLoaded', function () {
	var form = document.querySelector( 'form.cart' );
	if ( ! form || typeof wc_add_to_cart_params === 'undefined' ) {
		return;
	}

	var ajaxUrl = wc_add_to_cart_params.wc_ajax_url.replace( '%%endpoint%%', 'add_to_cart' );
	var cartUrl = wc_add_to_cart_params.cart_url;

	function resumenTexto() {
		var colorSpan = document.querySelector( '.vi-wpvs-label-selected-title' );
		var color = colorSpan ? colorSpan.textContent.trim() : '';
		var titulo = document.querySelector( 'h1' );
		var producto = titulo ? titulo.textContent.trim() : '';
		var qty = form.querySelector( 'input.qty' );
		var cantidad = qty ? qty.value : '1';
		var totalReal = document.querySelector( '.precio-total-valor' );
		var total = totalReal ? totalReal.textContent.trim() : '';

		var partes = [];
		if ( color ) {
			partes.push( color );
		}
		if ( producto ) {
			partes.push( producto );
		}
		partes.push( cantidad + ' ud.' );
		if ( total ) {
			partes.push( total );
		}
		return partes.join( ' · ' );
	}

	function colorActualFondo() {
		var seleccionado = document.querySelector( '.vi-wpvs-option-wrap-selected .vi-wpvs-option-color' );
		return seleccionado ? getComputedStyle( seleccionado ).background : '#EFEFEF';
	}

	function mostrarConfirmacion() {
		var texto = resumenTexto();
		var colorFondo = colorActualFondo();

		document.querySelectorAll( '.carrito-estado-normal' ).forEach( function ( el ) {
			el.style.display = 'none';
		} );
		var confirmDesktop = document.querySelector( '.carrito-estado-confirmacion' );
		if ( confirmDesktop ) {
			var resumenDesktop = confirmDesktop.querySelector( '.carrito-resumen' );
			if ( resumenDesktop ) {
				resumenDesktop.textContent = texto;
			}
			var circuloDesktop = confirmDesktop.querySelector( '.carrito-resumen-circulo' );
			if ( circuloDesktop ) {
				circuloDesktop.style.background = colorFondo;
			}
			confirmDesktop.style.display = 'flex';
		}

		document.querySelectorAll( '.barra-fija-movil .carrito-estado-normal' ).forEach( function ( el ) {
			el.style.display = 'none';
		} );
		var confirmMovil = document.querySelector( '.barra-confirmacion' );
		if ( confirmMovil ) {
			var resumenMovil = confirmMovil.querySelector( '.barra-carrito-resumen' );
			if ( resumenMovil ) {
				resumenMovil.textContent = texto;
			}
			var circuloMovil = confirmMovil.querySelector( '.barra-carrito-resumen-circulo' );
			if ( circuloMovil ) {
				circuloMovil.style.background = colorFondo;
			}
			confirmMovil.style.display = 'flex';
		}
	}

	function volverEstadoNormal() {
		// Lo que se acaba de añadir ya está en el carrito; si se deja tal
		// cual (color + cantidad elegidos), la siguiente vez se podría
		// añadir lo mismo otra vez sin darse cuenta. Se vuelve al mismo
		// estado que al cargar la página: sin color elegido y cantidad 1.
		var resetLink = document.querySelector( '.reset_variations' );
		if ( resetLink ) {
			resetLink.click();
		}

		var qty = form.querySelector( 'input.qty' );
		if ( qty && qty.value !== '1' ) {
			qty.value = 1;
			qty.dispatchEvent( new Event( 'change', { bubbles: true } ) );
		}

		document.querySelectorAll( '.carrito-estado-normal' ).forEach( function ( el ) {
			el.style.display = '';
		} );
		var confirmDesktop = document.querySelector( '.carrito-estado-confirmacion' );
		if ( confirmDesktop ) {
			confirmDesktop.style.display = 'none';
		}

		document.querySelectorAll( '.barra-fija-movil .carrito-estado-normal' ).forEach( function ( el ) {
			el.style.display = '';
		} );
		var confirmMovil = document.querySelector( '.barra-confirmacion' );
		if ( confirmMovil ) {
			confirmMovil.style.display = 'none';
		}
	}

	function anadirAlCarrito( boton ) {
		var datos = new URLSearchParams( new FormData( form ) );

		// El endpoint AJAX de esta instalación de WooCommerce identifica la
		// variación por "product_id" (comprueba si ese ID es del tipo
		// "variation"), no por "variation_id" aparte. Si no se envía así,
		// intenta añadir el producto variable "a secas" y lo rechaza.
		var variationId = datos.get( 'variation_id' );
		if ( variationId && variationId !== '0' ) {
			datos.set( 'product_id', variationId );
		}

		fetch( ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: datos.toString(),
		} )
			.then( function ( respuesta ) {
				return respuesta.json();
			} )
			.then( function ( datos ) {
				if ( datos && ! datos.error ) {
					if ( window.jQuery ) {
						jQuery( document.body ).trigger( 'added_to_cart', [ datos.fragments, datos.cart_hash, jQuery( boton ) ] );
					}
					mostrarConfirmacion();
				}
			} )
			.catch( function () {
				// Si falla el AJAX, no se hace nada: el usuario se queda en
				// el estado normal y puede reintentar.
			} );
	}

	// Solo se engancha al botón real. El de la barra móvil ya reenvía su
	// clic al real (ver barra-sticky-movil.js); enganchar también el de la
	// barra duplicaría el añadido al carrito.
	document.querySelectorAll( '.single_add_to_cart_button' ).forEach( function ( boton ) {
		boton.addEventListener(
			'click',
			function ( e ) {
				if ( boton.classList.contains( 'disabled' ) || boton.classList.contains( 'wc-variation-selection-needed' ) ) {
					return;
				}
				// El plugin de swatches (WPVS) también engancha este mismo
				// botón y hace su propio añadido AJAX al carrito. Sin
				// detener del todo el evento, los dos añaden a la vez
				// (doble unidad en el carrito) y su comportamiento nativo
				// ("Ver carrito") pisa nuestra confirmación en el sitio.
				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				anadirAlCarrito( boton );
			},
			true
		);
	} );

	document.querySelectorAll( '.carrito-seguir-comprando, .barra-seguir-comprando' ).forEach( function ( boton ) {
		boton.addEventListener( 'click', volverEstadoNormal );
	} );

	document.querySelectorAll( '.carrito-ir-carrito, .barra-ir-carrito' ).forEach( function ( boton ) {
		boton.addEventListener( 'click', function () {
			window.location.href = cartUrl;
		} );
	} );
} );
