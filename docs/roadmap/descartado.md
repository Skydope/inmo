# Descartado — Bolívar Inmo

> Lo que se evaluó y **no** se hace, con el porqué y qué lo reabriría. Leer antes de
> proponer algo que suene obvio.

| Fecha | Qué | Por qué no | Qué lo reabre |
|---|---|---|---|
| 2026-10-08 | **Animaciones llamativas**: GSAP, scroll animado, el hero día/noche (`HeroInteractive`), `CountUp`, `Reveal` | Pedido de Manuel: claro, simple, elegante, "sin fondos locos". En una herramienta para buscar, el movimiento distrae | Nada en el hito 1 |
| 2026-10-08 | **Navbar con Comprar/Alquilar + filtros en popovers** (la spec del 2026-10-07, archivada en `archivo/`) | La reemplaza el buscador guiado: una pregunta grande por pantalla es más clara en el celu que una barra de popovers | — |
| 2026-10-08 | **Carrusel con librería** (Embla, Swiper) | `scroll-snap` nativo hace lo mismo sin JS, con el gesto del sistema; el slide activo se lee con `IntersectionObserver` | Que haga falta algo que scroll-snap no pueda (loop infinito, por ejemplo) |
| 2026-10-08 | **`vaul`** para la hoja de filtros | Base UI ya trae `Drawer` con deslizar para cerrar y snap points (verificado en su doc, 2026-10-08) | — |
| 2026-10-08 | **Slider de precio de dos manijas** | A 360 px es impreciso con el dedo. Rangos sugeridos (calculados de los datos) + mínimo/máximo escritos resuelven mejor | Que Manuel lo pida después de probar los rangos |
| 2026-10-08 | **Convertir pesos ⇄ dólares** | El tipo de cambio es variable y cualquier conversión es una opinión. Se filtra en la moneda publicada | Nunca para el filtro; quizás como dato informativo en la ficha |
| 2026-10-08 | **Modo oscuro en el hito 1** | Duplica la verificación visual y el mapa necesita otro estilo. El hito 1 es claro. Los tokens se arman para que sumarlo después sea remapear | Que Manuel lo pida (pendiente ⚪ en el hito 2) |
| 2026-10-08 | **Clustering de pines** | Con decenas de avisos no hace falta, y agrupa justo cuando uno quiere ver precios | Más de ~150 avisos en pantalla (ver `riesgos.md`) |
| 2026-10-08 | **Mapa inclinado en 3D** (pitch 48 actual) | Pide más tiles (más lento, más consumo) y en el celu se lee peor. Mapa plano | — |
| 2026-10-08 | **Mapa en otra página** (como tandilprop `/ver-por-mapa`) | El mapa es otra forma de ver **los mismos resultados**: vive en `/propiedades` con un selector Lista / Mapa y comparte filtros y selección | — |
| 2026-10-08 | **Lista vertical infinita** como vista principal | Manuel pidió ver propiedades deslizando, sin bajar hasta el fondo. En escritorio sí hay grilla | Que el uso real muestre que la gente prefiere bajar |
| 2026-10-08 | **Buscar por calle** en el front del hito 1 | No está en el recorrido que pidió Manuel (operación → tipo → zona → detalles). La API y `streets.ts` quedan | Que las inmobiliarias o la gente lo pidan (pendiente ⚪ en el hito 2) |
| 2026-10-08 | **Carto basemaps** | Desde el 29/09/2026 exigen API key; uso comercial gratis solo hasta 1 M de tiles/mes y pueden bloquear sin aviso | Nada: hay alternativas sin key (OpenFreeMap, PMTiles propio) |
| 2026-10-08 | **Magic UI, UI/UX Pro Max** | Descartados por la familia (sus efectos se reconocen como "hechos por IA"; el segundo degrada diseños). Ver `~/dev/clubdelcoctel/docs/hitos/hito-2/metodo-landing.md` | — |
| 2026-10-08 | **Cuenta para quien busca** (favoritos, alertas) en el hito 1 | Quien busca entra sin cuenta (`PRODUCT.md`). Favoritos sin cuenta (en el navegador) podría ir al hito 2 | Pedido de Manuel o de inmobiliarias |
