---
name: melopido-store
description: "Gestiona y construye la tienda WooCommerce seda.melopido.shop mediante lenguaje natural, cubriendo absolutamente todo lo que el conector woocommerce permite (crear y editar productos, precios, stock, variaciones, atributos, categorías, marcas, envíos con zonas/métodos/clases, impuestos, cupones, pedidos, clientes, reseñas) y contenido ACF (descripciones, acordeones, textos de producto) vía el conector wordpress. Úsala tanto para consultas rutinarias como para tareas de configuración/creación inicial de la tienda (dar de alta productos nuevos, crear zonas de envío, definir atributos o categorías desde cero). Usa esta skill siempre que el usuario pida crear, editar o consultar cualquier dato de la tienda Melopido, incluso si no menciona 'WooCommerce' o el nombre exacto de la herramienta, por ejemplo 'sube el precio de la funda de 90x45', 'crea una zona de envío para Canarias', 'dame de alta este producto nuevo', 'qué pedidos hay pendientes', 'cambia el texto del acordeón 2 del producto 170'."
---

# Gestión y construcción de la tienda seda.melopido.shop

Tienda WordPress + WooCommerce + Bricks Builder gestionada a través de dos conectores MCP. El detalle completo del stack está en `CLAUDE.md` en la raíz del proyecto — léelo si necesitas contexto adicional (versiones, plugins, convenciones). Esta skill cubre tanto el uso rutinario (consultas, ajustes puntuales) como la configuración inicial de la tienda (dar de alta productos, estructura de envíos/impuestos/atributos desde cero) — no asumas que solo sirve para tareas pequeñas.

## Los dos conectores, y cuándo usar cada uno

- **`woocommerce`** (`mcp__woocommerce__*`, ~101 herramientas): todo lo que es *funcionamiento y datos de la tienda*, con CRUD completo (crear/leer/editar/eliminar) en cada área:
  - **Productos**: productos simples y variables, variaciones, atributos globales y sus términos, categorías, marcas, etiquetas, reseñas.
  - **Pedidos**: pedidos, notas de pedido, reembolsos.
  - **Clientes**: alta, edición, listados con gasto total.
  - **Cupones**: por porcentaje, importe fijo en carrito o en producto.
  - **Envíos**: zonas de envío, métodos por zona, clases de envío.
  - **Impuestos**: clases de impuesto, tipos de impuesto.
  - **Otros**: pasarelas de pago, ajustes generales (`settings`), informes (ventas, top sellers, totales), medios (media library, incluida limpieza de huérfanos), webhooks, estado y herramientas del sistema.
  - Si necesitas un dato o acción y no la ves aquí, búscala igualmente con `ToolSearch` sobre `mcp__woocommerce__*` antes de asumir que no existe — la lista de arriba es un resumen, no exhaustiva.
- **`wordpress`** (`mcp__wordpress__*`): contenido general de WordPress y **campos ACF**. Es el único camino para leer/escribir los campos ACF de producto — `woocommerce` puede leerlos como `meta_data` pero **no puede escribirlos** (el parámetro se acepta sin error, pero el valor nunca se persiste; ya se verificó esto con una prueba de round-trip).

## Dar de alta un producto nuevo desde cero

Cuando el usuario pida crear un producto nuevo (no solo editar uno existente), sigue este orden porque cada pieza depende de la anterior:

1. Categoría (`list_categories`/`create_category`) y marca si aplica (`list_brands`/`create_brand`) — reutiliza las existentes en vez de duplicar, comprueba antes de crear.
2. Atributo (`list_attributes`/`create_attribute`) y sus términos (`list_attribute_terms`/`create_attribute_term`) si el producto necesita variantes (p. ej. Color) — reutiliza el atributo `Color` ya existente en esta tienda salvo que el usuario pida uno distinto.
3. `create_product` con `type: "variable"` si tiene variantes, o `"simple"` si no. Sin variaciones creadas, un producto variable no tiene precio/stock reales (ver más abajo).
4. Variaciones con `create_variation` o `batch_update_variations`, una por cada combinación de atributo, con su propio precio y stock.
5. Contenido ACF (descripción, acordeones) vía `wordpress` → `update_content` si el usuario tiene ese contenido listo; si no, puedes dejarlo para después.

No des por completado un alta de producto hasta confirmar con `get_product`/`list_variations` que precio y stock realmente aparecen — no te quedes solo con la respuesta del `create_*`.

No asumas que ambos conectores están ya cargados en la sesión actual: si una herramienta `mcp__woocommerce__*` o `mcp__wordpress__*` no aparece, o parece de solo lectura, comprueba primero si la sesión es antigua (abierta antes de un cambio en `.mcp.json`) antes de asumir un problema de la API.

## Trabajar con campos ACF (vía `wordpress`)

Los campos ACF de un producto viven bajo la clave **`acf`** en la respuesta de `get_content`/`update_content` con `content_type: "product"` — **no** bajo `meta_data` ni `meta`. Ejemplo de campos habituales en productos de esta tienda: `short_intro`, `acc_detalles`, `titulo_acordeon_2/3/4`, `acordeon2/3/4`, `titulo_offcanvas_1`, `oc-1`, `gallery_vertical_rep`.

Para escribir un campo ACF con `mcp__wordpress__update_content`, pásalo dentro de `custom_fields` (o `meta`, según cuál acepte el valor — si uno falla silenciosamente, comprueba con una lectura posterior y prueba el otro). Verifica siempre el resultado releyendo el producto, ya que WordPress puede ignorar en silencio una clave de meta no registrada con `show_in_rest`.

Si un campo ACF nuevo no aparece o no se puede escribir, la causa más probable es que su grupo de campos no tiene activado "Mostrar en la API REST" (ACF PRO → Custom Fields → grupo → pestaña Ajustes). El grupo `Producto – Contenido estructurado`, que cubre los campos listados arriba, ya lo tiene activado.

## Productos variables y variaciones (vía `woocommerce`)

Todos los productos de esta tienda son variantes de "Funda de Seda" de tipo `variable`. Un producto variable **sin variaciones creadas** ignora en silencio cualquier `regular_price`/`stock_status` que le pongas en el propio padre — WooCommerce solo lee precio/stock de sus variaciones. Antes de tocar precio o stock de un producto:

1. Comprueba con `get_product` si `type` es `variable` y si ya tiene variaciones (`list_variations`).
2. Si no las tiene, créalas con `create_variation` o `batch_update_variations` (atributo Color, opciones: Azul Navy, Azul Pavo Real, Granate, Gris Azulado, Marfil, Negro, Topo — a menos que el usuario indique otro atributo).
3. `batch_update_variations` devuelve `{}` (objeto vacío) incluso cuando la operación tiene éxito — nunca trates una respuesta vacía como fallo; confirma siempre con `list_products` o `list_variations` después.

## El catálogo cambia con frecuencia — no lo hardcodees

No asumas que la lista de productos, precios o IDs de un snapshot anterior (incluido el de `CLAUDE.md`) sigue siendo cierta. Antes de cualquier operación sobre "el producto X", confirma con `list_products` o `get_product`.

## Regla crítica: confirmación antes de escribir

Esta es una tienda en producción real. **Cualquier operación de escritura** — cambiar precio, stock, crear/editar variaciones, tocar un pedido, crear un cupón, modificar contenido o campos ACF, etc. — requiere que expongas al usuario exactamente qué vas a cambiar (producto/pedido, campo, valor anterior → nuevo valor) y esperes confirmación explícita antes de ejecutarla. Las operaciones de solo lectura (listar, consultar) no la necesitan.

## Fuente de verdad para precios reales

Si el usuario pide "poner el precio correcto" sin dar una cifra, el sitio de marketing público `melopido.shop` (distinto del admin `seda.melopido.shop`) tiene páginas por talla (p.ej. `funda-almohada-seda-90x45.html`) que sirven de referencia de precio real — más fiable que lo que haya en WooCommerce si sospechas que hay un precio placeholder.
