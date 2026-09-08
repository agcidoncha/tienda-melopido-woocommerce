# Reglas de trabajo: Bricks Builder + MCP

Documento **exportable a cualquier proyecto** que use Bricks Builder gestionado por MCP (vía un adapter tipo `mcp-adapter` de WordPress). No contiene nada específico de una tienda o web concreta — son reglas de proceso y gotchas técnicos reutilizables.

---

## 1. Punto de partida de cualquier proyecto nuevo

**Siempre se parte de una plantilla wireframe oficial de Bricks**, nunca de una página en blanco construida elemento a elemento desde cero. Los wireframes oficiales traen ya la estructura, la semántica y las clases base bien planteadas — se adaptan y se les cambia el contenido, no se reinventan.

**Lo primero que se crea en cualquier proyecto, antes de tocar un solo módulo, es el Theme Style y la tipografía** (paleta de colores nativa, fuentes, tamaños base). Todo lo que se construya después debe apoyarse en esos ajustes ya creados — nunca al revés (construir módulos sueltos y luego intentar que encajen con un look and feel que no existía todavía). Esto evita meter colores/tamaños que luego no correspondan con la identidad visual real del proyecto y haya que reescribir módulos ya hechos.

**Renombrar siempre los módulos/elementos a nombres legibles, nunca dejarlos con el ID autogenerado.** Un wireframe importado trae IDs de 6 caracteres sin sentido (ej. `edww456`); lo primero al adaptar cada bloque es ponerle una etiqueta clara que describa qué es (ej. `edww456` → "Caja Contacto"). Esto es lo que hace posible hablar del proyecto por nombres reales en vez de estar cruzando IDs constantemente — ver la convención de etiquetado en la sección 5.

---

## 2. Regla de oro: todo nativo, nada suelto

**Nunca `_cssCustom` ni CSS/JS empotrado dentro de Bricks.** Todo ajuste visual pasa por los controles nativos del elemento o de la clase global (Background, Typography, Layout, Border, Box Shadow, etc.), nunca por una cadena de CSS escrita a mano en un elemento, clase o plantilla.

**Si algo no se puede hacer nativo, decirlo, no inventarlo.** Si el usuario pide algo y no existe un ajuste/elemento nativo de Bricks para lograrlo:
1. Confirmar de verdad que no existe (revisar el catálogo de elementos del proyecto si lo hay, y `bricks/get-element-schema` sobre el tipo de elemento en cuestión).
2. Si de verdad no existe, decirlo explícitamente y preguntar cómo proceder — nunca meter un workaround silencioso (CSS custom, un sustituto aproximado, o saltarse parte de lo pedido sin avisar).

**No crear clases globales "sueltas".** Una clase global creada para un único ajuste puntual, que no se va a reutilizar, es basura acumulada. Reutilizar o extender una clase semántica ya existente en vez de crear una nueva por cada retoque.

**Por qué importa esto** (motivo original del usuario, aplicable a cualquier proyecto): no es solo estilo de código — es mantener el control real del sitio. Con `_cssCustom` disperso y clases huérfanas, nadie sabe qué se usa y qué es basura acumulada; con todo nativo, el propio panel de Bricks es la fuente de verdad y se puede auditar.

**Ojo con plantillas/wireframes importados.** Algunas librerías de plantillas de Bricks traen sus propias clases con `_cssCustom` ya puesto de fábrica (no lo pusiste tú). No es licencia para añadir más — al tocar esas clases, sustituir el CSS custom por el ajuste nativo equivalente si existe, y si no, avisar.

**Nunca un color en hexadecimal suelto — siempre la variable de la paleta nativa.** Todo color (fondo, texto, borde, sombra) se referencia como `var(--nombre-color)` de la paleta de colores nativa del Theme Style, nunca como un `#HEXCODE` escrito a mano en un ajuste, aunque "por casualidad" coincida con un color de la paleta. Si aparece un hexadecimal suelto (en un ajuste heredado, o pegado desde fuera por el usuario) y no hay ninguna variable existente que coincida exactamente, crear una nueva variable de paleta con ese valor antes de usarlo — nunca dejarlo como hex directo. Esto es lo que permite hacer cambios de marca (por ejemplo, cambiar un color en toda la web) tocando un solo sitio en vez de perseguir hexadecimales repetidos por todo el proyecto.

**Esto incluye variantes con transparencia/opacidad — no es una excepción a la regla.** Es tentador pensar "para un blanco al 50% no hay forma nativa, así que aquí sí vale un hex con alpha" — es un error, comprobado en la práctica: existe una ability nativa para generar variantes transparentes/claras/oscuras de un color ya existente de la paleta (`bricks/generate-color-shades`, `shadeType:"transparent"`), que genera la variante exacta (ej. `hsl(0 0% 100% / 0.5)`) y la guarda como una variable real de la paleta (`var(--blanco-t-1)`). **Antes de escribir un hex "porque este caso concreto no tiene forma nativa", hay que comprobarlo de verdad buscando la ability correspondiente — no asumirlo.** Saltarse este paso no es un desliz menor: si hay reglas escritas, no se dan por buenas excepciones improvisadas sobre la marcha.

---

## 3. Cuándo SÍ usar el tema hijo (child theme) como excepción

La única vía legítima para CSS/JS real fuera de Bricks es el **tema hijo**, y solo cuando Bricks genuinamente no llega — típicamente markup de un plugin de terceros que Bricks no renderiza ni puede seleccionar con sus propios controles (ej. un plugin de swatches de variaciones, un selector de cantidad custom, etc.).

**Estructura de archivos:**
- `wp-content/themes/<tema-hijo>/css/<caso>.css` y `.../js/<caso>.js` — **un archivo por caso/funcionalidad**, nunca un `custom.css`/`custom.js` compartido como cajón de sastre. Razones: cargas condicionales más pequeñas (rendimiento), depuración más fácil (se sabe exactamente qué archivo abrir), consistencia con la separación por página/funcionalidad.
- Enqueue desde `functions.php`, dentro del hook `wp_enqueue_scripts`, **condicionalmente** (`is_product()`, `is_cart()`, etc. — no cargar CSS/JS de una página concreta en todo el sitio).
- El parámetro de versión de `wp_enqueue_style`/`wp_enqueue_script` debe usar `filemtime()` del propio archivo — así cualquier re-subida vía SFTP/FTP invalida la caché sola, sin bump manual de versión.

**Workflow de edición** (cuando no hay una herramienta de "editar archivo remoto" directa): leer/mantener una copia local de scratch → editar esa copia local → subir por SFTP/FTP/despliegue → recargar la página real en el navegador (con bypass de caché) para verificar. Si no hay entorno de staging, cada cambio se prueba directamente sobre el sitio público — hacerlo con cuidado.

**Cuándo usar `!important` (justificado, no por pereza):** cuando de verdad no hay otra forma de ganar la cascada CSS — ej. un plugin inyecta `style="..."` inline vía JS tras cargar la página (eso nunca lo gana una regla de hoja de estilos externa sin `!important`), o Bricks repite la misma regla generada en un bloque `<style>` inline posterior que carga después de tu CSS enqueado, sin que puedas controlar el orden. Antes de usar `!important`, comprobar que no hay forma de ganar por especificidad (ej. usando el `#brxe-{id}` del propio elemento — un selector con ID gana siempre a cualquier número de clases, sin necesitar `!important`).

**Cuándo usar un `MutationObserver` en vez de CSS puro:** si un plugin inserta/quita nodos del DOM dinámicamente (no solo aplica estilos) y ese nodo nuevo necesita reubicarse o reestilarse cada vez que aparece, un `MutationObserver` que reubique el nodo en un wrapper propio es más robusto que perseguirlo con selectores CSS. Cuidado: proteger la lógica de reordenar contra movimientos "sin cambio real" (un `appendChild` que no mueve nada de sitio sigue disparando una mutación y puede crear un bucle).

**Antes de asumir "esto no tiene ajuste nativo", comprobar que el elemento subyacente es del tipo correcto.** A veces un markup heredado/importado simula un elemento nativo (ej. un `text`/`text-basic` con un dynamic tag) en vez de ser el elemento real (ej. `product-rating`) — eso estructuralmente no puede exponer los controles nativos de contenido/color que sí tendría el elemento correcto. Si algo "no tiene ajuste nativo", primero comprobar que no es en realidad un elemento genérico disfrazado.

---

## 4. Clases y variables globales huérfanas

**Herramienta de auditoría:** el propio adapter MCP de Bricks suele traer una ability de auditoría del sistema de diseño (ej. `bricks/audit-design-system`) que detecta: clases/variables huérfanas (errores), theme styles sin condiciones (avisos), recursos sin usar (info). Es de solo lectura — no borra nada, solo informa.

**Falso positivo importante: cadenas de variables.** El auditor normalmente no sigue cadenas de referencia entre variables (`--var-a: var(--var-b)`). Si `--var-b` alimenta a `--var-a`, y `--var-a` sí está en uso real en algún elemento, borrar `--var-b` rompe el sitio **aunque el auditor la marque como huérfana**. Antes de borrar en bloque variables "sin uso", trazar a mano las cadenas de indirección — no fiarse ciegamente del reporte automático.

**`delete-global-class`/`delete-global-variable` pueden decir éxito sin borrar de verdad.** Se ha observado (repetible, no puntual) que una llamada de borrado devuelve `success:true` con un snapshot correcto de "antes de borrar", pero la clase/variable sigue apareciendo en el listado después. No hay ninguna pista en la respuesta de que algo fue mal.
**Cómo aplicar:** después de cualquier borrado importante o en bloque, volver a listar (`list-global-classes`/`list-global-variables`) y comprobar qué IDs objetivo siguen presentes. Reintentar el borrado sobre esos IDs concretos (una segunda llamada idéntica suele bastar) — no asumir que la operación falló del todo ni investigar de más. Verificar una vez más antes de dar la limpieza por terminada.

**Nombre de parámetro correcto al borrar variables:** comprobar la firma exacta de la ability antes de lanzar un borrado en bloque — el nombre del parámetro para identificar la variable puede no ser el que uno espera por analogía con otras abilities (ej. `variableId` en vez de `id`). Un error de parámetro aquí falla todo el bloque de golpe con un mensaje de "Permission denied" engañoso (no es un problema de permisos real).

**Dos theme styles con la misma condición de alcance pueden pisarse en silencio.** Si dos theme styles comparten la misma condición (ej. ambos con alcance "todo el sitio"), Bricks puede cargar solo el que considera "más específico" con un criterio de desempate no documentado, descartando el otro por completo y sin aviso claro más allá de un texto en el propio panel del builder. Si un theme style parece dejar de aplicarse tras crear/tocar otro, comprobar primero si hay dos compitiendo por el mismo alcance — la solución robusta es fusionar todos los ajustes necesarios en un único theme style con condiciones, no mantener varios con el mismo alcance.

---

## 5. Condiciones de plantillas: `wc_*` vs el resto

**Crítico, puede tumbar el sitio en producción.** Los tipos de plantilla específicos de WooCommerce (cualquiera que empiece por `wc_`: `wc_account_dashboard`, `wc_cart`, `wc_form_checkout`, `wc_product`, etc.) **se colocan solos por tipo** — no necesitan ninguna entrada de condiciones. A diferencia de plantillas genéricas (`header`, `footer`, `popup`, `section`, contenido/archivo/búsqueda/error genéricos), que sí necesitan una condición explícita para aparecer en algún sitio.

**Qué pasa si se pone una condición de "todo el sitio" en una plantilla `wc_*`:** esa condición se toma literalmente y la plantilla empieza a renderizarse en **todas las páginas, incluida la home**, sustituyendo el contenido real — en producción, con tráfico real posible.

**Cómo aplicar:** antes de fijar condiciones en cualquier plantilla nueva, mirar su `type`. Si es `wc_*`, dejar las condiciones **vacías** (`[]`, no `null` — el array vacío es el estado correcto de "que se coloque solo por su tipo"). Solo los tipos que no son `wc_*` necesitan condiciones explícitas.

---

## 6. Convenciones de construcción

**Etiquetar (label) todos los elementos, no solo los contenedores.** Un panel de capas con nodos genéricos sin nombre ("Block", "Div", div sin etiqueta) obliga a cruzar referencias por ID constantemente. Convención: `{Bloque/sección padre} {rol}` (ej. "Acordeón Item 3 Icono"), en el idioma del proyecto, con mayúsculas de título. Ojo: `label` suele ser un campo de nivel superior del elemento (hermano de `settings`/`name`/`parent`), no algo dentro de `settings` — comprobar si la ability de actualización parcial de un elemento soporta cambiar el label o si hace falta la ability de reescritura completa de la página para setearlo.

**Pedir siempre el nombre explícito del módulo/plantilla al usuario antes de editarlo.** Nunca fiarse de un nombre autogenerado por Bricks para identificar qué construir/tocar — confirmar con la persona qué plantilla o módulo es, por su nombre real.

**Verificar en el navegador real, no solo por el eco de la API o el código fuente.** El orden de renderizado en pantalla sigue el orden del array plano tal como se envía en el guardado, no necesariamente el campo `children` tal cual se lee de vuelta de la API — no asumir que lo que devuelve la API tras guardar es exactamente lo que se ve en vivo. Para verificar tamaños/espaciados/comportamiento responsive, usar herramientas de navegador reales: `getComputedStyle`, `getBoundingClientRect`, capturas a distintos anchos — no fiarse de razonamiento sobre el código fuente ni de un `curl` estático cuando hay JS/CSS con especificidad compleja de por medio.

---

## 7. Gotchas técnicos frecuentes

**Los iconos SVG en Bricks suelen tener DOS ajustes de tamaño independientes.** Uno es el tamaño del contenedor/wrapper que envuelve al icono, y otro es el `icon.height` (o equivalente) del propio SVG interior. Cambiar solo uno de los dos no basta: el que quede sin tocar sigue con su valor anterior fijo (se ve en el CSS generado como algo tipo `#brxe-x svg {height: 25px}` sin cambiar) y visualmente el icono no crece ni se reduce aunque el wrapper sí. Al redimensionar cualquier icono, comprobar y ajustar los dos ajustes, no solo el primero que se encuentre.

**Un elemento flex con `width` explícito se puede seguir encogiendo si no lleva `flex-shrink: 0`.** Esto no es específico de Bricks, es CSS flexbox general, pero es fácil olvidarlo al fijar tamaños (incluso con `!important`) dentro de un contenedor flex: por defecto `flex-shrink: 1`, así que en cuanto el contenedor no tiene sitio de sobra, el navegador encoge el elemento por debajo del `width`/`clamp()` que le hayas puesto, sin avisar ni romper nada visualmente evidente — el valor "gana" en el CSS pero pierde en el layout real. Si un tamaño fijado por CSS no se respeta y no hay ninguna regla con más especificidad compitiendo, sospechar primero de flexbox y añadir `flex-shrink: 0` antes de seguir buscando el problema en la cascada.

---

## 8. Resumen operativo (checklist rápido)

- [ ] ¿Proyecto nuevo o módulo nuevo? → parte de un wireframe oficial de Bricks, no de cero.
- [ ] ¿Ya existe el Theme Style y la tipografía del proyecto? → si no, es lo primero que se crea, antes de cualquier módulo.
- [ ] ¿El módulo tiene un ID autogenerado tipo `edww456`? → renómbralo a un nombre legible antes de seguir.
- [ ] ¿Existe un control nativo de Bricks para esto? → usarlo. Si no estás seguro, comprobar el schema del elemento antes de descartarlo.
- [ ] ¿De verdad no hay nativo? → decirlo al usuario, no inventar un workaround.
- [ ] ¿Hace falta CSS/JS real? → tema hijo, un archivo por caso, carga condicional, nunca dentro de Bricks.
- [ ] ¿Vas a poner un color? → variable de la paleta nativa, nunca un hexadecimal suelto. Incluye transparencias: busca la ability de variantes (`generate-color-shades`) antes de asumir que hace falta un hex con alpha.
- [ ] ¿Vas a redimensionar un icono SVG? → revisa si hay dos ajustes de tamaño (wrapper + icono interior), no solo uno.
- [ ] ¿Un tamaño fijado por CSS no se respeta dentro de un flex? → prueba `flex-shrink: 0` antes de sospechar de la cascada.
- [ ] ¿Vas a borrar clases/variables "sin uso"? → traza cadenas de variables a mano primero, y vuelve a listar tras borrar para reintentar lo que sobreviva.
- [ ] ¿Vas a poner condiciones en una plantilla nueva? → comprueba el `type` primero; si es `wc_*`, condiciones vacías.
- [ ] ¿Vas a dar un cambio visual por bueno? → verifícalo en el navegador real (computed styles, capturas), no solo por lo que devuelve la API.
