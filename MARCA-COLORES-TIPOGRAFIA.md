# Marca: colores y tipografía (seda.melopido.shop)

Referencia de la identidad visual, extraída del CSS real de la web pública **melopido.shop** (la tienda ya publicada, fuente de verdad del diseño) y aplicada como estándar en **seda.melopido.shop** (Bricks).

Última actualización: 2026-09-23.

## Tipografía

3 fuentes personalizadas subidas en Bricks (`bricks_fonts`, `Ajustes > Personalizador > Fuentes`):

| Nombre | Post ID | Slug | Uso |
|---|---|---|---|
| PlayfairDisplay | 180 | playfairdisplay-medium | Cabeceras (h1-h6) |
| Montserrat | 185 | montserrat-medium | Cuerpo de texto |
| Fontspring | 182 | fontspring | Sin uso confirmado todavía |

Aplicado globalmente vía **Theme Style → Typography** (`melopido_style`, condición `any`), no por elemento:
- `typographyBody.font-family` → `custom_font_185` (Montserrat)
- `typographyHeadingH1` a `H6` → `custom_font_180` (Playfair Display)

El identificador interno que usa Bricks en los ajustes de tipografía es `custom_font_{ID del post de la fuente}` (ej. `custom_font_180`), no el nombre de la fuente directamente.

## Colores

Paleta de marca nativa de Bricks: **"Melopido"** (id `4f1861`), creada vía `bricks/create-color-palette` / `bricks/create-color`. Todos los elementos del sitio referencian estos colores por variable (`var(--nombre)`), nunca por hex suelto — auditado y verificado el 2026-08-13 (`bricks/audit-design-system`, cero errores de color hardcodeado).

### Fondos

| Nombre | Variable | Hex | Uso |
|---|---|---|---|
| Crema principal | `--crema-principal` | `#F8F3EE` | Sin uso actual confirmado — la doc decía que era el fondo del sitio pero al comprobarlo en vivo (2026-09-21) el ajuste real era `--blanco`, no este |
| Beige secundario | `--beige-secundario` | `#F4EFE8` | Fondos de tarjetas/secciones alternas |
| Blanco | `--blanco` | `#FFFFFF` | Fondos de bloques, tarjetas destacadas |
| Blanco hueso | `--blanco-hueso` | `#FDFCFA` | Fondo de variaciones de producto, botón inactivo del quiz de color |
| Beige borde | `--beige-borde` | `#D8D2CB` | Bordes de campos (ej. selector de cantidad) |
| Beige borde apagado | `--beige-borde-apagado` | `#DDD8D2` | Borde del item "medida actual" deshabilitado en la fila "Otras medidas" (producto) |
| Blanco background | `--blanco-background` | `#F5F5F7` | **Fondo del sitio actual** (Page Settings → Fondo del sitio, plantilla header id 206) — creado y aplicado el 2026-09-21, sustituyendo a `--blanco` |

### Texto

| Nombre | Variable | Hex | Uso |
|---|---|---|---|
| Texto principal | `--texto-principal` | `#66605C` | Cuerpo de texto |
| Texto secundario | `--texto-secundario` | `#7A736D` | Texto atenuado, descripciones cortas |
| Texto apagado | `--texto-apagado` | `#9C9690` | Texto del item "medida actual" deshabilitado en la fila "Otras medidas" (producto) |
| Gris medio | `--gris-medio` | `#616161` | Etiquetas de formulario (Mi cuenta → editar dirección) |
| Negro casi puro | `--negro-casi-puro` | `#1F1F1F` | Títulos con máximo contraste si hace falta |
| Blanco cálido | `--blanco-calido` | `#FFFAF7` | Texto sobre fotos/fondos oscuros (hero) |

### Marca / acentos

| Nombre | Variable | Hex | Uso |
|---|---|---|---|
| Rosa empolvado (principal) | `--rosa-empolvado` | `#C17D7A` | Botones CTA principales |
| Terracota (variante/hover) | `--terracota` | `#AC6764` | Estado hover o variante del rosa |
| Naranja Amazon | `--naranja-amazon` | `#F39200` | Botón "Comprar en Amazon" — diferenciado del CTA propio |

16 colores en total. Los 3 marcados arriba (blanco hueso, gris medio, beige borde) se añadieron el 2026-08-13 al detectar hex sueltos en clases globales existentes (`brxw-woo-add-to-cart`, `toggle-boton-activo/inactivo`, `brxw-woo-account-edit-address-01`) que no tenían variable asignada. Beige borde apagado y texto apagado se añadieron el 2026-09-17 en una auditoría de hex sueltos en los CSS del tema hijo (`quiz-color.css`, `selector-color-carrito.css`, `medida-selector.css`) — la mayoría coincidían exactamente con colores ya existentes y se sustituyeron por su `var()`, pero estos dos no coincidían con ningún color de la paleta. Blanco background se creó el 2026-09-21 y se aplicó ese mismo día como fondo del sitio, sustituyendo a `--blanco`.

Nota: la paleta real de Bricks tiene más colores que estos 16 (25+ en total) — el resto son tonalidades/transparencias generadas automáticamente (`-t-1`, `-t-2`...) y colores de las variaciones de producto (swatches de color por variante), que no forman parte de la identidad de marca documentada aquí. Una excepción puntual: `--negro-casi-puro-t-4` (transparencia manual al 4%, id `e101ab`) se creó el 2026-09-22 para sustituir un hex suelto (`#1F1F1F0A`) detectado en la "Píldora Color" de la barra fija móvil de producto — no encajaba en las tonalidades automáticas existentes (25%/50%/75%).

## Cómo cambiar esto desde el propio editor de Bricks

- **Fondo del sitio**: plantilla "header" → Configuración de página (icono engranaje arriba del panel derecho) → pestaña General → "Fondo del sitio".
- **Tipografía global**: Bricks → Ajustes → Theme Styles → "Melopido-style" → pestaña Tipografía.
- **Colores**: Bricks → Ajustes → Paletas de color → paleta "Melopido".

## Regla de trabajo

No se usa CSS personalizado (`_cssCustom`) para ninguno de estos valores — todo pasa por controles nativos de Bricks (Theme Style, Page Settings, Paleta de colores, ajustes de cada elemento), para que quede editable y visible dentro del propio builder.
