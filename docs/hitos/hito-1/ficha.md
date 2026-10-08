---
slug: ficha
hito: 1
estado: approved
aprobada: 2026-10-08
creada: 2026-10-08
---

# Ficha de la propiedad

> `/propiedades/[id]`: todo lo que hace falta para decidir si se consulta, y **consultar con
> un toque**: la barra de WhatsApp y llamar queda fija abajo. Es también lo que se comparte
> por WhatsApp, así que la vista previa del link tiene que mostrar foto y precio. Depende de
> `resultados` (tarjeta chica, mapa) y `modelo-de-busqueda`.

## Problema

- La ficha actual es una columna larga: portada, datos, más fotos sueltas, descripción,
  características y un botón de contacto **al final**. En el celu, para consultar hay que
  bajar hasta el fondo.
- No hay mapa, ni "cómo llegar", ni propiedades parecidas, ni forma de compartir; el link
  compartido por WhatsApp no muestra foto ni precio.
- En tandilprop hay datos rotos a la vista ("1 m²") y la descripción es un bloque sin formato.

## Objetivo

Desde la ficha, en el celular: se pasan las fotos deslizando, se ve **precio, qué es, dónde y
los datos clave** sin bajar, se lee la descripción si se quiere, y **"Consultar por WhatsApp"
está siempre a mano** con un mensaje que ya dice qué propiedad es. Compartir el link muestra
la foto, el precio y la zona.

## Historias de usuario

- Como **quien busca**, quiero consultar por WhatsApp sin tener que escribir qué propiedad
  es, para que la inmobiliaria sepa de qué le hablo.
- Como **quien busca**, quiero mandarle la propiedad a mi pareja y que en el chat ya se vea la
  foto y el precio.
- Como **quien busca**, quiero ver dónde queda y cómo llegar.
- Como **quien busca**, si esta no me convence, quiero ver otras parecidas sin volver a buscar.
- Como **inmobiliaria**, quiero que mi nombre, matrícula y dirección se vean, para dar
  confianza.

## Pantalla

```
┌────────────────────────────────────┐
│ ‹ Volver                  ⇪ Compartir│ barra superior (56), blanca
├────────────────────────────────────┤
│┌──────────────────────────────────┐│ galería 4:3 a todo el ancho
││ VENTA                            ││ etiqueta cartel
││        (deslizar: fotos)         ││ acá deslizar = fotos (no hay otro gesto horizontal)
││                            1/9 ⤢ ││ contador · pantalla completa
│└──────────────────────────────────┘│
│ US$ 120.000                        │ 30 px semi condensada, tabular
│ + $ 45.000 de expensas             │ si hay
│ Casa de 3 dormitorios con patio    │ h1, 20 px
│ Belgrano 450 · Centro              │ o "Centro · dirección a consultar"
│                                    │
│ ┌────────┬────────┬───────┬──────┐ │ datos clave: los que hay, hasta 8,
│ │ 180 m² │ 120 m² │   3   │  2   │ │ grilla de 4 columnas (2 filas máx.)
│ │ total  │ cubier.│ dorm. │baños │ │
│ ├────────┼────────┼───────┼──────┤ │
│ │   4    │   1    │ 15    │      │ │
│ │ amb.   │ coch.  │ años  │      │ │
│ └────────┴────────┴───────┴──────┘ │
│ (Apto crédito) (Pileta) (Parrilla) │ características (chips informativos)
│                                    │
│ Descripción                        │ h2
│ Primeros ~300 caracteres…          │
│ Leer más ⌄                         │ <details>: anda sin JS
│                                    │
│ Ubicación                          │
│ ┌──────────────────────────────┐   │ mapa chico, quieto (se carga al llegar)
│ │              ●               │   │ pin, o un círculo si la dirección no se muestra
│ └──────────────────────────────┘   │
│ Cómo llegar ›   Ver en el mapa ›   │ app de mapas · resultados con esta elegida
│                                    │
│ Publicada por                      │
│ ◫ Inmobiliaria Norte               │ logo 40 + nombre
│   Matrícula CMCPSI 1234            │
│   San Martín 120, Bolívar          │
│                                    │
│ Parecidas                          │
│ [tarjeta][tarjeta][tarj…  →        │ fila de tarjetas chicas
│                                    │
│ Publicada el 30/9/2026 · Código bol-07│ 13 px tinta-suave
│ (pie)                              │
├────────────────────────────────────┤ barra de contacto fija (blanca, sombra, safe-area)
│ ┌──────────────────────────┐ ┌───┐ │
│ │ ✆ Consultar por WhatsApp │ │ ☏ │ │ principal (56) + llamar (56 × 56)
│ └──────────────────────────┘ └───┘ │
└────────────────────────────────────┘
```

### Comportamiento

- **Volver**: si se llegó desde el sitio, vuelve atrás en el historial (resultados con la
  misma tarjeta, gracias a `sel`); si se entró directo por un link compartido, va a
  `/propiedades?operacion=<la de la propiedad>&tipo=<su tipo>`.
- **Compartir**: abre el menú de compartir del celular (Web Share API) con título, texto y
  link; donde no existe (escritorio), copia el link y avisa "Link copiado".
- **Galería**: deslizar pasa fotos; tocar abre la **galería a pantalla completa** (fondo
  `tinta`, deslizar, pellizcar para ampliar, ✕ para cerrar, Esc en escritorio). Sin fotos: el
  bloque `papel` con el ícono del tipo.
- **Datos clave**: solo los que existen (nunca "0 m²" ni "—"). Orden: superficie total,
  cubierta (o hectáreas en campos), dormitorios, baños, ambientes, cocheras, antigüedad ("A
  estrenar" si es 0).
- **Descripción**: los primeros ~300 caracteres cortados en un final de oración; el resto en
  un `<details>` "Leer más". Los saltos de línea del texto se respetan como párrafos.
- **Ubicación**: un mapa chico **no interactivo** que se carga recién cuando la sección entra
  en pantalla. Si `showAddress` es `false`: un círculo de ~300 m sin pin, el texto
  "Ubicación aproximada" y sin "Cómo llegar". **Ver en el mapa** →
  `/propiedades?vista=mapa&sel=<id>` (la propiedad entre las demás).
- **Consultar por WhatsApp** abre `wa.me/<whatsapp de la inmobiliaria>` con el mensaje:
  > Hola, vi en Bolívar Inmo esta casa en venta en Centro (US$ 120.000):
  > https://bolivarinmo.com.ar/propiedades/bol-07 ¿Sigue disponible?

  Si la inmobiliaria no tiene WhatsApp, el botón principal es **Llamar**; si tampoco tiene
  teléfono, **Escribir un mail** (con el mismo mensaje). El botón chico de llamar solo aparece
  si hay teléfono y el principal es WhatsApp.
- **Parecidas**: hasta 6, misma operación y tipo (o los dos de vivienda), primero las de la
  misma zona, después por cercanía de precio. No aparece la propia. Si no hay, la sección no
  se muestra.
- **Propiedad que ya no existe**: "Esta propiedad ya no está publicada." + "Ver propiedades
  parecidas" (resultados de la misma operación y tipo si se pueden deducir, si no
  `/propiedades`). Responde 404.

### Vista previa al compartir

El link de una ficha, pegado en WhatsApp, muestra una **imagen generada** de 1200 × 630: la
primera foto, encima una franja blanca con el precio, "Casa en venta · Centro" y el logo.
Título: "Casa en venta en Centro · US$ 120.000"; descripción: el comienzo del texto.

### Escritorio (≥ 1024 px)

Galería grande arriba (foto principal + 4 miniaturas en grilla); debajo, dos columnas:
contenido a la izquierda y, a la derecha, una **tarjeta fija** con precio, inmobiliaria y los
botones de contacto (reemplaza la barra fija de abajo).

## Alcance

**Entra:** la pantalla, la galería completa, el contacto con mensaje armado, compartir, el
mapa chico, parecidas, la imagen para compartir, el 404 amable, escritorio.

**No entra:** formulario de contacto (D10 de la spec madre); favoritos; datos estructurados
para Google (JSON-LD, hito 3); página de la inmobiliaria con todas sus propiedades (hito 2);
"reservada" / "vendida" (el modelo no lo tiene todavía; hito 2 con datos reales).

## Criterios de aceptación

- [ ] A 360 × 640, sin bajar, se ven: foto, precio, título y la barra de contacto.
- [ ] La barra de contacto queda fija mientras se baja y no tapa el final del contenido.
- [ ] El link de "Consultar por WhatsApp" es `https://wa.me/<número>?text=…` y el texto
      decodificado incluye el tipo, la operación, la zona, el precio y la URL de la ficha
      (e2e). Es un `<a>`: anda sin JS.
- [ ] Sin WhatsApp en la inmobiliaria → el principal es "Llamar" (`tel:`); sin teléfono →
      "Escribir un mail" (`mailto:`). (Test de `contact.ts` + e2e con una propiedad de prueba
      así.)
- [ ] Ningún dato clave muestra 0, vacío o "—".
- [ ] La descripción larga se corta con "Leer más" y se expande **con JS apagado**.
- [ ] Galería: deslizar cambia de foto; tocar abre pantalla completa; ✕ y Esc cierran.
- [ ] El mapa chico **no** se pide hasta que la sección de ubicación entra en pantalla (e2e
      mira la red). Con dirección oculta: círculo, sin pin, sin "Cómo llegar".
- [ ] Desde resultados → ficha → Volver: misma tarjeta. Entrando directo → Volver: resultados
      de la misma operación y tipo.
- [ ] `og:image` de la ficha responde una imagen de 1200 × 630 con el precio (e2e la pide).
- [ ] `/propiedades/no-existe` responde 404 con la salida a parecidas.
- [ ] 👀 Manuel abrió una ficha en su celular, tocó Consultar (llegó a WhatsApp con el mensaje)
      y compartió un link a su propio chat y vio la vista previa.

## Riesgos

- **La vista previa de WhatsApp** se cachea del lado de WhatsApp y tiene sus propias reglas
  de tamaño de imagen (🔎 verificar el peso máximo que muestra; apuntar a < 300 KB en JPEG).
  En local no se puede probar (WhatsApp necesita una URL pública): se verifica en el primer
  deploy.
- **Números de WhatsApp mal cargados** (con 0 o 15): `contact.ts` normaliza a formato
  internacional argentino (`549` + característica sin 0 + número sin 15) y tiene test.

## Preguntas abiertas

- ¿El mensaje de WhatsApp está bien así? *(Default: el de arriba.)*
- ¿Se muestra el código de la propiedad (para que la inmobiliaria la ubique)? *(Default: sí,
  chico al final.)*

---

## Plan técnico

### Enfoque

Página **server** que arma todo en el servidor (mensaje de contacto, datos clave, parecidas,
corte de descripción) con funciones puras de `src/lib`. Solo son cliente: la barra superior
(volver y compartir), la galería (y su versión a pantalla completa con `Dialog` de Base UI) y
el mapa chico (MapLibre con `interactive: false`, cargado con `next/dynamic` cuando la sección
entra en pantalla). La barra de contacto son `<a>` puros. La imagen para compartir se genera
con `opengraph-image.tsx` (`next/og`).

### Archivos

| Archivo | Qué |
|---|---|
| `src/app/propiedades/[id]/page.tsx` | Reemplaza el andamio. `await params`; `getPropertyById`; `notFound()` si no está; `generateMetadata`; `generateStaticParams` se queda mientras el seed sea la fuente |
| `src/app/propiedades/[id]/opengraph-image.tsx` | 1200 × 630 con la foto, precio, tipo · zona y logo (fuente Encode Sans cargada como `ArrayBuffer`) |
| `src/app/propiedades/[id]/not-found.tsx` | El 404 amable |
| `src/lib/contact.ts` (+ test) | `mensajeDeConsulta(p, url)`, `linksDeContacto(agency, mensaje) → { principal, llamar? }`, `normalizarWhatsApp(numero)` |
| `src/lib/properties/similares.ts` (+ test) | `similares(p, todas, max = 6)` |
| `src/lib/properties/datos-clave.ts` (+ test) | `datosClave(p) → { valor, etiqueta, icono }[]` sin vacíos ni ceros, en el orden de la spec |
| `src/lib/texto.ts` (+ test) | `cortarDescripcion(texto, ~300) → { inicio, resto }` en final de oración; `parrafos(texto)` |
| `src/lib/format.ts` (+ test) | `formatFecha("2026-09-30") → "30/9/2026"` |
| `src/components/ficha/barra-superior.tsx` | `"use client"`: volver (historial o resultados de la misma operación y tipo) y compartir (Web Share API o copiar) |
| `src/components/ficha/galeria.tsx` | `"use client"`: scroll-snap, contador, abrir pantalla completa |
| `src/components/ficha/galeria-completa.tsx` | `Dialog` de Base UI, fondo `tinta`, `touch-action: pinch-zoom` |
| `src/components/ficha/encabezado-ficha.tsx` | Precio, expensas, título, dirección o zona |
| `src/components/ficha/datos-clave.tsx`, `caracteristicas.tsx`, `descripcion.tsx` | Server |
| `src/components/ficha/ubicacion.tsx` | `"use client"`: `IntersectionObserver` → `next/dynamic` de `mapa-chico.tsx`; links "Cómo llegar" (`https://www.google.com/maps/search/?api=1&query=lat,lng`) y "Ver en el mapa" |
| `src/components/map/mapa-chico.tsx` | MapLibre no interactivo con el mismo `estilo.json`; pin o círculo |
| `src/components/ficha/inmobiliaria.tsx`, `parecidas.tsx`, `barra-de-contacto.tsx` | Server; parecidas reusa la tarjeta `chica` |
| `e2e/ficha.spec.ts` | Los criterios de aceptación |

**Se borran**: el andamio de la ficha.

### Datos

Nada nuevo en el modelo. Las inmobiliarias de prueba necesitan casos sin WhatsApp y sin
teléfono para probar los caminos alternativos (se suman al seed en el bloque 1).

### Tests (TDD)

1. `contact.test.ts`: mensaje con y sin precio ("Consultar precio"), con dirección oculta (no
   se menciona la calle), URL absoluta; prioridad WhatsApp → teléfono → mail;
   `normalizarWhatsApp` con `02314 15-123456`, `+54 9 2314 123456`, `2314123456`.
2. `similares.test.ts`: excluye la propia; misma operación; prioriza zona y después precio;
   respeta el máximo; vivienda con vivienda.
3. `datos-clave.test.ts`: omite ceros y vacíos; hectáreas en campos; "A estrenar".
4. `texto.test.ts`: corte en oración, texto corto sin `resto`, párrafos.
5. E2E `ficha.spec.ts` (`android-chico`, `iphone`, `escritorio`, y `sin-js` para "Leer más" y
   el link de WhatsApp): todos los criterios.

### Riesgos

- `next/og` con una fuente variable: puede necesitar una instancia estática de Encode Sans
  (🔎 verificar; si no, se baja el `.ttf` de la instancia semi condensada bold a
  `src/app/propiedades/[id]/`).
- Detectar "se llegó desde el sitio" para Volver: `document.referrer` del mismo origen o una
  marca en `sessionStorage` que pone resultados al navegar a una ficha. Se elige al
  implementar; los dos casos tienen e2e.

### Alternativas consideradas

- **Formulario de contacto**: nadie lo contesta rápido en un pueblo; WhatsApp sí.
- **Mapa estático (imagen)**: OpenFreeMap no genera imágenes estáticas
  ([verificado](https://openfreemap.org/), "no static image generation"); el mapa chico cargado
  al llegar a la sección cuesta lo mismo que una imagen solo si se usa.
- **"Leer más" con JS**: con JS apagado el texto quedaría cortado para siempre; `<details>`
  anda siempre.

## Tareas

**Bloque 1 — Lógica de la ficha** · commit "Ficha: mensaje de consulta, datos clave, parecidas y corte de descripción"
- [ ] `contact.test.ts` → `contact.ts` (mensaje, links, normalizar WhatsApp).
- [ ] `datos-clave.test.ts` → `datos-clave.ts`.
- [ ] `similares.test.ts` → `similares.ts`.
- [ ] `texto.test.ts` → `texto.ts`; `formatFecha` (+ test).
- [ ] Seed: una inmobiliaria sin WhatsApp y otra sin teléfono.
- [ ] Gates en verde.

**Bloque 2 — La pantalla** · commit "Ficha: galería, precio, datos, descripción y contacto fijo"
- [ ] `page.tsx` (reemplaza el andamio) + `generateMetadata`.
- [ ] `barra-superior.tsx`, `galeria.tsx`, `galeria-completa.tsx`.
- [ ] `encabezado-ficha.tsx`, `datos-clave.tsx`, `caracteristicas.tsx`, `descripcion.tsx`.
- [ ] `barra-de-contacto.tsx`.
- [ ] E2E: pliegue, contacto (los tres caminos), Leer más sin JS, galería, Volver.
- [ ] Gates + `pnpm e2e`.

**Bloque 3 — Ubicación, inmobiliaria, parecidas, 404** · commit "Ficha: ubicación, inmobiliaria y propiedades parecidas"
- [ ] `mapa-chico.tsx` + `ubicacion.tsx` (carga al llegar; círculo si la dirección está oculta).
- [ ] `inmobiliaria.tsx`, `parecidas.tsx`, `not-found.tsx`.
- [ ] E2E: el mapa no se pide antes de llegar; dirección oculta; 404.
- [ ] Gates + `pnpm e2e`.

**Bloque 4 — Compartir** · commit "Ficha: compartir y vista previa para WhatsApp"
- [ ] Compartir en `barra-superior.tsx` (Web Share API o copiar).
- [ ] `opengraph-image.tsx` (verificar la fuente con `next/og`).
- [ ] E2E: `og:image` responde 1200 × 630.
- [ ] Escritorio: galería en grilla y tarjeta fija de contacto.
- [ ] Gates + `pnpm e2e`.

**Bloque 5 — Mirar** · sin commit si no hay cambios
- [ ] Capturas a 360 × 640, 390 × 844 y 1280 × 800 (arriba, medio, abajo, galería completa).
- [ ] Detector de Impeccable sobre una ficha.
- [ ] 👀 Manuel abre una ficha en el celu, consulta por WhatsApp y comparte (la vista previa se
      verifica en el primer deploy público: queda como pendiente si todavía no hay).

**Cierre**
- [ ] `/cerrar ficha` y, si es la última, el cierre del hito (§ 11 de la spec madre).

## Lo que se encontró al implementar

_(se completa al ejecutar)_
