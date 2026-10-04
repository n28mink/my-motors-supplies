# My motors Supplies

Tienda web de repuestos de moto (Venezuela). Sitio estático: HTML + CSS + JS, sin build.

- Catálogo de 20 productos con fotos propias, buscador y filtros por categoría
- Carrito con persistencia local y checkout por WhatsApp (el pedido se arma solo)
- Precios en USD

## Editar

Todo el contenido editable está en `js/data.js`: nombre del negocio, número de
WhatsApp, categorías, productos y precios.

## Ver local

```bash
cd my-motors-supplies
python3 -m http.server 8000
# abrir http://localhost:8000
```
