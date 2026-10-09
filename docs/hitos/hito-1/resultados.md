---
slug: resultados
hito: 1
estado: approved
aprobada: 2026-10-08
creada: 2026-10-08
---

# Resultados: lista deslizable ⇄ mapa

> `/propiedades`: las propiedades de la búsqueda, **de a una tarjeta grande que se desliza**
> o **en el mapa**, con un selector para pasar de una vista a la otra sin perder cuál se
> estaba mirando. Una hoja de filtros para ajustar sin volver al buscador. Depende de
> `buscador-guiado` (campos compartidos) y `modelo-de-busqueda`.

## Problema

- Hoy `/propiedades` es un mapa a pantalla completa con una barra de seis popovers abajo y
  una tira de tarjetas chicas: en el celu compiten mapa, filtros y tarjetas por la misma
  pantalla, y las tarjetas son chicas para decidir.
- En tandilprop las propiedades son una lista vertical (para ver 20 hay que bajar 20
  pantallas) y el mapa es otra página, con los filtros tapando la primera pantalla.
- El mapa usa tiles de Carto sin API key, fuera de sus términos desde el 29/09/2026.

## Objetivo

En el celular, los resultados entran en **una pantalla**: arriba qué se está viendo y cuántas
son; abajo **una tarjeta grande por vez** que se pasa deslizando. Un toque en **Mapa** muestra
las mismas propiedades como precios sobre el mapa de Bolívar; tocar uno abre su tarjeta
flotante con **"Ver detalles"**. La propiedad que se está mirando es la misma en las dos
vistas y sobrevive a ir a la ficha y volver.

## Historias de usuario

- Como **quien busca**, quiero pasar de una propiedad a la otra con el pulgar, viendo foto,
  precio y lo esencial, para descartar rápido.
- Como **quien busca**, quiero ver dónde queda cada propiedad respecto del centro, de la
  escuela o de mi trabajo, para decidir si me sirve la zona.
- Como **quien busca**, quiero cambiar un filtro (por ejemplo, el precio) sin rehacer todo el
  recorrido.
- Como **quien busca**, quiero volver de una ficha y seguir desde la misma propiedad, no desde
  la primera.
- Como **quien busca y no encontró nada**, quiero saber qué filtro sacar para que aparezcan
  propiedades.

## Pantallas

### Vista lista (por defecto)

```
┌────────────────────────────────────┐
│ ▣ bolívar inmo                 ☰  │ header (56)
├────────────────────────────────────┤
│ Casas en venta en Centro           │ h1: tituloDeBusqueda, 20 px, hasta 2 líneas
│ 12 propiedades                     │ 14 px, tinta-suave
│ ┌───────────┬───────────┐ ┌──────┐ │
│ │ ▤ Lista ● │  ◎ Mapa   │ │⚙ 2  │ │ selector (segmentado) + Filtros con badge (44)
│ └───────────┴───────────┘ └──────┘ │
│ ┌──────────────────────────────┐┌─ │
│ │┌────────────────────────────┐││  │ tarjeta: ancho − 48 px, asoma la siguiente
│ ││ VENTA                      │││  │ etiqueta "cartel"
│ ││                            │││  │
│ ││‹          foto 4:3        ›│││  │ flechas de foto (44 de área)
│ ││                       1/8  │││  │
│ │└────────────────────────────┘││  │
│ │ US$ 120.000                  ││  │ 24 px semi condensada, tabular
│ │ Casa en Centro               ││  │ 16 px semibold
│ │ Belgrano 450                 ││  │ 14 px tinta-suave (o nada si no se muestra)
│ │ ⬚ 180 m² · ⌸ 3 dorm. · ⛆ 2   ││  │ datos con ícono; los que faltan no van
│ │ ◫ Inmob. Norte   Ver detalles›│  │ logo 24 + nombre · link
│ └──────────────────────────────┘└─ │
│        ‹    3 de 12    ›           │ contador + flechas (44)
└────────────────────────────────────┘
```

- **Deslizar en horizontal** pasa de propiedad (scroll-snap, una por vez, sin saltear). Las
  **flechas de abajo** hacen lo mismo (teclado, escritorio, accesibilidad).
- **Las fotos de una tarjeta se pasan con sus flechas**, no deslizando (deslizar ya significa
  "otra propiedad"). Contador "1/8". La primera foto carga con la tarjeta; las demás, al tocar
  la flecha (la siguiente se precarga).
- **Tocar la tarjeta** (foto o texto) o "Ver detalles" va a la ficha. Es un `<a>`.
- **Al final** hay una tarjeta "Viste las 12" con "Probá ampliando:" (las sugerencias de sacar
  filtros, con conteo) y "Ver en el mapa".
- A **360 × 640** se ve una tarjeta entera (foto, precio y "Ver detalles") sin scroll vertical.
- Sin foto: el fondo `papel` con el ícono del tipo. "Consultar precio" cuando `price` es
  `null`. Con expensas: "+ $ 45.000 expensas" chico al lado del precio.

### Vista mapa

```
┌────────────────────────────────────┐
│ ▣ bolívar inmo                 ☰  │
├────────────────────────────────────┤
│ Casas en venta en Centro           │
│ 12 propiedades                     │
│ [ ▤ Lista │ ◎ Mapa ● ]   [⚙ 2]     │
│┌──────────────────────────────────┐│
││         (US$ 95k)            [+] ││ mapa al resto del alto; zoom +/− arriba a la derecha
││  (US$ 120k)●                 [−] ││ pin elegido: fondo plano-700, letra blanca, encima
││                (US$ 80k)         ││
││     (US$ 210k)      (⌂)          ││ "Consultar precio" → pin con el ícono del tipo
││┌────────────────────────────────┐││
│││▣▣▣  US$ 120.000                │││ tarjeta flotante (aparece al tocar un pin)
│││▣▣▣  Casa en Centro             │││ foto 96 × 96, datos, se desliza ← → entre
│││▣▣▣  180 m² · 3 dorm.           │││ propiedades y el mapa la sigue
│││     [      Ver detalles      ] │││
││└────────────────────────────────┘││
││ © OpenStreetMap · OpenFreeMap    ││ atribución, siempre visible
│└──────────────────────────────────┘│
└────────────────────────────────────┘
```

- **Cámara inicial**: encuadra todos los resultados (con margen); si hay `sel`, centra esa
  propiedad con su tarjeta abierta. Sin resultados: el centro de Bolívar. **Mapa plano**
  (sin inclinación ni rotación).
- **Pines**: precio compacto ("US$ 120k", "$ 450k"). Cuando el mapa está muy alejado (zoom <
  13,5, por ejemplo si hay propiedades en localidades), los pines pasan a **puntos** de 10 px,
  salvo el elegido. Sin detección de choques: una regla simple y previsible.
- **Tocar un pin** → se elige, el mapa se corre para que el pin quede **arriba** de la
  tarjeta, y aparece la tarjeta flotante.
- **Deslizar la tarjeta flotante** → pasa a la propiedad anterior/siguiente (el orden de la
  lista) y el mapa vuela a su pin.
- **Tocar el mapa vacío** → se deselecciona y la tarjeta baja.
- La tarjeta flotante **no tapa la atribución** ni los botones de zoom.
- Con JS apagado, la vista mapa muestra "El mapa necesita JavaScript" y un link a la lista.

### El selector Lista / Mapa y la propiedad elegida

- Cambiar de vista **no recarga** la página ni pide nada al servidor.
- La propiedad que se está mirando (`sel`) es **la misma en las dos vistas**: si estoy en la
  tarjeta 3 de la lista y toco Mapa, el mapa abre con la propiedad 3 elegida; si deslizo la
  tarjeta flotante hasta la 5 y vuelvo a Lista, la lista está en la 5.
- `vista` y `sel` se escriben en la URL (con `replaceState`, sin sumar entradas al historial):
  compartir el link abre lo mismo; ir a la ficha y volver deja todo donde estaba.

### Hoja de filtros

```
┌────────────────────────────────────┐
│              ───                   │ asa (se cierra deslizando hacia abajo)
│ Filtros                 Limpiar    │
├────────────────────────────────────┤
│ Quiero                             │
│ [Comprar ●][Alquilar][Temporario]  │ operación (segmentado)
│ Tipo                               │
│ (Casa ✓)(Departamento)(Quinta ✓)…  │ CampoTipos, variante compacta (chips)
│ Zona                               │
│ (Todo Bolívar)(Centro ✓)(Casariego)│ CampoZonas
│ Precio                             │ CampoPrecio
│ Dormitorios · Baños                │ CampoAmbientes
│ Que tenga                          │ CampoCaracteristicas
│ Ordenar por                        │
│ (● Más recientes)(Menor precio)    │ radio
│ (Mayor precio)                     │
├────────────────────────────────────┤
│ ┌────────────────────────────────┐ │
│ │       Ver 9 propiedades        │ │ conteo en vivo; aplica y cierra
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

- Sube desde abajo hasta el 92 % del alto; el contenido se desplaza adentro; el botón queda
  fijo abajo.
- **Los mismos campos que los pasos del buscador** (componentes compartidos).
- Cambiar la operación saca los tipos y características que no aplican.
- **"Ver N propiedades"** aplica (navega a la URL nueva) y cierra. **Cerrar sin aplicar**
  (asa, ✕, tocar afuera) descarta los cambios.
- El badge del botón Filtros es `filtrosActivos` (todo menos la operación).
- Sin JS, "Filtros" es un link al paso 2 del buscador con la búsqueda actual.

### Sin resultados

```
│ Casas en venta en Centro           │
│ 0 propiedades                      │
│                                    │
│ No hay casas en venta en Centro    │
│ con esos filtros.                  │
│ Probá sacando:                     │
│ (Pileta ✕ · 4) (2+ dorm. ✕ · 3)    │ sugerenciasSinResultados
│ Ver todas las propiedades en venta›│
```

### Escritorio (≥ 1024 px)

Dos columnas: a la izquierda (480 px) el título, los controles y las tarjetas en **grilla de
dos columnas que se baja**; a la derecha el **mapa fijo**, siempre visible (sin selector).
Pasar el mouse por una tarjeta resalta su pin; tocar un pin lleva la lista a su tarjeta.
La hoja de filtros entra desde la derecha. Entre 600 y 1023 px: la vista del celular con dos
tarjetas visibles en el carrusel.

## Alcance

**Entra:** todo lo de arriba; pasar los tiles a OpenFreeMap con un estilo propio; metadata de
la página (título, canónica, `noindex` para combinaciones raras); el `loading` y el `error` de
la ruta; "Recién publicadas" en el inicio (reusa la tarjeta).

**No entra:** "buscar en esta zona" al mover el mapa (pendiente ⚪ en el hito 2); ubicarme
(GPS); favoritos; clustering ([descartado](../../roadmap/descartado.md) hasta ~150 avisos);
PMTiles propio (hito 3); modo oscuro del mapa.

## Criterios de aceptación

- [ ] A **360 × 640**, en vista lista, se ve una tarjeta entera (foto, precio, "Ver detalles")
      sin scroll vertical, y asoma el borde de la siguiente.
- [ ] Deslizar (y las flechas) pasa de a una propiedad; el contador dice "n de N".
- [ ] Las flechas de la foto cambian de foto **sin** cambiar de propiedad.
- [ ] En la tarjeta 3 → Mapa: el mapa abre con la propiedad 3 elegida y su tarjeta flotante.
      Deslizar la flotante a la 5 → Lista: la lista está en la 5.
- [ ] Tarjeta 3 → Ver detalles → atrás del navegador: la lista está en la tarjeta 3.
- [ ] La URL con `vista=mapa&sel=<id>` pegada en otra pestaña abre el mapa con esa propiedad elegida.
- [ ] Tocar el mapa vacío cierra la tarjeta flotante.
- [ ] La atribución de OpenStreetMap se ve siempre, también con la tarjeta flotante abierta.
- [ ] Ningún request a `cartocdn.com` (e2e escucha la red).
- [ ] La hoja de filtros: cambiar algo actualiza "Ver N" sin navegar; aplicar navega a la URL
      canónica; cerrar sin aplicar no cambia nada.
- [ ] Sin resultados: se ven las sugerencias y tocar una lleva a una búsqueda con resultados.
- [ ] MapLibre **no** está en el JS de `/propiedades` en vista lista (se carga al abrir el mapa).
- [ ] Lighthouse mobile Performance ≥ 90 en `/propiedades` (lista).
- [ ] En escritorio: lista + mapa a la vez; hover resalta el pin.
- [ ] Ningún scroll horizontal de la página a 360 px (el del carrusel es interno).
- [ ] 👀 Manuel recorrió lista, mapa y filtros en su celular.

## Riesgos

- **Gestos que compiten** (carrusel horizontal, mapa, hoja que se cierra deslizando): la tira
  flotante del mapa **no** es un Drawer; dentro de la hoja, lo que desliza en horizontal lleva
  `data-base-ui-swipe-ignore` (ver `riesgos.md` § Gotchas).
- **OpenFreeMap caído**: el mapa queda en blanco con los pines igual (son HTML); la lista anda.
  Se anota; la solución definitiva es el PMTiles propio (hito 3).
- **WebGL en el e2e headless**: Chromium headless usa SwiftShader. Los pines son DOM y se
  pueden tocar aunque los tiles no carguen; el e2e bloquea los tiles para no depender de la red
  (🔎 verificar que el evento `load` del mapa igual se dispara).
- **iOS y scroll-snap**: `scroll-snap-stop: always` y probar en el proyecto `iphone` (WebKit).

## Preguntas abiertas

- ¿El orden por defecto es "más recientes"? Alternativa: destacadas primero. *(Default:
  recientes; las destacadas solo llevan su etiqueta.)*

---

## Plan técnico

### Enfoque

La página es **server**: lee la búsqueda (con `vista` y `sel`), filtra y ordena con
`src/lib/busqueda`, y pasa a un único componente cliente (`ResultadosCliente`) **solo los
datos de tarjeta** (proyección `aTarjeta`) y el índice para la hoja de filtros. El cliente
maneja `vista` y `sel` en estado local y los refleja con `window.history.replaceState` (Next
16 lo sincroniza con el router). El carrusel es **CSS scroll-snap** con un
`IntersectionObserver` que informa la tarjeta activa. El mapa es el `PropertyMap` actual
reescrito: **estilo propio en `public/mapa/estilo.json`** sobre los tiles de OpenFreeMap, plano,
y una **tira flotante** (otro carrusel scroll-snap, compacto) sincronizada con los pines. Los
filtros navegan con `router.push(escribirBusqueda(b))`.

### Archivos

| Archivo | Qué |
|---|---|
| `src/app/propiedades/page.tsx` | Reemplaza el andamio. `await searchParams` → `leerBusqueda(sp, { conVista: true })`; `getProperties()`; `ordenarPropiedades(filtrarPropiedades(…))`; `sugerenciasSinResultados` si da 0; `generateMetadata` (título, canónica sin `vista`/`sel`, `robots` según `esIndexable`) |
| `src/app/propiedades/loading.tsx`, `error.tsx` | Esqueleto (título + tarjeta) y error con el shell nuevo |
| `src/lib/properties/tarjeta.ts` (+ test) | `aTarjeta(p)`: id, operación, tipo, zona, precio, moneda, expensas, dirección visible, datos clave, hasta 8 fotos, agencia (nombre + logo), lat/lng |
| `src/lib/busqueda/indexable.ts` (+ test) | `esIndexable(b)`: operación + ≤ 1 tipo + ≤ 1 zona y nada más → `index`; si no, `noindex` |
| `src/components/resultados/encabezado.tsx` | h1 + conteo (server) |
| `src/components/resultados/resultados-cliente.tsx` | `"use client"`: estado `vista`/`sel`, `replaceState`, barra de controles, carrusel o mapa, hoja de filtros |
| `src/components/resultados/selector-de-vista.tsx` | Segmentado Lista / Mapa. Son dos `<a href="?…vista=…">` (sin JS navegan); con JS, `preventDefault` + estado |
| `src/components/resultados/carrusel.tsx` | Contenedor scroll-snap, contador "n de N", flechas, restaurar `sel` al montar (sin animación), tarjeta final |
| `src/hooks/use-slide-activo.ts` | `IntersectionObserver` (umbral 0,6) → índice activo; `irA(i)` con `scrollIntoView` |
| `src/components/resultados/tarjeta-propiedad.tsx` | Variantes `grande` (carrusel), `flotante` (mapa), `chica` (inicio, similares). Patrón *stretched link*: el `<a>` cubre la tarjeta y las flechas de foto quedan encima |
| `src/components/resultados/fotos-de-tarjeta.tsx` | `"use client"`: flechas, contador, precarga de la siguiente; `next/image` con `sizes` |
| `src/components/resultados/fin-de-resultados.tsx`, `sin-resultados.tsx` | Tarjeta final y estado vacío con sugerencias |
| `src/components/resultados/vista-mapa.tsx` | `"use client"`: `next/dynamic` del mapa + `TiraFlotante`; precarga del chunk con `requestIdleCallback` cuando la lista ya se ve |
| `src/components/resultados/tira-flotante.tsx` | Carrusel compacto de tarjetas `flotante`, sincronizado con `sel` |
| `src/components/resultados/hoja-de-filtros.tsx` | `"use client"`: `Drawer` de Base UI (snap 92 %), campos compartidos en variante compacta, orden, conteo en vivo con el índice, aplicar = `router.push` |
| `src/components/map/property-map.tsx` | Reescrito: estilo `/mapa/estilo.json`, `pitch: 0`, `bearing: 0`, sin el buscador de calles, props `{ propiedades, seleccionada, onSeleccionar, onDeseleccionar, margenInferior }`; pines con `markers.ts`; regla de puntos con zoom < 13,5; `AttributionControl` compacto abajo; `NavigationControl` sin brújula |
| `src/components/map/property-map-dynamic.tsx` | Esqueleto del mapa con los tokens nuevos |
| `src/app/globals.css` | `.map-pin*` re-vestidos con los tokens; se borran `.map-street-pill` y `.map-pin-preview` |
| `public/mapa/estilo.json` | El estilo `positron` de OpenFreeMap (`https://tiles.openfreemap.org/styles/positron`, verificado que responde el 2026-10-08) descargado y recoloreado con la paleta (agua, parques, calles, etiquetas en `tinta-suave`); `sources` siguen apuntando a OpenFreeMap; `glyphs` y `sprite` a OpenFreeMap |
| `src/components/inicio/recien-publicadas.tsx` + `src/app/page.tsx` | Fila de tarjetas `chica` (las 8 más recientes) debajo del pliegue del inicio |
| `e2e/resultados.spec.ts`, `e2e/mapa.spec.ts` | Los criterios de aceptación |

**Se borran**: el andamio de `/propiedades`; los estilos y el código del buscador de calles en
el mapa (la API `/api/streets` y `src/lib/streets.ts` quedan; ver hito 2).

### Datos

Ninguno nuevo. Al cliente viajan solo las tarjetas (no la descripción ni todas las fotos).

### Tests (TDD)

1. `tarjeta.test.ts`: proyecta lo justo; respeta `showAddress`; recorta a 8 fotos.
2. `indexable.test.ts`: los casos de la regla.
3. `markers.test.ts` (existente): sigue en verde con los campos nuevos; se suma `deselect` al
   tocar el mapa si no estaba.
4. E2E `resultados.spec.ts` (`android-chico`, `iphone`, `escritorio`): pliegue a 360 × 640;
   deslizar y flechas; flechas de foto; ida y vuelta a la ficha conserva la tarjeta; hoja de
   filtros (conteo en vivo, aplicar, descartar); vacío con sugerencias; sin scroll horizontal.
5. E2E `mapa.spec.ts`: tiles bloqueados con `page.route`; lista 3 → mapa con 3 elegida; tocar
   pin; deslizar la flotante cambia `sel`; tocar vacío deselecciona; atribución visible;
   ningún request a `cartocdn.com`; el chunk de MapLibre no se pide en vista lista.

### Riesgos

- `replaceState` muy seguido (cada tarjeta) puede trabar en Safari: se escribe con un debounce
  de 300 ms.
- Restaurar `sel` con `scrollIntoView` antes de que carguen las imágenes puede quedar corrido:
  las tarjetas tienen alto fijo (relación de aspecto reservada), así no se mueven al cargar.

### Alternativas consideradas

- **Carto con API key**: gratis hasta 1 M de tiles/mes con uso comercial, y pueden bloquear sin
  aviso ([descartado](../../roadmap/descartado.md)).
- **Mapbox / Google Maps**: pagos por carga de mapa y con key en el cliente.
- **Tarjeta flotante como Drawer**: compite con los gestos del mapa; una tira propia es más
  simple y predecible.
- **Filtros que navegan al tocar cada control**: cada toque recarga resultados detrás de la
  hoja; se prefirió "Ver N" explícito con conteo en vivo.

## Tareas

**Bloque 1 — Encabezado, tarjeta y carrusel** · commit "Resultados: tarjeta grande y carrusel deslizable"
- [ ] `tarjeta.test.ts` → `tarjeta.ts`; `indexable.test.ts` → `indexable.ts`.
- [ ] `page.tsx` (reemplaza el andamio) + `generateMetadata`; `loading.tsx`, `error.tsx`.
- [ ] `encabezado.tsx`, `tarjeta-propiedad.tsx` (variante `grande`), `fotos-de-tarjeta.tsx`.
- [ ] `use-slide-activo.ts`, `carrusel.tsx`, `fin-de-resultados.tsx`.
- [ ] E2E: pliegue, deslizar, flechas, fotos.
- [ ] Gates + `pnpm e2e`.

**Bloque 2 — Vista y selección en la URL** · commit "Resultados: selector Lista/Mapa y propiedad elegida en la URL"
- [ ] `resultados-cliente.tsx` con `vista`/`sel` y `replaceState` (debounce 300 ms).
- [ ] `selector-de-vista.tsx` (links que JS intercepta).
- [ ] Restaurar `sel` al volver de la ficha.
- [ ] E2E: ida y vuelta a la ficha; URL compartida.
- [ ] Gates + `pnpm e2e`.

**Bloque 3 — Mapa** · commit "Mapa: OpenFreeMap con estilo propio, plano, pines y tarjeta flotante"
- [ ] Descargar `positron` de OpenFreeMap a `public/mapa/estilo.json` y recolorearlo; revisar la atribución que exige.
- [ ] Reescribir `property-map.tsx` (estilo, plano, props, regla de puntos, controles) y `markers.ts` si hace falta (tests primero).
- [ ] `vista-mapa.tsx` (carga dinámica + precarga en idle), `tira-flotante.tsx`, variante `flotante` de la tarjeta.
- [ ] `globals.css`: pines con tokens nuevos; borrar estilos del buscador de calles.
- [ ] E2E `mapa.spec.ts`.
- [ ] `grep -rn cartocdn src public` sin resultados.
- [ ] Gates + `pnpm e2e`.

**Bloque 4 — Hoja de filtros** · commit "Resultados: hoja de filtros con conteo en vivo"
- [x] `hoja-de-filtros.tsx` con los campos compartidos (variante compacta), operación y orden.
      El conteo en vivo sale de `useBusquedaDelFormulario` (compartido con el buscador);
      "Todo Bolívar" es botón en la hoja (`CampoZonas modo="boton"`); cambiar la operación y
      "Limpiar" rearman el formulario.
- [x] Sin JS: "Filtros" es link al paso 2.
- [x] E2E de la hoja (`resultados.spec.ts`, `resultados-sin-js.spec.ts`).
- [x] Gates + `pnpm e2e`.

**Bloque 5 — Vacío y escritorio** · commit "Resultados: estado vacío con sugerencias y vista de escritorio"
- [x] `sin-resultados.tsx` (lista y mapa: sin resultados no hay selector Lista / Mapa).
- [x] Escritorio: dos columnas, grilla, mapa fijo, hover ↔ pin. 600–1023 px: dos tarjetas visibles.
- [x] E2E: vacío; escritorio (y la hoja de filtros corre también en escritorio).
- [x] Gates + `pnpm e2e`.

**Bloque 6 — Recién publicadas en el inicio** · ➜ **pasó a [`inicio-y-pie.md`](inicio-y-pie.md)** (pedido de Manuel: el inicio entero con más contenido)
- [ ] Variante `chica` de la tarjeta; `recien-publicadas.tsx` debajo del pliegue de `/`.
- [ ] Gates + `pnpm e2e` (el pliegue del inicio sigue igual).

**Bloque 7 — Mirar** · sin commit si no hay cambios
- [x] Capturas a 360 × 640, 390 × 844 y 1280 × 800 de lista, mapa con tarjeta, hoja y vacío.
- [x] Detector de Impeccable sobre `/propiedades` (lista y mapa): quedan dos reglas, explicadas
      abajo (falso positivo y excepción de la spec).
- [x] Lighthouse mobile sobre `/propiedades` (≥ 90) y verificar que MapLibre no está en la carga inicial.
- [ ] 👀 Manuel recorre lista, mapa y filtros en su celular.

**Cierre**
- [ ] `riesgos.md`: sacar la fila de Carto de "Fechas que vencen" (ya no aplica).
- [ ] `/cerrar resultados`.

## Lo que se encontró al implementar

- **2026-10-08, pedido de Manuel**: los resultados son siempre el mapa. No hay lista ni botón
  Mapa. La tira de abajo es la tarjeta flotante de siempre; deslizarla no cambia la elegida.
  El conteo queda a la izquierda y Filtros a la derecha. En escritorio la hoja entra desde la
  derecha, como el menú. No hay polígonos de barrio: marcar Las Flores filtra los pines, no
  pinta la zona. El rango de precio se aplica al soltar. Elegir una tarjeta o su pin la mueve
  al principio. En escritorio queda a la izquierda, fuera del scroll, con una sola foto un
  poco más grande; el resto pasa al lado con el mismo ancho. En el celular no se agranda:
  la tira salta hasta esa propiedad. A la ficha se entra con Ver detalles.
  En escritorio la rueda sobre la tira la desplaza. El chip elegido no se rellena: lleva un
  punto. Limpiar es un botón con ícono.
- **Mapa**: Carto → OpenFreeMap con estilo propio (`scripts/estilo-mapa.mjs`). Rotar e
  inclinar con dos dedos quedan habilitados (Manuel los pidió); arranca plano.
- **Volver de la ficha**: Next reconstruye la página con las props de la primera visita;
  `vista` y `sel` se leen de `window.location`, pero solo si la URL es de la misma búsqueda
  (tras `router.push` a otra búsqueda, el cliente nuevo renderiza antes de que cambie la URL).
  `ResultadosCliente` se keyea por la búsqueda canónica.
- **Escritorio**: la columna izquierda es `minmax(26rem, 40%)` con una tarjeta por fila hasta
  1279 px y `minmax(40rem, 48%)` con dos desde 1280 px (con 480 px fijos y dos columnas las
  tarjetas grandes quedaban de ~220 px). La elegida en el mapa se marca con un anillo y se trae
  a la vista; el mouse sobre una tarjeta resalta su pin (`.is-resaltado`).
- **Slide activo**: con dos por pantalla (tablet), el activo es el primero de los que se ven
  al 60 % (`useSlideActivo` lleva un conjunto, no el último que avisó).
- **Lighthouse** (build de producción, mobile): daba 87. Tres causas, tres arreglos: la
  precarga del mapa (274 KB) salía en el primer momento libre y competía con la carga → ahora
  espera 3 s; la foto LCP no tenía prioridad alta (`priority` está deprecado en Next 16) →
  `loading="eager"` + `fetchPriority="high"`; el navegador bajaba 5 fotos de tarjetas que no se
  ven → las lejanas se piden al acercarse (sin JS, `<noscript>`), y `sizes` decía 90vw cuando
  la tarjeta mide 100vw − 3rem. Queda **91** estable (4/4), 484 KB, TBT 30 ms, sin MapLibre;
  accesibilidad, buenas prácticas y SEO 100.
- **Detector de Impeccable**: `text-occlusion` sobre los carteles VENTA / Destacada es un
  falso positivo (llevan `pointer-events-none` encima del link estirado, así que
  `elementFromPoint` devuelve el link; se ven bien en las capturas). `first-viewport-column-
  overflow` en escritorio es la grilla que se baja con el mapa fijo, tal como pide la spec. No
  se agregaron ignores.
