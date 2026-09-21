# Plantillas pendientes de revisión en escritorio

Listado completo de todo lo que hay que repasar en escritorio una vez cerrada la revisión mobile. La revisión mobile (template por template) tiene su propio checklist en memoria (`project_mobile_review_checklist`); este documento es el equivalente para no perder nada al empezar con desktop, generado el 2026-09-17.

## Plantillas Bricks (`bricks_template`)

| Plantilla | Tipo | ID |
|---|---|---|
| header-general | header | 206 |
| footer-general | footer | 1044 |
| topbar-promocional | section (hook) | 979 |
| Barra flotante móvil - accesos rápidos | section (hook) | 1347 |
| Archivo de productos | wc_archive | 621 |
| producto-mcp-claude | wc_product | 521 |
| Resultados de búsqueda | search | 1370 |
| popup-iniciar-sesion | popup | 981 |
| popup-registrarse | popup | 983 |
| Carrito | wc_cart | 623 |
| Carrito vacío | wc_cart_empty | 624 |
| Pago | wc_form_checkout | 627 |
| Pagar | wc_form_pay | 629 |
| Recibo del pedido | wc_order_receipt | 628 |
| Gracias | wc_thankyou | 630 |
| cuenta-panel | wc_account_dashboard | 1021 |
| cuenta-pedidos | wc_account_orders | 1022 |
| cuenta-ver-pedido | wc_account_view_order | 1023 |
| cuenta-descargas | wc_account_downloads | 1024 |
| cuenta-direcciones | wc_account_addresses | 1025 |
| cuenta-editar-direccion | wc_account_form_edit_address | 1026 |
| cuenta-editar-cuenta | wc_account_form_edit_account | 1027 |
| cuenta-iniciar-sesion | wc_account_form_login | 1028 |
| cuenta-contrasena-olvidada | wc_account_form_lost_password | 1029 |
| cuenta-contrasena-olvidada-confirmacion | wc_account_form_lost_password_confirmation | 1030 |
| cuenta-restablecer-contrasena | wc_account_reset_password | 1031 |

## Páginas reales de WordPress (`page`)

| Página | Slug | ID |
|---|---|---|
| Inicio | inicio | 2 |
| Tienda | tienda | 14 |
| Carrito | carrito | 15 |
| Finalizar compra | finalizar-compra | 16 |
| Mi cuenta | mi-cuenta | 17 |
| Medidas | medidas-3 | 1090 |
| Colores | colores-5 | 1450 |
| Beneficios | beneficios-3 | 1452 |
| Quiénes somos | quienes-somos | 1095 |
| Contacto | contacto-2 | 1092 |
| Envíos | envios | 1093 |
| Devoluciones | devoluciones | 1094 |
| Preguntas frecuentes | preguntas-frecuentes | 1091 |
| Política de privacidad | politica-de-privacidad | 1096 |
| Términos y condiciones | terminos-y-condiciones | 1097 |
| Aviso legal | aviso-legal | 1098 |

## Productos (ficha individual, mismo template pero contenido real distinto)

| Producto | Slug | ID |
|---|---|---|
| Funda de Seda 75×50 cm | funda-seda-75x50 | 24 |
| Funda de Seda 90×45 cm | funda-seda-90x45 | 169 |
| Funda de Seda 110×45 cm | funda-seda-110x45 | 170 |
| Funda de Seda 120×45 cm | funda-seda-120x45 | 171 |
| Funda de Seda 135×45 cm | funda-seda-135x45 | 172 |
| Funda de Seda 150×45 cm | funda-seda-150x45 | 173 |

## Notas

- Este listado se generó consultando `bricks/list-templates` + `bricks/find-post` el 2026-09-17. Antes de usarlo para la revisión de escritorio, conviene regenerarlo o al menos comprobar que no ha cambiado nada (plantillas nuevas, páginas borradas, etc.).
- "Medidas", "Colores" y "Beneficios" son páginas nuevas creadas el 2026-09-17, publicadas con un texto "Próximamente" — cuando lleguen a revisión de escritorio ya deberían tener contenido real si se ha completado ese trabajo antes.
- "Recibo del pedido" (628) está sin diseñar (plantilla en bruto de WooCommerce) — si sigue así cuando lleguemos a desktop, hay que construirla entera, no solo revisarla.
