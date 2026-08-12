# Barra fija inferior en móvil — ficha de producto

**Plantilla:** `producto-mcp-claude` (id 521, Bricks Builder)
**Ámbito:** solo móvil (`_display:mobile_portrait`). En desktop no existe/no se ve.

---

## 1. Problema que resuelve

En móvil, la imagen principal del producto está arriba del todo y el selector de color más abajo, en su propia tarjeta. Al elegir un color:

- La foto cambia arriba, fuera de la vista del usuario, que no ve el cambio sin hacer scroll manual.
- Al seguir bajando por la ficha (acordeones, etc.), se pierde de vista qué color se había elegido.

La barra fija resuelve ambas cosas: mantiene visible el color elegido en todo momento, y al elegir uno nuevo hace scroll automático hasta la galería para confirmar el cambio.

---

## 2. Comportamiento

### 2.1. Sin color elegido (estado inicial)
- Solo se ve el botón **"Añadir al carrito"**, a todo el ancho.
- El botón está **inactivo** (opacidad reducida, no se puede pulsar) hasta que se elige un color.
- No se muestran cantidad ni total.

### 2.2. Con color elegido
- Aparece una fila con: círculo del color + nombre + flecha (píldora), y el selector de cantidad (−/+), uno junto al otro.
- Debajo, el botón se **encoge** y comparte fila con el **Total**.
- El botón ya está activo.

### 2.3. Píldora de color (desplegable)
- Al pulsar la píldora, se despliegan los 7 círculos de color reales del producto **en la misma línea**, aprovechando todo el ancho (`justify-content: space-between`).
- Junto a los círculos aparece **"Busca tu color"** (icono de ayuda + texto), que abre el mismo quiz de color que ya existe en la ficha.
- La flecha de la píldora gira 180° al abrir/cerrar (`.barra-desplegada`).
- Al elegir un color desde ahí:
  1. Se selecciona la variación real (clic sobre el swatch real correspondiente).
  2. Se cierra el desplegable.
  3. Se hace scroll suave hasta la galería (`#brxe-f69a40`) para ver el cambio.
- Junto al nombre del color elegido aparece **"Quitar"**, que resetea la selección (clic sobre el enlace real `.reset_variations`) y vuelve al estado 2.1.

### 2.4. Al añadir al carrito
En vez de recargar la página o abrir un modal aparte, el propio bloque de color/cantidad/total/botón **cambia de contenido en el mismo sitio** (nunca hacen falta las dos cosas a la vez):

- Se añade al carrito por AJAX (sin recargar).
- Se oculta el contenido normal y aparece una confirmación: icono ✓ + "Añadido al carrito" en la misma línea, y debajo un círculo con el color elegido + "Nombre color · Producto · N ud. · Total".
- Dos botones: **"Seguir comprando"** (vuelve al estado inicial: sin color elegido, cantidad 1 — como si se hubiera pulsado "Quitar") y **"Ir al carrito"** (navega a la página real del carrito).

Mismo comportamiento en la tarjeta de escritorio ("Selector Color y Carrito"), documentado también en `02-pagina-producto-desktop-funcionamiento.md`.

---

## 3. Cómo está construido

### 3.1. Estructura visual (Bricks, nativo)
Bloque **"Barra Fija Móvil"** (`_position: fixed`, `_bottom: 0`, oculto en desktop, visible en `mobile_portrait`), con tres filas:

1. **Fila Color y Cantidad** — píldora de color + selector de cantidad (este último solo visible con color elegido).
2. **Fila Colores Desplegable** — vacía en Bricks; los 7 círculos y "Busca tu color" los genera JS.
3. **Fila Total y Botón** — total (solo visible con color elegido) + botón "Añadir al carrito".

Todo con clases CSS fijas (`barra-pildora-color`, `barra-circulo-color`, `barra-nombre-color`, `barra-limpiar`, `barra-qty-menos/valor/mas`, `barra-total-valor`, `barra-anadir-carrito`, `barra-fila-colores`, `barra-ayuda-color`, `barra-necesita-color`) para que el JS los enganche sin depender de IDs autogenerados por Bricks (que cambian si se reconstruye el módulo).

### 3.2. Sincronización (JS/CSS del tema hijo)
Es un **espejo** de los controles reales de la ficha — no duplica lógica de WooCommerce, solo la refleja y actúa sobre los controles reales:

| Elemento de la barra | Se sincroniza con |
|---|---|
| Círculo + nombre de color | `.vi-wpvs-option-wrap-selected` / `.vi-wpvs-label-selected-title` (plugin de swatches) |
| Círculos del desplegable | Se generan clonando cada `.vi-wpvs-option-wrap` real (color y `data-attribute_value`) |
| Cantidad | `input.qty` del formulario real; los botones −/+ accionan `.quantity .action.minus/.plus` reales |
| Total | Observa `.precio-total-valor` (el mismo Total que ya existe en desktop, calculado por `precio-cantidad-dinamico.js`) |
| Botón Añadir al carrito | Aciona `.single_add_to_cart_button` real |
| Quitar | Aciona `.reset_variations` real |
| Busca tu color | Misma clase `.quiz-color-trigger` que el disparador de escritorio — abre el mismo overlay de quiz |

Archivo principal: `wp-content/themes/bricks-child/js/barra-sticky-movil.js`
Confirmación al añadir al carrito: `wp-content/themes/bricks-child/js/confirmacion-carrito.js` (compartido con la tarjeta de escritorio)
Estilos: bloque final de `wp-content/themes/bricks-child/css/selector-color-carrito.css`
Encolado condicional (`is_product()`) en `functions.php`.

### 3.3. Texto "Quitar" en vez de "Limpiar"
El enlace de reset de WooCommerce dice "Limpiar" por defecto (cadena traducida del núcleo). Se sustituye por "Quitar" mediante un filtro `gettext` en `functions.php` — sin tocar el DOM ni plantillas, aplica tanto en desktop como en la barra móvil.

---

## 4. Problemas encontrados durante el desarrollo (para no repetirlos)

- **Bloques con `width: 100%` por defecto**: varios elementos "block" de Bricks se estiraban a todo el ancho de su fila flex aunque el padre fuera `display:flex; flex-direction:row`, rompiendo el layout lado a lado. Solución: `_width: "auto"` explícito en cada uno (píldora, cantidad, total, "Busca tu color").
- **`display:none` con más especificidad que las clases**: al ocultar/mostrar elementos según estado (`barra-necesita-color`, `barra-ayuda-color`) mediante clases CSS, el `display:none` que Bricks aplica directamente al elemento (regla por ID) gana a los selectores de clase salvo que se use `!important`.
- **Un elemento no anidado no hereda la visibilidad del padre**: "Busca tu color" vivía fuera de "Fila Colores Desplegable" hasta el primer clic (JS lo mueve ahí dinámicamente). Antes de ese primer clic, su propio `_display` mandaba y se veía siempre. Solución: por defecto oculto (`_display: none`), y JS lo muestra explícitamente (estilo en línea) solo al moverlo dentro de la fila.
- **Un solo disparador de quiz**: al añadir un segundo elemento con la clase `.quiz-color-trigger` (el de la barra móvil), `document.querySelector` en `quiz-color.js` solo enganchaba el primero. Se cambió a `querySelectorAll` + `forEach`.
- **Total no sincronizaba al cargar**: la barra móvil se inicializa en `DOMContentLoaded`, igual que el script que crea el "Total" real — a veces ese elemento aún no existía. Se añadió un `MutationObserver` que espera a que aparezca en vez de comprobarlo una sola vez.
- **`dataset.attributeValue` con guion bajo**: `data-attribute_value` en el HTML no se lee como `dataset.attributeValue` (el guion bajo no se convierte a camelCase, solo los guiones normales). Irrelevante para la función final, pero se dejó documentado por si se reutiliza en otro sitio.
- **Un círculo vacío con `_width: "auto"` colapsa a 0px**: el arreglo de "bloques al 100%" (punto anterior) aplicado sin pensar a un círculo de color (un `div` vacío, sin texto) lo encoge a 0 en vez de mantener su tamaño, porque "auto" en un elemento sin contenido no tiene de qué medir. Los círculos necesitan un ancho/alto fijo en px (no "auto") más `flex-shrink: 0`; el "auto" es solo para elementos con texto/icono.
- **`align-items: center` en una fila con una columna de varias líneas**: al poner un icono junto a un bloque de texto que puede ocupar 1 o 2 líneas (título + resumen apilados), centrar verticalmente el icono respecto a *todo* el bloque hace que parezca pegado a la segunda línea cuando el resumen es largo y envuelve. Se soluciona con `align-items: flex-start` para que el icono se alinee arriba, junto al título.
- **El endpoint AJAX de "añadir al carrito" de esta instalación de WooCommerce identifica la variación por `product_id`** (comprueba si ese ID es del tipo `variation`), no por un campo `variation_id` aparte — a pesar de que el formulario sí envía ambos campos. Si no se sobreescribe `product_id` con el valor real de `variation_id` antes de enviar, WooCommerce intenta añadir el producto variable "a secas" y lo rechaza (`{error:true}`). Diagnosticado ejecutando `wp eval` directamente en el servidor con el PHP correcto (`/opt/php-8.3/bin/php`, no el `wp` por defecto que corría en PHP 7.0 y no cargaba WooCommerce).
- **Un plugin (WPVS) ya engancha el mismo botón "Añadir al carrito"** y hace su propio añadido AJAX. Interceptar el clic solo con `preventDefault()` no es suficiente — el evento seguía llegando a ese otro manejador (delegado en un ancestro) y añadía el producto por duplicado. Hace falta también `stopPropagation()` (o `stopImmediatePropagation()`) para que no llegue a ningún otro listener.
- **Un elemento de texto sin ningún valor en "text" no se renderiza en absoluto** (ni siquiera como etiqueta vacía) — hace falta darle un texto de partida (aunque sea un guion "—") para que Bricks pinte el elemento y el JS pueda rellenarlo después.

---

*Documento actualizado a partir del estado real de la plantilla el 12 de agosto de 2026 (incluye la confirmación al añadir al carrito).*
