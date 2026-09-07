# CHANEZ STORE — Demo e-commerce

Tienda demo multipágina basada en plantilla **Kaira** (Bootstrap 5, TemplatesJungle). Catálogo de **36 productos** con imágenes reutilizadas (5 assets WebP) para mantener el demo liviano.

## URL demo

https://sala-cero.onrender.com/demo/chanez-ecommerce/

## Flujo

1. **index.html** — Tienda densa (grid 4 columnas, filtros, chips, bolsa lateral)
2. **producto.html** — Ficha de producto + relacionados
3. **carrito.html** — Edición de cantidades
4. **checkout.html** — Datos de envío → WhatsApp 69297946

## Comparar

- [Demo catálogo / landing](../chanez-store/) — misma marca, enfoque catálogo

## Notas técnicas

- Carrito en `localStorage` (`chanez-cart-v1`)
- Sin backend: ideal para deploy estático en Render (mismo pipeline que Sala Cero)
- Next.js sería overkill para este demo; en producción se puede migrar si el cliente necesita panel admin o pagos integrados
