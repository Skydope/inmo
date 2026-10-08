---
slug: vivi-bolivar
hito: 1
estado: approved
creada: 2026-10-08
aprobada: 2026-10-08
---

# Viví Bolívar: el hero de antes, con nuestro filtro

> Pedido de Manuel (2026-10-08), después de ver el inicio con la foto de la plaza: *"el hero
> section hay que refactorizarlo totalmente, saqué esa imagen de fondo, no me gusta… usá la
> que había puesto Matías… esa casa que se ponía en modo oscuro y modo claro… más
> estilizado"*; *"el fondo, el Viví Bolívar, eso, recuperalo… cómo estaba orientado, cómo
> subía el scroll… de una manera más simple"*. Y al aprobar: *"está perfecto lo de Viví
> Bolívar… pero el qué estás buscando, comprar, alquilar, alquiler temporario, eso tiene que
> seguir estando, nada más que mejor estilizado… tiene que verse en la primera pantalla"*;
> *"lo único principal que hay que cambiar es el hero section"*. Las secciones de abajo y la
> tipografía que definimos (*"grande, negrita, que cualquier gente de cualquier edad lo puede
> ver"*) **se quedan**.
>
> **Reemplaza** la presentación del paso 1 de [`buscador-guiado.md`](buscador-guiado.md) (la
> foto de la plaza con velo). De [`inicio-y-pie.md`](inicio-y-pie.md) cambia solo la franja
> de números (pasa a ser una frase) y el pie (suma el plano en el inicio y el cierre "VIVÍ
> BOLÍVAR"); el resto de sus secciones queda igual.

## Problema

- El inicio actual es correcto pero plano: una foto de la plaza bajo un velo oscuro y una
  tarjeta blanca encima. A Manuel no le gusta.
- La versión anterior (rama `main`, de Matías Asin, 30/09–06/10) tenía lo que Manuel quiere:
  la casa de campo de día y de noche, **"VIVÍ BOLÍVAR" enorme con el techo de la casa delante
  de las letras**, pestañas sobre la foto y la página que sube por encima. Se retiró entera,
  junto con lo que tenía mal:
  - las dos fotos siempre descargadas, con `<img>` sin optimizar;
  - un destello en modo oscuro (el server pintaba el día y el JS pasaba a la noche);
  - un dato inventado ("2012, año de arranque") y contadores que suben;
  - el crema, el dorado y la marca "Inmu".

## Objetivo

Un inicio que se reconoce a primera vista —la casa, VIVÍ BOLÍVAR detrás del techo, de día o de
noche según el celular— **con el filtro "¿Qué estás buscando?" en la primera pantalla**, y una
página que sube encima con una frase que cuenta qué es esto. Abajo, todo lo que ya está.

## Historias de usuario

- Como **quien entra por primera vez**, quiero entender en un vistazo que acá están las
  propiedades de Bolívar y empezar a buscar con un toque, sin bajar.
- Como **quien entra de noche con el celular en modo oscuro**, quiero que el inicio no me
  encandile.
- Como **inmobiliaria**, quiero que el portal se vea profesional.

## Pantallas

### Inicio a 360 × 640 (medido sobre la foto)

```
┌────────────────────────────────────┐
│░╭──────────────────────────────╮░░░│ papel; la foto en un marco redondeado con 8 px de margen
│ │ ☰      ▣ bolívar inmo  Ingresar│  │ pestaña invertida color papel, pegada al borde de la foto
│ ╰──────────────────────────────╯   │ (muescas cóncavas a los costados)
│              (cielo)               │
│               VIVÍ                 │ Encode Sans ancha 900, MAYÚSCULAS
│            BOLÍVAR                 │ tinta de día, blanco de noche
│      ▄▄▄▄▄▄▄ techo ▄▄▄▄▄▄▄▄▄       │ el techo tapa ~35 % de la R, nada de la B
│     █ casa (≈160 px) ████████ █    │
│ ╭────────────────────────────────╮ │ EL FILTRO: tarjeta blanca, 24 px de radio
│ │ ¿Qué estás buscando?           │ │ h2, font-titulo 22 px
│ │ ╭─────────────╮╭─────────────╮ │ │ Comprar y Alquilar lado a lado (64 px):
│ │ │ ⚿ Comprar   ││ ⌂ Alquilar  │ │ │ ícono, nombre y "22 en venta"
│ │ │ 22 en venta ││ 11 en alq.  │ │ │
│ │ ╰─────────────╯╰─────────────╯ │ │
│ │ ▦ Alquiler temporario      3 › │ │ a lo ancho, 48 px
│ ╰────────────────────────────────╯ │
│      ( Ver todas en el mapa › )    │ píldora blanca
╰────────────────────────────────────╯
╭────────────────────────────────────╮ la HOJA (papel, 24 px arriba) sube y tapa la foto
│ En Bolívar, todas las propiedades  │ Instrument Serif 28 px; se enciende palabra por
│ en un solo lugar. Las publican las │ palabra al bajar (de tinta-suave a tinta)
│ inmobiliarias de la ciudad. Hoy    │
│ hay 36, de 4 inmobiliarias, en 14  │
│ zonas.                             │
│ Recién publicadas · Buscá por tipo │ todo como está hoy
│ · Destacadas · Por zona ·          │
│ Inmobiliarias · ¿Sos inmobiliaria? │
╰────────────────────────────────────╯
┌────────────────────────────────────┐ PIE (tinta), como hoy, más:
│ ¿Buscás casa en Bolívar?           │ solo en el inicio: línea en serif
│ Empezá por acá.                    │
│ (columnas de hoy)                  │
│ ░╱░░│░░╲░░│░░╱░│░ plano de Bolívar │ solo en el inicio: las calles, se dibujan al llegar
│ VIVÍ BOLÍVAR                       │ en todas las páginas: el cierre
│ © … · Plano: © colaboradores OSM   │
└────────────────────────────────────┘
```

### Inicio a 1280 px

La casa ocupa la derecha (zoom 1, centrada). VIVÍ BOLÍVAR a la izquierda (≈190 px), con el
techo delante de "VAR". Pestañas: logo a la izquierda; al centro Comprar · Alquilar ·
Temporario · Mapa · Inmobiliarias; Ingresar a la derecha. El filtro abajo a la izquierda, con
las tres opciones en fila y "Ver todas en el mapa" en su encabezado.

## Comportamiento

- **Día o noche** según `prefers-color-scheme` del navegador: solo cambian la foto y el color
  del título. Sin JS, sin botón, sin destello, **una sola foto descargada**. El resto del sitio
  sigue claro (el modo oscuro completo, en el hito 2).
- **El filtro** es el paso 1 del buscador guiado re-vestido: cada opción es un link al paso 2
  con su conteo. Con conteo 0, la opción queda sin link y dice "Sin propiedades por ahora".
  El `h1` es "Viví Bolívar"; la pregunta es el `h2` del filtro. Sin JS anda igual.
- **La hoja**: el hero queda quieto (`sticky`) y la página sube encima al scrollear. En
  pantallas de menos de 37 rem de alto (celular acostado) el hero no es sticky.
- **La barra fija**: cuando la hoja tapa las pestañas, aparece el header blanco de siempre
  (en CSS, con `animation-timeline: scroll()`). Sin soporte no hay barra: los links están en
  el pie.
- **La frase** sale de los datos (`fraseDelPortal`): "Hoy hay 36, de 4 inmobiliarias, en 14
  zonas." Con menos de 10 propiedades, solo las dos primeras oraciones.
- **El plano del pie**: las calles del casco urbano de Bolívar, sacadas una vez de
  OpenStreetMap a datos estáticos (ODbL, atribución visible). Decorativo (`aria-hidden`).

## Tipografía y movimiento (lo que cambia de la identidad)

- **Nuestra letra se queda**: Encode Sans en todo lo funcional (filtro, secciones, tarjetas,
  botones, el resto del sitio).
- **Display**: Encode Sans ancha (`wdth` 125, 900, mayúsculas) solo para VIVÍ BOLÍVAR (hero y
  cierre del pie). Es la misma familia: 0 KB extra.
- **La voz**: Instrument Serif (400, derecha) **solo** en la frase del inicio y la línea del pie
  del inicio. Nunca menos de 24 px, nunca en itálica, nunca en controles ni datos.
- **Movimiento**: una excepción acordada al invariante, solo en el inicio y todo en CSS:
  - la hoja que sube (`sticky`);
  - la frase que se enciende cambiando el color;
  - el plano que se dibuja;
  - la barra fija que aparece.

  Todo va detrás de `@supports (animation-timeline: …)` y `prefers-reduced-motion:
  no-preference`. Sin soporte o con movimiento reducido, la página queda quieta y completa.
  Sin librerías, contadores ni entradas animadas.

## Alcance

**Entra:**
- El hero: casa de día y de noche, VIVÍ BOLÍVAR con profundidad, pestañas y el filtro.
- La hoja y la barra fija.
- La frase, que reemplaza la franja de números.
- El pie: el cierre VIVÍ BOLÍVAR en todas las páginas; en el inicio, además, la línea en
  serif y el plano.
- Las fotos de la casa con su crédito; sale la de la plaza.
- Open Graph con la casa.
- La documentación: identidad, `DESIGN.md`, `CLAUDE.md`, `descartado.md`.

**No entra:** el estilo nuevo en el resto del sitio, bento, radios o botones nuevos, serif en
títulos, modo oscuro completo, botón día/noche, librerías de movimiento.

## Criterios de aceptación

- [ ] A **360 × 640** entran sin scroll: VIVÍ BOLÍVAR, "¿Qué estás buscando?", Comprar,
      Alquilar, Alquiler temporario y "Ver todas en el mapa".
- [ ] Con `colorScheme: dark` se ve la foto de noche y el título blanco; en claro, la de día
      y el título en tinta.
- [ ] Se descarga **una sola** foto del hero (AVIF o WebP).
- [ ] El techo tapa la base de la R (entre 15 % y 50 %) y no tapa la B, a 360, 390, 412, 768
      y 1280 px.
- [ ] Contraste del título contra el cielo ≥ 3:1, de día y de noche (medido).
- [ ] La hoja sube sobre el hero (captura a mitad de scroll) y la barra fija aparece cuando
      tapa las pestañas.
- [ ] La frase: el texto exacto sale de los datos, y ninguna palabra baja de 4,5 de contraste
      en ningún momento del scroll.
- [ ] Instrument Serif: nunca menos de 24 px ni en itálica, y solo en el inicio.
- [ ] El pie del inicio tiene el plano y el link de atribución de OSM (≥ 44 px); los demás
      pies no tienen plano.
- [ ] Sin JS, el inicio se ve y el filtro anda.
- [ ] Lighthouse mobile: inicio ≥ 90, accesibilidad 100; `/propiedades` sigue ≥ 90.
- [ ] Detector de Impeccable sin hallazgos nuevos en el inicio.
- [ ] 👀 Manuel lo recorre en el celu, de día y de noche.

## Riesgos

- **La casa no es de Bolívar** (parece un render, posiblemente con IA). Es ilustrativa: el
  título dice "Viví Bolívar", no "esta casa está en Bolívar". Queda en `CREDITOS.md` para que
  Manuel confirme el origen. Si llega la foto aérea, necesita su propio polígono del primer
  plano.
- **La foto mide 1672 × 941**: en el celu, con zoom 1,36, se ve agrandada unas 2,4×. Si se
  nota blanda, bajar el zoom a 1,25.
- **Medidas tipográficas estimadas** (ancho de "BOLÍVAR" en `em`, el hundido): se calibran con
  Playwright.
- `text-box` todavía no anda en todos los navegadores: sin él, el título queda unos px más
  arriba (aceptable).
- Que `<picture>` cambie de foto en vivo al cambiar el modo del celular: si no, cambia al
  recargar.
- Overpass caído al generar el plano: el script corre una vez y los datos quedan en el repo;
  si falla, el pie va sin plano.

## Preguntas resueltas (Manuel, 2026-10-08)

- Noche: solo el hero.
- Pie: con el plano de Bolívar.
- El filtro "¿Qué estás buscando?" va en la primera pantalla, mejor estilizado.
- Las secciones de abajo y nuestra tipografía quedan como están; nada de bento.
- La serif, solo en la frase y el pie.

---

## Plan técnico

### Enfoque

Todo server components y CSS. El día y la noche son un `<picture>` armado con `getImageProps`
(dos fuentes por `media`). El efecto de profundidad usa un "escenario" con la proporción de la
foto que cubre el marco (unidades de contenedor `cq` y un punto focal): la foto llena el
escenario y se repite encima del título, recortada con `clip-path: polygon(…%)`. Las dos copias
usan la misma URL y los mismos `srcset/sizes`, así que se descarga un solo archivo. El título se
ubica **desde el techo** (`techoEn(x)` de `src/lib/casa.ts`), así la proporción tapada de cada
letra es la misma en todos los anchos. El scroll se resuelve con `sticky` y `animation-timeline`.

### Archivos

| Archivo | Qué |
|---|---|
| `src/lib/casa.ts` (+ test) | Medidas de la foto, polígono del primer plano, `poligonoEnPorcentaje()`, `techoEn(x)` |
| `src/lib/inicio.ts` (+ test) | `fraseDelPortal(numeros)` |
| `public/images/inicio/casa-dia.webp`, `casa-noche.webp` | De `main` (`6d60560`), Matías Asin. Sale `fondo.webp` |
| `src/components/inicio/hero.tsx` | Marco, escenario, `<picture>` día/noche ×2, título, filtro |
| `src/components/inicio/pestanas.tsx` | Pestañas invertidas (usa `Menu` y `Logo`) |
| `src/components/inicio/filtro.tsx` | "¿Qué estás buscando?" (reemplaza a `OpcionGrande`, que se borra) |
| `src/components/inicio/frase.tsx` | Una `<span>` por palabra; reemplaza a `numeros.tsx` |
| `src/components/shell/header.tsx` | Variante `fija` (la barra del inicio) |
| `src/components/shell/pie.tsx` (+ `plano-de-bolivar.tsx`, `plano-de-bolivar.datos.ts`) | Cierre VIVÍ BOLÍVAR; en el inicio, línea en serif, plano y atribución |
| `scripts/plano-bolivar.mjs` | Overpass → proyección → unión de tramos → Douglas-Peucker → datos |
| `src/app/layout.tsx` | `Instrument_Serif` (`weight: "400"`, `preload: false`); Open Graph con la casa |
| `src/app/globals.css` | `font-voz`, `font-display`, escenario y título, pestañas, hoja, barra fija, frase y plano (scroll-driven) |
| `src/app/page.tsx` | El inicio nuevo |
| `scripts/contraste-sobre-foto.mjs` | Mide `.vivi-titulo` en los dos modos |
| `e2e/inicio.spec.ts`, `e2e/inicio-sin-js.spec.ts`, `e2e/tipografia.spec.ts`, `e2e/pie.spec.ts` | Ver Tests |

### Tests

1. `casa.test.ts`: el polígono en % (`0% 75.45%, 29.25% 75.45%, …`), `techoEn(836) ≈ 488,9`,
   `techoEn(1330) ≈ 438,8`, `techoEn(300) = 710`.
2. `inicio.test.ts`: `fraseDelPortal` con 36/4/14, singulares ("1 inmobiliaria", "1 zona") y
   `null`.
3. E2E:
   - El pliegue a 360 × 640.
   - La noche, con `colorScheme: dark`.
   - Una sola descarga de la foto.
   - El techo sobre la R y no sobre la B.
   - Los `h2` en orden: "¿Qué estás buscando?" primero.
   - La frase: texto y contraste en cuatro posiciones de scroll.
   - Instrument Serif: nunca menos de 24 px ni en itálica.
   - El pie con plano solo en el inicio.
   - El inicio sin JS.

## Tareas

**Bloque 0 — Spec y documentos** · commit "Spec vivi-bolivar: el hero de antes con nuestro filtro"
- [x] Esta spec, `descartado.md`, `CLAUDE.md`, `PRODUCT.md`, `identidad-visual`, `DESIGN.md`, `ROADMAP.md`.

**Bloque 1 — El hero** · commit "Inicio: la casa de día y de noche con VIVÍ BOLÍVAR"
- [x] `casa.test.ts` → `casa.ts`.
- [x] Fotos, `hero.tsx`, `pestanas.tsx`, `filtro.tsx`, CSS, `page.tsx`, Open Graph, `CREDITOS.md`.
- [x] E2E del hero; capturas a 360, 390, 412, 768 y 1280, de día y de noche; contraste medido.
- [x] Gates + `pnpm e2e`.

**Bloque 2 — La hoja y la frase** · commit "Inicio: la hoja sube y la frase cuenta qué es esto"
- [x] `fraseDelPortal` (test primero), Instrument Serif, `frase.tsx`, barra fija.
- [x] E2E de la frase y de la tipografía.
- [x] Gates + `pnpm e2e`.

**Bloque 3 — El pie con el plano** · commit "Pie: el plano de Bolívar y VIVÍ BOLÍVAR"
- [x] Script y datos del plano; `PlanoDeBolivar`; `Pie({ inicio })`.
- [x] E2E del pie.
- [x] Gates + `pnpm e2e`.

**Bloque 4 — Mirar**
- [ ] Capturas a mitad de scroll; Lighthouse mobile (build de producción); detector.
- [ ] 👀 Manuel en el celu, de día y de noche.

**Cierre**
- [ ] `/cerrar vivi-bolivar` (y `inicio-y-pie`, `buscador-guiado`, `resultados`).

## Lo que se encontró al implementar

- **El techo tapa igual en todos los tamaños** (medido con Playwright de 360 × 640 a
  1920 × 1080, de día y de noche): R 33–35 %, A 21–24 %, V 10–12 %, B, O y L nada. El título se
  apoya en el techo (`techoEn`), no en un % del marco.
- **Una sola descarga**: las dos copias de la foto (la de fondo y la del recorte) piden la
  misma URL; el e2e lo verifica escuchando la red.
- **El `<picture>` cambia de foto en vivo** al pasar el celular a modo oscuro (visto con la
  emulación de Playwright), sin recargar.
- **Contraste del título contra el cielo** (`scripts/contraste-sobre-foto.mjs`, percentil 1):
  de día 6,9–9,6 y de noche 9,8–11,4. Pide 3 (texto grande): pasa holgado, sin sombras.
- **El filtro**: Comprar y Alquilar lado a lado no entraban con el número y la flecha en la
  misma línea ("C…"); el número pasó abajo del nombre ("22 en venta") y la flecha quedó solo
  en Alquiler temporario. En escritorio, la tercera columna es un 30 % más ancha para que
  entre "Alquiler temporario".
- **La hoja y la barra** (360 × 640): la frase se enciende entre los 100 y los 550 px de
  scroll; la barra aparece entre 528 y 584 px (cuando la hoja llega a las pestañas) y desde ahí
  las pestañas dejan de ser enfocables. El build mantiene `animation-timeline` (Lightning CSS no
  junta las propiedades en el atajo).
- **El plano** (Overpass, 2026-10-08): 191 avenidas y 429 calles en 12 KB de datos, la caja
  de ≈ 4 × 4 km toma el casco urbano entero (la cuadrícula en diagonal, la plaza, el parque con
  la laguna). Node no llegaba a Overpass (el intento de conexión de 250 ms no alcanza en esta
  red): el script se corre con `--network-family-autoselection-attempt-timeout=3000`.
- **El dibujo del plano** va con rangos de `entry` (mientras entra en pantalla): está al fondo
  de la página y con `cover` nunca terminaba de dibujarse.
- **"Quiero comprar" / "Quiero alquilar"** en la invitación del pie: no "Comprar", para no
  repetir el nombre de los links de la columna Buscar.
- **Verificación** (build de producción, 2026-10-08): Lighthouse mobile del inicio 92–93 (86
  en el primer pedido, mientras se optimiza la foto), `/propiedades` 91; accesibilidad, buenas
  prácticas y SEO 100. La casa baja una sola vez (AVIF, 35 KB) y la serif (15 KB) solo en el
  inicio.
- **Detector de Impeccable** en el inicio:
  - `clipped-overflow-container` en el marco de la foto: es a propósito, porque el marco
    redondeado recorta la casa. El recorte de `.casa`, que sobraba, se sacó.
  - `organic-clip-path`: es el polígono del techo, el efecto de profundidad.
  - `nested-cards`: las opciones del filtro son botones con fondo dentro de la tarjeta
    blanca. Para bajar un nivel, se sacó el círculo blanco detrás del ícono. Queda a juicio
    de Manuel cuando lo vea.
- **Sin entrada animada**: el borrador la tenía, pero el invariante acordado no suma entradas
  animadas; el hero aparece quieto.
