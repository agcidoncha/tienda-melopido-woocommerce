# Conectores MCP — seda.melopido.shop

Todos los conectores apuntan a **producción** (`https://seda.melopido.shop`). No hay entorno local/staging (se eliminó `lab-local` el 2026-07-29 por decisión explícita: el sitio está en construcción, sin tráfico).

Configuración en [`.mcp.json`](.mcp.json).

---

## 1. `woocommerce` — REST API de WooCommerce

Paquete: `@amitgurbani/mcp-server-woocommerce` · Auth: Consumer Key/Secret

Acceso completo de lectura/escritura a todo lo que cubre la REST API de WooCommerce:

- **Catálogo**: productos, variaciones, atributos y sus términos, categorías, marcas, tags, reseñas
- **Pedidos**: crear/editar/borrar, notas de pedido, reembolsos, totales
- **Clientes**: alta, edición, totales
- **Envíos**: zonas, métodos por zona, clases de envío
- **Impuestos**: clases y tarifas
- **Cupones**
- **Pagos**: consulta/edición de pasarelas de pago (no credenciales)
- **Ajustes**: lectura/escritura de settings de WooCommerce, grupos de settings
- **Informes**: ventas, top sellers, totales de productos/pedidos/clientes
- **Sistema**: system status, países, monedas, webhooks, media, herramientas de mantenimiento (limpiar caché, recontar términos, etc.)

Es el conector "grande" para todo lo transaccional/catálogo de la tienda.

---

## 2. `wordpress` — REST API de WordPress core

Paquete: `@instawp/mcp-wp` · Auth: usuario + contraseña de aplicación

Gestión genérica de WordPress, independiente de WooCommerce/Bricks:

- **Contenido**: crear/editar/borrar posts, páginas y cualquier custom post type (con soporte de edición parcial de contenido, no solo reemplazo completo)
- **Taxonomías y términos**: descubrir taxonomías, crear/editar/borrar términos, asignarlos a contenido
- **Medios**: subir, editar, borrar, buscar en la biblioteca
- **Usuarios**: crear/editar/borrar, roles
- **Comentarios**: crear/editar/borrar, moderar
- **Plugins**: listar, activar, desactivar, instalar desde el repositorio oficial de WordPress.org (por slug — **no** sirve para temas premium como Bricks)
- **SQL de solo lectura**: `execute_sql_query` (solo `SELECT`/`EXPLAIN`, sin escritura)
- **Sitio**: info general, test de conexión

Es el conector para todo lo de WordPress que no es ni WooCommerce ni Bricks (contenido normal, usuarios, plugins, medios).

---

## 3. `seda-melopido-shop` — MCP Adapter (Abilities API)

Paquete: `@automattic/mcp-wordpress-remote` → `wp-json/mcp/mcp-adapter-default-server`

Este conector expone **abilities** registradas por plugins/temas específicos del sitio, vía el plugin *MCP Adapter*. Tiene tres grupos:

### WooCommerce (subconjunto reducido)
Solo consulta y gestión básica — no reemplaza al conector `woocommerce` completo:
- `woocommerce/products-query`, `product-create`, `product-update`, `product-delete`
- `woocommerce/orders-query`, `order-add-note`, `order-update-status`

### Yoast SEO
- `yoast-seo/get-seo-scores` — puntuaciones SEO de las entradas modificadas más recientes
- `yoast-seo/get-readability-scores` — puntuaciones de legibilidad

### Bricks Builder (~145 abilities) — **maquetado completo por IA**
Activado desde el 2026-07-29 (requirió actualizar el tema a Bricks 2.4-beta2 + activar el interruptor en `Bricks > Configuración > AI`). Cubre:

| Categoría | Qué permite |
|---|---|
| Elementos de página | Leer/crear/editar/borrar elementos de cualquier página o plantilla, árbol completo o parcial, renderizado de prueba sin guardar, conversión de HTML/CSS a formato Bricks |
| Plantillas | CRUD de templates (header, footer, popup, archivo, error, etc.), condiciones de dónde se muestran, biblioteca remota de templates (wireframes/design-sets) |
| Diseño | Paletas de color, clases globales CSS, theme styles, variables globales, generación de escalas tipográficas/espaciado, generación de sombras de color, auditoría de consistencia del design system |
| Componentes | Crear/editar/borrar componentes reutilizables, extraer un bloque de una página a componente global |
| Contenido | Crear/duplicar/borrar páginas y posts con su árbol Bricks incluido |
| Revisiones | Listar, leer y restaurar versiones anteriores de una página (deshacer cambios) |
| Medios | Subir, buscar, borrar archivos de la biblioteca |
| Navegación | Leer/crear/editar menús de WordPress, mega-menús, multinivel |
| Formularios | Configurar campos y acciones de formularios Bricks, leer envíos guardados |
| Filtros de producto/contenido | Elementos de filtro (checkbox, select, rango, buscador), reindexado |
| Popups | Listar, leer condiciones y configuración (cierre, scroll, límites) |
| Interacciones | Eventos click/scroll/hover → mostrar/ocultar/animar/etc. sobre cualquier elemento |
| Condiciones de elemento | Mostrar/ocultar elementos según reglas |
| Ajustes globales de Bricks | Lectura/escritura de la config general del tema (allow-list controlada) |
| WooCommerce (integración Bricks) | Estado y asistente de configuración de páginas Woo (tienda, ficha de producto, carrito, checkout) |
| Breakpoints | Leer/definir los puntos de corte responsive del sitio |
| Queries globales | Bucles de contenido reutilizables (ACF repeaters, WooCommerce, custom post types) |
| Sidebars, fuentes e iconos personalizados | CRUD completo de cada uno |
| Mantenimiento | Regenerar CSS, limpiar elementos huérfanos |
| Import/export | Empaquetar y mover diseño completo (paletas, clases, templates, componentes...) entre sitios |
| Sistema | Info de versión de Bricks/WP/tema/plugins |

**4 abilities deshabilitadas por defecto** (no por un admin, vienen así de fábrica): gestión de permisos de acceso al builder por rol de WordPress (`list/upsert/delete-builder-capability`, `set-builder-role-access`). Si en algún momento se quiere gestionar quién puede usar el builder por rol, hay que activarlas explícitamente.

---

## Resumen: qué conector usar para qué

| Necesito... | Conector |
|---|---|
| Precio, stock, variaciones, pedidos, cupones, envíos, impuestos | `woocommerce` |
| Contenido genérico de WordPress, usuarios, plugins, medios | `wordpress` |
| Maquetar/diseñar con Bricks (páginas, plantillas, componentes, estilos) | `seda-melopido-shop` |
| Puntuación SEO/legibilidad de una entrada | `seda-melopido-shop` (Yoast) |

## Convención de escritura

Cualquier cambio real en el sitio (crear, editar, borrar — en cualquiera de los tres conectores) requiere confirmación explícita antes de ejecutarse, según lo acordado en [`CLAUDE.md`](CLAUDE.md).
