/**
 * Actualiza el módulo "Precio Producto" (elemento nativo product-price,
 * #brxe-npu5rs) para mostrar precio unitario × cantidad seleccionada en
 * el selector de cantidad de "Selector Color y Carrito". No existe ningún
 * control nativo de Bricks/WooCommerce para esto, así que se resuelve con
 * el propio evento jQuery "found_variation" de WooCommerce (que entrega
 * variation.display_price, el precio numérico real de la variación
 * seleccionada) combinado con el valor del input de cantidad.
 *
 * La variación por defecto ya viene seleccionada al cargar la página, así
 * que "found_variation" no llega a dispararse hasta que el usuario cambia
 * de color manualmente. Por eso se lee también el precio ya renderizado
 * en el DOM como valor de partida, para que cambiar solo la cantidad
 * funcione desde el primer momento.
 *
 * Al pulsar "Limpiar" (reset_data), se restaura tal cual el HTML original
 * del precio (guardado al cargar la página) y la cantidad vuelve a 1 —
 * no basta con releer el DOM en ese momento, porque ya puede contener un
 * total con cantidad > 1 en vez del precio base real.
 */
jQuery( function ( $ ) {
	var $form = $( 'form.variations_form' );
	var $priceWrap = $( '#brxe-npu5rs' );
	var $qty = $( 'form.cart input.qty' );

	if ( ! $form.length || ! $priceWrap.length || ! $qty.length ) {
		return;
	}

	var originalPriceHtml = $priceWrap.find( '.price' ).first().prop( 'outerHTML' );

	function parsePriceFromDom() {
		var text = $priceWrap.find( '.price' ).first().text();
		var match = text.replace( /\./g, '' ).match( /([\d,]+)/ );
		if ( ! match ) {
			return null;
		}
		return parseFloat( match[ 1 ].replace( ',', '.' ) );
	}

	var unitPrice = parsePriceFromDom();

	function formatPrice( value ) {
		var formatted = value.toLocaleString( 'es-ES', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		} );
		return '<span class="woocommerce-Price-amount amount"><bdi>' + formatted + '&nbsp;<span class="woocommerce-Price-currencySymbol">€</span></bdi></span>';
	}

	function updateDisplayedPrice() {
		if ( unitPrice === null ) {
			return;
		}
		var qty = parseInt( $qty.val(), 10 ) || 1;
		var total = unitPrice * qty;
		$priceWrap.find( '.price' ).html( formatPrice( total ) );
	}

	$form.on( 'found_variation', function ( event, variation ) {
		unitPrice = parseFloat( variation.display_price );
		updateDisplayedPrice();
	} );

	$form.on( 'reset_data', function () {
		$priceWrap.find( '.price' ).replaceWith( originalPriceHtml );
		unitPrice = parsePriceFromDom();
		$qty.val( 1 );
	} );

	$qty.on( 'change input', updateDisplayedPrice );
} );
