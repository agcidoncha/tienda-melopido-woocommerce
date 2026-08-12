# Estudio competencia fundas — Ficha de producto desktop

**Proyecto:** nueva tienda `seda.melopido.shop`  
**Documento:** definición inicial de la página de producto en desktop  
**Versión:** 0.1  
**Fecha:** 11 de agosto de 2026  
**Ficha de referencia:** [Funda de seda 150 × 45 cm](https://seda.melopido.shop/funda-seda-150x45/)

## 1. Objetivo del documento

Este documento recoge el estado actual y las primeras decisiones tomadas para la ficha de producto de la nueva tienda `seda.melopido.shop` en su versión de escritorio.

La ficha de **150 × 45 cm** se utiliza como referencia para definir una plantilla común que después pueda aplicarse a las demás medidas.

Por el momento, el estudio se limita exclusivamente a la **página de producto en desktop**. No incluye la página de inicio, categorías, carrito, proceso de pago ni adaptación móvil.

## 2. Relación entre las dos webs

### `melopido.shop`

Es la web principal de captación y posicionamiento SEO. Alojará el contenido informativo amplio sobre la seda, el satén, el cabello, la piel, los momme y otros temas educativos.

### `seda.melopido.shop`

Es la nueva tienda WooCommerce y estará orientada principalmente a la conversión y a la venta.

### Regla obligatoria

La tienda **no debe canibalizar** a `melopido.shop`. Por tanto:

- No se copiarán textos, preguntas frecuentes ni bloques SEO de la web principal.
- La ficha incluirá solo la información necesaria para comprender, elegir y comprar el producto.
- Los contenidos educativos extensos seguirán perteneciendo a `melopido.shop`.
- Cuando resulte útil, la tienda podrá incluir un resumen breve y enlazar a la guía completa correspondiente de la web principal.

## 3. Producto de referencia

- **Producto:** funda de almohada de seda.
- **Medida actual:** 150 × 45 cm.
- **Material:** 100 % seda de morera.
- **Densidad:** 22 momme.
- **Cierre:** tipo sobre, sin cremallera.
- **Colores disponibles:** 7.
- **Precio actual de una unidad:** 119,90 €.

## 4. Principios de diseño y usabilidad

La ficha debe:

- Mantener una presentación limpia, elegante y premium.
- Permitir entender el producto y comprarlo sin recorrer una página innecesariamente larga.
- Dar prioridad a las decisiones de compra: medida, color, cantidad y pago.
- Conservar las funciones que ya están bien resueltas.
- Evitar repetir información.
- Evitar tarjetas grandes, bloques decorativos o elementos que aumenten el scroll sin aportar utilidad.
- Mantener una estructura principal de dos columnas en desktop: galería a la izquierda e información de compra a la derecha.

## 5. Estructura de la página en desktop

### 5.1. Columna izquierda: galería del producto

La zona izquierda contendrá la galería visual del producto:

- Imagen principal grande.
- Miniaturas o navegación entre las imágenes disponibles.
- Fotografías correspondientes a los distintos colores.
- Imágenes de detalle del tejido, acabado y cierre.
- Acceso al contenido visual que ayuda a comprobar la diferencia entre seda y satén.

La galería ya permite mostrar imagen y vídeo. Se mantendrá esta funcionalidad.

### 5.2. Columna derecha: información y compra

La zona derecha contendrá, en este orden aproximado:

1. Nombre del producto.
2. Descripción corta.
3. Precio unitario.
4. Resumen breve de calidad y características.
5. Medida actual y acceso a las demás medidas.
6. Selector de color.
7. Acceso opcional al test de color.
8. Selector de cantidad y total de la compra.
9. Botón «Añadir al carrito».
10. Métodos de pago rápido.
11. Información breve de confianza y condiciones de compra.

## 6. Precio y cantidad

### Funcionamiento actual

Actualmente, el precio situado en la parte superior cambia cuando aumenta la cantidad:

- 1 unidad: 119,90 €.
- 2 unidades: 239,80 €.
- 3 unidades: 359,70 €.

El cálculo funciona correctamente.

### Mejora acordada para estudiar o implementar

Se propone separar claramente el precio unitario del total:

- En la parte superior se mantendrá fijo: **119,90 € / unidad**.
- Junto al selector `−  cantidad  +` se mostrará el total dinámico.
- Ejemplo con tres unidades: **Total: 359,70 €**.
- No se mostrará un segundo precio sin identificarlo.

Esta solución permite ver simultáneamente cuánto cuesta cada funda y cuánto se pagará por la cantidad seleccionada.

## 7. Selección de medida

La página ya detecta cuál es la medida del producto que se está viendo y no la repite entre los enlaces a las demás fichas.

Ejemplo para la ficha de 150 × 45 cm:

- Texto informativo: **Tu medida: 150 × 45 cm**.
- Accesos a: 75 × 50, 90 × 45, 110 × 45, 120 × 45 y 135 × 45 cm.

### Mejora visual acordada para desktop

- Convertir los enlaces actuales en botones compactos.
- Colocar los cinco botones en una sola fila siempre que el ancho disponible lo permita.
- No usar fotografías, tarjetas grandes ni descripciones adicionales.
- No repetir la medida actual como botón.
- Mantener cada medida enlazada a su ficha de producto independiente.
- No aumentar de forma apreciable la altura del bloque ni el scroll.

## 8. Selección de color

La selección de color ya está funcionalmente bien resuelta:

- Se muestran siete círculos de color.
- Al pulsar un color aparece su nombre.
- El borde del círculo identifica el color activo.
- La elección puede actualizar la imagen correspondiente del producto.
- El cliente puede cambiar de color libremente.

No es necesario sustituir este sistema. Solo deberá conservarse una selección visual clara, accesible y coherente con la galería.

## 9. Test para elegir el color

La ficha incorpora un test opcional de cuatro preguntas para ayudar al cliente a elegir el color más adecuado.

Al finalizar:

- Se muestra una recomendación personalizada.
- El color recomendado queda marcado en la ficha.
- El usuario puede aceptar la recomendación o seleccionar después otro color.

El test es una función diferencial frente a muchos competidores y debe conservarse. No debe interrumpir a quien ya sabe qué color quiere comprar.

## 10. Botón de compra y pagos rápidos

La zona de compra incluirá:

- Selector de cantidad.
- Total dinámico de la selección.
- Botón principal **«Añadir al carrito»**.
- Apple Pay.
- Google Pay.
- Amazon Pay.
- Link u otros métodos rápidos compatibles.

Los pagos rápidos deben mantenerse debajo del botón principal para facilitar la compra sin competir visualmente con «Añadir al carrito».

## 11. Información de confianza cercana a la compra

Todavía debe definirse o comprobarse la información exacta que se mostrará cerca del botón. El bloque deberá ser breve e incluir únicamente datos reales:

- Disponibilidad o estado del stock.
- Plazo estimado de entrega.
- Gastos o condiciones de envío.
- Plazo y condiciones principales de devolución.

Esta información no debe convertirse en un bloque largo. Su función es resolver las dudas más importantes antes de añadir el producto al carrito.

## 12. Justificación breve del producto y del precio

Cerca del precio se mostrará una línea breve con los principales atributos del producto. Propuesta inicial:

> 100 % seda de morera · 22 momme · medida 150 × 45 cm · cierre tipo sobre

El objetivo no es crear contenido SEO ni repetir los acordeones, sino explicar de un vistazo qué está comprando el cliente.

Solo se mostrarán certificaciones, grados de calidad o afirmaciones que puedan acreditarse documentalmente.

## 13. Información ampliada y acordeones

La ficha puede mantener información ampliada mediante acordeones para evitar una página excesivamente larga. Los contenidos previstos son:

- Detalles del producto.
- Información breve sobre el cabello.
- Información breve sobre la piel.
- Cuidados y mantenimiento.
- Preguntas prácticas relacionadas directamente con la compra.

Estos textos deberán ser breves, comerciales y distintos de los contenidos SEO de `melopido.shop`.

## 14. Galería «Seda vs. satén»

La página ya dispone de una sección o pestaña visual llamada actualmente «Seda VS Saten», con:

- Un vídeo de aproximadamente 49 segundos.
- Una prueba visual de quemado.
- Una comparación entre fibra natural y tejido sintético.

### Decisiones

- Mantener el vídeo como contenido complementario dentro de la galería.
- No moverlo junto al botón de compra, porque ocuparía demasiado espacio.
- Corregir el nombre a **«Seda vs. satén»**.
- Explicar con prudencia que la prueba ayuda a diferenciar una fibra natural de una sintética, pero no demuestra por sí sola que el tejido sea seda de morera, grado 6A o 22 momme.
- No animar al cliente a repetir la prueba en casa.

## 15. Reseñas

Se considera importante incorporar reseñas de clientes, especialmente por tratarse de un producto de precio elevado.

La posición exacta se decidirá en una fase posterior, pero no deben crear un bloque excesivamente largo antes de la compra principal. Podrán mostrarse mediante:

- Valoración media y número de opiniones cerca del título, cuando existan datos suficientes.
- Sección de opiniones más abajo en la ficha.
- Reseñas verificadas siempre que la herramienta utilizada permita identificarlas correctamente.

## 16. Juegos de cama o confección bajo pedido

El acceso a juegos completos o encargos especiales puede mantenerse, pero será una opción secundaria.

No debe interrumpir el recorrido principal de compra de la funda. Se colocará después de la información esencial, de los detalles del producto o en una zona claramente secundaria.

## 17. Funciones que deben conservarse

- Estructura de dos columnas en desktop.
- Galería de imágenes y vídeo.
- Precio calculado según la cantidad, adaptándolo a la nueva presentación si se aprueba definitivamente.
- Selector de cantidad.
- Nombre visible del color seleccionado.
- Estado visual del color activo.
- Test opcional para recomendar un color.
- Marcado automático del color recomendado.
- Detección automática de la medida actual.
- Exclusión de la medida actual en los enlaces a otras tallas.
- Enlaces a las fichas de las demás medidas.
- Botón «Añadir al carrito».
- Pagos rápidos.
- Acordeones de información complementaria.
- Galería «Seda vs. satén».

## 18. Ideas descartadas por el momento

- Tarjetas grandes para mostrar las demás medidas.
- Fotografías o descripciones individuales para cada medida dentro de la ficha.
- Diseños que aumenten notablemente el scroll.
- Repetir la medida actual entre las opciones disponibles.
- Duplicar el total de compra en varias zonas.
- Convertir la ficha en una página informativa extensa.
- Copiar textos o preguntas frecuentes de `melopido.shop`.
- Diseñar todavía la versión móvil.

## 19. Orden general recomendado

1. Cabecera de la tienda.
2. Migas de pan, si se mantienen en el diseño final.
3. Bloque principal de dos columnas.
4. Galería en la columna izquierda.
5. Nombre, descripción corta y precio unitario en la columna derecha.
6. Resumen breve de calidad.
7. Medida actual y botones compactos de las demás medidas.
8. Selector de color y acceso al test.
9. Cantidad y total dinámico.
10. Botón «Añadir al carrito».
11. Pagos rápidos.
12. Envío, entrega, devolución y disponibilidad.
13. Detalles y acordeones.
14. Reseñas.
15. Juegos de cama o encargos especiales.
16. Información complementaria y pie de página.

## 20. Pendientes para la siguiente fase

- Confirmar definitivamente el nuevo comportamiento visual del precio unitario y el total.
- Diseñar con precisión el bloque compacto de medidas para desktop.
- Definir el texto real de stock, entrega, envío y devolución.
- Comprobar qué sistema de reseñas se utilizará.
- Revisar la jerarquía visual completa de la ficha sin alterar las funciones actuales.
- Realizar un nuevo boceto desktop basado en esta especificación.
- Analizar después la adaptación móvil como una fase independiente.

---

Este documento es una base de trabajo y deberá actualizarse a medida que se aprueben nuevas decisiones de diseño, contenido y funcionamiento.
