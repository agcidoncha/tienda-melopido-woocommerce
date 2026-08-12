/**
 * Barra fija inferior (solo móvil) con color · cantidad · total · añadir al
 * carrito. Es un "espejo" de los controles reales de la ficha (selector de
 * color WPVS, cantidad, total ya calculado por precio-cantidad-dinamico.js,
 * botón de compra) — no duplica lógica de WooCommerce, solo la refleja y
 * actúa sobre los controles reales para no desincronizar estado.
 *
 * La estructura visual vive en Bricks (bloque "Barra Fija Móvil", clase
 * .barra-fija-movil, oculto en desktop vía _display:mobile_portrait).
 */
document.addEventListener( 'DOMContentLoaded', function () {
	var barra = document.querySelector( '.barra-fija-movil' );
	var form = document.querySelector( 'form.cart' );
	if ( ! barra || ! form ) {
		return;
	}

	var pildora = barra.querySelector( '.barra-pildora-color' );
	var circulo = barra.querySelector( '.barra-circulo-color' );
	var nombre = barra.querySelector( '.barra-nombre-color' );
	var filaColores = barra.querySelector( '.barra-fila-colores' );
	var ayudaColor = barra.querySelector( '.barra-ayuda-color' );
	var qtyValor = barra.querySelector( '.barra-qty-valor' );
	var qtyMenos = barra.querySelector( '.barra-qty-menos' );
	var qtyMas = barra.querySelector( '.barra-qty-mas' );
	var totalValor = barra.querySelector( '.barra-total-valor' );
	var botonAnadir = barra.querySelector( '.barra-anadir-carrito' );
	var botonLimpiar = barra.querySelector( '.barra-limpiar' );

	var $qty = form.querySelector( 'input.qty' );

	/* --- Construir los círculos de color a partir de los reales ---
	   "Busca tu color" se mueve dentro de la misma fila (al final), para que
	   quede flotando a la derecha de los círculos en vez de en su propia
	   línea debajo. */
	function construirColores() {
		if ( filaColores.dataset.construida ) {
			return;
		}
		filaColores.dataset.construida = '1';
		document.querySelectorAll( '.vi-wpvs-option-wrap' ).forEach( function ( real ) {
			var colorReal = real.querySelector( '.vi-wpvs-option-color' );
			var mini = document.createElement( 'div' );
			mini.style.width = '24px';
			mini.style.height = '24px';
			mini.style.flexShrink = '0';
			mini.style.borderRadius = '50%';
			mini.style.cursor = 'pointer';
			mini.style.background = colorReal ? getComputedStyle( colorReal ).background : '#eee';
			mini.setAttribute( 'data-attribute-value', real.getAttribute( 'data-attribute_value' ) );
			mini.addEventListener( 'click', function () {
				real.click();
				cerrarDesplegable();
				var galeria = document.getElementById( 'brxe-f69a40' );
				if ( galeria ) {
					galeria.scrollIntoView( { behavior: 'smooth', block: 'center' } );
				}
			} );
			filaColores.appendChild( mini );
		} );
		if ( ayudaColor ) {
			filaColores.appendChild( ayudaColor );
			// Su "display: none" por defecto (de Bricks) es una regla de
			// hoja de estilos; este estilo en línea la sobreescribe. A
			// partir de aquí, como ya está anidado dentro de filaColores,
			// es el "display" del padre el que manda si se ve o no.
			ayudaColor.style.display = 'flex';
		}
	}

	/* --- Desplegar / plegar el selector de color (con flecha girando) --- */
	function cerrarDesplegable() {
		filaColores.style.display = 'none';
		pildora.classList.remove( 'barra-desplegada' );
	}

	pildora.addEventListener( 'click', function ( e ) {
		if ( botonLimpiar && e.target === botonLimpiar ) {
			return;
		}
		construirColores();
		var abierta = filaColores.style.display === 'flex';
		if ( abierta ) {
			cerrarDesplegable();
		} else {
			filaColores.style.display = 'flex';
			pildora.classList.add( 'barra-desplegada' );
		}
	} );

	/* --- Reflejar el color seleccionado ---
	   Sin color elegido, la barra solo muestra el botón a todo lo ancho.
	   Al elegir uno, aparecen cantidad y total (clase .barra-con-color) y
	   el botón se encoge para compartir la fila. */
	function actualizarColorActual() {
		var seleccionado = document.querySelector( '.vi-wpvs-option-wrap-selected .vi-wpvs-option-color' );

		if ( seleccionado ) {
			circulo.style.background = getComputedStyle( seleccionado ).background;
			barra.classList.add( 'barra-con-color' );
			// El texto del nombre solo es de fiar cuando hay algo realmente
			// seleccionado: WPVS no lo borra al pulsar "Limpiar", solo quita
			// la marca de seleccionado de los círculos.
			var tituloSpan = document.querySelector( '.vi-wpvs-label-selected-title' );
			if ( tituloSpan && tituloSpan.textContent.trim() ) {
				nombre.textContent = tituloSpan.textContent.trim();
			}
		} else {
			barra.classList.remove( 'barra-con-color' );
			nombre.textContent = 'Elige un color';
			circulo.style.background = '#EFEFEF';
		}
	}

	/* --- Limpiar: resetea la variación real (mismo enlace "Limpiar" del
	   selector de color de la ficha) --- */
	if ( botonLimpiar ) {
		botonLimpiar.addEventListener( 'click', function ( e ) {
			e.stopPropagation();
			var real = document.querySelector( '.reset_variations' );
			if ( real ) {
				real.click();
			}
			cerrarDesplegable();
		} );
	}

	var observerColor = new MutationObserver( actualizarColorActual );
	observerColor.observe( form, { childList: true, subtree: true, attributes: true, attributeFilter: [ 'class' ] } );
	actualizarColorActual();

	/* --- Cantidad: los botones espejo accionan los reales --- */
	function actualizarQty() {
		qtyValor.textContent = $qty.value;
	}

	qtyMenos.addEventListener( 'click', function () {
		var real = form.querySelector( '.quantity .action.minus' );
		if ( real ) {
			real.click();
		} else {
			$qty.value = Math.max( 1, ( parseInt( $qty.value, 10 ) || 1 ) - 1 );
			$qty.dispatchEvent( new Event( 'change', { bubbles: true } ) );
		}
	} );

	qtyMas.addEventListener( 'click', function () {
		var real = form.querySelector( '.quantity .action.plus' );
		if ( real ) {
			real.click();
		} else {
			$qty.value = ( parseInt( $qty.value, 10 ) || 1 ) + 1;
			$qty.dispatchEvent( new Event( 'change', { bubbles: true } ) );
		}
	} );

	$qty.addEventListener( 'change', actualizarQty );
	$qty.addEventListener( 'input', actualizarQty );
	actualizarQty();

	/* --- Total: se refleja el que ya calcula precio-cantidad-dinamico.js ---
	   Ese "Total" real lo crea otro script también en DOMContentLoaded, así
	   que puede no existir todavía en este punto. Se espera a que aparezca
	   en vez de comprobarlo una sola vez. */
	function engancharTotal( totalReal ) {
		var observerTotal = new MutationObserver( function () {
			totalValor.textContent = totalReal.textContent;
		} );
		observerTotal.observe( totalReal, { childList: true, characterData: true, subtree: true } );
		totalValor.textContent = totalReal.textContent;
	}

	var totalReal = document.querySelector( '.precio-total-valor' );
	if ( totalReal ) {
		engancharTotal( totalReal );
	} else {
		var esperaTotal = new MutationObserver( function () {
			var encontrado = document.querySelector( '.precio-total-valor' );
			if ( encontrado ) {
				esperaTotal.disconnect();
				engancharTotal( encontrado );
			}
		} );
		esperaTotal.observe( form, { childList: true, subtree: true } );
	}

	/* --- Añadir al carrito: acciona el botón real ---
	   Inactivo hasta elegir color (ver CSS pointer-events); esta comprobación
	   es un segundo cierre por si acaso. */
	botonAnadir.addEventListener( 'click', function () {
		if ( ! barra.classList.contains( 'barra-con-color' ) ) {
			return;
		}
		var real = document.querySelector( '.single_add_to_cart_button' );
		if ( real ) {
			real.click();
		}
	} );
} );
