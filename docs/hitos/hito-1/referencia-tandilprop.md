# Referencia: tandilprop.com.ar

> Relevada el **2026-10-08** con Playwright a 390 × 844 (la que pasó Manuel: "hay que
> mejorarla mucho más; tiene que quedar más profesional"). Capturas en
> `docs/references/tandilprop/` (carpeta local, ignorada por git): `ref-tandil-home.png`,
> `ref-tandil-listado.png`, `ref-tandil-mapa.png`, `ref-tandil-ficha.png`. La comparación con
> lo que hacemos nosotros está en la [spec madre](README.md) § 3.

## Qué tiene

| Página | Ruta | Contenido |
|---|---|---|
| Inicio | `/` | Hero con foto aérea de la ciudad, "El portal inmobiliario de Tandil y la zona.", botones "Quiero comprar" / "Quiero alquilar", `<select>` de tipo (casa, departamento, local, lote, campo, otro), "Buscar". Debajo: "Explorá por categoría" (links con conteo: "Casas en venta en Tandil · 171 prop."), "Ingresos recientes" (carrusel con flechas), tarjetas |
| Categoría | `/venta/casa` | Migas, h1 "Casas en venta en Tandil", un párrafo con datos (cantidad, rango de dormitorios, precio mínimo, máximo y mediana, fecha de actualización, cuántas inmobiliarias publican), tarjetas una debajo de la otra |
| Mapa | `/ver-por-mapa` | Filtros apilados que ocupan la primera pantalla (dirección, USD/ARS, precio, apta crédito, checkboxes comprar/alquilar/temporario, más filtros), "Propiedades cerca de mí", el mapa abajo |
| Ficha | `/venta/casa/<slug>-<id>` | Aviso "¿Sos inmobiliaria? Sumate", volver, migas, h1, fecha de publicación, galería con video, precio, "Consultar" por WhatsApp, descargar ficha, compartir, inmobiliaria (logo, dirección, teléfono, matrícula), descripción, ficha técnica |

Tarjeta: foto con flechas y puntos, etiqueta de tipo, precio, operación, dirección, chips
(dormitorios, baños, cocheras, m²), logo y nombre de la inmobiliaria, "Ver detalle →".

## Ideas que quedan anotadas para después

- **Páginas por categoría con un párrafo de datos** (cantidad, mediana de precio, fecha): muy
  buenas para Google. → Hito 3, SEO.
- **"¿Sos inmobiliaria? Sumate"**: captación de inmobiliarias. → Hito 2.
- **Descargar ficha** (PDF): útil para imprimir o mandar. → ⚪ Hito 2.
- **Video en la galería**. → ⚪ cuando haya datos reales que lo tengan.
- **URLs con slug descriptivo** (`/venta/casa/3-ambientes-corrientes-45-tandil-1516`): mejor
  para Google que `/propiedades/bol-07`. → Hito 3, SEO.
