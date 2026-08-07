# Catálogo de elementos Bricks (seda.melopido.shop)

Lista completa de los **123 tipos de elemento** registrados en este sitio, obtenida vía `bricks/list-element-types` (conector `seda-melopido-shop`). Consultar este archivo **antes** de improvisar una solución (popup aparte, CSS a medida, etc.) — puede que ya exista un componente nativo de Bricks para lo que se necesita.

Regla de oro: antes de construir algo "raro" (offcanvas, toggle, tabs, acordeón, etc.), comprobar aquí primero, y si hace falta más detalle pedir el esquema completo con `bricks/get-element-schema` (ability vía `mcp-adapter-execute-ability`) pasando el `elementName`.

Última actualización: 2026-08-06.

## Estructura / layout

- `container`
- `section`
- `block`
- `div`
- `slot`

## Contenido básico

- `heading`
- `text-basic`
- `text` (texto enriquecido, admite HTML)
- `text-link`
- `button`
- `icon`
- `image`
- `video`

## Navegación e interacción

- `nav-nested`
- `dropdown`
- **`offcanvas`** — panel lateral nativo, anidable (contiene su propio contenido). Se abre con un elemento `toggle` que apunta a su selector CSS. **No requiere una plantilla popup aparte.**
- **`toggle`** — botón/icono que alterna una clase (por defecto `brx-open`) en el elemento indicado en `toggleSelector`. Se usa para abrir/cerrar `offcanvas`, menús móviles, etc.
- `toggle-mode` (probablemente modo claro/oscuro)
- `divider`

## Bloques de contenido

- `icon-box`
- `social-icons`
- `list`
- `accordion`
- `accordion-nested` — usado en la plantilla de producto actual (producto-mcp-claude)
- `tabs`
- `tabs-nested`

## Formularios / mapas

- `form`
- `map`
- `map-leaflet`
- `map-connector`

## Marketing / dinámicos

- `alert`
- `animated-typing`
- `countdown`
- `counter`
- `pricing-tables`
- `progress-bar`
- `pie-chart`
- `team-members`
- `testimonials`

## Código / plantillas

- `html`
- `code`
- `template` (inserta otra plantilla Bricks)

## Branding / social

- `logo`
- `facebook-page`
- `breadcrumbs`
- `rating`
- `back-to-top`

## Media / galería

- `image-gallery`
- `audio`
- `carousel`
- `slider`
- `slider-nested`
- `svg`
- `instagram-feed`

## Consultas / paginación

- `pagination`
- `query-results-summary`

## WordPress genérico

- `wordpress`
- `posts`
- `nav-menu`
- `sidebar`
- `search`
- `shortcode`

## Datos dinámicos de entrada (post)

- `post-title`
- `post-excerpt`
- `post-meta`
- `post-content`
- `post-sharing`
- `related-posts`
- `post-author`
- `post-comments`
- `post-taxonomy`
- `post-navigation`
- `post-reading-time`
- `post-reading-progress-bar`
- `post-toc`

## Producto individual (WooCommerce)

- `product-title`
- `product-gallery`
- `product-short-description`
- `product-price`
- `product-stock`
- `product-meta`
- `product-rating`
- `product-content`
- `product-add-to-cart`
- `product-related`
- `product-reviews`
- `product-additional-information`
- `product-tabs`
- `product-upsells`
- `woocommerce-breadcrumbs`
- `woocommerce-mini-cart`

## Carrito / checkout (WooCommerce)

- `woocommerce-cart-collaterals`
- `woocommerce-cart-coupon`
- `woocommerce-cart-items`
- `woocommerce-checkout-order-review`
- `woocommerce-checkout-thankyou`
- `woocommerce-checkout-order-table`
- `woocommerce-checkout-order-payment`
- `woocommerce-checkout-customer-details`

## Archivo/tienda (WooCommerce)

- `woocommerce-products`
- `woocommerce-products-pagination`
- `woocommerce-products-orderby`
- `woocommerce-products-total-results`
- `woocommerce-products-filter`
- `woocommerce-products-archive-description`

## Mi cuenta (WooCommerce)

- `woocommerce-account-page`
- `woocommerce-account-form-login`
- `woocommerce-account-form-register`
- `woocommerce-account-form-lost-password`
- `woocommerce-account-form-reset-password`
- `woocommerce-account-orders`
- `woocommerce-account-downloads`
- `woocommerce-account-addresses`
- `woocommerce-account-view-order`
- `woocommerce-account-form-edit-address`
- `woocommerce-account-form-edit-account`
- `woocommerce-account-payment-methods`
- `woocommerce-account-add-payment-method`

## Legacy / varios

- `brxc-darkmode-toggle` (Darkmode Toggle Legacy)
- `brxc-darkmode-btn` (Darkmode Button Legacy)
- `brxc-darkmode-toggle-nestable`
- `brxc-darkmode-btn-nestable`
- `custom-title`

---

## Nota: `woocommerce-notice` NO existe en este catálogo

Al insertar wireframes remotos (p. ej. "Product 01", "Product 02") el sistema avisó: *"Removed unavailable remote element type 'woocommerce-notice'"* — confirma que esta lista es la fuente de verdad real del sitio, no la de la librería de plantillas remota. Si un wireframe trae un elemento que no está en esta lista, Bricks lo descarta silenciosamente al importar (revisar los `warnings` de `bricks/insert-remote-template`).

## Lección aprendida (2026-08-06)

Se intentó construir un off-canvas de "Instrucciones de uso" creando una **plantilla popup aparte** (`bricks/create-template` tipo `popup`) con una interacción de clic apuntando a ella. Esto funcionaba técnicamente, pero era innecesario: existe el par nativo **`offcanvas` + `toggle`**, que vive dentro de la misma plantilla sin necesitar un post/plantilla adicional. Se revirtió el popup y el disparador. Antes de recurrir a una plantilla/popup separada para cualquier patrón de UI, comprobar primero si hay un elemento nativo que ya lo resuelva.
