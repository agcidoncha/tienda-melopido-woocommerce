/**
 * Inserta un bloque "Total" junto al selector de cantidad (dentro de
 * "Selector Color y Carrito"), que se recalcula al cambiar la cantidad
 * o el color (cada color es una variación con su propio precio). El
 * precio de arriba (#brxe-iqnled, "Precio Producto") se queda fijo como
 * precio por unidad — no se toca — tal como se definió en el estudio de
 * la ficha de producto.
 *
 * No existe ningún control nativo de Bricks/WooCommerce para esto, así
 * que se resuelve con el propio evento jQuery "found_variation" de
 * WooCommerce (que entrega variation.display_price, el precio numérico
 * real de la variación seleccionada) combinado con el valor del input
 * de cantidad.
 */
jQuery( function ( $ ) {
	var $form = $( 'form.variations_form' );
	var $qty = $( 'form.cart input.qty' );
	var $quantityWrap = $( 'form.cart .quantity' );

	if ( ! $form.length || ! $qty.length || ! $quantityWrap.length ) {
		return;
	}

	function parseUnitPriceFromDom() {
		var text = $( '#brxe-iqnled .price' ).first().text();
		var match = text.replace( /\./g, '' ).match( /([\d,]+)/ );
		if ( ! match ) {
			return null;
		}
		return parseFloat( match[ 1 ].replace( ',', '.' ) );
	}

	var unitPrice = parseUnitPriceFromDom();

	var $row = $( '<div class="cantidad-total-row"></div>' );
	$quantityWrap.before( $row );
	$row.append( $quantityWrap );

	var $total = $( '<div class="precio-total-dinamico"><span class="precio-total-label">Total</span><span class="precio-total-valor"></span></div>' );
	$row.append( $total );
	var $totalValor = $total.find( '.precio-total-valor' );

	function formatPrice( value ) {
		return value.toLocaleString( 'es-ES', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		} ) + ' €';
	}

	function updateTotal() {
		if ( unitPrice === null ) {
			return;
		}
		var qty = parseInt( $qty.val(), 10 ) || 1;
		$totalValor.text( formatPrice( unitPrice * qty ) );
	}

	$form.on( 'found_variation', function ( event, variation ) {
		unitPrice = parseFloat( variation.display_price );
		updateTotal();
	} );

	$form.on( 'reset_data', function () {
		unitPrice = parseUnitPriceFromDom();
		$qty.val( 1 );
		updateTotal();
	} );

	$qty.on( 'change input', updateTotal );

	updateTotal();
} );
