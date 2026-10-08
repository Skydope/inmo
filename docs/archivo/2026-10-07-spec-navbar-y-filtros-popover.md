# Spec Técnico: Rediseño de Navegación, Filtros Popover y Fixes de Mapa

**Metodología:** SDD (Specification-Driven Development) & TDD (Test-Driven Development)  
**Estado:** Listo para implementación  
**Alcance:** `/propiedades` (Catálogo interactivo con mapa y filtros), Navbar superior y estilos del mapa  
**Regla:** Cero cambios en código de producción en esta etapa; especificación completa y autosuficiente para implementación manual.

---

## 1. Resumen Ejecutivo y Objetivos

### 1.1 Objetivos de Negocio y Experiencia de Usuario (UX)
1. **Descongestionar la interfaz de `/propiedades`:** La barra de filtros inferior actual combina demasiados controles dispersos (operación, tipo, dormitorios, orden, moneda y dos inputs de precio en línea), compitiendo con la navegación superior.
2. **Consolidar la operación en el Navbar superior:** Las operaciones (`Comprar`, `Alquilar`, `Temporal / Hoteles`) pertenecen a la navegación global de nivel superior. Se eliminan los menús desplegables redundantes ("Casas", "Deptos", "Terrenos") dentro de Comprar y Alquilar, ya que duplicaban categorías.
3. **Filtros contextuales en la barra inferior mediante Popovers limpios:**
   - Filtro de **Tipo de Propiedad** (dropdown con opciones acotadas para testeo inicial y botón **Limpiar**).
   - Filtro de **Ambientes / Dormitorios** (dropdown con botón **Limpiar**).
   - Filtro de **Precio** idéntico a la referencia visual: popover con botón **Clear**, switch `Pesos ($)` / `USD (u$s)`, inputs numéricos `Min.` y `Max.`, y **slider de doble rango (Dual Range Slider)** interactivo.
   - Botón destacado con ícono: **"Crear aviso"** (o "Publicar").
4. **Solucionar fricciones en el mapa:**
   - **Visibilidad de precios:** Evitar que los precios se oculten agresivamente por colisión obligando a hacer zoom inconstante.
   - **Modo noche (Dark Mode) en popups/hints:** Los carteles (`.map-pin-preview` y `.map-street-pill`) deben respetar el tema oscuro con contraste legible.
   - **Deselección al hacer clic en el mapa:** Hacer clic en un área vacía del mapa debe deseleccionar la propiedad activa tanto en el mapa como en las tarjetas inferiores.

---

## 2. Diagnóstico de Causa Raíz (Root Cause Analysis)

| Problema Reportado | Causa Técnica en el Código Existente | Solución Especificada |
| :--- | :--- | :--- |
| **Precios no visibles en los pines sin hacer zoom** | En `src/components/map/property-map.tsx` (`layoutPricesRef`), se oculta `item.price.style.visibility = hit ? 'hidden' : 'visible'` con threshold vertical estricto (`Math.abs(item.y - s.y) < 64px`). | Relajar el algoritmo de colisión o compactar el badge de precio para que todos los pines muestren su valor o una versión compacta por defecto. |
| **Hints/carteles no responden al modo noche** | En `src/app/globals.css`, `.map-pin-preview` tiene colores duros: `background: #f7f2ea; color: #1a1a1a;`. No hay reglas `.dark .map-pin-preview`. | Agregar variables semánticas o clases `.dark .map-pin-preview` usando `var(--bg-elevated)`, `var(--fg)`, y bordes contrastados. |
| **Propiedad sigue seleccionada al hacer clic en el mapa** | En `property-map.tsx`: `map.on('click', () => handlersRef.current.onCollapse())`. En `markers.ts`: `collapse` solo vacía `expandedId: null`, pero mantiene `selectedId`. | Agregar acción `deselect` al reducer (`expandedId: null, selectedId: null`) y llamarla al hacer clic sobre el mapa base. |
| **Navegación caótica con dropdowns duplicados** | `LandingNav` tenía menús colgantes que abrían tipos de propiedades, y `FilterBar` repetía los segmentos de Venta / Alquiler / Temporaria. | Operaciones directas en `LandingNav` (sin dropdowns); barra inferior dedicada a Tipo, Ambientes, Precio y Publicar. |

---

## 3. Especificación SDD (Software Design Description)

### 3.1 Arquitectura de Navegación

```mermaid
flowchart TD
    subgraph Navbar Superior [LandingNav]
        N1[Logo / Home]
        N2[Comprar: op=sale]
        N3[Alquilar: op=rent]
        N4[Temporal / Hoteles: op=temporary]
        N5[Inmobiliarias: /inmobiliarias]
        N6[Theme Toggle & Ingresar]
    end

    subgraph Barra Inferior [FilterBar en /propiedades]
        F1[Buscador de Calles: StreetSearch]
        F2[Dropdown Tipo de Propiedad + Limpiar]
        F3[Dropdown Ambientes / Dormitorios + Limpiar]
        F4[Popover de Precio: Switch Moneda + Min/Max + Slider + Limpiar]
        F5[Dropdown Orden: Recientes / Precio / Distancia]
        F6[Botón CTA: Crear Aviso]
    end

    subgraph Mapa y Listado [PropertyMap & PropertyCards]
        M1[Pins con precios visibles siempre]
        M2[Click en mapa vacío -> Deseleccionar todo]
        M3[Preview card con soporte Dark Mode]
    end

    N2 -->|Actualiza URL ?op=sale| Barra Inferior
    N3 -->|Actualiza URL ?op=rent| Barra Inferior
    N4 -->|Actualiza URL ?op=temporary| Barra Inferior
    Barra Inferior -->|Filtra listado y sincroniza mapa| Mapa y Listado
```

#### Reglas de Navegación del Navbar Superior (`LandingNav`):
- Se eliminan los desplegables (`OPERATIONS.map(...)` con hover de `MARKETS`).
- Enlaces planos y directos en el menú principal:
  1. **Comprar**: `/propiedades?op=sale`
  2. **Alquilar**: `/propiedades?op=rent`
  3. **Temporal**: `/propiedades?op=temporary` (agrupa temporarios y hoteles/estancias)
  4. **Inmobiliarias**: `/inmobiliarias`
- Indicador visual `active` (`aria-current="page"`): se resalta únicamente el enlace cuya operación coincide con el parámetro de búsqueda (`op`).

---

### 3.2 Barra de Filtros Inferior (`FilterBar`)

La barra inferior se reestructura en contenedores modulares con activación tipo Popover:

#### A. Buscador de Calles (`StreetSearch`)
- Se mantiene el buscador predictivo existente con autocompletado de calles de Bolívar.
- Mantiene botón `(X)` para limpiar.

#### B. Desplegable: Tipo de Propiedad (`TypeDropdown`)
- **Trigger**: Botón con etiqueta dinámica (ej. `"Tipo"` si está vacío, o `"Casa"`, `"Departamento"` cuando está seleccionado) + chevron.
- **Acción Limpiar**: Enlace/botón `"Limpiar"` en la cabecera del desplegable que setea `type = undefined`.
- **Opciones iniciales (MVP acotado para pruebas):**
  1. `departamento` (`apartment`)
  2. `casa` (`house`)
  3. `ph` (`ph`)
  4. `terreno` (`lot`)
  5. `local comercial` (`commercial`)
  6. `campo` (`rural`)
  7. `quinta vacacional` (`vacational_house`)
- **Comportamiento**: Al hacer clic en una opción, se actualiza `type` en los search params y se cierra el popover. Si la opción ya estaba activa, se deselecciona.

#### C. Desplegable: Ambientes / Dormitorios (`RoomsDropdown`)
- **Trigger**: Botón con icono de cama (`Bed`), etiqueta dinámica (ej. `"Ambientes"` o `"2+ dorm."`) + chevron.
- **Acción Limpiar**: Botón `"Limpiar"` que setea `beds = undefined`.
- **Opciones de selección rápida (botones pills o lista):**
  - `Cualquiera` (reset)
  - `1 dorm.` (o 1 ambiente)
  - `2 dorm.`
  - `3 dorm.`
  - `4+ dorm.`

#### D. Desplegable: Precio (`PriceDropdown`) — Especificación de Referencia Visual
Este componente replica con exactitud la tarjeta modal/popover adjunta:

```
+-------------------------------------------------------------+
| Price                                                 Clear |
+-------------------------------------------------------------+
|  +-- Min. ----------------+    +-- Max. -----------------+  |
|  | 20                     |    | 900                     |  |
|  +------------------------+    +-------------------------+  |
|                                                             |
|           20$                                900$           |
|            O==================================O             |
|   ---------|                                  |----------   |
|                                                             |
|   [ Switch Moneda:  (o) ARS  |  ( ) USD ]                   |
+-------------------------------------------------------------+
```

1. **Cabecera**:
   - Título a la izquierda: `"Precio"` (o `"Price"`).
   - Acción a la derecha: Botón interactivo `"Limpiar"` (o `"Clear"`) en color de acento/púrpura. Al hacer clic, borra `min`, `max` y resetea los sliders a su rango por defecto.
2. **Selector de Moneda (Switch/Segment)**:
   - Switch de 2 estados: `Pesos ($)` y `USD (u$s)`.
   - Cambio de moneda recalcula los límites mínimo y máximo por defecto (ej. en USD: 0 a 500.000; en ARS: 0 a 100.000.000).
3. **Campos de Entrada Numérica (Inputs)**:
   - Dos inputs con contenedor redondeado y floating label: `Min.` y `Max.`.
   - Estado activo con outline/borde de acento (como en la referencia visual).
   - Escribir en `Min.` o `Max.` actualiza la posición correspondiente del slider.
4. **Slider de Rango Doble (Dual Range Slider)**:
   - Pista base gris clara; pista activa entre manijas rellena en color de acento.
   - Dos manijas circulares (thumbs).
   - Etiquetas dinámicas flotantes arriba de cada manija mostrando el valor formateado (ej. `20$` o `900$`).
   - Bloqueo de colisión: el valor `Min.` no puede superar a `Max.`.

#### E. Botón CTA: "Crear aviso"
- Ubicación: En el extremo derecho de la barra de filtros o en la barra principal.
- Icono: `PlusCircle` o `Megaphone` de Phosphor Icons.
- Texto: `"Crear aviso"`.
- Estilo: Botón con estilo primario (`bg-fg text-bg hover:opacity-90 rounded-full font-medium`).
- Enlace: Enruta hacia `/publicar` (o modal de contacto para publicación de propietarios/inmobiliarias).

---

### 3.3 Correcciones Técnicas en el Mapa (`PropertyMap` & CSS)

#### A. Precios Visibles en los Pines
- **Diagnóstico:** El método `layoutPricesRef` oculta precios con `item.price.style.visibility = "hidden"` si están en un radio vertical de 64px.
- **Especificación:**
  - Cambiar el comportamiento de visibilidad a **siempre visible por defecto**.
  - Si dos pines se tocan, el pin seleccionado o con hover toma `z-index: 10` y los precios se renderizan de forma compacta (ej. `$150k` o `$45M`) para evitar solapamientos masivos sin ocultar el dato.
  - Asegurar que la etiqueta `.map-pin-price` no sea ocultada por la cámara en los zooms estándar de Bolívar (`zoom >= 13`).

#### B. Soporte Dark Mode en Carteles y Popups (`globals.css`)
- Reemplazar estilos rígidos por selectores compatibles con `.dark`:

```css
/* Soporte Modo Noche para Preview de Pin */
.map-pin-preview {
  position: relative;
  width: 220px;
  overflow: hidden;
  border-radius: var(--radius-card);
  background: var(--bg-elevated);
  color: var(--fg);
  border: 1px solid var(--glass-border);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
}

.map-pin-preview::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--bg-elevated);
}

.map-pin-preview img {
  background: var(--chrome);
}

.map-pin-preview-address,
.map-pin-preview-meta {
  color: var(--fg-muted);
}

.map-pin-detail {
  background: var(--fg);
  color: var(--bg);
}

.dark .map-pin-price {
  background: var(--bg-elevated);
  color: var(--fg);
  border: 1px solid var(--glass-border);
}
.dark .map-pin-price::after {
  border-top-color: var(--bg-elevated);
}
```

#### C. Deselección al Hacer Clic en el Mapa
- En `src/lib/markers.ts`:
  - Agregar la acción `{ type: "deselect" }` que limpia tanto `expandedId: null` como `selectedId: null`.
- En `src/components/map/property-map.tsx`:
  - En el callback del mapa:
    ```ts
    map.on("click", (e) => {
      // Si el clic no fue dentro de un elemento marcador (.map-pin)
      const target = e.originalEvent.target as HTMLElement
      if (!target.closest(".map-pin")) {
        handlersRef.current.onDeselect()
      }
    })
    ```
- En `src/components/explore-client.tsx`:
  - Conectar `onDeselect={() => dispatchMarker({ type: "deselect" })}`.

---

## 4. Modelos de Datos y Contratos TypeScript

### 4.1 Extensión de Tipos de Propiedad (`src/lib/properties/types.ts`)

```typescript
export type PropertyType =
  | "house"            // Casa
  | "apartment"        // Departamento
  | "ph"               // PH
  | "lot"              // Terreno / Lote
  | "commercial"       // Local comercial
  | "rural"            // Campo
  | "vacational_house" // Quinta vacacional

export type Currency = "ARS" | "USD"
export type Operation = "sale" | "rent" | "temporary"
```

### 4.2 State Machine de Marcadores (`src/lib/markers.ts`)

```typescript
export type MarkerState = {
  expandedId: string | null
  selectedId: string | null
}

export type MarkerAction =
  | { type: "select"; id: string }
  | { type: "expand"; id: string }
  | { type: "collapse" }
  | { type: "deselect" } // <-- NUEVO: limpia expandido y seleccionado
  | { type: "hover-card"; id: string | null }

export function markerReducer(
  state: MarkerState,
  action: MarkerAction,
): MarkerState {
  switch (action.type) {
    case "expand":
      return { expandedId: action.id, selectedId: action.id }
    case "select":
      return {
        expandedId: state.expandedId === action.id ? state.expandedId : null,
        selectedId: action.id,
      }
    case "hover-card":
      return {
        ...state,
        selectedId: action.id ?? state.expandedId,
      }
    case "collapse":
      return { ...state, expandedId: null }
    case "deselect":
      return { expandedId: null, selectedId: null }
    default:
      return state
  }
}
```

### 4.3 Filtros de Búsqueda y URL State (`src/lib/filters.ts`)

```typescript
export type PropertyFilters = {
  op?: Operation
  type?: PropertyType
  cur?: Currency
  min?: number
  max?: number
  beds?: number
  agency?: string
  sort: SortKey
  view: ViewMode
}
```

---

## 5. Especificación TDD (Test-Driven Development)

Antes de codificar la interfaz, se deben ejecutar y verificar los siguientes tests unitarios. Todo test nuevo debe fallar primero (RED) y pasar luego de la implementación (GREEN).

### 5.1 Suite de Marcadores: `src/lib/markers.test.ts`

```typescript
import { describe, expect, it } from "vitest"
import { initialMarkerState, markerReducer } from "@/lib/markers"

describe("markerReducer - Deselección y estado de mapa", () => {
  it("deselect limpia tanto selectedId como expandedId al hacer clic en mapa vacío", () => {
    // 1. Estado inicial con propiedad seleccionada y expandida
    const expanded = markerReducer(initialMarkerState, { type: "expand", id: "bol-01" })
    expect(expanded.selectedId).toBe("bol-01")
    expect(expanded.expandedId).toBe("bol-01")

    // 2. Ejecutar deselect
    const clean = markerReducer(expanded, { type: "deselect" })
    expect(clean.selectedId).toBeNull()
    expect(clean.expandedId).toBeNull()
  })

  it("collapse preserva la selección pero oculta el preview", () => {
    const expanded = markerReducer(initialMarkerState, { type: "expand", id: "bol-01" })
    const collapsed = markerReducer(expanded, { type: "collapse" })
    expect(collapsed.expandedId).toBeNull()
    expect(collapsed.selectedId).toBe("bol-01")
  })
})
```

---

### 5.2 Suite de Filtros y Nuevos Tipos: `src/lib/filters.test.ts`

```typescript
import { describe, expect, it } from "vitest"
import { applyFilters, filtersToSearchParams, parseFilters } from "@/lib/filters"
import type { Property } from "@/lib/properties/types"

const MOCK_PROPERTIES: Property[] = [
  {
    id: "p-ph",
    title: "PH Luminoso centro",
    type: "ph",
    price: 45000,
    currency: "USD",
    operation: "sale",
    beds: 2,
    baths: 1,
    areaM2: 70,
    address: "Alvear 120",
    lat: -36.23,
    lng: -61.11,
    photoCount: 3,
    coverUrl: "/mock.jpg",
    agency: { name: "Bolívar Prop", logoUrl: "/logo.png" },
  },
  {
    id: "p-commercial",
    title: "Local comercial estratégico",
    type: "commercial",
    price: 350000,
    currency: "ARS",
    operation: "rent",
    beds: 0,
    baths: 1,
    areaM2: 50,
    address: "San Martín 400",
    lat: -36.23,
    lng: -61.11,
    photoCount: 2,
    coverUrl: "/mock.jpg",
    agency: { name: "Bolívar Prop", logoUrl: "/logo.png" },
  },
]

describe("parseFilters con categorías extendidas", () => {
  it("parsea correctamente tipos nuevos como ph, commercial, rural, vacational_house", () => {
    const f1 = parseFilters(new URLSearchParams("type=ph"))
    expect(f1.type).toBe("ph")

    const f2 = parseFilters(new URLSearchParams("type=commercial"))
    expect(f2.type).toBe("commercial")

    const f3 = parseFilters(new URLSearchParams("type=vacational_house"))
    expect(f3.type).toBe("vacational_house")
  })

  it("parsea y sanitiza rangos numéricos de min y max", () => {
    const f = parseFilters(new URLSearchParams("cur=USD&min=20&max=900"))
    expect(f.min).toBe(20)
    expect(f.max).toBe(900)
    expect(f.cur).toBe("USD")
  })

  it("elimina claves vacías en round-trip al limpiar", () => {
    const f = parseFilters(new URLSearchParams("type=house&min=100"))
    delete f.type
    delete f.min
    const qs = filtersToSearchParams(f).toString()
    expect(qs).not.toContain("type=")
    expect(qs).not.toContain("min=")
  })
})

describe("applyFilters con tipos extendidos", () => {
  it("filtra propiedades por tipo 'ph' y 'commercial'", () => {
    const phList = applyFilters(MOCK_PROPERTIES, { type: "ph", sort: "recent", view: "map" })
    expect(phList.length).toBe(1)
    expect(phList[0].id).toBe("p-ph")

    const commList = applyFilters(MOCK_PROPERTIES, { type: "commercial", sort: "recent", view: "map" })
    expect(commList.length).toBe(1)
    expect(commList[0].id).toBe("p-commercial")
  })
})
```

---

### 5.3 Suite de Navegación Superior: `src/components/landing-nav.test.ts`

```typescript
import { describe, expect, it } from "vitest"
import { navItemActive } from "./landing-nav"

const params = (op: string | null) => ({ op, type: null })

describe("LandingNav sin dropdowns y con rutas directas", () => {
  it("activa Comprar cuando op=sale", () => {
    expect(navItemActive("/propiedades?op=sale", "/propiedades", params("sale"))).toBe(true)
    expect(navItemActive("/propiedades?op=sale", "/propiedades", params("rent"))).toBe(false)
  })

  it("activa Alquilar cuando op=rent", () => {
    expect(navItemActive("/propiedades?op=rent", "/propiedades", params("rent"))).toBe(true)
  })

  it("activa Temporal cuando op=temporary", () => {
    expect(navItemActive("/propiedades?op=temporary", "/propiedades", params("temporary"))).toBe(true)
  })

  it("mantiene Inmobiliarias activa en /inmobiliarias", () => {
    expect(navItemActive("/inmobiliarias", "/inmobiliarias", params(null))).toBe(true)
  })
})
```

---

### 5.4 Suite de Slider y Rango de Precios: `src/lib/price-range.test.ts`

Crear un helper puro para desacoplar y testear la lógica de clamping y sliders:

```typescript
import { describe, expect, it } from "vitest"

// Helper puro de cálculo de rango de precios
export function clampPriceRange(
  min: number,
  max: number,
  absMin: number,
  absMax: number,
): { min: number; max: number } {
  const boundedMin = Math.max(absMin, Math.min(min, absMax))
  const boundedMax = Math.max(boundedMin, Math.min(max, absMax))
  return { min: boundedMin, max: boundedMax }
}

describe("clampPriceRange", () => {
  it("restringe min y max a los límites globales", () => {
    const res = clampPriceRange(-50, 1500, 0, 1000)
    expect(res.min).toBe(0)
    expect(res.max).toBe(1000)
  })

  it("no permite que min sea superior a max", () => {
    const res = clampPriceRange(500, 200, 0, 1000)
    expect(res.min).toBe(500)
    expect(res.max).toBe(500)
  })
})
```

---

## 6. Plan de Implementación Paso a Paso

### Fase 1: Capa de Datos y Tests (TDD)
1. **Extender Tipos:** En `src/lib/properties/types.ts`, agregar `"ph" | "commercial" | "rural" | "vacational_house"` al tipo `PropertyType`.
2. **Actualizar Reducer de Marcadores:** En `src/lib/markers.ts`, agregar el action `{ type: "deselect" }`.
3. **Escribir Tests Unitarios:**
   - Crear/actualizar `src/lib/markers.test.ts` con el caso `deselect`.
   - Actualizar `src/lib/filters.test.ts` con los nuevos tipos y rangos de precio.
   - Ejecutar `pnpm test` y verificar que pasen en verde.

### Fase 2: Fixes de Mapa y Modo Noche
1. **Deselección:** En `src/components/map/property-map.tsx`, añadir listener en `map.on("click")` para llamar `onDeselect` si el clic no es un marcador.
2. **Visibilidad de Precios:** En `property-map.tsx`, relajar `layoutPricesRef` asegurando que los precios no desaparezcan por colisiones menores.
3. **Estilos Dark Mode:** En `src/app/globals.css`, agregar soporte semántico para `.dark .map-pin-preview` y `.dark .map-pin-price`.

### Fase 3: Navbar Superior (`LandingNav`)
1. **Limpiar Dropdowns:** En `src/components/landing-nav.tsx`, remover la estructura de submenú hover (`MARKETS.map`).
2. **Simplificar Links:** Dejar enlaces planos para:
   - `Comprar` (`/propiedades?op=sale`)
   - `Alquilar` (`/propiedades?op=rent`)
   - `Temporal` (`/propiedades?op=temporary`)
   - `Inmobiliarias` (`/inmobiliarias`)
3. Correr `pnpm test` para validar `landing-nav.test.ts`.

### Fase 4: Reestructuración de la Barra de Filtros Inferior (`FilterBar`)
1. **Remover Operación:** Quitar el `<Segment label="Operación" ... />` de la barra inferior (ya cubierto por el navbar superior).
2. **Crear Componente `PriceFilterPopover`:**
   - Cabecera con título "Precio" y botón "Limpiar".
   - Switch de Moneda `ARS` / `USD`.
   - Inputs estilizados `Min.` y `Max.`.
   - Range slider doble con manijas interactivas y etiquetas sobre los thumbs.
3. **Crear Desplegables con botón Limpiar:**
   - `TypeFilterDropdown` (Departamento, Casa, PH, Terreno, Local, Campo, Quinta vacacional).
   - `RoomsFilterDropdown` (Ambientes / Dormitorios).
4. **Agregar Botón CTA:**
   - Botón `"Crear aviso"` con icono `PlusCircle`.

### Fase 5: Verificación Integral
1. Ejecutar `pnpm test` (todos los tests deben pasar).
2. Ejecutar `pnpm typecheck` (cero errores de TypeScript).
3. Prueba visual manual:
   - Alternar entre modo claro y oscuro verificando contraste en el mapa.
   - Seleccionar un pin y clickear en el mapa base para constatar que se deselecciona.
   - Verificar la interacción fluida del slider de precios y el botón "Limpiar".

---
*Fin de especificación técnica.*
