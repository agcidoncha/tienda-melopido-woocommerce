/**
 * Oculta el bloque de cantidad + añadir al carrito hasta que el usuario
 * elija un color de verdad. Por defecto, WooCommerce oculta ese bloque
 * (.single_variation_wrap) hasta encontrar una variación válida, pero el
 * plugin de swatches (WPVS) no dispara ese comportamiento en esta
 * plantilla y el bloque queda visible desde el primer momento sin
 * ninguna variación seleccionada. No hay ningún control nativo de
 * Bricks/WooCommerce para forzar esto, así que se resuelve enganchando
 * los mismos eventos jQuery "found_variation" / "reset_data" que ya usa
 * el cálculo de precio × cantidad (ver precio-cantidad-dinamico.js).
 */
jQuery( function ( $ ) {
	var $form = $( 'form.variations_form' );
	var $addToCart = $form.find( '.woocommerce-variation-add-to-cart' );

	if ( ! $form.length || ! $addToCart.length ) {
		return;
	}

	$addToCart.hide();

	$form.on( 'found_variation', function () {
		$addToCart.show();
	} );

	$form.on( 'reset_data', function () {
		$addToCart.hide();
	} );
} );
