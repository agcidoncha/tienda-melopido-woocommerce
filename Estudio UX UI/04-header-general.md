# Header general — cómo está construido

**Plantillas:** `header-general` (id 206, tipo `header`) + `topbar-promocional` (id 979, tipo `section` con hook) — ver §2 sobre por qué son dos plantillas separadas.
**Ámbito de este documento:** estructura, contenido y comportamiento del header tal como está hoy. La adaptación móvil está trabajada (no se rompe ni desborda), pero no rediseñada visualmente aparte del header 06 de referencia.

---

## 1. Estructura general

Dos plantillas independientes, cada una a ancho completo de página con el contenido centrado en el contenedor de 1280px del sitio (Theme Style "Melopido-style" → `container.width: 1280px`, no un ajuste local):

1. **`topbar-promocional`** (id 979) — barra superior estrecha, fondo rosa empolvado de marca. Vive **fuera** del header, enganchada al hook `bricks_before_header`.
2. **`header-general`** (id 206) — "Header 06": menú a la izquierda, logo centrado, acciones de usuario a la derecha. Con **Header sticky** nativo activado.

---

## 2. Topbar — por qué es una plantilla aparte

Al principio la topbar vivía como una sección más dentro de `header-general`, junto a la barra principal. Al pedir que solo la barra principal se quedara pegada arriba al hacer scroll (y la topbar se fuera con la página), apareció una limitación real de Bricks: el ajuste nativo **"Header sticky" pega TODO el contenido de la plantilla header como un bloque único** — no se puede fijar solo una de sus secciones. El wireframe original ocultaba esto pintando todo de blanco al hacer scroll (por eso la franja rosa "desaparecía").

**Solución 100% nativa** (sin JS ni CSS propios): sacar la topbar de la plantilla `header-general` y convertirla en su propia plantilla de tipo **Section**, con una condición de tipo hook:

```
main: "any", hookName: "bricks_before_header"
```

`bricks_before_header` es un hook nativo del tema Bricks (`header.php`) que se dispara justo antes de renderizar `<header id="brx-header">`. Así la topbar queda fuera del wrapper sticky, en el flujo normal de la página — se va con el scroll y vuelve a aparecer al subir arriba, sin ningún JS.

- **Sección** (`iktncc` en la plantilla 979): fondo `var(--rosa-empolvado)` (paleta nativa "Melopido", no un hex suelto).
- **Texto promocional**: "Suavidad natural para dormir mejor", color `var(--blanco-calido)`.

Texto y color son placeholders de contenido — cambiar aquí si la campaña/promo cambia, sin tocar estructura.

### 2.1. Header sticky — el matiz `fixed` vs. `sticky`

Con la topbar ya fuera, se activó el toggle nativo **"Header sticky"** en `header-general`. Por defecto ese ajuste usa `position: fixed` en el `<header>`, que no respeta el flujo del documento — al probarlo, el header (fijo, siempre en `top:0` del viewport) tapaba visualmente a la topbar (que sigue en flujo normal, también en `top:0` al inicio de la página), aunque ambas existían correctamente en el HTML.

La solución fue activar también **`headerStickyOnScroll: true`** (segundo ajuste nativo, independiente): con los dos activados, Bricks usa `position: sticky` en vez de `fixed`. Un elemento `sticky` sí respeta el flujo normal — se queda en su sitio (debajo de la topbar) hasta que el scroll lo alcanza, y entonces se pega arriba. Resultado exacto: topbar visible al inicio → desaparece con el scroll → barra principal se queda fija → topbar reaparece al volver arriba. Cero líneas de JS o CSS custom.

---

## 3. Header principal — layout de 3 columnas

El contenedor `Inner` (`c6f99c`) usa **flexbox**, no CSS Grid: `_display: flex`, y los dos hijos laterales llevan `_flexGrow: 1` + `_flexBasis: 0%` para que el logo del medio quede perfectamente centrado respecto al viewport, sea cual sea el ancho real del menú o de las acciones de la derecha.

> ⚠️ **Por qué no Grid:** un primer intento con `grid-template-columns: 1fr auto 1fr` producía un bug real de Bricks/navegador donde una columna `1fr` explotaba a un ancho fijo (1280px), descentrando el logo. Confirmado midiendo `getBoundingClientRect()`, no a ojo. Si se vuelve a tocar este layout, usar el patrón flex (`flexGrow`/`flexBasis: 0%`), no Grid con `1fr`.

### 3.1. Menú (izquierda) — `qpjpjl`, elemento nativo `nav-menu`
Tira del menú real de WordPress **"Main Menu"** (id 24), no hay enlaces de texto hardcodeados. Hoy solo tiene *Inicio* y *Tienda*; añadir más páginas ahí, no en la plantilla.

### 3.2. Logo (centro) — `3ee2cb`
Imagen SVG real de Melopido (no texto). `logoWidth: 140px`, `logoHeight: 32px` fijados explícitamente — el SVG original no traía `width`/`height` en la etiqueta raíz y quedaba a 0px de ancho sin este ajuste (si se sube un logo nuevo sin esos atributos, pasa lo mismo).

### 3.3. Acciones de usuario (derecha) — `0d9axp`
Fila con, de izquierda a derecha: Iniciar sesión / Registrarse (o "Mi cuenta"), separador vertical, buscador, carrito. Tipografía Playfair Display en los textos y en el menú (`menuTypography`/`mobileMenuTypography` en `qpjpjl`, `_typography` en cada text-link) — misma fuente de cabeceras de la marca.

1. **Login / Registro condicionado** — dos `text-link` independientes, mostrados según la **Condición de elemento nativa de Bricks** `user_logged_in`:
   - `yyn62c` "Iniciar sesión" + `7njjdf` "Registrarse", visibles si `user_logged_in == 0` — **cada uno abre su propio popup nativo** (ver §4), no una página compartida.
   - `rubhqt` — "Mi cuenta" + icono de usuario, visible si `user_logged_in == 1`, enlaza a la página real "Mi cuenta" (id 17).
   - Los tres se ocultan en `tablet_portrait` y por debajo (`_display:tablet_portrait: none`) para no desbordar en móvil — **pendiente decidir si se muestran en móvil, hoy no hay acceso a login/registro desde el header móvil.**
2. **Separador vertical** (`9j005m`) — elemento nativo `divider`, color `var(--beige-secundario)`.
3. **Buscador** (`t9skog`) — elemento nativo `search` en modo `searchType: overlay`: icono dentro de un círculo (`_border` radius 999, color `var(--rosa-empolvado)`) que abre una superposición a pantalla completa con un formulario de búsqueda real de WordPress (`?s=...`). No es un popup construido a mano.
4. **Carrito** (`v5t508`) — `woocommerce-mini-cart` nativo: icono (20px) + contador (círculo terracota a tamaño nativo) + subtotal en euros en Playfair 20px (`subtotalPosition: row`). Se actualiza al instante al añadir un producto vía los *fragments* AJAX nativos de WooCommerce, sin JS propio.

Iconos actuales: Font Awesome 6 Solid (placeholder, pendiente de SVG de marca — ver §6).

---

## 4. Popups de Iniciar sesión y Registro

Al principio "Iniciar sesión / Registrarse" era un único enlace a `/mi-cuenta/`, que muestra los dos formularios juntos sin importar en cuál de las dos palabras pulsabas — confuso, y en móvil uno queda apilado debajo del otro. Se sustituyó por **dos popups nativos de Bricks independientes**, cada uno con **solo** el formulario que corresponde:

- **`popup-iniciar-sesion`** (id 981) — elemento nativo `woocommerce-account-form-login`.
- **`popup-registrarse`** (id 983) — elemento nativo `woocommerce-account-form-register`.

Ambos con condición `main: "any"` (si no, Bricks no los inserta en la página — un popup necesita condición igual que cualquier plantilla, aunque solo se abra por interacción). Se abren desde los textos del header vía **Interacción nativa** `click → show → popup → templateId`, y cada uno tiene un enlace cruzado al pie ("¿No tienes cuenta? Regístrate" / "¿Ya tienes cuenta? Inicia sesión") que cierra el popup actual y abre el otro con dos interacciones en el mismo `click` (`hide` + `show`).

### 4.1. Registro: usuario + contraseña visibles, no solo email

WooCommerce tenía activadas *"Generar automáticamente el nombre de usuario"* y *"Generar automáticamente la contraseña"* (envío de enlace por email) — por eso el registro solo pedía el email. Se desactivaron ambas (`wp option update woocommerce_registration_generate_username/password no`) a petición del usuario, para evitar cuentas a medio crear si el email de contraseña se pierde o cae en spam. Ahora el formulario nativo pide usuario + email + contraseña directamente.

> WooCommerce no tiene de fábrica un campo de "repetir contraseña" — no es que se haya quitado, nunca ha existido en el formulario nativo. Añadirlo requeriría JS, pendiente de decidir si se hace.

### 4.2. Gotchas de estilo de popup nativo (para no repetir la búsqueda)

- **Ancho**: el ajuste de plantilla es `popupContentWidth` (afecta a `.brx-popup-content`, el wrapper *fuera* del contenido). Debe **coincidir exactamente** con el `max-width` del contenedor de dentro — si el wrapper es más ancho que el contenedor, éste queda pegado a la izquierda en vez de centrado (holgura asimétrica). Confirmado midiendo `getBoundingClientRect()` de ambos.
- **Padding doble**: `.brx-popup-content` trae **30px de padding nativo por defecto**, que se suma al padding del contenedor de dentro. Ajuste de plantilla `popupContentPadding: 0` para dejar un único padding (el del contenedor).
- **Fondo blanco asomando en las esquinas**: si el contenedor de dentro tiene esquinas redondeadas (`_border radius`) pero `.brx-popup-content` mantiene su fondo blanco por defecto, ese fondo asoma por detrás en las esquinas. Ajuste de plantilla `popupContentBackground: transparent`.
- **Margen negativo inesperado**: el elemento `container` como raíz de un popup hereda por defecto un margen pensado para compensar el padding de una sección padre (no existe en un popup) — se ve como `margin-right: -Npx` en el inspector y desborda la caja. Forzar `_margin: 0` explícito en el contenedor raíz.
- **Centrado**: los ajustes de plantilla `popupJustifyConent` (sic, typo del propio Bricks) y `popupAlignItems`, puestos a `center`, centran el popup en el viewport.
- **Cerrar (X)**: Bricks no genera un botón de cerrar visible por defecto (solo cierra con clic en el fondo o ESC, ajuste `popupCloseOn`). Hay que añadir un icono a mano con interacción `click → hide → popup → (su propio templateId)`. Si se posiciona con `_position: absolute`, el contenedor padre necesita `_position: relative` explícito o el icono se ancla a toda la ventana en vez de a la tarjeta.
- **Altura de campos**: el `line-height` de los inputs se hereda muy alto (~40px) aunque el padding esté bien ajustado — hay que fijar `line-height` explícito en `fieldsInputTypography` para que los campos no salgan desproporcionadamente altos.
- **Alineación del texto del botón**: puede diferir entre Safari y Chrome si no se fija `text-align: center` explícito en `submitButtonTypography`.

### 4.3. Estilo aplicado (paleta y tipografía de marca)

Tarjeta fondo `var(--crema-principal)`, borde `var(--beige-secundario)`, sombra suave, esquinas redondeadas (20px). Título en Playfair Display, divisor simple (línea `var(--beige-secundario)`, sin icono — se probó una estrella decorativa y se retiró por no encajar). Campos con borde `var(--beige-secundario)`, fondo blanco, radio 12px. Botón `var(--terracota)`, texto blanco, ancho completo.

### 4.4. Registro de cuenta

El formulario de registro en `/mi-cuenta/` no aparecía porque WooCommerce tenía desactivado *"Permitir a los clientes crear una cuenta en la página Mi cuenta"* (`enableMyAccountRegistration`). Se activó — es un ajuste real de WooCommerce (Ajustes → Cuentas y privacidad), no de la plantilla.

---

## 5. Dónde vive cada cosa (para futuras ediciones)

| Qué | Dónde |
|---|---|
| Estructura, textos, colores, iconos, condiciones (barra principal) | Nativo en Bricks, plantilla `header-general` (id 206) |
| Topbar promocional (texto/color de campaña) | Nativo en Bricks, plantilla `topbar-promocional` (id 979, tipo Section, hook `bricks_before_header`) |
| Que solo la barra principal quede fija al hacer scroll | Ajustes nativos de plantilla en `header-general`: `headerSticky: true` + `headerStickyOnScroll: true` (fuerza `position: sticky` en vez de `fixed`) |
| Enlaces del menú | Menú de WordPress "Main Menu" (id 24), no la plantilla |
| Mostrar login/registro vs. Mi cuenta | Condición nativa de elemento `user_logged_in` (Bricks) sobre `text-link`, popups (login/registro) o página "Mi cuenta" (id 17) según estado |
| Popups de login/registro (contenido y estilo) | Plantillas nativas `popup-iniciar-sesion` (981) y `popup-registrarse` (983) — ver §4 |
| Registro pide usuario+contraseña, no solo email | `wp_options`: `woocommerce_registration_generate_username` / `_password` = `no` |
| Registro habilitado en Mi cuenta | WooCommerce → Ajustes → Cuentas y privacidad (`enableMyAccountRegistration`) |
| Buscador funcional | Elemento nativo `search` de Bricks, `searchType: overlay` |
| Colores de marca | Paleta nativa de color "Melopido" (rosa empolvado, terracota, crema, beige, blanco) — nunca hex sueltos |
| Tipografía de marca en menú/textos/popups | Playfair Display (`custom_font_180`) vía controles nativos de tipografía de cada elemento |
| Ancho del contenido (1280px) | Theme Style "Melopido-style" → General → Container width, no un ajuste local de la plantilla |

No hay JS ni CSS propios en este header — a diferencia de la ficha de producto (que sí necesita JS para cosas que dependen de plugins externos), todo aquí se resuelve con elementos y ajustes nativos de Bricks/WooCommerce.

---

## 6. Pendiente / no cubierto en este documento

- **Iconos**: los actuales (Font Awesome) son un placeholder. El usuario ha confirmado que más adelante subiremos SVG personalizados de marca — sustituir vía `bricks/create-custom-icon-set` + `bricks/upload-custom-icon`, no volver a Font Awesome/Themify.
- **Favoritos/wishlist**: se probó un icono de corazón condicionado y se retiró a petición del usuario. No hay plugin de wishlist instalado; si se quiere retomar, hace falta instalarlo primero.
- **Login/Registro en móvil**: ocultos hoy (`_display:tablet_portrait: none`). Pendiente decidir si se muestran (probablemente solo iconos) ahora que son popups y no una página que desbordaba.
- **Detalles de los popups pedidos y no implementados aún** (no son ajustes nativos de Bricks/WooCommerce, requieren código y estaban pendientes de confirmación):
  - Icono dentro de cada campo (persona/sobre/candado) — posible con iconos nativos superpuestos en posición absoluta, sin CSS, pero a ojo/iterativo.
  - Icono de ojo para mostrar/ocultar contraseña — necesita JS (WooCommerce no lo trae).
  - Placeholder dentro de los campos de registro — necesita un snippet PHP (Code Snippets), el control de Bricks no expone placeholder para estos campos.
  - Campo de "repetir contraseña" en el registro — no existe en WooCommerce nativo, necesitaría JS.
- **Limpieza de sistema de diseño**: se borraron 18 clases globales huérfanas y 1 Theme Style muerto que quedaron de wireframes previos (Header 02 y el menú anidado manual que sustituyó `nav-menu`). Las ~112 variables `--brxw-*` marcadas como "sin uso" por el auditor **no se han tocado**: son una escala de tipografía/espaciado en uso real por cadena de referencias que el auditor no sigue; borrarlas rompería estilos.
- **Regla de fondo para cualquier cambio futuro en este header (o cualquier plantilla)**: todo nativo de Bricks, nunca `_cssCustom`, nunca contenido hardcodeado que ya exista como dato real (menús, páginas, colores) — ver sección "Regla de oro en Bricks" en `CLAUDE.md`.

---

*Documento creado el 13 de agosto de 2026, actualizado el mismo día tras añadir los popups de login/registro y el rediseño de tipografía/iconos del header.*
