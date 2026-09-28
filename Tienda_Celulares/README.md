# MobiWire — Tienda de Celulares

Proyecto front-end (HTML + CSS + Bootstrap 5 + JavaScript) basado en el mockup:
header con buscador, hero, categorías populares, destacados, beneficios,
newsletter y footer. Todo funcional, con paleta de marca e imágenes locales.

## Paleta de colores

| Rol | Nombre | Hex | Uso |
|-----|--------|-----|-----|
| Primario | Índigo | `#4F46E5` | Logo, botones, links activos, precios |
| Degradado | Violeta | `#7C3AED` | Hero, botón agregar, avatar |
| Acento | Cian | `#06B6D4` | Iconos, buscador pill, beneficios, focos |
| Ofertas | Ámbar | `#F59E0B` | Badge `-15%`, chip ofertas, estrellas |
| Éxito | Verde | `#10B981` | En stock, envío gratis, pedido confirmado |
| Alerta | Rojo | `#EF4444` | Poco stock, errores, favoritos |
| Texto | Tinta | `#0F172A` | Texto, footer y newsletter oscuros |
| Fondo | Gris claro | `#F1F5F9` | Fondo de página |

Variables en `:root` de `mobiwire/css/styles.css` (la paleta vive solo en el
código/CSS, no se muestra como sección en la página).

## Estructura

```text
Tienda_Celulares/
├── README.md
└── mobiwire/
    ├── index.html     <- layout + hero con foto + toolbar + modales + footer
    ├── css/styles.css <- paleta, componentes, responsive
    ├── js/
    │   ├── data.js    <- CATEGORIES, PRODUCTS (img local + web, precio, rating, specs), HERO_IMG
    │   ├── cart.js    <- carrito + localStorage
    │   └── app.js     <- render, filtros, favoritos, modales, checkout
    └── assets/img/    <- 9 fotos locales (Unsplash, licencia libre)
        ├── hero-phones.jpg, iphone-15.jpg, iphone-14.jpg
        ├── galaxy-s24.jpg, galaxy-a54.jpg, redmi-note-13.jpg
        └── moto-g84.jpg, pixel-8.jpg, poco-x6.jpg
```

Créditos de fotos: Unsplash (uso libre). Cada producto guarda `img` local y
`web` de respaldo: si el archivo local falla, el JS cambia automáticamente a
la URL web (`onerror`), así las imágenes siempre cargan.


## Navegación (cada item muestra lo que dice)

| Item | Acción |
|------|--------|
| Inicio | Limpia filtros y sube al hero |
| Celulares | Muestra los 8 celulares y baja al catálogo |
| Categorías | Baja a las 4 categorías (Apple, Samsung, Xiaomi, Gama Alta, cada una filtra) |
| Ofertas | Filtra solo ofertas (`-11%` a `-17%`) con badge y baja al catálogo |

## Todo lo funcional

- Búsqueda en vivo sincronizada (3 buscadores) por marca, modelo y specs.
- Filtro por categoría con foto, chip Todos / Solo ofertas / Favoritos.
- Ordenar por relevancia, menor/mayor precio y calificación.
- “Ver Ofertas” (hero) filtra con badge; “Ver Catálogo Completo (8)” expande/colapsa.
- Tarjetas con foto, descuento `-15%`, precio anterior tachado, rating ★ y stock.
- Detalle en modal con foto, specs, cantidad (tope = stock) y agregar.
- Favoritos (corazón) con contador y persistencia en `localStorage`.
- Carrito drawer: +/−, quitar, vaciar, subtotal, envío ($12.000, gratis > $500.000),
  total, contador, persistencia y toast.
- Checkout en modal con validación (nombre, email, dirección) y N° de pedido.
- Newsletter validado, links del footer que filtran o muestran info con toast,
  año dinámico, estado vacío de búsqueda, imagen hero con fallback.
