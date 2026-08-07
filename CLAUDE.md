# Woocomerce-melopido

Proyecto para gestionar la tienda **seda.melopido.shop** (WordPress + WooCommerce + Bricks Builder) mediante instrucciones en lenguaje natural mediante Claude Code.

## Stack de la tienda

- WordPress 7.0.2, WooCommerce 10.9.4, PHP 8.3.31, MySQL/MariaDB 11.4.12
- Tema: Bricks Child Theme (Bricks 2.4-beta2)
- HPOS (High-Performance Order Storage) activado
- Moneda: EUR
- Idioma: es_ES
- Plugins activos relevantes: Advanced Custom Fields PRO, Advanced Themer for Bricks, Yoast Duplicate Post, FileBird Pro, Premmerce Permalink Manager, WooCommerce Product Variations Swatches Premium, Yoast SEO
- Plugin inactivo: Packlink PRO Shipping

## MCP de WooCommerce

- `.mcp.json` define el servidor `woocommerce` usando `@amitgurbani/mcp-server-woocommerce` (101 herramientas, lectura + escritura).
- Variables de entorno: `WORDPRESS_SITE_URL`, `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET` (key con permisos Read/Write).
- Si las herramientas `mcp__woocommerce__*` no aparecen o parecen de solo lectura, lo primero es comprobar si la sesión es antigua (abierta antes de un cambio en `.mcp.json`) — no asumir que es un problema de la API.

## Catálogo actual (referencia rápida)

6 productos, todos variantes de "Funda de Seda":

| ID | Producto | Precio | Stock |
|----|----------|--------|-------|
| 173 | Funda de Seda 150×45 cm | sin precio | outofstock |
| 172 | Funda de Seda 135×45 cm | sin precio | outofstock |
| 171 | Funda de Seda 120×45 cm | sin precio | outofstock |
| 170 | Funda de Seda 110×45 cm | sin precio | outofstock |
| 169 | Funda de Seda 90×45 cm | 100€ | outofstock |
| 24 | Funda de Seda 75×50 cm | 100€ | instock |

Este catálogo cambia con frecuencia — verificar con `list_products` antes de asumir que sigue igual.

## Convenciones de trabajo

- Cualquier escritura en la tienda (cambiar precio, stock, pedidos, etc.) requiere confirmación explícita del usuario antes de ejecutarse — es producción real.
- Pendiente (a futuro, no crear todavía): una skill de Claude Code para gestión habitual de esta tienda, y valorar un artefacto tipo dashboard (ej. productos sin precio/stock).
