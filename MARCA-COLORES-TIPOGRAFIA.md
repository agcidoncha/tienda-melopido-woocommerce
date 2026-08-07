# Marca: colores y tipografía (seda.melopido.shop)

Referencia de la identidad visual, extraída del CSS real de la web pública **melopido.shop** (la tienda ya publicada, fuente de verdad del diseño) y aplicada como estándar en **seda.melopido.shop** (Bricks).

Última actualización: 2026-08-07.

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

Paleta de marca, confirmada por el usuario el 2026-08-07. Pendiente de crear como paleta de colores nativa en Bricks (`bricks/create-color-palette`) para sustituir/complementar la paleta actual "Bricks Wireframes" (solo grises neutros, heredada de la librería de wireframes).

### Fondos

| Nombre | Hex | Uso |
|---|---|---|
| Crema principal | `#F8F3EE` | Fondo general del sitio (Page Settings → Fondo del sitio, puesto en la plantilla header id 206 para que aplique a toda la web) |
| Beige secundario | `#F4EFE8` | Fondos de tarjetas/secciones alternas |
| Blanco | `#FFFFFF` | Fondos de bloques, tarjetas destacadas |

### Texto

| Nombre | Hex | Uso |
|---|---|---|
| Texto principal | `#66605C` | Cuerpo de texto |
| Texto secundario | `#7A736D` | Texto atenuado, descripciones cortas |
| Negro casi puro | `#1F1F1F` | Títulos con máximo contraste si hace falta |
| Blanco cálido | `#FFFAF7` | Texto sobre fotos/fondos oscuros (hero) |

### Marca / acentos

| Nombre | Hex | Uso |
|---|---|---|
| Rosa empolvado (principal) | `#C17D7A` | Botones CTA principales |
| Terracota (variante/hover) | `#AC6764` | Estado hover o variante del rosa |
| Naranja Amazon | `#F39200` | Botón "Comprar en Amazon" — diferenciado del CTA propio |

## Cómo cambiar esto desde el propio editor de Bricks

- **Fondo del sitio**: plantilla "header" → Configuración de página (icono engranaje arriba del panel derecho) → pestaña General → "Fondo del sitio".
- **Tipografía global**: Bricks → Ajustes → Theme Styles → "Melopido-style" → pestaña Tipografía.
- **Colores**: Bricks → Ajustes → Paletas de color (una vez creada la paleta de marca).

## Regla de trabajo

No se usa CSS personalizado (`_cssCustom`) para ninguno de estos valores — todo pasa por controles nativos de Bricks (Theme Style, Page Settings, Paleta de colores, ajustes de cada elemento), para que quede editable y visible dentro del propio builder.
