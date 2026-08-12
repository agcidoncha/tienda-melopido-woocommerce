# Página de producto — cómo funciona (versión desktop)

**Plantilla:** `producto-mcp-claude` (id 521, Bricks Builder)
**Ámbito de este documento:** solo la versión de escritorio. La adaptación móvil no se ha trabajado todavía.
**Producto de referencia:** Funda de Seda 150×45 cm (mismo comportamiento en las 6 medidas)

---

## 1. Estructura general

Dos columnas dentro de una rejilla (`Contenedor seleccion produ`):

- **Columna izquierda — Galería** (`Columna Galería`)
- **Columna derecha — Información y compra** (`Columna Información Producto`, con posición *sticky*: se queda fija al hacer scroll)

La columna derecha está dividida en **dos tarjetas blancas independientes**, apiladas:

1. **Tarjeta 1 — "Bloque Título y Precio"**: migas de pan, título, descripción, medida, precio, acordeón de detalles.
2. **Tarjeta 2 — "Bloque Color y Carrito"**: ayuda para elegir color, selector de color y carrito de compra.

---

## 2. Columna izquierda — Galería

### 2.1. Selector Galería / Vídeo
Dos botones rectangulares con icono (imagen / cámara de vídeo), sin texto. Alternan entre:
- **Galería de imágenes** del producto (elemento nativo WooCommerce).
- **Vídeo** "Cómo comprobar la seda" (prueba visual seda vs. satén).

El botón activo se pinta en terracota; el inactivo en blanco roto.

### 2.2. Acordeón de información complementaria
Debajo de la galería, un acordeón adicional con:
- **Preguntas frecuentes** (campo ACF `acf_titulo_acordeon_4` / `acf_acordeon4`)

*(Nota: los otros dos ítems que vivían aquí — "¿Qué significa 22 momme?" y "¿Por qué elegir seda de morera?" — se movieron a la Tarjeta 1, ver §3.5.)*

---

## 3. Tarjeta 1 — Título y precio

### 3.1. Migas de pan
Inicio / Fundas de Seda / [nombre del producto] — elemento nativo WooCommerce.

### 3.2. Título con imagen
Icono/ilustración pequeña (40px, sin rotar) a la izquierda del `<h1>` del producto (`{post_title}`).

### 3.3. Descripción corta
Texto libre por producto (contenido nativo de WooCommerce, editable por producto).

### 3.4. Medida actual + otras medidas
Va **antes que el precio** en el orden visual actual.
- **"Medida actual: X"** — el texto de la medida se calcula automáticamente quitando el prefijo "Funda de Seda" del título, vía un **dynamic tag propio `{measure}`** (registrado en `functions.php`). No depende de mantener un campo aparte.
- **Botones de otras medidas**: fila de botones rectangulares (75×50, 90×45, 110×45, 120×45, 135×45 cm) que enlazan a las fichas de las demás medidas. Usa un query loop nativo de Bricks sobre la categoría "Fundas de Seda" con `exclude_current_post: true` — **la medida que se está viendo nunca aparece como botón**, en cualquier ficha, de forma automática.

### 3.5. Precio
- Precio unitario fijo (`119,90 € / unidad`) — el precio real de WooCommerce + un texto "/ unidad" añadido junto a él.
- **No cambia** al variar la cantidad (ver el "Total" en la Tarjeta 2, §4.3).

### 3.6. Acordeón "Detalles del producto"
Tres ítems, todos con el mismo estilo (icono de información + texto en negrita terracota, sin viñeta de flecha):
1. **Detalles del producto** — contenido ACF `acf_acc_detalles`.
2. **¿Qué significa 22 momme?** — título y contenido ACF (`acf_titulo_acordeon_2` / `acf_acordeon2`).
3. **¿Por qué elegir seda de morera?** — título y contenido ACF (`acf_titulo_acordeon_3` / `acf_acordeon3`).

---

## 4. Tarjeta 2 — Color y carrito

### 4.1. Ayuda para elegir color (quiz)
- Enlace "¿No sabes qué color elegir? Te ayudamos" (icono de ayuda + texto en negrita terracota, sin subrayado).
- Al pulsarlo se abre un **overlay a pantalla completa** con un quiz de 4 preguntas (gustos de decoración, estilo, etc.).
- Al final, recomienda un color y, si el usuario lo confirma, **selecciona automáticamente esa variación** en el selector de color de más abajo y hace scroll hasta el botón de compra.
- Toda la lógica (preguntas, puntuación, resultado) vive en `quiz-color.js`; el disparador se identifica por una clase CSS fija (`.quiz-color-trigger`), no por el ID autogenerado de Bricks, para que no se rompa si se reconstruye el módulo.

### 4.2. Selector de color
- 7 círculos de color (plugin de swatches de variaciones WooCommerce).
- Etiqueta **"Color (N disponibles)"** — el número se calcula contando los círculos reales, no está fijado a mano.
- Al elegir un color, su nombre aparece en negrita junto a un enlace **"Quitar"** para deseleccionar (antes decía "Limpiar" — cambiado vía filtro `gettext`, ver §5).
- El primer color no viene preseleccionado: **hay que elegir un color explícitamente** para poder comprar (bloqueo de compra sin color, `seleccion-obligatoria-color.js`).

### 4.3. Cantidad y total
- Selector de cantidad (−, campo numérico, +).
- **"Total"**, junto a la cantidad: se recalcula en tiempo real al cambiar la cantidad o el color (cada color es una variación con su propio precio). El precio de arriba (Tarjeta 1) se queda fijo como precio por unidad — no se sobrescribe.

### 4.4. Compra y confirmación
- Botón **"Añadir al carrito"**.
- Métodos de pago rápido (Google Pay, y los que WooCommerce tenga configurados).
- **Al pulsar "Añadir al carrito"**: se añade por AJAX (sin recargar) y la propia tarjeta cambia de contenido en el mismo sitio — se oculta el selector normal y aparece una confirmación: icono ✓ + "Añadido al carrito", círculo del color + "Nombre color · Producto · N ud. · Total", y dos botones:
  - **"Seguir comprando"** — vuelve al estado inicial (sin color elegido, cantidad 1), como si se hubiera pulsado "Quitar".
  - **"Ir al carrito"** — navega a la página real del carrito.
- Mismo comportamiento en la barra fija de móvil (ver `03-barra-sticky-movil-producto.md`).

---

## 5. Dónde vive cada cosa (para futuras ediciones)

| Qué | Dónde |
|---|---|
| Estructura, textos, estilos, iconos, layout | Nativo en Bricks, plantilla `producto-mcp-claude` (id 521) |
| Dynamic tag `{measure}` | `wp-content/themes/bricks-child/functions.php` |
| Texto "Quitar" en vez de "Limpiar" | Filtro `gettext` en `functions.php` |
| "Total" junto a cantidad | `js/precio-cantidad-dinamico.js` |
| Reubicación nombre de color, recuento "(N disponibles)", quitar "×" de Limpiar | `js/selector-color-carrito.js` + `css/selector-color-carrito.css` |
| Quiz de color (preguntas, lógica, selección de variación) | `js/quiz-color.js` (soporta varios disparadores: ficha + barra móvil) |
| Bloqueo de compra sin color elegido | `js/seleccion-obligatoria-color.js` |
| Toggle Galería / Vídeo | `js/galeria-video-toggle.js` |
| Añadir al carrito por AJAX + confirmación en el mismo sitio | `js/confirmacion-carrito.js` (desktop y barra móvil) |
| Barra fija inferior en móvil | Ver `03-barra-sticky-movil-producto.md` |

Estos archivos JS/CSS solo existen porque dependen de markup generado por **plugins externos** (WooCommerce, el plugin de swatches WPVS) que Bricks no puede editar con sus controles nativos. Todo lo demás de la página está hecho con elementos y ajustes nativos de Bricks, sin CSS ni HTML sueltos.

---

## 6. Pendiente / no cubierto en este documento

- Reseñas de clientes (previsto en el estudio inicial, no implementado aún).
- Juegos de cama / confección bajo pedido (existía un aviso, se retiró al reorganizar el bloque de medidas). **Pendiente, pero se hará** — falta decidir dónde y cómo se recupera.
- Información de stock/envío/devolución cerca del botón de compra (mencionado en el estudio inicial, no implementado en esta plantilla).

La versión móvil **ya está trabajada** para la parte de compra (barra fija inferior) — ver `03-barra-sticky-movil-producto.md`. El resto de la ficha en móvil (galería, acordeones, etc.) sigue el layout responsive por defecto, sin ajustes específicos documentados aparte.

---

*Documento actualizado a partir del estado real de la plantilla el 12 de agosto de 2026.*
