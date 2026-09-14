# Overrides de plantillas de WooCommerce — índice

Referencia rápida de las plantillas de WooCommerce sobrescritas en el tema hijo (`wp-content/themes/bricks-child/woocommerce/`), qué cambia cada una respecto al original y por qué. La explicación completa vive **dentro de cada archivo**, como comentario en la cabecera — este documento es solo el mapa.

## Por qué esto no se pierde al actualizar

Estos archivos viven en el **tema hijo** (`bricks-child`), nunca en el plugin de WooCommerce ni en el tema padre (Bricks). Son carpetas completamente separadas en el servidor:

```
wp-content/
├── plugins/
│   └── woocommerce/          ← esto lo pisa la actualización de WooCommerce
│       └── templates/cart/cart-totals.php   (el original, sin tocar)
│
└── themes/
    ├── bricks/                ← esto lo pisaría una actualización de Bricks (el tema padre)
    └── bricks-child/          ← ESTO es donde está todo lo nuestro, nadie lo actualiza automáticamente
        └── woocommerce/
            ├── cart/cart-totals.php        (nuestra copia)
            ├── cart/mini-cart.php          (nuestra copia)
            └── checkout/review-order.php   (nuestra copia)
```

Cuando se actualiza el plugin de WooCommerce, solo se reemplaza la carpeta `plugins/woocommerce/` — la copia que tenemos dentro de `themes/bricks-child/woocommerce/` ni se toca. WordPress simplemente **lee primero de ahí antes que del plugin** (es el mecanismo oficial de WooCommerce para overrides de plantilla, documentado en la cabecera de cada archivo original de WooCommerce).

Lo único a vigilar: si WooCommerce cambia de verdad una de estas plantillas en una versión futura (añade una fila nueva, cambia un hook), nuestra copia se queda con la versión antigua hasta que la actualicemos a mano — por eso cada override lleva anotada la versión del original de la que viene, para poder comparar si hace falta.

## Cómo encontrar TODOS los overrides que existan

Esta tabla puede quedarse desactualizada; la carpeta no. WooCommerce solo busca overrides en `wp-content/themes/bricks-child/woocommerce/`, así que esa ruta es siempre la lista completa y real:

```bash
find "wp-content/themes/bricks-child/woocommerce" -type f
```

Cada archivo que salga ahí lleva su propio comentario arriba explicando qué cambia y de qué versión del plugin viene — esa es la fuente de verdad; esta tabla es solo el resumen para no tener que abrir cada uno.

## Overrides actuales

| Archivo | Plantilla original | Qué cambia |
|---|---|---|
| [`cart/cart-totals.php`](wp-content/themes/bricks-child/woocommerce/cart/cart-totals.php) | `woocommerce/templates/cart/cart-totals.php` (v2.3.6) | Quita la fila "Subtotal" del resumen (queda solo "Total" — sin impuestos activados en la tienda, los dos números son siempre idénticos). Cambia el título "Cart totals" por "Resumen del pedido". |
| [`checkout/review-order.php`](wp-content/themes/bricks-child/woocommerce/checkout/review-order.php) | `woocommerce/templates/checkout/review-order.php` (v11.0.0) | Mismo cambio que `cart-totals.php`: quita la fila "Subtotal" del resumen del pedido en el checkout. La columna "Subtotal" por artículo (precio × cantidad) de la tabla de productos se mantiene intacta, es información real distinta. |
| [`cart/mini-cart.php`](wp-content/themes/bricks-child/woocommerce/cart/mini-cart.php) | `woocommerce/templates/cart/mini-cart.php` (v11.0.0) | Envuelve el nombre del producto en su propio `<span class="mini-cart-item-name">` (antes iba como texto suelto pegado a la imagen) para poder controlar el interlineado cuando el nombre pasa a dos líneas. |

---

**Al crear un override nuevo**: comentario explicativo en la cabecera del propio archivo (qué cambia, por qué, de qué versión del original viene), y una fila nueva en la tabla de arriba.
