# Maquetación fluida (clamp)

Última actualización: 2026-08-15

## Qué es

En vez de tamaños fijos por breakpoint, los textos/espaciados crecen de forma continua con el ancho de pantalla usando `clamp()` nativo de CSS, sin JS ni media queries adicionales. Se eligió esto en vez de más breakpoints porque en pantallas grandes (1920px, contenedor global fijado a esa anchura) un tamaño "fijo desde 1280px" se queda pequeño y desaprovecha el espacio, y con clamp el crecimiento es proporcional en todo el rango en vez de saltos bruscos.

**Fórmula usada en todos los casos** (interpolación lineal entre dos anchos de referencia):

```
clamp(V_min, calc(V_min + (V_max - V_min) * (100vw - 992px) / 928), V_max)
```

- `992px` = suelo (ancho de referencia mínimo, tablet horizontal).
- `1920px` = techo (ancho de referencia máximo, el ancho de contenedor global de la web).
- `928` = `1920 - 992`, el rango de crecimiento.
- Por debajo de 992px o por encima de 1920px el valor se queda fijo en `V_min`/`V_max` (eso es lo que hace `clamp`).

## Alcance actual: ficha de producto + header

Todavía no está aplicado a toda la web: solo a la plantilla de producto (`producto-mcp-claude`, id 521, la que usan las 6 fichas de "Funda de Seda") y a `header-general` (id 206). Se hizo así a propósito, como prueba local antes de decidir si se extiende al resto del sitio (footer, otras plantillas).

### Textos convertidos a clamp fluido

| Elemento | Rango (992px → 1920px) |
|---|---|
| Título del producto (h1) | 32px → 58px |
| Icono junto al título (logo pequeño) | 40px → 72px (ancho, escala a la misma proporción que el título) |
| Precio | 28px → 46px |
| "Medida actual: …" | 15px → 21px |
| Enlaces de "otras medidas" | 13px → 18px |
| Sufijo "/ unidad" | 14px → 19px |
| Títulos de los 3 acordeones (Detalles, 22 momme, Por qué elegir seda) | 14px → 19px |
| Textos de los 3 acordeones + descripción corta | 16px → 22px |
| Texto "¿No sabes qué color elegir? Te ayudamos" | 14px → 19px |

### Selector de color (plugin WPVS) y bloque cantidad/total/botón

Fuera de Bricks, en `bricks-child/css/selector-color-carrito.css` (el plugin de swatches WPVS no es controlable por Bricks nativo, mismo patrón de siempre para estos casos):

- Círculos de color: `36px → 50px`, con `border-radius: 50%` (no un px fijo, para que sea círculo perfecto en todo el rango) y `flex-shrink: 0` (si no, el contenedor los encoge por debajo del clamp en cuanto falta sitio).
- Etiqueta "Color:": `14px → 18px`.
- Fila cantidad + total (`.cantidad-total-row`): gap `10px → 16px`, input de cantidad `15px → 19px`, iconos `+`/`−` `24px → 30px` (son SVG con `width`/`height` como atributo HTML — el CSS los sobreescribe igualmente, sin `!important`, porque un atributo de presentación siempre pierde contra una regla CSS), "TOTAL" `12px → 15px`, valor del total `22px → 32px`.

**Botón "Añadir al carrito" en fila con cantidad/total — solo desde 1300px, no 992px.** A partir de cierto ancho sobra espacio con todo apilado, así que se probó a poner cantidad+total y el botón en una misma fila (50/50) desde el punto de referencia habitual (992px). Pero a 992px la tarjeta "Color y carrito" solo tiene ~417px útiles, y el mínimo real para que quepan los dos bloques sin romperse es ~571px (260px que necesita el botón para que el texto no toque el padding + 290px de cantidad+total + gap) — no cabe, y forzarlo hace que el botón se salga de la tarjeta. La fila horizontal solo tiene sitio real desde ~1300px de ancho de ventana. Por debajo de eso se queda apilado (botón a todo lo ancho), como estaba antes de este cambio.

```css
@media (min-width: 1300px) {
	.woocommerce-variation-add-to-cart { flex-direction: row; align-items: center; gap: 24px; }
	.cantidad-total-row { flex: 1 1 max(50%, 290px); flex-wrap: nowrap; }
	.single_add_to_cart_button { flex: 1 1 50%; min-width: 260px; width: auto; }
}
```

El reparto es 50/50 real (`flex-basis`, no solo espacio libre) pero con un mínimo garantizado por bloque: si el 50% exacto es menor que el mínimo de alguno, ese bloque se queda en su mínimo y es el otro el que cede el espacio de más.

### Espaciados convertidos a clamp fluido

En la rejilla de botones "otras medidas" (`Fila Otras Medidas`, 3 columnas × 2 filas):

- Padding vertical de cada botón: 8px → 16px (el horizontal se dejó fijo en 16px).
- Separación entre botones (`gap` del grid): 8px → 20px.
- De paso se quitó el border-radius de esos botones (a 0, esquinas rectas).

### Efecto secundario corregido: separación entre tarjetas

Al revisar el resultado, la tarjeta "Título y precio" y la tarjeta "Color y carrito" se veían separadas por un hueco muy grande. No era un efecto de lo fluido: era que ambas tarjetas son blancas sobre un fondo de página también blanco (cambiamos el fondo global de crema a blanco antes en esta misma sesión), así que no había ningún borde visual entre ellas y el espaciado normal (padding + margen ≈ 80px) se leía como un vacío. Se arregló añadiendo una sombra sutil nativa (`_boxShadow`, `0 2px 12px` con negro al ~6% de opacidad) a ambas tarjetas, para que se distingan del fondo sin tocar el espaciado.

## Header (`header-general`, id 206)

El **logo sí escala** (se reconsideró a mitad de sesión: con todo lo demás creciendo, un logo fijo se veía pequeño/descompensado a 1920px), pero con un rango algo más comedido que el texto (×1.25 en vez de ×1.3) para que no domine.

| Elemento | Rango (992px → 1920px) |
|---|---|
| Logo | 140×32px → 175×40px |
| Menú principal (enlaces) | 15px → 19px |
| "Iniciar sesión" / "Registrarse" / "Mi cuenta" (texto) | 15px → 19px |
| Separador vertical (altura) | 20px → 26px |
| Icono buscador | 25px → 32px |
| Icono "Mi cuenta" | 25px → 32px |
| Icono + subtotal del carrito | 20px → 26px |

**Gotcha con los iconos SVG en Bricks**: cada icono tiene DOS ajustes de tamaño independientes — el del contenedor/botón que lo envuelve, y el `icon.height` del propio SVG. Hacer fluido solo el primero no basta: el SVG interior se queda con su `height` fijo (CSS generado tipo `#brxe-x svg {height: 25px}`) y visualmente no crece nada aunque el wrapper sí. Hay que aplicar el `clamp()` a los dos ajustes.

## Pendiente / próximos pasos

- Decidir si se extiende el mismo tratamiento fluido al **footer** y al resto de plantillas.
- Si se decide llevar esto a nivel global (toda la web, no solo producto), la vía nativa sería `bricks/generate-scale-variables` para regenerar la escala `--brxw-text-*`/`--brxw-space-*` — de momento no se ha tocado esa escala global, todo lo de este documento son valores `clamp()` puestos a mano en elementos concretos de la ficha de producto.
