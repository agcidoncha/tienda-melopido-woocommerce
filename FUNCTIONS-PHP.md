# functions.php — índice de personalizaciones

Referencia rápida de todo lo que hay en `wp-content/themes/bricks-child/functions.php`, qué hace y por qué existe. La explicación completa y detallada de cada bloque vive **dentro del propio archivo**, como comentario justo encima del código — este documento es solo el mapa para encontrar rápido qué hay y no tener que leerse las 650+ líneas cada vez.

Convención: cada bloque nuevo añadido a partir de septiembre de 2026 lleva un comentario con fecha `[YYYY-MM-DD]` explicando el problema real, por qué la solución nativa no bastaba y qué hace el código. Sigue esa misma convención al añadir algo nuevo.

Para los overrides de plantillas de WooCommerce (plantillas completas sobrescritas, no hooks de `functions.php`), ver [`WOOCOMMERCE-OVERRIDES.md`](WOOCOMMERCE-OVERRIDES.md) — documento aparte, mismo criterio.

## Por qué esto no se pierde al actualizar

`functions.php` vive en el **tema hijo** (`bricks-child`), nunca en el tema padre (Bricks). Son carpetas completamente separadas en el servidor:

```
wp-content/
└── themes/
    ├── bricks/                ← esto lo pisaría una actualización de Bricks (el tema padre)
    └── bricks-child/          ← ESTO es donde está todo lo nuestro, nadie lo actualiza automáticamente
        └── functions.php
```

Una actualización del tema padre no toca `bricks-child/` — es una carpeta aparte por diseño, así que nada de aquí se pierde.

## Rendimiento

| Qué | Línea | Resumen |
|---|---|---|
| Quita el script de Stripe Express Checkout de la ficha de producto | [`functions.php:14`](wp-content/themes/bricks-child/functions.php#L14) | El botón de pago rápido (Apple/Google Pay, Amazon Pay, Link) nunca se ve en la ficha de producto por la plantilla personalizada, pero el plugin cargaba igualmente ~250KB de JS "por si acaso". Se usa el filtro nativo del plugin para desactivarlo solo ahí; sigue intacto en carrito y checkout. |
| Foto principal de la galería sin carga diferida | [`functions.php:67`](wp-content/themes/bricks-child/functions.php#L67) | WooCommerce marca `loading=lazy` en TODAS las imágenes de la galería, incluida la principal — justo la candidata a LCP. Se fuerza `eager` + `fetchpriority=high` solo en la imagen principal; las miniaturas siguen en diferido. |
| Precarga de tipografías de marca | [`functions.php:88`](wp-content/themes/bricks-child/functions.php#L88) | Causa real del CLS intermitente en toda la web: el texto se pinta con la fuente de reserva y salta al llegar la tipografía real. Precarga Montserrat (Regular/Medium/SemiBold) y PlayfairDisplay Medium en todas las páginas. |
| Precarga del vídeo del hero | [`functions.php:411`](wp-content/themes/bricks-child/functions.php#L411) | El vídeo del hero de la home se cargaba en diferido (Bricks), retrasando el LCP a 5s. Precarga el mismo vídeo que `{random_hero_video}` va a renderizar (misma función, misma caché de petición). Solo en portada. |
| Carga asíncrona de 5 hojas de estilo | [`functions.php:451`](wp-content/themes/bricks-child/functions.php#L451) | CSS de iconos de Bricks, Advanced Themer y WooCommerce Variations Swatches — verificado que no afectan a nada visible por encima del pliegue en ninguna página. Se difiere su carga (patrón `media=print` + `onload`) para no bloquear el primer pintado. Lista blanca explícita de handles, no toca nada del núcleo de Bricks/WooCommerce. |
| CSS del tema hijo combinado en `sitewide.css` | [`functions.php:192`](wp-content/themes/bricks-child/functions.php#L192) | 4 archivos CSS sueltos (minicart, minicart-subtotal-vacío, espaciado de texto, altura del hero) combinados en uno para quitar 3 peticiones bloqueantes. El porqué de cada regla individual sigue documentado dentro de `css/sitewide.css`. |
| Red de seguridad para la carga diferida de Bricks | [`functions.php:210`](wp-content/themes/bricks-child/functions.php#L210) (`js/lazy-load-fallback.js`) | Mitigación para el observador de lazy-load de Bricks bajo condiciones lentas (ver comentario dentro del propio JS). En todas las páginas. |

## SEO / GEO (motores de IA)

| Qué | Línea | Resumen |
|---|---|---|
| Datos estructurados FAQPage | [`functions.php:114`](wp-content/themes/bricks-child/functions.php#L114) | A partir del acordeón "Preguntas frecuentes" (campo ACF `acordeon4`) que ya existe por producto — no inventa contenido, solo lo expone en `schema.org/FAQPage` para que ChatGPT/Gemini/Claude lo lean y citen directamente. Solo en fichas de producto. |
| Migas de pan sin el último tramo | [`functions.php:168`](wp-content/themes/bricks-child/functions.php#L168) | Quita el tramo de la página actual (redundante con el H1, y sin control nativo en Bricks para ocultar solo ese tramo). |

*(El resto de trabajo de SEO/GEO de esta sesión —descripciones de producto reales, `llms.txt`, Organization/logo de Yoast— vive en la base de datos o en archivos sueltos, no en `functions.php`; no hace falta buscarlo aquí.)*

## UX / contenido

| Qué | Línea | Resumen |
|---|---|---|
| Quita el botón "Ver carrito" cuando ya estás en el carrito | [`functions.php:33`](wp-content/themes/bricks-child/functions.php#L33) | El aviso de WooCommerce al añadir un producto se genera y guarda en sesión ANTES de que el navegador redirija al carrito, así que no basta con filtrar el mensaje al crearlo (`is_cart()` da falso en ese momento). Se corrige justo antes de imprimirse, en `template_redirect`, editando el aviso ya guardado en sesión. |
| "Subtotal" → "Importe" en la línea de cada producto (carrito/checkout) | [`functions.php:189`](wp-content/themes/bricks-child/functions.php#L189) | El "Subtotal" por línea (precio × cantidad) es información real, pero el nombre confunde sin IVA activado ("Subtotal" implica que después se suma algo más). Solo en carrito/checkout; en Mi cuenta, el admin o los emails de pedido sigue diciendo "Subtotal" normal. |
| Quita la fila "Subtotal" de "Detalles del pedido" (Gracias / Mi cuenta → Ver pedido) | [`functions.php:207`](wp-content/themes/bricks-child/functions.php#L207) | Mismo motivo que en carrito/checkout (sin IVA, subtotal = total), pero aquí hay hook nativo (`woocommerce_get_order_item_totals`) y no hace falta sobrescribir ninguna plantilla. |
| Texto "Quitar" en vez de "Limpiar" | [`functions.php:181`](wp-content/themes/bricks-child/functions.php#L181) | Traducción nativa de WooCommerce ("Clear") sustituida por un texto que describe mejor la acción de deshacer la variación seleccionada. |
| Botones de pago rápido (Apple/Google Pay, Amazon Pay, Link) junto a "Opciones de pago" | [`functions.php:225`](wp-content/themes/bricks-child/functions.php#L225) | Salían sueltos arriba del todo del checkout, antes del formulario de facturación (donde los engancha el plugin de Stripe por defecto). Se reenganchan al mismo hook que ya usa WooCommerce para imprimir el resumen del pedido y "Opciones de pago" (`woocommerce_checkout_order_review`), entre ambos, sin tocar el código del plugin. |
| Scripts y estilos específicos de producto | [`functions.php:192`](wp-content/themes/bricks-child/functions.php#L192) (dentro del mismo `wp_enqueue_scripts`) | Selector de color, quiz de color, toggle de galería/vídeo, precio dinámico según cantidad, selección de color obligatoria, barra fija móvil, confirmación de carrito — todos condicionados a `is_product()`. El porqué de cada uno vive en su propio archivo `.css`/`.js` dentro de `css/` y `js/`. |
| Avisos de WooCommerce como tarjeta flotante ("toast") | [`functions.php:236`](wp-content/themes/bricks-child/functions.php#L236) (`js/avisos-toast.js` + CSS en `sitewide.css`) | Los avisos de éxito/información ("Carrito actualizado", producto añadido, cambios en Mi cuenta...) se muestran como tarjeta flotante que aparece y desaparece sola, en vez de banner fijo arriba de la página. Los errores se quedan igual, anclados. En todas las páginas — esos avisos pueden salir en cualquier sitio. |
| Actualización automática del carrito al cambiar cantidad | [`functions.php:319`](wp-content/themes/bricks-child/functions.php#L319) (`js/actualizar-carrito-automatico.js`) | Al cambiar la cantidad ya no hace falta pulsar "Actualizar carrito": tras una pausa breve (debounce) se simula un clic real sobre ese mismo botón, reutilizando el AJAX/bloqueo nativo de WooCommerce tal cual. Solo en la página del carrito. |
| Estilo del recibo/pago de pedido pendiente | `functions.php` (dentro del mismo `wp_enqueue_scripts`, condicionado a `is_wc_endpoint_url('order-pay')`) | `css/recibo-pedido.css`, para el override `checkout/form-pay.php` (ver [`WOOCOMMERCE-OVERRIDES.md`](WOOCOMMERCE-OVERRIDES.md)). Solo en la página de pagar un pedido pendiente. |

## Bricks — dynamic tags y datos del hero

| Qué | Línea | Resumen |
|---|---|---|
| `{measure}` / `{measure_link}` | [`functions.php:304`](wp-content/themes/bricks-child/functions.php#L304), lógica en `melopido_get_measure_from_title()` / `melopido_render_measure_link()` | Extrae la medida del título del producto (sin el prefijo "Funda de Seda") para la fila "Otras medidas" — las 6 tallas siempre en 2×3, la actual como texto sin enlace. |
| `{random_hero_video}` / `{random_hero_video_poster}` | [`functions.php:304`](wp-content/themes/bricks-child/functions.php#L304), lógica en `melopido_get_random_hero_media()` | Elige al azar, en cada carga, un vídeo de `/video/hero-*.mp4` (+ su póster a juego). Añadir un vídeo nuevo es solo subir el `.mp4` + `.jpg` con el mismo nombre — no hace falta tocar código. Resuelto en PHP (no JS) para que el HTML llegue ya con la URL correcta. |

*(Los overrides de plantilla de WooCommerce —archivos completos sobrescritos, no hooks de este archivo— están en [`WOOCOMMERCE-OVERRIDES.md`](WOOCOMMERCE-OVERRIDES.md), no aquí.)*

## Boilerplate de Bricks (sin usar / sin tocar)

Líneas 512–656: scaffold que trae Bricks por defecto al crear el tema hijo (registro de elemento custom `title.php`, lista de elementos para el builder —el filtro que la aplica está comentado, así que no tiene efecto—, mensajes de guardado personalizados, ejemplos comentados de fuentes/mapas). No se ha tocado ni se usa activamente; se deja documentado aquí para no confundirlo con una personalización real la próxima vez que se revise el archivo.

---

**Al añadir algo nuevo a `functions.php`**: escribe el comentario explicativo ahí mismo (fecha + problema + por qué no bastaba lo nativo), y añade una fila a la tabla que corresponda en este documento.

**Al crear un override de plantilla de WooCommerce nuevo**: eso va en [`WOOCOMMERCE-OVERRIDES.md`](WOOCOMMERCE-OVERRIDES.md), no aquí.
