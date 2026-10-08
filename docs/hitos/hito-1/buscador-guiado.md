---
slug: buscador-guiado
hito: 1
estado: approved
aprobada: 2026-10-08
creada: 2026-10-08
---

# Buscador guiado

> El inicio del sitio **es** el buscador: una pregunta por pantalla, con opciones grandes.
> Paso 1 ¿comprar o alquilar? → paso 2 tipo → paso 3 zona → paso 4 algo más → resultados.
> Depende de `identidad-y-base` (componentes, shell) y de `modelo-de-busqueda` (taxonomía,
> URL, conteos).

## Problema

- Hoy el inicio es una landing: hero animado día/noche, un buscador chico con un `<select>`
  de tipo y otro de precio, categorías, contadores animados y una grilla de destacadas. Para
  buscar hay que leer y elegir en controles chicos.
- No se puede elegir barrio ni varios tipos a la vez.
- tandilprop, la referencia, tiene el mismo problema: dos botones chicos y un `<select>`
  sobre una foto aérea.

## Objetivo

Al entrar, en el celular, lo primero que se ve es **"¿Qué estás buscando?"** con **Comprar** y
**Alquilar** en grande. Cada respuesta lleva a la siguiente pregunta, siempre mostrando
cuántas propiedades hay, y en cuatro toques como máximo se llega a los resultados. Funciona
con JavaScript apagado y el botón atrás vuelve un paso.

## Historias de usuario

- Como **quien busca casa para comprar**, quiero decir "comprar → casa o quinta → Centro o
  Casariego" sin escribir nada, para ver solo eso.
- Como **quien busca alquiler apurado**, quiero ver todos los alquileres con dos toques, sin
  contestar todas las preguntas.
- Como **quien busca**, quiero saber cuántas propiedades hay de cada tipo y en cada zona antes
  de tocar, para no terminar en una búsqueda vacía.
- Como **quien busca desde el navegador de Instagram con mala señal**, quiero que el buscador
  ande aunque el JavaScript tarde en cargar.

## Pantallas

### Paso 1 · Inicio (`/`)

```
┌────────────────────────────────────┐
│ ▣ bolívar inmo                 ☰  │ header (56)
├────────────────────────────────────┤
│                                    │
│ ¿Qué estás buscando?               │ h1, 32 px semi condensada
│ Propiedades de las inmobiliarias   │ 16 px, tinta-suave
│ de Bolívar.                        │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ ⚿                              │ │ opción grande (≥ 104 px)
│ │ Comprar                        │ │ 24 px semi condensada
│ │ Casas, terrenos, campos…   48 ›│ │ ayuda + conteo
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ ⌂                              │ │
│ │ Alquilar                       │ │
│ │ Para vivir o para tu negocio 21›│ │
│ └────────────────────────────────┘ │
│                                    │
│  Alquiler temporario          3 › │ fila de 44 px
│  Ver todas en el mapa           › │ fila de 44 px
│                                    │
├ ─ ─ ─ ─ ─ (pliegue a 640) ─ ─ ─ ─ ┤
│  Recién publicadas            →    │ (llega con `resultados`, bloque 6)
│  Inmobiliarias de Bolívar      ›   │
│  pie                               │
└────────────────────────────────────┘
```

- **Comprar**, **Alquilar** y **Alquiler temporario** son links (`<a>`) a
  `/buscar/tipo?operacion=…`. Un toque y se pasa al paso 2: no hay "Continuar" en el paso 1.
- El número es la cantidad de propiedades de esa operación (de los datos, no inventado). Una
  operación con 0 propiedades se muestra igual, con "Sin propiedades por ahora" y sin link.
- **Ver todas en el mapa** → `/propiedades?vista=mapa` (sin operación: todas).
- A 360 × 640 **se ven sin scroll** la pregunta, las dos opciones grandes y "Alquiler
  temporario".
- Fondo `papel`; las opciones son tarjetas blancas con borde `linea`; al tocar, borde y fondo
  `palmera` (estado `:active`), sin animación.

### Pasos 2 a 4 · la barra de paso y el pie fijo

```
┌────────────────────────────────────┐
│ ‹  Comprar · Casa, Quinta     3/4  │ barra de paso (56): volver, lo elegido, progreso
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬░░░░░░░░░ │ barra de progreso (4 px, palmera-700)
│                                    │
│  (contenido del paso)              │
│                                    │
├────────────────────────────────────┤ pie fijo, blanco, sombra arriba, safe-area
│     Ver las 12 propiedades ahora   │ link (44)
│ ┌────────────────────────────────┐ │
│ │           Continuar            │ │ botón principal (56)
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

- **‹** vuelve al paso anterior **con lo elegido hasta ahí** (es un link, no `history.back()`,
  para que ande también si se entró directo a un paso).
- El texto del medio resume lo elegido ("Comprar · Casa, Quinta"); si no entra, se corta con
  "…". El header normal (logo, menú) no aparece en los pasos: la pantalla es de la pregunta.
- **El conteo del pie se actualiza al tocar cada opción** (con JS) y siempre refleja lo que
  está marcado. Sin JS muestra el conteo de lo que venía en la URL.
- **"Ver las N propiedades ahora"** salta a los resultados con lo elegido hasta acá.
- Si el conteo da **0**, el botón principal sigue habilitado (la pregunta siguiente puede
  igual cambiar algo), pero el link dice "Con esto no hay propiedades" y se ofrece cuál sacar
  (ver paso 4).

### Paso 2 · Tipo (`/buscar/tipo?operacion=venta`)

```
│ ¿Qué tipo de propiedad?            │ h1
│ Podés elegir más de uno.           │
│ ┌───────────────┐┌───────────────┐ │ grilla de 2 columnas, opciones de ≥ 80 px
│ │ ⌂             ││ ▦             │ │
│ │ Casa       12 ││ Departamento 8│ │
│ └───────────────┘└───────────────┘ │
│ ┌───────────────┐┌───────────────┐ │
│ │ ▭             ││ ♣             │ │
│ │ Terreno     6 ││ Casa quinta  4│ │
│ └───────────────┘└───────────────┘ │
│ ┌───────────────┐┌───────────────┐ │
│ │ ⛟ Campo     2 ││ ▤ Local      1│ │
│ └───────────────┘└───────────────┘ │
│ … (galpón, PH, oficina, cochera)   │
```

- Los tipos de la operación elegida, **en el orden de la taxonomía** (lo más buscado primero).
- Selección múltiple. Elegida = borde `palmera-700` 2 px, fondo `palmera-50` y un ✓ en la
  esquina (no solo color: el ✓ lo hace visible para daltónicos).
- Un tipo con 0 propiedades va **al final**, atenuado, con "Sin avisos ahora", y no se puede
  elegir.
- Sin elegir nada, "Continuar" sigue con todos los tipos.

### Paso 3 · Zona (`/buscar/zona?operacion=venta&tipo=casa,quinta`)

```
│ ¿En qué zona?                      │ h1
│ Podés elegir varias.               │
│                                    │
│ (● Todo Bolívar  38)               │ chip, elegido si no hay ninguna zona
│                                    │
│ Ciudad                             │ título de grupo
│ (Centro 7) (Casariego 4) (Villa    │ chips de 44 px, en filas
│  Melitona 3) (San José 2) …        │
│ Afueras                            │
│ (Zona de quintas 5) (Rural 2)      │
│ Localidades                        │
│ (Urdampilleta 1) (Pirovano 1)      │
```

- Chips con el conteo **para el tipo y la operación elegidos**. Las zonas con 0 **no se
  muestran** (salvo que vengan elegidas en la URL). Un grupo sin zonas con propiedades no se
  muestra.
- **Todo Bolívar** limpia la selección.

### Paso 4 · Algo más (`/buscar/detalles?…`)

```
│ ¿Algo más?                         │ h1
│ Todo es opcional.                  │
│                                    │
│ Precio                             │ título de campo
│ ┌──────────┬──────────┐            │ moneda: segmentado (radio)
│ │ Dólares ●│  Pesos   │            │ (por defecto la de la operación)
│ └──────────┴──────────┘            │
│ (Hasta 80 mil) (80 a 120 mil)      │ rangos sugeridos (de los datos)
│ (120 a 180 mil) (Más de 180 mil)   │
│ ┌──────────────┐ ┌──────────────┐  │
│ │ Desde US$    │ │ Hasta US$    │  │ inputs numéricos
│ └──────────────┘ └──────────────┘  │
│                                    │
│ Dormitorios                        │ solo si hay tipos de vivienda
│ [Indistinto][1+][2+][3+][4+]       │ segmentado (radio)
│ Baños                              │
│ [Indistinto][1+][2+][3+]           │
│                                    │
│ Que tenga                          │
│ (Cochera) (Pileta) (Patio o jardín)│ chips (checkbox), según la operación
│ (Parrilla) (Apto crédito)          │
├────────────────────────────────────┤
│               Limpiar              │ link
│ ┌────────────────────────────────┐ │
│ │        Ver 12 propiedades      │ │ botón principal → /propiedades
│ └────────────────────────────────┘ │
```

- **Los rangos sugeridos** salen de `rangosDePrecio` (cuartiles de los precios de lo elegido);
  con menos de 4 propiedades con precio, no hay rangos, solo los inputs. Tocar un rango llena
  "Desde" y "Hasta". Sin JS, los rangos no se muestran (los inputs sí).
- Los inputs muestran el número con puntos de miles al salir del campo (`45.000`) y aceptan
  escribir con o sin puntos. Teclado numérico (`inputMode="numeric"`).
- **Si con lo elegido no hay propiedades**: arriba del botón aparece "Con esto no hay
  propiedades. Probá sacando:" y chips con `sugerenciasSinResultados` ("Pileta ✕ → 4",
  "Hasta US$ 80.000 ✕ → 6"); tocar uno saca ese filtro.
- **Limpiar** vacía solo los campos de este paso.

### Campos compartidos

Los controles de los pasos 2, 3 y 4 son **los mismos componentes** que usa la hoja de filtros
de `resultados` (`CampoTipos`, `CampoZonas`, `CampoPrecio`, `CampoAmbientes`,
`CampoCaracteristicas`). En los pasos van uno por pantalla; en la hoja, todos juntos.

## Alcance

**Entra:** `/` (paso 1) y `/buscar/[paso]` (pasos 2-4), los campos compartidos, el conteo en
vivo, el funcionamiento sin JS, los títulos de cada paso, la guarda de pasos.

**No entra:** "Recién publicadas" en el inicio (necesita la tarjeta de `resultados`: se suma
en su último bloque); buscar por calle o por texto ([descartado](../../roadmap/descartado.md));
guardar búsquedas o alertas (sin cuentas para quien busca).

## Criterios de aceptación

- [ ] A **360 × 640**, en `/` se ven sin scroll: la pregunta, Comprar, Alquilar y "Alquiler
      temporario".
- [ ] Inicio → Comprar → (Casa + Quinta) → Continuar → (Centro) → Continuar → (2+ dorm) →
      "Ver N propiedades" termina en
      `/propiedades?operacion=venta&tipo=casa,quinta&zona=centro&dorm=2` (o su forma con
      parámetros repetidos, que se lee igual) y N coincide con la cantidad de resultados.
- [ ] Al tocar una opción en el paso 2, 3 o 4, el conteo del pie cambia **sin navegar** y
      coincide con `contarResultados` (e2e compara con lo que muestra resultados).
- [ ] El botón **atrás del navegador** desde el paso 3 vuelve al paso 2 **con las opciones
      marcadas**.
- [ ] **Con JavaScript apagado** (proyecto `sin-js`), el recorrido inicio → paso 2 → paso 3 →
      paso 4 → resultados funciona y llega a la URL correcta.
- [ ] Entrar a `/buscar/tipo` sin `operacion` redirige a `/`; `/buscar/cualquiercosa` da 404.
- [ ] En el paso 2, un tipo sin propiedades está al final, atenuado, y no se puede elegir.
- [ ] Todo lo que se toca mide ≥ 44 px; cada paso es un `<fieldset>` con `<legend>`; la
      opción elegida tiene un indicador que no es solo color.
- [ ] Cada paso tiene su `<title>` ("¿Qué tipo de propiedad? · Bolívar Inmo") y los pasos
      2-4 son `noindex`.
- [ ] Lighthouse mobile Performance ≥ 90 en `/`; MapLibre no está en el JS de `/`.
- [ ] 👀 Manuel hizo el recorrido en su celular.

## Riesgos

- **Conteo en vivo con muchos datos**: se calcula en el cliente con un índice compacto de las
  propiedades (ver Plan). Con 1.000 avisos son ~60 KB; con más de ~2.000 conviene pasar a
  pedir el conteo al servidor (anotar en `riesgos.md` al cerrar).
- **Formularios GET con checkboxes** mandan `tipo=casa&tipo=quinta` (repetido), no
  `tipo=casa,quinta`: `leerBusqueda` acepta las dos formas (está en el contrato).
- **El pie fijo tapa contenido** con el teclado abierto en iOS: el paso 4 se prueba con el
  teclado abierto en el proyecto `iphone`.

## Preguntas abiertas

- 🙋 ¿Alquiler temporario va en el inicio? (pregunta 3 de la spec madre).
- ¿El ícono de "Comprar" es una llave (`KeyRound`) y el de "Alquilar" una casa (`House`)? Se
  decide en la muestra si no convence.

---

## Plan técnico

### Enfoque

Cada paso es una **página server** que lee la búsqueda de la URL (`leerBusqueda`), calcula
conteos con `src/lib/busqueda` y renderiza un **`<Form>` de `next/form`** con `action` = la
ruta del paso siguiente. Las opciones son **`<input>` nativos** (checkbox o radio) dentro de
`<label>`, así el formulario anda sin JS; las respuestas de pasos anteriores viajan en
`<input type="hidden">`. Con JS, un componente cliente lleva el estado local de lo marcado y
recalcula el conteo del pie contra un **índice compacto** de las propiedades, con las mismas
funciones puras. "Ver las N ahora" es un `<button formAction="/propiedades">` (verificado en
la doc de `next/form` instalada: hace navegación cliente, sin prefetch).

### Archivos

| Archivo | Qué |
|---|---|
| `src/app/page.tsx` | Paso 1: server; `getProperties()` → `contarPorOpcion(…, "operacion")`; header, pregunta, opciones grandes (links), filas, pie. Metadata de la marca |
| `src/app/buscar/[paso]/page.tsx` | Server: valida `paso ∈ {tipo, zona, detalles}` (si no, `notFound()`); `await searchParams` → `leerBusqueda`; si `!pasoAccesible` → `redirect("/")`; calcula conteos / rangos / índice; renderiza `PasoLayout` con el paso que toca. `generateMetadata` con el título del paso y `robots: { index: false }` |
| `src/app/buscar/[paso]/loading.tsx` | Esqueleto del paso (lo prefetchea `<Form>`) |
| `src/components/busqueda/opcion-grande.tsx` | Las tarjetas de Comprar / Alquilar (link) |
| `src/components/busqueda/barra-de-paso.tsx` | ‹ + resumen + "n/4" + barra de progreso (server) |
| `src/components/busqueda/formulario-de-paso.tsx` | `"use client"`: `<Form action={siguiente}>`, estado local de lo marcado, campos ocultos, pie fijo con conteo en vivo y "Ver las N ahora" |
| `src/components/busqueda/campos-ocultos.tsx` | `<input type="hidden">` de la búsqueda menos los campos del paso actual |
| `src/components/busqueda/campos/campo-tipos.tsx` | Grilla de opciones (checkbox) con ícono, conteo, ✓ y deshabilitado |
| `src/components/busqueda/campos/campo-zonas.tsx` | Grupos de chips (checkbox) + "Todo Bolívar" |
| `src/components/busqueda/campos/campo-precio.tsx` | Moneda (radio), rangos (botones, solo con JS), desde/hasta |
| `src/components/busqueda/campos/campo-ambientes.tsx` | Dormitorios y baños (radio segmentado) |
| `src/components/busqueda/campos/campo-caracteristicas.tsx` | Chips (checkbox) según la operación |
| `src/components/busqueda/sugerencias.tsx` | "Con esto no hay propiedades. Probá sacando:" |
| `src/lib/busqueda/indice.ts` (+ test) | `indiceDeBusqueda(props)`: solo los campos que filtran (`id, operation, type, zone, beds, baths, price, currency, features, publishedAt`) |
| `src/lib/busqueda/numeros.ts` (+ test) | `leerMonto("45.000") → 45000`, `escribirMonto(45000) → "45.000"` |
| `e2e/buscador.spec.ts` | Los criterios de aceptación (con JS) |
| `e2e/buscador-sin-js.spec.ts` | El recorrido en el proyecto `sin-js` |

**Cambio en `modelo-de-busqueda`**: `filtrarPropiedades` y `contarPorOpcion` tienen que
aceptar el tipo compacto del índice (`Filtrable`, un `Pick<Property, …>`), no solo `Property`.
Si `modelo-de-busqueda` ya se implementó, es cambiar la firma (los tests no cambian).

### Datos

Nada nuevo en el modelo. El índice se pasa como prop serializable al componente cliente.

### Tests (TDD)

1. `indice.test.ts`: el índice filtra igual que las propiedades completas (mismo resultado
   para una batería de búsquedas).
2. `numeros.test.ts`: montos con puntos, sin puntos, con espacios, vacíos, basura.
3. E2E (`buscador.spec.ts`, proyectos `android-chico`, `iphone`, `escritorio`): pliegue a
   360 × 640 (bounding boxes dentro de la ventana); recorrido completo y URL final; conteo en
   vivo = cantidad en resultados; atrás conserva lo marcado; guarda y 404; tipo sin avisos no
   elegible; tamaños táctiles ≥ 44 px.
4. E2E (`buscador-sin-js.spec.ts`, proyecto `sin-js`): el recorrido llega a la URL correcta.

### Riesgos

- `useSearchParams` no hace falta: la página server pasa la búsqueda como prop. Evita el
  `<Suspense>` obligatorio.
- El estado local del cliente puede divergir de la URL si se navega con atrás: el formulario
  se inicializa siempre desde la búsqueda que llega por props (`key` con la URL del paso).

### Alternativas consideradas

- **Un solo formulario largo en una pantalla** (tandilprop): es lo que se quiere mejorar.
- **Wizard 100 % cliente** (estado en memoria, sin URLs por paso): atrás no anda, no se
  comparte y no anda sin JS.
- **Pedir el conteo al servidor en cada toque** (`router.replace`): un viaje de red por toque;
  el índice en el cliente da el número al instante con la misma lógica.
- **Toggle / ToggleGroup de Base UI para las opciones**: lindos, pero sin JS no envían nada.
  Inputs nativos estilizados con `peer-checked` dan lo mismo y andan siempre.

## Tareas

**Bloque 1 — Paso 1: inicio** · commit "Inicio: ¿Qué estás buscando? con Comprar y Alquilar"
- [ ] `opcion-grande.tsx`; `src/app/page.tsx` reemplaza el andamio.
- [ ] E2E: pliegue a 360 × 640; los tres links llevan a `/buscar/tipo?operacion=…`; conteos = datos.
- [ ] Gates + `pnpm e2e`.

**Bloque 2 — Esqueleto de pasos + paso 2** · commit "Buscador: paso de tipo con conteo en vivo"
- [ ] `indice.test.ts` → `indice.ts` (y `Filtrable` en `filtrar.ts` / `contar.ts` si hace falta).
- [ ] `src/app/buscar/[paso]/page.tsx` con guarda, 404 y metadata; `loading.tsx`.
- [ ] `barra-de-paso.tsx`, `formulario-de-paso.tsx`, `campos-ocultos.tsx`, `campo-tipos.tsx`.
- [ ] E2E: elegir tipos cambia el conteo; atrás conserva lo marcado; tipo sin avisos no elegible.
- [ ] Gates + `pnpm e2e`.

**Bloque 3 — Paso 3: zona** · commit "Buscador: paso de zona"
- [ ] `campo-zonas.tsx` (grupos, Todo Bolívar, zonas en 0 ocultas).
- [ ] E2E del paso.
- [ ] Gates + `pnpm e2e`.

**Bloque 4 — Paso 4: detalles** · commit "Buscador: precio, ambientes y características"
- [ ] `numeros.test.ts` → `numeros.ts`.
- [ ] `campo-precio.tsx`, `campo-ambientes.tsx`, `campo-caracteristicas.tsx`, `sugerencias.tsx`.
- [ ] El botón final va a `/propiedades`.
- [ ] E2E: recorrido completo y URL final; teclado abierto en `iphone` no tapa el input.
- [ ] Gates + `pnpm e2e`.

**Bloque 5 — Sin JS, accesibilidad, mirar** · commit "Buscador: anda sin JavaScript y verificado a 360 px"
- [ ] `buscador-sin-js.spec.ts` en verde.
- [ ] `fieldset`/`legend`, foco visible, ✓ en lo elegido, tamaños ≥ 44 px.
- [ ] Capturas de los cuatro pasos a 360 × 640 y 390 × 844; detector de Impeccable sobre `/` y `/buscar/tipo`.
- [ ] Lighthouse mobile sobre `/` (≥ 90).
- [ ] 👀 Manuel hace el recorrido en su celular.
- [ ] Gates + `pnpm e2e`.

**Cierre**
- [ ] `/cerrar buscador-guiado`.

## Lo que se encontró al implementar

_(se completa al ejecutar)_
