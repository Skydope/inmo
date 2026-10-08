---
slug: modelo-de-busqueda
hito: 1
estado: approved
aprobada: 2026-10-08
creada: 2026-10-08
---

# Modelo de búsqueda

> El contrato que comparten el buscador guiado, los resultados, el mapa y la ficha: **qué se
> puede buscar, cómo se escribe en la URL y cómo se filtra**. No tiene pantallas propias: es
> la lógica pura de `src/lib/busqueda/` y los datos de prueba.

## Problema

- El modelo actual no alcanza para lo que pidió Manuel: **no hay barrio/zona**, los tipos son
  7 (falta casa quinta, campo, galpón, oficina, cochera) y no hay características (cochera,
  pileta, apto crédito).
- Los filtros actuales (`src/lib/filters.ts`) están en inglés en la URL (`op=sale`,
  `type=house`) y pensados para popovers, no para un recorrido por pasos.
- Los datos de prueba son 12 propiedades, casi todas casas: no alcanzan para ver si un
  buscador por tipo y zona funciona.

## Objetivo

Existe **un solo módulo** que sabe qué operaciones, tipos, zonas y características hay; que
convierte **URL ⇄ búsqueda** sin romperse con valores inválidos; y que filtra, cuenta, ordena,
sugiere rangos de precio y arma el título de cualquier búsqueda. Todo con tests. Los datos de
prueba cubren todos los tipos y zonas.

## Historias de usuario

- Como **quien busca**, quiero que el link de mi búsqueda abra lo mismo en el celu de mi
  pareja, para mandárselo por WhatsApp.
- Como **quien busca**, quiero ver cuántas propiedades hay de cada tipo y en cada zona antes de
  elegir, para no terminar en una búsqueda vacía.
- Como **quien busca**, quiero filtrar por precio en la moneda en que se publica, sin
  conversiones raras.
- Como **inmobiliaria** (hito 2), quiero que mis avisos usen las mismas categorías que el
  buscador, para que aparezcan donde la gente los busca.

## Taxonomía

### Operaciones

| Slug (URL) | En el buscador | En la tarjeta | Moneda por defecto |
|---|---|---|---|
| `venta` | **Comprar** | Venta | USD |
| `alquiler` | **Alquilar** | Alquiler | ARS |
| `temporario` | Alquiler temporario | Temporario | ARS |

### Tipos de propiedad

Los más comunes en Argentina, y en un partido agrícola como Bolívar. El ícono es de lucide
(nombre a verificar en la versión instalada).

| Slug | Singular | Plural | Ícono | Venta | Alquiler | Temporario | Vivienda* |
|---|---|---|---|:-:|:-:|:-:|:-:|
| `casa` | Casa | Casas | `House` | ✔ | ✔ | ✔ | ✔ |
| `departamento` | Departamento | Departamentos | `Building2` | ✔ | ✔ | ✔ | ✔ |
| `ph` | PH | PH | `Building` | ✔ | ✔ | | ✔ |
| `quinta` | Casa quinta | Casas quinta | `Trees` | ✔ | ✔ | ✔ | ✔ |
| `terreno` | Terreno | Terrenos | `LandPlot` | ✔ | | | |
| `campo` | Campo | Campos | `Tractor` | ✔ | ✔ | | |
| `local` | Local comercial | Locales | `Store` | ✔ | ✔ | | |
| `oficina` | Oficina | Oficinas | `BriefcaseBusiness` | ✔ | ✔ | | |
| `galpon` | Galpón | Galpones | `Warehouse` | ✔ | ✔ | | |
| `cochera` | Cochera | Cocheras | `CarFront` | ✔ | ✔ | | |

\* *Vivienda*: tiene dormitorios y baños. Los filtros de dormitorios y baños solo aparecen si
la búsqueda no tiene tipo o tiene al menos un tipo de vivienda.

**Orden en el paso 2, según la operación** (lo más buscado primero):

- Venta: casa, departamento, terreno, quinta, campo, local, galpón, PH, oficina, cochera.
- Alquiler: departamento, casa, local, PH, oficina, galpón, quinta, campo, cochera.
- Temporario: quinta, casa, departamento.

### Zonas

**Lista provisional** (🙋 confirmar con una inmobiliaria local). Salió de fuentes públicas
(cronogramas de cortes de la cooperativa eléctrica, municipio, diarios locales); los nombres
pueden estar desactualizados.

| Grupo | Slug → nombre |
|---|---|
| **Ciudad** | `centro` Centro · `casariego` Barrio Casariego · `villa-melitona` Villa Melitona · `san-jose` Barrio San José · `colombo` Barrio Colombo · `las-flores` Barrio Las Flores · `villa-diamante` Villa Diamante · `la-ganadera` Barrio La Ganadera · `los-tilos` Barrio Los Tilos · `san-juan` Barrio San Juan · `solidaridad` Barrio Solidaridad |
| **Afueras** | `quintas` Zona de quintas · `rural` Zona rural |
| **Localidades del partido** | `urdampilleta` Urdampilleta · `pirovano` Pirovano · `hale` Hale · `ibarra` Juan F. Ibarra · `paula` Paula |

Una propiedad tiene **una** zona. "Toda Bolívar" = sin filtro de zona.

### Características

| Slug | Etiqueta | Aplica a |
|---|---|---|
| `cochera` | Cochera | todas las operaciones |
| `pileta` | Pileta | todas |
| `patio` | Patio o jardín | todas |
| `parrilla` | Parrilla | todas |
| `apto-credito` | Apto crédito | venta |
| `a-estrenar` | A estrenar | venta |
| `mascotas` | Acepta mascotas | alquiler, temporario |
| `amoblado` | Amoblado | alquiler, temporario |

## Contrato de URL

Vale para `/propiedades` y para los pasos `/buscar/[paso]` (que llevan la búsqueda de un paso
al otro). **Los valores son los slugs de la taxonomía.** Multivalor = separado por comas.

| Parámetro | Valores | Multi | Si falta | Notas |
|---|---|:-:|---|---|
| `operacion` | `venta` · `alquiler` · `temporario` | | todas | |
| `tipo` | slugs de tipos | ✔ | todos | Se descartan los que no aplican a la operación |
| `zona` | slugs de zonas | ✔ | toda Bolívar | |
| `dorm` | `1`…`4` | | indistinto | "al menos n"; `4` = 4 o más. Se ignora si no hay tipos de vivienda |
| `banos` | `1`…`3` | | indistinto | "al menos n"; `3` = 3 o más. Ídem |
| `moneda` | `USD` · `ARS` | | la de la operación | Solo se escribe si hay `desde` o `hasta` |
| `desde`, `hasta` | entero ≥ 0 | | sin tope | En la moneda de `moneda`. Si `desde > hasta`, se invierten |
| `con` | slugs de características | ✔ | — | Todas a la vez (Y). Se descartan las que no aplican a la operación |
| `orden` | `recientes` · `precio-asc` · `precio-desc` | | `recientes` | |
| `vista` | `lista` · `mapa` | | `lista` | Solo `/propiedades` |
| `sel` | id de propiedad | | — | Solo `/propiedades`. Se ignora si no está en los resultados |

**Reglas del contrato** (cada una es un test):

1. **Un valor desconocido se ignora**, no rompe nada: `?tipo=casa,castillo` = `?tipo=casa`.
2. **Forma canónica**: multivalores sin repetir y en el orden de la taxonomía; los valores por
   defecto **no se escriben** (`orden=recientes`, `vista=lista`). Así una misma búsqueda tiene
   una sola URL.
3. **Ida y vuelta**: `leerBusqueda(escribirBusqueda(b))` es igual a `b` para toda búsqueda
   normalizada; y `escribirBusqueda(leerBusqueda(x))` es idempotente.
4. **Lo que no aplica se descarta al leer**: `?operacion=alquiler&tipo=terreno` = sin tipo;
   `?operacion=venta&con=mascotas` = sin características.

## Semántica del filtro

- Entre parámetros distintos: **Y**. Dentro de un multivalor (`tipo`, `zona`): **O**. En
  `con`: **Y** (tiene que tener todas).
- `dorm` / `banos`: `beds >= n` / `baths >= n`; si la propiedad no tiene el dato, queda afuera
  **solo si el filtro está activo**.
- **Precio**: con `desde` o `hasta`, entran solo las propiedades **con precio** y **en la moneda
  del filtro**. Nunca se convierte. `price: null` ("Consultar precio") queda afuera.
- **Orden por precio** con monedas mezcladas: primero las de la moneda por defecto de la
  operación, después la otra; dentro de cada una, por precio; las sin precio al final.
  `recientes`: por fecha de publicación, la más nueva primero; empate por id.

## Lo que el módulo calcula

| Función | Qué devuelve | Lo usa |
|---|---|---|
| `filtrarPropiedades(props, b)` | las que cumplen la búsqueda | resultados, conteos |
| `ordenarPropiedades(props, orden, operacion)` | el orden de arriba | resultados |
| `contarPorOpcion(props, b, campo)` | para cada opción de `operacion` / `tipo` / `zona`: cuántas habría **eligiendo solo esa** en ese campo, con el resto de la búsqueda igual | inicio (Comprar 48), paso 2 (Casa 12), paso 3 (Centro 7) |
| `sugerenciasSinResultados(props, b)` | por cada filtro activo: su etiqueta y cuántas aparecen **si se saca solo ese**; ordenadas de más a menos, solo las > 0 | resultados vacíos |
| `rangosDePrecio(props, b, moneda)` | hasta 4 rangos sugeridos sacados de los cuartiles de los precios de la búsqueda (sin el filtro de precio), redondeados a números "lindos" (2 cifras significativas). Menos de 4 propiedades con precio → ninguno | paso 4, hoja de filtros |
| `tituloDeBusqueda(b)` | "Casas en venta en Centro", "Casas y quintas en venta en Bolívar", "Propiedades en alquiler en 3 zonas", "Propiedades en Bolívar" | `<h1>` y `<title>` de resultados |
| `chipsDeBusqueda(b)` | lista de `{ parametro, valor, etiqueta }` ("Centro", "2+ dorm.", "Hasta US$ 150.000", "Con pileta") | resumen de resultados, chips para quitar |
| `filtrosActivos(b)` | cuántos filtros hay además de la operación | badge del botón "Filtros" |
| `pasoSiguiente` / `pasoAnterior` / `rutaDePaso(paso, b)` | navegación del buscador: `operacion → tipo → zona → detalles → resultados` | buscador guiado |

Reglas de `tituloDeBusqueda`: un tipo → su plural ("Casas"); dos → "Casas y quintas"; tres o
más, o ninguno → "Propiedades". Operación → "en venta" / "en alquiler" / "en alquiler
temporario" / nada. Zona: una → "en Centro"; varias → "en N zonas"; ninguna → "en Bolívar".

## Datos

### El tipo `Property` (nuevo)

Identificadores en inglés como el código existente; valores de dominio en español (ver
`ARQUITECTURA.md` § Modelo de datos).

```ts
type Property = {
  id: string
  operation: Operacion            // "venta" | "alquiler" | "temporario"
  type: TipoPropiedad             // "casa" | "departamento" | … (taxonomía)
  zone: Zona                      // slug de zona
  title: string                   // "Casa de 3 dormitorios con patio"
  description: string
  price: number | null            // null = "Consultar precio"
  currency: "USD" | "ARS"
  expenses?: number               // ARS por mes (departamentos, PH)
  address: string                 // "Belgrano 450"
  showAddress: boolean            // false → en la ficha se ve solo la zona
  lat: number
  lng: number                     // si showAddress es false, la inmobiliaria carga una ubicación aproximada
  areaTotalM2?: number
  areaCoveredM2?: number
  areaHa?: number                 // campos: se muestra en hectáreas
  rooms?: number                  // ambientes
  beds?: number                   // dormitorios
  baths?: number
  garages?: number
  ageYears?: number               // 0 = a estrenar
  features: Caracteristica[]
  photos: string[]                // la primera es la portada; puede estar vacía
  publishedAt: string             // ISO, "2026-09-30"
  featured?: boolean
  agency: Agency
}

type Agency = {
  id: string                      // slug: "inmobiliaria-norte"
  name: string
  logoUrl: string
  address: string
  phone?: string
  whatsapp?: string               // formato internacional sin +: "5492314xxxxxx"
  email?: string
  license?: string                // matrícula: "CMCPSI 1234"
}
```

*(hoy: `type` en inglés con 7 valores, `operation` `sale/rent/temporary`, `areaM2`,
`coverUrl` + `photoCount`, sin zona ni características tipadas, `Agency` sin id.)*

### Datos de prueba

`src/lib/properties/seed.ts` pasa de 12 a **~36 propiedades** que cubren todos los tipos, las
tres operaciones y la mayoría de las zonas:

| Operación | Reparto aproximado |
|---|---|
| Venta (22) | 7 casas · 4 departamentos · 4 terrenos · 3 quintas · 2 campos · 1 local · 1 galpón |
| Alquiler (11) | 4 departamentos · 3 casas · 2 locales · 1 oficina · 1 cochera |
| Temporario (3) | 2 quintas · 1 casa |

Con casos borde a propósito: 2 con "Consultar precio", 1 venta en pesos, 2 con
`showAddress: false`, 1 sin fotos, 1 a estrenar, publicadas en fechas distintas. Las
coordenadas se reparten cerca de cada zona (aproximadas: es data de prueba). Las inmobiliarias
de prueba pasan a tener `id`, `whatsapp` y `license`.

🙋 **Fotos**: hay 10 en `public/images/properties/` (casas, departamentos, terrenos). Faltan
para quinta, campo, local, oficina, galpón y cochera. Opciones: fotos libres de Unsplash o
Pexels (licencia libre), o generadas. Sin fotos, esas propiedades usan el estado "sin foto"
de la tarjeta (que igual hay que diseñar).

## Alcance

**Entra:** la taxonomía, el contrato de URL, las funciones de la tabla, el tipo `Property`
nuevo, el seed ampliado, el adapter con la misma firma, y llevar el código que hoy usa el
modelo viejo a andamios mínimos (ver Plan técnico).

**No entra:** datos reales de Supabase (hito 2); conversión de moneda
([descartado](../../roadmap/descartado.md)); búsqueda por texto libre o por calle
([descartado](../../roadmap/descartado.md) para el hito 1).

## Criterios de aceptación

- [ ] `?operacion=venta&tipo=casa,quinta&zona=centro&dorm=2&moneda=USD&hasta=150000&con=pileta`
      devuelve exactamente las casas o quintas en venta en Centro, con 2+ dormitorios, en
      dólares, hasta US$ 150.000, con pileta (test con fixtures).
- [ ] Ninguna URL inventada rompe: un test recorre valores basura en cada parámetro y
      `leerBusqueda` siempre devuelve una búsqueda válida.
- [ ] Las cuatro reglas del contrato tienen su test.
- [ ] `contarPorOpcion` para el paso 2 coincide con filtrar uno por uno (test por propiedad).
- [ ] `tituloDeBusqueda` cubre los casos de las reglas.
- [ ] `src/lib/busqueda/` no importa nada de `next`, `react` ni del DOM (lo verifica lint o un
      test de imports).
- [ ] El seed cubre todos los tipos y las tres operaciones (test sobre el seed).
- [ ] Los cuatro gates en verde.

## Riesgos

- **Cambiar el tipo `Property` rompe el código viejo** que todavía lo usa: se resuelve con
  andamios (Plan técnico), no adaptando código que se va a borrar.
- **La lista de zonas puede estar mal**: está en un solo archivo de datos y cambiarla no toca
  lógica.

## Preguntas abiertas

- 🙋 ¿Las localidades del partido van como zonas? (Pregunta 4 de la spec madre.)
- ¿Terrenos en alquiler? Hoy no (casi no se publican). Si una inmobiliaria los publica, se
  suma `alquiler` a `terreno` en la taxonomía y listo.

---

## Plan técnico

### Enfoque

Módulo nuevo `src/lib/busqueda/`, escrito test-first, con la taxonomía como **datos** (arrays
`as const` de los que se derivan los tipos TS) y `zod` para leer search params. El tipo
`Property` cambia en `src/lib/properties/types.ts` y el seed se reescribe. Va **después de
`identidad-y-base`**, que ya borró `ExploreClient` y dejó `/propiedades` y
`/propiedades/[id]` como **andamios** (lista simple con link): acá los andamios pasan a usar
`leerBusqueda` + `filtrarPropiedades` y el tipo nuevo, y se borran `filters.ts` y
`price-range.ts`, que quedan sin uso. El sitio compila en todo momento.

### Archivos

| Archivo | Qué |
|---|---|
| `src/lib/busqueda/taxonomia.ts` (+ test) | `OPERACIONES`, `TIPOS`, `ZONAS`, `GRUPOS_DE_ZONA`, `CARACTERISTICAS`, `ORDEN_DE_TIPOS`, tipos derivados (`Operacion`, `TipoPropiedad`, `Zona`, `Caracteristica`), `esVivienda`, `tiposDe(operacion)`, `caracteristicasDe(operacion)`, `etiqueta*` |
| `src/lib/busqueda/parametros.ts` (+ test) | `type Busqueda`, `BUSQUEDA_VACIA`, `leerBusqueda(params: URLSearchParams \| Record<string, string \| string[] \| undefined>)`, `escribirBusqueda(b, extra?)`, `normalizarBusqueda(b)`. zod con `.catch()` por campo para que un valor malo no tire todo |
| `src/lib/busqueda/filtrar.ts` (+ test) | `filtrarPropiedades`, `ordenarPropiedades`. Tipadas sobre `Filtrable` (`Pick<Property, "id" \| "operation" \| "type" \| "zone" \| "beds" \| "baths" \| "price" \| "currency" \| "features" \| "publishedAt">`), genéricas para devolver el mismo tipo que reciben: así el buscador cuenta en el cliente con un índice compacto |
| `src/lib/busqueda/contar.ts` (+ test) | `contarPorOpcion`, `sugerenciasSinResultados`, `filtrosActivos` |
| `src/lib/busqueda/precios.ts` (+ test) | `rangosDePrecio`, `redondearLindo`, `monedaPorDefecto` |
| `src/lib/busqueda/resumen.ts` (+ test) | `tituloDeBusqueda`, `chipsDeBusqueda` |
| `src/lib/busqueda/pasos.ts` (+ test) | `PASOS`, `pasoSiguiente`, `pasoAnterior`, `rutaDePaso`, `pasoAccesible` |
| `src/lib/busqueda/index.ts` | re-exporta lo público |
| `src/lib/properties/types.ts` | `Property` y `Agency` nuevos |
| `src/lib/properties/seed.ts` (+ test de cobertura) | ~36 propiedades |
| `src/lib/agencies/seed.ts` | `id`, `whatsapp`, `license` |
| `src/lib/properties/adapter.ts` | misma firma: `getProperties()`, `getPropertyById(id)` |
| `src/lib/format.ts` (+ test) | `formatPrice(price, currency)` acepta `null` → "Consultar precio"; `formatArea(p)` (m² o ha); se van `operationLabel`/`typeLabel` (pasan a la taxonomía) |
| `src/lib/markers.ts`, `src/components/map/property-map.tsx` | ajustar a los campos nuevos (`photos[0]`, `type` en español). El mapa se reusa en `resultados` |
| `src/app/propiedades/page.tsx` | el **andamio** de `identidad-y-base` pasa a usar `leerBusqueda` + `filtrarPropiedades` + `tituloDeBusqueda` (así el contrato ya se puede probar a mano por URL) |
| `src/app/propiedades/[id]/page.tsx` | el **andamio** se ajusta a los campos nuevos |
| `src/app/sitemap.ts` | ajustar a los campos nuevos |

**Se borran**: `src/lib/filters.ts` (+ test), `src/lib/price-range.ts` (+ test).

### Tests (TDD, en este orden, cada uno visto en rojo)

1. `taxonomia.test.ts`: slugs únicos; cada tipo tiene etiqueta e ícono; `tiposDe("temporario")`
   = quinta, casa, departamento en ese orden; `esVivienda`.
2. `parametros.test.ts`: las cuatro reglas del contrato; basura en cada parámetro (`dorm=abc`,
   `desde=-5`, `tipo=` vacío, parámetros repetidos `?tipo=casa&tipo=ph`); `desde > hasta` se
   invierten; moneda por defecto según operación; `sel` y `vista` se leen solo si se piden.
3. `filtrar.test.ts`: cada criterio solo; combinaciones Y/O; precio excluye la otra moneda y
   los `null`; `dorm` excluye a los que no tienen dato solo con filtro activo; orden por
   precio con monedas mezcladas; empate de `recientes` por id.
4. `contar.test.ts`: `contarPorOpcion` = filtrar uno por uno; `sugerenciasSinResultados`
   ordena y descarta los 0.
5. `precios.test.ts`: cuartiles con 4, 5 y 100 precios; menos de 4 → vacío; redondeo lindo
   (`137_500 → 140_000`, `487_000 → 490_000`).
6. `resumen.test.ts`: los casos de las reglas del título; chips con precio formateado.
7. `pasos.test.ts`: la secuencia; `rutaDePaso` arrastra la búsqueda; `pasoAccesible("tipo",
   sin operación) = false`.
8. `seed.test.ts`: cubre todos los tipos y operaciones; ids únicos; coordenadas dentro del
   partido.

Los tests usan **fixtures propias**, no el seed (el seed puede cambiar).

### Alternativas consideradas

- **Valores en inglés en el código y traducir a la URL**: una capa de mapeo más, y dos
  nombres para lo mismo. Se eligió un solo vocabulario (español) para valores.
- **`nuqs`** para el estado en la URL: resuelve la sincronización cliente, pero la lógica de
  lectura/escritura igual tiene que ser pura y testeable en `src/lib`; con
  `useSearchParams` + `history.replaceState` alcanza.
- **Adaptar el código viejo al tipo nuevo**: trabajo sobre código que se borra dos specs
  después. Andamios mínimos en su lugar.

## Tareas

**Bloque 1 — Taxonomía** · commit "Taxonomía de búsqueda: operaciones, tipos, zonas y características"
- [ ] `taxonomia.test.ts` en rojo → `taxonomia.ts` en verde.
- [ ] Gates en verde.

**Bloque 2 — Contrato de URL** · commit "Contrato de URL de la búsqueda con zod"
- [ ] `pnpm add zod` (si `identidad-y-base` no lo instaló).
- [ ] `parametros.test.ts` en rojo → `parametros.ts` en verde.
- [ ] Gates en verde.

**Bloque 3 — Filtrar, ordenar y contar** · commit "Filtrado, orden y conteos de la búsqueda"
- [ ] `filtrar.test.ts` → `filtrar.ts`.
- [ ] `contar.test.ts` → `contar.ts`.
- [ ] Gates en verde.

**Bloque 4 — Precios, resumen y pasos** · commit "Rangos de precio, títulos y pasos del buscador"
- [ ] `precios.test.ts` → `precios.ts`.
- [ ] `resumen.test.ts` → `resumen.ts`.
- [ ] `pasos.test.ts` → `pasos.ts`.
- [ ] `index.ts` con lo público.
- [ ] Gates en verde.

**Bloque 5 — Tipo nuevo, seed y andamios** · commit "Modelo de propiedad nuevo, seed ampliado y andamios de resultados y ficha"
- [ ] `types.ts` con `Property` y `Agency` nuevos.
- [ ] 🙋 Fotos para los tipos que no tienen (o se usa el estado "sin foto").
- [ ] `seed.ts` con ~36 propiedades + `seed.test.ts`; `agencies/seed.ts` con id, whatsapp, matrícula.
- [ ] `format.ts` (+ test): `formatPrice` con `null`, `formatArea`.
- [ ] Ajustar `markers.ts`, `property-map.tsx` y `sitemap.ts` a los campos nuevos.
- [ ] Andamios de `/propiedades` (con `leerBusqueda` + `filtrarPropiedades` + `tituloDeBusqueda`) y `/propiedades/[id]` al tipo nuevo.
- [ ] Borrar `filters.ts`, `price-range.ts` y sus tests.
- [ ] `grep -rn "sale\|rent\b\|coverUrl\|photoCount\|areaM2" src` sin resultados.
- [ ] Gates en verde.

**Cierre**
- [ ] `/cerrar modelo-de-busqueda`.

## Lo que se encontró al implementar

_(se completa al ejecutar)_
