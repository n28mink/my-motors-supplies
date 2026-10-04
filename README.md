# My motors Supplies

Tienda web de repuestos de carro (Venezuela). Sitio estático: HTML + CSS + JS, sin build.

- Catálogo de 40 repuestos con fotos propias: Chevrolet, Toyota, Honda, Ford, Hyundai, Kia, Nissan y Mazda
- Filtros por marca del vehículo y por categoría, más buscador
- Ficha de producto con compatibilidad (aplica a), referencia OEM y cantidad
- Carrito con persistencia local y checkout por WhatsApp (el pedido se arma solo)
- Precios en USD (ilustrativos)

## Editar

Todo el contenido editable está en `js/data.js`: nombre del negocio, número de
WhatsApp, marcas, categorías, productos y precios.

## Ver local

```bash
cd my-motors-supplies
python3 -m http.server 8000
# abrir http://localhost:8000
```
