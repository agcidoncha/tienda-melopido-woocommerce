<?php
/**
 * Pay for order form — override del tema hijo.
 *
 * [2026-09-17] Esta es la plantilla real que WooCommerce usa cuando alguien
 * tiene que pagar un pedido pendiente (ej. quedó sin pagar, o se generó a
 * mano). Vive DENTRO del shortcode [woocommerce_checkout] de la página
 * "Finalizar compra" (id 16) — no existe como plantilla Bricks aparte, así
 * que no se puede diseñar desde el builder. La versión original del plugin
 * no llevaba ningún envoltorio ni título, solo la tabla y el formulario de
 * pago sueltos, sin el aspecto de tarjeta que tiene el resto de la tienda.
 *
 * Cambios respecto al original:
 * - Se añade un título "Completa el pago de tu pedido" (no existía).
 * - Se envuelve la tabla y el bloque de pago en <div class="melopido-recibo-pedido">
 *   para poder darle el mismo aspecto de tarjeta (fondo, borde, sombra) que
 *   ya tienen el carrito y el checkout — ver css/recibo-pedido.css.
 * - La fila "Método de pago" del resumen (normalmente dentro de la tabla,
 *   con colspan) se saca de la tabla y se imprime aparte, debajo, como
 *   texto normal (ver "$metodo_pago" más abajo). Su valor ("Tarjeta de
 *   Crédito / Débito") es mucho más largo que un precio y no cabía en una
 *   columna de tabla pensada para totales cortos sin partirse en varias
 *   líneas con hueco vacío al lado — y, al ser la única celda con colspan
 *   de la tabla, no hay forma fiable en CSS de hacer que ocupe todo el
 *   ancho sin romper la alineación de columnas del resto de filas (probado
 *   en vivo: display:block en la celda/fila no hereda el ancho completo
 *   de la tabla por las reglas de cajas anónimas del modelo de tabla CSS).
 * - Ningún hook, acción ni campo del formulario de pago se ha tocado: la
 *   lógica de pago (Stripe, nonce, etc.) es exactamente la del original.
 *
 * @package WooCommerce\Templates
 * @version 10.9.0 (basado en esta versión del template original)
 */

defined( 'ABSPATH' ) || exit;

$totals       = $order->get_order_item_totals(); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
$metodo_pago  = null;

if ( isset( $totals['payment_method'] ) ) {
	$metodo_pago = $totals['payment_method'];
	unset( $totals['payment_method'] );
}
?>
<div class="melopido-recibo-pedido">

	<h1 class="melopido-recibo-pedido__titulo"><?php esc_html_e( 'Completa el pago de tu pedido', 'melopido' ); ?></h1>

	<form id="order_review" method="post">

		<table class="shop_table">
			<thead>
				<tr>
					<th class="product-name"><?php esc_html_e( 'Product', 'woocommerce' ); ?></th>
					<th class="product-quantity"><?php esc_html_e( 'Qty', 'woocommerce' ); ?></th>
					<th class="product-total"><?php esc_html_e( 'Totals', 'woocommerce' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php if ( count( $order->get_items() ) > 0 ) : ?>
					<?php foreach ( $order->get_items() as $item_id => $item ) : ?>
						<?php
						if ( ! apply_filters( 'woocommerce_order_item_visible', true, $item ) ) {
							continue;
						}
						?>
						<tr class="<?php echo esc_attr( apply_filters( 'woocommerce_order_item_class', 'order_item', $item, $order ) ); ?>">
							<td class="product-name">
								<?php
									echo wp_kses_post( apply_filters( 'woocommerce_order_item_name', $item->get_name(), $item, false ) );

									do_action( 'woocommerce_order_item_meta_start', $item_id, $item, $order, false );

									wc_display_item_meta( $item );

									do_action( 'woocommerce_order_item_meta_end', $item_id, $item, $order, false );
								?>
							</td>
							<td class="product-quantity"><?php echo apply_filters( 'woocommerce_order_item_quantity_html', ' <strong class="product-quantity">' . sprintf( '&times;&nbsp;%s', esc_html( $item->get_quantity() ) ) . '</strong>', $item ); ?></td><?php // @codingStandardsIgnoreLine ?>
							<td class="product-subtotal"><?php echo $order->get_formatted_line_subtotal( $item ); ?></td><?php // @codingStandardsIgnoreLine ?>
						</tr>
					<?php endforeach; ?>
				<?php endif; ?>
			</tbody>
			<tfoot>
				<?php if ( $totals ) : ?>
					<?php foreach ( $totals as $total ) : ?>
						<tr>
							<th scope="row" colspan="2"><?php echo $total['label']; ?></th><?php // @codingStandardsIgnoreLine ?>
							<td class="product-total"><?php echo $total['value']; ?></td><?php // @codingStandardsIgnoreLine ?>
						</tr>
					<?php endforeach; ?>
				<?php endif; ?>
			</tfoot>
		</table>

		<?php if ( $metodo_pago ) : ?>
			<p class="metodo-pago"><?php echo $metodo_pago['label']; ?> <strong><?php echo $metodo_pago['value']; ?></strong></p><?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php endif; ?>

		<?php
		/**
		 * Triggered from within the checkout/form-pay.php template, immediately before the payment section.
		 *
		 * @since 8.2.0
		 */
		do_action( 'woocommerce_pay_order_before_payment' );
		?>

		<div id="payment">
			<?php if ( $order->needs_payment() ) : ?>
				<ul class="wc_payment_methods payment_methods methods" aria-label="<?php esc_attr_e( 'Payment methods', 'woocommerce' ); ?>">
					<?php
					if ( ! empty( $available_gateways ) ) {
						foreach ( $available_gateways as $gateway ) {
							wc_get_template( 'checkout/payment-method.php', array( 'gateway' => $gateway ) );
						}
					} else {
						echo '<li>';
						wc_print_notice( apply_filters( 'woocommerce_no_available_payment_methods_message', esc_html__( 'Sorry, it seems that there are no available payment methods for your location. Please contact us if you require assistance or wish to make alternate arrangements.', 'woocommerce' ) ), 'notice' ); // phpcs:ignore WooCommerce.Commenting.CommentHooks.MissingHookComment
						echo '</li>';
					}
					?>
				</ul>
			<?php endif; ?>
			<div class="form-row">
				<input type="hidden" name="woocommerce_pay" value="1" />

				<?php wc_get_template( 'checkout/terms.php' ); ?>

				<?php do_action( 'woocommerce_pay_order_before_submit' ); ?>

				<?php echo apply_filters( 'woocommerce_pay_order_button_html', '<button type="submit" class="button alt' . esc_attr( wc_wp_theme_get_element_class_name( 'button' ) ? ' ' . wc_wp_theme_get_element_class_name( 'button' ) : '' ) . '" id="place_order" value="' . esc_attr( $order_button_text ) . '" data-value="' . esc_attr( $order_button_text ) . '">' . esc_html( $order_button_text ) . '</button>' ); // @codingStandardsIgnoreLine ?>

				<?php do_action( 'woocommerce_pay_order_after_submit' ); ?>

				<?php wp_nonce_field( 'woocommerce-pay', 'woocommerce-pay-nonce' ); ?>
			</div>
		</div>
	</form>

</div>
