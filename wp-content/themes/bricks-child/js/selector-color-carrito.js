/**
 * El plugin de swatches de variaciones inserta el nombre del color
 * seleccionado dentro del <th> estrecho de la tabla, junto a la etiqueta
 * "Color". Eso obliga a los 7 círculos a repartirse en dos filas para
 * dejarle sitio. Lo reubicamos junto a "Limpiar" (misma celda que los
 * swatches), en una fila propia, para que ambos queden alineados en la
 * misma línea y con todo el ancho de la tarjeta disponible.
 */
document.addEventListener( 'DOMContentLoaded', function () {
	var form = document.querySelector( 'form.cart' );
	if ( ! form ) {
		return;
	}

	var td = form.querySelector( '.variations td.value' );
	if ( ! td ) {
		return;
	}

	var row = document.createElement( 'div' );
	row.className = 'selector-color-nombre-row';
	td.appendChild( row );

	function relocate() {
		var span = form.querySelector( '.vi-wpvs-label-selected-title' );
		var resetLink = td.querySelector( '.reset_variations' );

		var misplaced =
			( span && span.parentElement !== row ) ||
			( resetLink && resetLink.parentElement !== row ) ||
			( span && resetLink && span.nextElementSibling !== resetLink );

		// Solo reordena cuando hace falta: mover un nodo que ya está en su
		// sitio dispara igualmente un evento del MutationObserver, así que
		// sin esta guarda entraríamos en un bucle infinito de reordenados.
		if ( ! misplaced ) {
			return;
		}

		if ( span ) {
			row.appendChild( span );
		}
		if ( resetLink ) {
			row.appendChild( resetLink );
		}
	}

	relocate();

	var observer = new MutationObserver( relocate );
	observer.observe( form, { childList: true, subtree: true } );
} );
