# Spec de alcance v1.1 — Portal inmobiliario Bolívar (front)

Estado: bases en alineación (visual + mapa congelados) · Fecha: 2026-09-30  
Stack front: Next.js + TS + Tailwind (+ shadcn para primitivos) — a scaffold post-OK  
Backend: **fuera de alcance** (socios). Front con datos mock / contratos stub.

Changelog v1.1 (2026-09-30):

- Filtros con URL-state, moneda ARS/USD como filtro segmentado.
- Sync listado ↔ mapa + state machine de markers.
- `type` en Property; seed ~10 variados; adapter `getProperties()` + constante `brandName`.
- Mapa: candidatos de estilo free, atribución © OSM obligatoria, dynamic import sin SSR.
- GPS: caso timeout + distancia en card.
- CTA contacto wa.me / tel / mailto (sin botones muertos).
- Matriz de estados por superficie.
- Visual: 01+03 como blueprint de UI a gran escala (inventario de componentes), 02 solo tipografía, 04 paleta nocturna dark-only; candidatas tipográficas.
- TDD: nuevas lógicas testeables + tooling (Vitest + Testing Library).

## 1. Producto

Portal inmobiliario **local para Bolívar, Buenos Aires** (análogo a ZonaProp, pero ciudad única).

- No hay filtro multi-ciudad en v1.
- Si el usuario está fuera de la zona, v1 puede mostrar un aviso soft o centrar el mapa en Bolívar; no es blocking.
- Matias dueño del **impacto visual** del front. Iconografía: placeholders ahora, seed real después.
- **Nombre de marca:** TBD — UI usa placeholder (`Bolívar` / `Inmo` temporal) hasta definición.

## 2. Metodología

### SDD (sí — apropiado)

Antes de features: este doc + decisiones visuales + contratos de UI (páginas, estados, eventos de mapa/GPS). Cualquier cambio de alcance se refleja acá primero.

### TDD (sí, selectivo)

| Área | TDD |
| --- | --- |
| Lógica de filtros y reglas currency/price, parseo de query y URL-state, expand/collapse de marker y sync listado↔mapa, geolocalización (success/deny/timeout/fallback), haversine y sort por distancia | **Sí** — tests unitarios primero |
| Componentes de presentación / CSS glass / layout | **No** — review visual + checklist manual |
| Integración con API real | Diferido hasta que existan contratos de backend |

Tooling: Vitest + Testing Library (mock de geolocation, URL-state con router mock). Lint y typecheck quedan definidos en el scaffold.

Regla: si hay branch de lógica, hay un test que falla antes del implement. Si es solo estética, no inventar tests cosméticos.

## 3. Fuera de alcance (v1)

- Auth, CRM, carga de avisos, pagos, chat real
- Backend, DB, CMS
- Multi-ciudad / SEO avanzado / PWA offline
- App nativa
- Light mode / toggle de tema (dark-only v1)
- Logo final (Matias; por ahora placeholder tipográfico / mark abstracto)

## 4. Feature v1 — “Portal llamativo + mapa + GPS”

### 4.1 Experiencia

1. **Landing / home** de alto impacto (tipografía brutalista, glass oscuro tipo iOS, foto arquitectura) + search segmentada sobre el hero.
2. **Exploración** listado + **mapa estilizado** free.
3. **GPS**: pedir ubicación → centrar/ordenar cercanos; fallback elegante si niega.
4. Markers: precio → expand (thumb o logo inmobiliaria + precio + specs) → detalle.
5. **Filtros** con URL como source of truth, deep-linkable.

### 4.2 Páginas / superficies

| Superficie | Responsabilidad |
| --- | --- |
| `/` | Hero + search segmentada (ref-03) que submitte a `/propiedades` con query params + CTA explorar / GPS |
| `/propiedades` | Split listado + mapa (desktop); toggle Map/Grid (mobile, param `view`); barra de filtros |
| `/propiedades/[id]` | Detalle mock (placeholders, specs, CTA contacto wa.me/tel) |

### 4.3 Datos mock (front-owned)

```ts
type Property = {
  id: string
  title: string
  type: "house" | "apartment" | "lot"
  price: number
  currency: "ARS" | "USD"
  operation: "sale" | "rent"
  beds: number
  baths: number
  areaM2: number
  address: string
  lat: number
  lng: number
  photoCount: number
  coverUrl: string // placeholder
  agency: { name: string; logoUrl: string; phone?: string }
}
```

~10 avisos seed en Bolívar (coords cercanas al centro), variados en operación / tipo / moneda / zona para que filtros y distancia sean demostrables.

El acceso es siempre vía adapter async `getProperties(): Promise<Property[]>` con latencia fake: el swap al backend de los socios es cambio de adapter, no refactor.  
`brandName` es constante única en el codebase: el rename de la marca TBD es 1 línea.

### 4.4 Mapa — **congelado**

- **MapLibre GL JS** + tiles/estilo **gratuitos**. Candidatos (abierto): OpenFreeMap / Carto dark / style JSON dark propio en repo.
- Motivo: gratis, muy skinnable, buena pinta (mejor que Leaflet stock para skin dark/champagne).
- **Atribución © OpenStreetMap** visible en esquina del mapa (requisito legal de tiles free, no estética).
- Render: dynamic import (sin SSR) con skeleton glass mientras cargan tiles.
- Skin **oscuro** alineado a marca (no mapa claro de las refs light).
- Marker colapsado: pill precio + acento champagne.
- Marker expandido: thumb/logo + operación + precio + specs + dirección.
- Controles: zoom, ubicarme (GPS).

### 4.5 GPS

- Botón “Cerca mío” en `/propiedades`.
- Success: center + sort por distancia client-side (haversine); distancia visible en card (“a 1,2 km de vos”).
- Deny / error / timeout (~8s): banner + mapa en centro Bolívar default.

### 4.6 Filtros y URL-state

La URL es source of truth en `/propiedades` (deep-linkable; la search del home submitte acá):

`/propiedades?op=sale|rent&type=house|apartment|lot&cur=ARS|USD&min=&max=&beds=&sort=&view=map|grid`

| Filtro | Comportamiento |
| --- | --- |
| `op` | venta / alquiler / todos |
| `type` | casa / depto / lote / todos |
| `cur` | segmentado `[Todos \| ARS \| USD]` |
| `min` / `max` | precio; habilitados solo con `cur` en moneda única (evita rango ambiguo entre monedas) |
| `beds` | mínimos dormitorios |
| `sort` | recientes / precio-asc / precio-desc (solo con moneda única) / distancia (solo con GPS activo) |
| `view` | `map` / `grid` — el toggle mobile es este param |

- 0 resultados: estado con CTA “limpiar filtros”.
- Cards muestran label de moneda siempre, independiente del filtro.

### 4.7 Sync listado ↔ mapa y state machine de markers

- Hover/select de card ↔ highlight de marker: bidireccional, selección única.
- Un solo marker expandido a la vez; click afuera o Esc cierra.
- Pills superpuestas: seleccionado al frente; **sin clustering en v1** (≤12 seeds).
- Click en marker expande y selecciona su card en el listado (scroll into view en desktop).

### 4.8 CTA contacto (sin backend)

- En card y detalle: `wa.me/<phone>` si hay `agency.phone`; sino `tel:`; sino mailto.
- Ningún botón muerto en v1.

### 4.9 Matriz de estados

| Superficie | Estados |
| --- | --- |
| `/propiedades` | Tiles cargando (skeleton glass) · 0 resultados (CTA limpiar) · GPS deny/timeout (banner) |
| Card / detalle | `coverUrl` rota → fallback gradient + icono |
| `/` | Search sin match → 0 resultados en `/propiedades` |
| Todas | Latencia fake del adapter (no hay loading de red real) |

## 5. Dirección visual — **congelada (armónica)**

Referencias en `docs/references/`:

| Archivo | Rol |
| --- | --- |
| `ref-01-housi-map-list.png` | Blueprint UI: split, cards, markers, sort, toggle |
| `ref-02-planetvision-hero.png` | Solo tipografía: peso black/condensado (no UI light, no paleta) |
| `ref-03-glass-catalog.png` | Blueprint UI: nav glass, search segmentada, catálogo, itálica de acento |
| `ref-04-brand-palette.png` | **Paleta nocturna única** (charcoal + champagne) |

### Jerarquía v1.1

- **ref-01 + ref-03 = blueprint de UI a gran escala**: estructura, componentes, radios y densidad. No es inspiración: los bloques se copian re-tinteados.
- **ref-02 = solo tipografía**: peso tipográfico brutalista black/condensado en hero y números grandes.
- **ref-04 = paleta nocturna única**: charcoal + champagne. **Dark-only en v1** (el toggle light/dark de ref-02 no se implementa).

### Inventario de componentes (bloque → ref → superficie)

| Bloque | Ref | Superficie |
| --- | --- | --- |
| Nav glass + tabs pill centrados | 03 | Todas |
| Search segmentada sobre hero (ubicación / precio / ambientes / tipo + CTA) | 03 | `/` |
| Fila featured + load more + stats row (calculada del seed) | 03 | `/` |
| Split listado + mapa con controles flotantes | 01 | `/propiedades` |
| Anatomía de card: cover + badge foto count, chip agencia con logo y phone sobre foto, precio + specs con iconos | 01 | `/propiedades`, detalle |
| Pills de precio + card expandida sobre mapa | 01 | `/propiedades` |
| Sort dropdown + toggle Map/Grid | 01 | `/propiedades` |

Regla de re-tinte innegociable: todo lo que venga de 01/03 llega en charcoal / glass oscuro. Si un bloque exige fondo blanco, se traduce a charcoal elevado, nunca blanco literal. “Escala grande” = estructura y componentes, no fondos claros.

### Tipografía

- Display: grotesca black condensada — candidatas `Archivo Black` / `Anton` (hero, números grandes, precios).
- Itálica de acento: serif itálica rescatada de ref-03 — candidata `Instrument Serif` italic (contraste luxury contra la black).
- UI sans: **no Inter** — candidatas `Manrope` / `Geist` / `Satoshi`.
- Elección final: abierta (Matias), candidatas congeladas.

### Tokens (borrador)

```css
--bg: #1a1a1a;          /* charcoal matte */
--bg-elevated: #262626; /* un pelo más alto: separación de capas en dark */
--fg: #f3efe6;          /* warm off-white */
--accent: #c4a574;      /* champagne / tan-gold */
--accent-muted: #a8906a;
--glass: rgba(255, 255, 255, 0.06);
--glass-border: rgba(255, 255, 255, 0.12);
--danger/success: usar solo semántica UI, no marca
```

Glass iOS **oscuro**: `backdrop-filter: blur` + fill bajo + borde champagne sutil.  
En dark a gran escala, la separación entre capas se apoya más en `--glass-border` champagne que en el delta de fondos.  
Skin del mapa con los mismos tokens (calles/labels en gris champagne).  
Iconos: placeholders; seed de Matias después.  
Logo: TBD — wordmark temporal + mark abstracto opcional inspirado en ref-04.

## 6. Criterios de done v1

- [ ] Home con identidad placeholder + tokens de marca + search segmentada sobre hero
- [ ] Listado mock + detalle
- [ ] Filtros con URL-state (incl. moneda ARS/USD) + estado 0 resultados
- [ ] Mapa MapLibre dark + markers precio → expand + atribución © OSM visible
- [ ] Sync listado ↔ mapa + state machine de markers (expand único, Esc/afuera)
- [ ] Flujo GPS (ok / deny / timeout / fallback) + distancia en card
- [ ] CTA contacto funcional (wa.me / tel / mailto)
- [ ] Responsive: toggle mapa/lista mobile (param `view`)
- [ ] A11y básico: focus states, contraste, `prefers-reduced-motion`, listado navegable por teclado como alternativa al mapa
- [ ] Sin backend real
- [ ] Specs/refs en `docs/`
- [ ] Tests unitarios: GPS / filtros / marker state / haversine / URL-state

## 7. Decisiones

| Tema | Estado |
| --- | --- |
| Mezcla visual | **OK** — 01+03 blueprint a gran escala, 02 solo type, 04 paleta |
| Tema | **Cerrado** — dark-only v1 |
| Mapa | **OK** — MapLibre + estilo free dark; fuente abierta (OpenFreeMap / Carto / JSON propio), atribución © OSM obligatoria |
| Moneda | **Cerrado** — filtro segmentado ARS/USD; min/max y sort por precio solo con moneda única |
| CTA contacto | **Cerrado** — wa.me → tel → mailto |
| Tipografías | Abierto con candidatas congeladas (Archivo Black/Anton · Instrument Serif italic · Manrope/Geist/Satoshi) |
| Nombre marca | **Abierto** — placeholder en UI, constante `brandName` |
| CTA Vender | Abierto (sugerido ocultar en v1) |

## 8. Próximo paso

Con bases visuales + mapa OK → scaffold Next en `/home/cipher/Projects/WIP/Inmo` con tokens y shell de páginas mock, **cuando Matias dé luz verde** (nombre puede seguir TBD).
