# Marca: colores y tipografía (seda.melopido.shop)

Referencia de la identidad visual, extraída del CSS real de la web pública **melopido.shop** (la tienda ya publicada, fuente de verdad del diseño) y aplicada como estándar en **seda.melopido.shop** (Bricks).

Última actualización: 2026-08-13.

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
| Crema principal | `--crema-principal` | `#F8F3EE` | Fondo general del sitio (Page Settings → Fondo del sitio, puesto en la plantilla header id 206 para que aplique a toda la web) |
| Beige secundario | `--beige-secundario` | `#F4EFE8` | Fondos de tarjetas/secciones alternas |
| Blanco | `--blanco` | `#FFFFFF` | Fondos de bloques, tarjetas destacadas |
| Blanco hueso | `--blanco-hueso` | `#FDFCFA` | Fondo de variaciones de producto, botón inactivo del quiz de color |
| Beige borde | `--beige-borde` | `#D8D2CB` | Bordes de campos (ej. selector de cantidad) |

### Texto

| Nombre | Variable | Hex | Uso |
|---|---|---|---|
| Texto principal | `--texto-principal` | `#66605C` | Cuerpo de texto |
| Texto secundario | `--texto-secundario` | `#7A736D` | Texto atenuado, descripciones cortas |
| Gris medio | `--gris-medio` | `#616161` | Etiquetas de formulario (Mi cuenta → editar dirección) |
| Negro casi puro | `--negro-casi-puro` | `#1F1F1F` | Títulos con máximo contraste si hace falta |
| Blanco cálido | `--blanco-calido` | `#FFFAF7` | Texto sobre fotos/fondos oscuros (hero) |

### Marca / acentos

| Nombre | Variable | Hex | Uso |
|---|---|---|---|
| Rosa empolvado (principal) | `--rosa-empolvado` | `#C17D7A` | Botones CTA principales |
| Terracota (variante/hover) | `--terracota` | `#AC6764` | Estado hover o variante del rosa |
| Naranja Amazon | `--naranja-amazon` | `#F39200` | Botón "Comprar en Amazon" — diferenciado del CTA propio |

13 colores en total. Los 3 marcados arriba (blanco hueso, gris medio, beige borde) se añadieron el 2026-08-13 al detectar hex sueltos en clases globales existentes (`brxw-woo-add-to-cart`, `toggle-boton-activo/inactivo`, `brxw-woo-account-edit-address-01`) que no tenían variable asignada.

## Cómo cambiar esto desde el propio editor de Bricks

- **Fondo del sitio**: plantilla "header" → Configuración de página (icono engranaje arriba del panel derecho) → pestaña General → "Fondo del sitio".
- **Tipografía global**: Bricks → Ajustes → Theme Styles → "Melopido-style" → pestaña Tipografía.
- **Colores**: Bricks → Ajustes → Paletas de color → paleta "Melopido".

## Regla de trabajo

No se usa CSS personalizado (`_cssCustom`) para ninguno de estos valores — todo pasa por controles nativos de Bricks (Theme Style, Page Settings, Paleta de colores, ajustes de cada elemento), para que quede editable y visible dentro del propio builder.
