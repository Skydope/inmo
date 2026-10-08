---
slug: identidad-y-base
hito: 1
estado: approved
aprobada: 2026-10-08
creada: 2026-10-08
---

# Identidad y base técnica

> La marca Bolívar Inmo, cómo se ve (paleta, tipografía, íconos, componentes) y la base
> técnica sobre la que se construyen las pantallas: shadcn sobre Base UI, Playwright y la
> limpieza del front viejo. **Es lo primero que Manuel ve del rediseño**: una muestra en el
> celu antes de seguir.

## Problema

- La marca es "Inmu" y el proyecto va a ser **bolivarinmo.com.ar**.
- El sistema visual actual ("papel cálido": crema `#efe8dc`, Archivo Black + Instrument Serif
  en itálica, vidrio esmerilado, dorado, hero día/noche animado) es justamente lo que hoy sale
  por defecto cuando se pide algo *premium*, y no es lo que pidió Manuel: **simple, elegante,
  claro, sin fondos recargados ni animaciones**.
- No hay librería de componentes (un botón hecho a mano), los íconos son Phosphor (distinto de
  la familia), hay modo oscuro que duplica la verificación, y no hay e2e.

## Objetivo

Bolívar Inmo tiene una identidad propia, sobria y reconocible, escrita en tokens con
contrastes medidos; un set de componentes base accesibles (shadcn sobre Base UI) y un shell
(header, menú, pie) que usan todas las pantallas; Playwright corre a 360 px; y del front
viejo no queda nada que estorbe.

## Historias de usuario

- Como **quien busca**, quiero reconocer de un vistazo qué es este sitio y de dónde es, para
  confiar en que las propiedades son de Bolívar.
- Como **quien busca**, quiero leer todo sin esforzarme en la pantalla del celu, a pleno sol.
- Como **Manuel**, quiero ver la identidad en mi celular antes de que se construyan las
  pantallas, para corregir el rumbo temprano.

## Dirección visual: "el cartel y el plano"

La identidad sale de **los dos objetos del mundo inmobiliario de un pueblo**, no de la
categoría "inmobiliaria premium":

- **El cartel de "VENDE"** que las inmobiliarias clavan en el frente de la casa: letras
  **compactas y negras**, color **liso**, contraste total, se lee desde la vereda de enfrente.
  → De ahí salen **los precios, las etiquetas de operación y los títulos**: letra semi
  condensada y pesada, sin adornos.
- **El plano de la ciudad**: la cuadrícula de Bolívar, líneas finas sobre papel blanco,
  precisión. → De ahí salen **la base clara, los bordes finos, la grilla de 4 px** y un mapa
  gris claro donde lo único con color son los precios.
- **El color de acción es el verde de las palmeras**: Bolívar es "la ciudad de las palmeras"
  (así se presenta el municipio). Un verde profundo, **el único color liso de la interfaz**:
  significa "avanzar" (continuar, ver propiedades, consultar, lo elegido, el pin activo).

Lo que **no** es: ni crema, ni serif en itálica, ni vidrio, ni dorado, ni gradientes, ni fotos
de fondo detrás de los controles, ni sombras de color.

### Paleta (propuesta A, recomendada)

Contrastes **medidos** con script (WCAG 2.x) el 2026-10-08.

| Token | Hex | Rol | Contraste medido |
|---|---|---|---|
| `papel` | `#f7f8f6` | Fondo de la página (blanco apenas verdoso, no crema) | — |
| `blanco` | `#ffffff` | Superficies: tarjetas, hoja de filtros, barras fijas | — |
| `tinta` | `#17211c` | Texto principal, íconos | 15,5 sobre `papel` · 16,5 sobre blanco |
| `tinta-suave` | `#56635c` | Texto secundario (dirección, datos, ayudas) | 5,9 sobre `papel` · 6,3 sobre blanco |
| `linea` | `#dfe4e0` | Bordes y divisores. **Nunca texto** | 1,3 sobre blanco |
| `palmera-700` | `#1e5b45` | **Acción**: botón principal, opción elegida, pin activo, links | blanco encima 8,0 · como texto sobre `papel` 7,5 |
| `palmera-800` | `#174836` | Hover / presionado del botón principal | blanco encima 10,4 |
| `palmera-50` | `#ecf4ef` | Fondo de una opción elegida (con borde `palmera-700`) | `tinta` encima 14,8 · `palmera-700` encima 7,1 |
| `trigo` | `#e3b04b` | Acento escaso: etiqueta "Destacada" / "Nueva". **Nunca botón** | `tinta` encima 8,3 |
| `alerta` | `#b4432f` | Errores | blanco encima 5,6 |

**Propuesta B** (si la A no convence en la muestra): mismo esquema con acción en **azul
plano** `#1f4e79` (blanco encima 8,7; como texto sobre `papel` 8,1). Más institucional, menos
propio de Bolívar.

Las etiquetas de operación ("VENTA", "ALQUILER", "TEMPORARIO") van como el cartel: **fondo
`tinta`, letra blanca**, compactas, en mayúsculas. Es el único lugar con mayúsculas.

### Tipografía

**Una sola familia: Encode Sans** (Impallari Type, Argentina), variable en **peso y ancho**,
con `next/font/google`.

| Uso | Ancho | Peso | Tamaño a 360 px |
|---|---|---|---|
| Pregunta de cada paso ("¿Qué estás buscando?") | semi condensada | 700 | 30–32 px, interlineado 1,1 |
| Precio en tarjeta / ficha | semi condensada | 700 | 24 px / 30 px, `tabular-nums` |
| Títulos de sección | semi condensada | 600 | 20 px |
| Etiqueta de operación (cartel) | condensada | 700 | 12 px, mayúsculas, tracking 0,06 em |
| Texto | normal | 400 | 16 px (nunca menos de 14; 13 solo en atribuciones) |
| Botones y opciones | normal | 600 | 16–17 px |
| Logotipo | semi condensada | 700 + 400 | "**bolívar** inmo" |

🔎 *A verificar al instalar*: que Encode Sans en Google Fonts traiga el eje de ancho (`wdth`) y
cifras tabulares (`tnum`). Si no trae alguna de las dos, la alternativa es **Barlow** +
**Barlow Semi Condensed** (tiene ambas).

### Forma, espacio, sombra, movimiento

- **Grilla de 4 px**; margen lateral de **16 px** a 360 px.
- **Radios**: 12 px controles y opciones · 16 px tarjetas · 24 px arriba de la hoja de filtros
  · píldora solo para chips y pines.
- **Sombras neutras**, solo en lo que flota (tarjeta del mapa, barras fijas, hoja). El resto
  se separa con `linea`.
- **Íconos lucide**, 20 px en controles y 24 px en las opciones de los pasos, trazo 1,75.
- **Movimiento**: solo de transición (aparecer una hoja, cambiar de paso), 150–200 ms,
  `ease-out`, solo `transform` y `opacity`. `prefers-reduced-motion` lo apaga. Sin entradas
  animadas, sin parallax, sin contadores que suben.
- **Fotos**: 4:3, sin filtros ni velos. Sin foto: fondo `papel` con el ícono del tipo en
  `tinta-suave` (no una foto genérica).

### Tono de copy

Vos, directo, sin signos de exclamación, sin promesas. Dice qué pasa al tocar.

| Sí | No |
|---|---|
| ¿Qué estás buscando? | ¡Encontrá el hogar de tus sueños! |
| Ver 12 propiedades | Buscar |
| No hay casas en Centro con esos filtros. Probá sacando uno: | No se encontraron resultados |
| Consultar por WhatsApp | Contactar ahora |

## La marca

- **Nombre en textos**: Bolívar Inmo. **Logotipo**: "**bolívar** inmo" en minúscula, como el
  dominio (🙋 pregunta 1 de la spec madre).
- **Isotipo** (versión 1, hecha en SVG en el código): un cuadrado de esquinas redondeadas en
  `palmera-700` con una "b" blanca, como un cartel visto de frente. Plano, dos colores,
  legible a 16 px (favicon). Si Manuel quiere un logo trabajado, se pide después con la regla
  de la familia: *plano, pocos colores, legible a 32 px*.
- `src/lib/brand.ts`: `brandName = "Bolívar Inmo"`, `brandDomain = "bolivarinmo.com.ar"`.

## Pantallas

### Header (todas las pantallas salvo los pasos 2-4 y la ficha, que tienen su barra)

```
┌────────────────────────────────────┐
│ ▣ bolívar inmo                 ☰  │  56 px, fondo blanco, línea abajo
└────────────────────────────────────┘
```

- Logo → `/`. ☰ (44 × 44, `aria-label="Abrir menú"`) abre el menú.

### Menú (hoja que entra desde la derecha)

```
┌───────────────────────┐
│ Menú               ✕  │
│                       │
│ Buscar propiedades  › │  → /
│ Ver en el mapa      › │  → /propiedades?vista=mapa
│ Inmobiliarias       › │  → /inmobiliarias
│ ───────────────────── │
│ ¿Sos inmobiliaria?    │
│ Ingresar            › │  → /ingresar
└───────────────────────┘
```

### Pie (inicio, inmobiliarias, ficha)

Logo, una línea ("Las propiedades de las inmobiliarias de Bolívar, en un solo lugar."),
links (Buscar, Mapa, Inmobiliarias, Ingresar), "© 2026 Bolívar Inmo". Sin redes hasta tenerlas.

### Muestra (temporal, solo en desarrollo)

`/muestra`: paleta con sus contrastes, escala tipográfica, botones (primario, secundario,
fantasma) en sus estados, una opción grande elegida y sin elegir, chips, una etiqueta de
operación, una tarjeta de propiedad de ejemplo con precio, y el header. **Devuelve 404 en
producción** y se borra al cerrar el hito.

## Alcance

**Entra:** tokens, fuente, íconos, componentes base, shell, logo v1, muestra, Playwright, skills
y agentes de la familia, reescribir `DESIGN.md` y `PRODUCT.md`, la skill `identidad-visual`,
borrar el front viejo y dejar andamios donde haga falta para que el sitio compile.

**No entra:** las pantallas del recorrido (sus specs); modo oscuro
([descartado en el hito 1](../../roadmap/descartado.md)); re-vestir `/inmobiliarias`,
`/ingresar`, `/cuenta` y `/publicar` (hito 2: solo heredan el shell y los íconos nuevos).

## Criterios de aceptación

- [ ] 👀 Manuel vio `/muestra` y el header en su celular y eligió A o B (o pidió cambios).
- [ ] Los tokens están en `@theme` de `globals.css` con un comentario por token: de dónde
      sale y su contraste medido. Ningún texto queda por debajo de 4,5 (o 3 si es ≥ 24 px).
- [ ] Una sola familia tipográfica cargada con `next/font`; ni Manrope, ni Archivo Black, ni
      Instrument Serif.
- [ ] `lucide-react` es la única librería de íconos (`@phosphor-icons/react` desinstalado).
- [ ] `components.json` con estilo `base-nova` e íconos lucide; `src/components/ui/` tiene
      button, toggle, toggle-group, drawer, dialog, input, label, badge, separator, skeleton.
- [ ] Botón principal: 56 px de alto; todo lo que se toca ≥ 44 px (lo mide un e2e en `/muestra`).
- [ ] `pnpm e2e` corre en tres proyectos (360 × 640, iPhone 390 × 844, escritorio) y pasa un
      humo: `/` carga, sin scroll horizontal, sin errores de consola.
- [ ] `grep -rni "inmu" src PRODUCT.md DESIGN.md` sin resultados.
- [ ] No existen: `hero-interactive`, `count-up`, `reveal`, `scroll-reveal-line`,
      `landing-nav`, `hero-search`, `landing-property-card`, `theme-provider`, `theme-toggle`,
      `explore-client`, `property-card`, `site-footer`, ni las clases `.glass`, `.nav-tab`,
      `.sheet-over`, `.hero-search`, `.page-atmosphere`.
- [ ] `/`, `/propiedades`, `/propiedades/[id]`, `/inmobiliarias`, `/ingresar`, `/cuenta` y
      `/publicar` responden 200 (o redirigen como antes) con el shell nuevo.
- [ ] Los cuatro gates en verde.

## Riesgos

- **Encode Sans sin `wdth` o sin `tnum`** en Google Fonts: alternativa Barlow (ver arriba).
- **Borrar el front viejo deja pantallas pobres** hasta que lleguen las specs siguientes: son
  andamios a propósito; nadie usa el sitio todavía (🙋 confirmar que no hay un deploy público
  que alguien esté mirando).
- **shadcn con Base UI** cambia rápido: los componentes se agregan con el CLI y se leen antes
  de usarlos; lo que no exista en el registro `base-nova` se arma directo con Base UI.

## Preguntas abiertas

- 🙋 Grafía de la marca (pregunta 1 de la spec madre).
- 🙋 La otra referencia visual que Manuel iba a pasar (pregunta 2).
- 🙋 ¿Hay un deploy público hoy (Vercel)? Si lo hay, ¿se puede ver "en obra" unos días?

---

## Plan técnico

### Enfoque

Primero la base técnica (shadcn + Base UI calcados de Club del Cóctel, lucide, zod, Playwright),
después los tokens y la fuente, después los componentes y el shell, y recién ahí la limpieza:
se borra el front viejo y `/`, `/propiedades` y `/propiedades/[id]` quedan como **andamios**
(una lista simple con el shell nuevo) que las specs siguientes reemplazan. La muestra se le
muestra a Manuel **antes** de la limpieza, para que elija paleta con algo andando.

### Archivos

| Archivo | Qué |
|---|---|
| `components.json` | Calcado de `~/dev/clubdelcoctel/components.json` (`style: base-nova`, `iconLibrary: lucide`, `baseColor: neutral`, aliases `@/components`, `@/lib/utils`, `@/components/ui`) |
| `package.json` | **+** `@base-ui/react`, `class-variance-authority`, `lucide-react`, `tw-animate-css`, `zod`; dev **+** `@playwright/test`. **−** `@phosphor-icons/react`. Script `e2e`, `e2e:ui` |
| `playwright.config.ts` | Calcado de Club del Cóctel (puerto propio para no pisar `pnpm dev`: **43124**), proyectos `android-chico` (360 × 640, touch, Chromium), `iphone` (`devices["iPhone 13"]`, WebKit), `escritorio` (`devices["Desktop Chrome"]`), y `sin-js` (360 × 640 con `javaScriptEnabled: false`, solo para los specs que lo pidan) |
| `e2e/humo.spec.ts` | `/` carga; ancho del documento = ancho de la ventana; sin errores de consola |
| `e2e/muestra.spec.ts` | todo lo tocable de `/muestra` mide ≥ 44 px |
| `src/app/globals.css` | Reescrito: `@import "tw-animate-css"`; `@theme` con los tokens de arriba (comentados con contrastes); radios; base de `body`; sin `.dark`, sin clases viejas. Los estilos de pines del mapa (`.map-pin*`) se conservan y se re-visten en `resultados` |
| `src/app/layout.tsx` | Encode Sans con `next/font`, `lang="es-AR"`, metadata con la marca, sin `ThemeProvider` |
| `src/lib/brand.ts` | `brandName`, `brandDomain` |
| `src/components/ui/*` | Con el CLI de shadcn: `button` (variantes `primario`, `secundario`, `fantasma`, `enlace`; tamaños `md` 44 px, `lg` 56 px), `toggle`, `toggle-group`, `drawer`, `dialog`, `input`, `label`, `badge`, `separator`, `skeleton` |
| `src/components/ui/opcion.tsx` | La opción grande de los pasos (ícono + etiqueta + conteo + estado elegido), sobre `Toggle` de Base UI o `<label>` + `<input>` para que ande sin JS (decisión en `buscador-guiado`) |
| `src/components/ui/etiqueta-operacion.tsx` | El "cartel": VENTA / ALQUILER / TEMPORARIO |
| `src/components/marca/logo.tsx` | Isotipo SVG + logotipo, en `em` |
| `src/components/shell/header.tsx`, `menu.tsx`, `pie.tsx` | El shell |
| `src/app/icon.svg`, `src/app/apple-icon.png` | El isotipo (reemplaza `favicon.ico`) |
| `src/app/muestra/page.tsx` | La muestra; `notFound()` si `process.env.NODE_ENV === "production"` |
| `src/app/page.tsx`, `src/app/propiedades/page.tsx`, `src/app/propiedades/[id]/page.tsx` | **Andamios**: el shell + una lista simple de links / el título y el precio. Los reemplazan `buscador-guiado`, `resultados` y `ficha` |
| `src/app/inmobiliarias/page.tsx`, `src/components/agency-directory.tsx`, `src/app/cuenta`, `src/app/ingresar`, `src/app/publicar` | Solo: shell nuevo, íconos de Phosphor → lucide, clases viejas → tokens nuevos (mínimo para que se vean bien; el re-vestido es del hito 2) |
| `.claude/skills/impeccable/` | Copiada de `~/dev/clubdelcoctel/.claude/skills/impeccable/` |
| `.claude/skills/identidad-visual/SKILL.md` | **Nueva**, con lo aprobado en la muestra: paleta, tipografía, forma, tono, fotos, qué no se hace |
| `.claude/agents/{architect-reviewer,expert-nextjs-developer,expert-react-frontend-engineer}.md` | Copiados de Club del Cóctel, con la sección "Contexto de ESTE repo" reescrita para Bolívar Inmo |
| `DESIGN.md`, `PRODUCT.md` | Reescritos (formato Impeccable) con la marca y la dirección nuevas |
| `README.md` | Actualizado (hoy dice "sin backend" y "force dark") |

**Se borran**: `src/components/{hero-interactive,count-up,count-up.test,reveal,scroll-reveal-line,landing-nav,landing-nav.test,hero-search,landing-property-card,theme-provider,theme-toggle,explore-client,property-card,site-footer,cover-image}.tsx|ts`, `src/components/ui/button.tsx` (lo reemplaza el de shadcn), `public/images/hero/` (si nada más la usa), `src/app/favicon.ico`. **Se conservan** para `resultados`: `src/components/map/*`, `src/lib/markers.ts`.

### Tests

- Vitest: nada nuevo de lógica (esta spec es visual). Se borran `count-up.test.ts` y
  `landing-nav.test.ts` junto con sus componentes.
- Playwright: `humo.spec.ts` y `muestra.spec.ts`.
- Contraste: el script de medición queda en `scripts/contraste.mjs` y su salida se pega en el
  comentario de `globals.css`.

### Alternativas consideradas

- **Mantener el sistema "papel cálido"** y solo cambiar el nombre: es la dirección que Manuel
  no quiere (fondos, serif, efectos) y la familia la marca como "default de IA" (crema + serif).
- **Radix en vez de Base UI**: la familia ya usa Base UI (`base-nova`) y trae `Drawer` propio.
- **Inter / Geist**: correctas pero de cualquier proyecto; Encode Sans tiene el ancho
  semi condensado para el "cartel" y es de una fundidora argentina.

## Tareas

**Bloque 1 — Base técnica** · commit "Base técnica: shadcn sobre Base UI, lucide, zod y Playwright"
- [ ] `pnpm add @base-ui/react class-variance-authority lucide-react tw-animate-css zod` y `pnpm add -D @playwright/test`; `pnpm exec playwright install chromium webkit`.
- [ ] `components.json` calcado; verificar con `context7` el comando de shadcn para Base UI.
- [ ] `playwright.config.ts` con los cuatro proyectos; script `e2e`.
- [ ] `e2e/humo.spec.ts` (contra el `/` actual) en verde.
- [ ] Copiar la skill `impeccable` y los tres agentes; adaptar su "Contexto de ESTE repo".
- [ ] Gates en verde + `pnpm e2e`.

**Bloque 2 — Tokens y tipografía** · commit "Identidad de Bolívar Inmo: tokens con contraste medido y Encode Sans"
- [ ] Verificar `wdth` y `tnum` de Encode Sans en `next/font` (si no, Barlow).
- [ ] `scripts/contraste.mjs`; medir A y B.
- [ ] `globals.css`: `@theme` nuevo **al lado** del viejo (los nombres nuevos no chocan), para no romper nada todavía.
- [ ] `layout.tsx`: Encode Sans (las fuentes viejas siguen hasta el bloque 5).
- [ ] Gates en verde.

**Bloque 3 — Componentes, marca y shell** · commit "Componentes base, logo y shell de Bolívar Inmo"
- [ ] Agregar con shadcn: button, toggle, toggle-group, drawer, dialog, input, label, badge, separator, skeleton. Ajustar variantes y tamaños a la spec.
- [ ] `opcion.tsx`, `etiqueta-operacion.tsx`, `logo.tsx`, `icon.svg`, `apple-icon.png`.
- [ ] `header.tsx`, `menu.tsx` (Drawer desde la derecha), `pie.tsx`.
- [ ] `brand.ts` con la marca nueva.
- [ ] Gates en verde.

**Bloque 4 — Muestra** · commit "Muestra de identidad para aprobar en el celular"
- [ ] `/muestra` con paleta A y B lado a lado, tipografía, botones, opciones, chips, etiqueta, tarjeta de ejemplo, header.
- [ ] `e2e/muestra.spec.ts` (≥ 44 px).
- [ ] Capturas a 360 × 640 y 390 × 844; detector de Impeccable sobre `/muestra`.
- [ ] 👀 🙋 **Manuel la ve en su celu** (`pnpm exec next dev --port 43123 --hostname 0.0.0.0`) y elige A o B. **No se sigue sin esto.**
- [ ] Dejar en `@theme` solo la paleta elegida.
- [ ] Gates en verde.

**Bloque 5 — Limpieza y andamios** · commit "Se retira el front de Inmu: andamios con el shell nuevo"
- [ ] Andamios de `/`, `/propiedades`, `/propiedades/[id]` con el shell nuevo.
- [ ] Shell + lucide + tokens en `/inmobiliarias`, `agency-directory`, `/ingresar`, `/cuenta`, `/publicar`.
- [ ] Borrar los componentes, clases CSS, fuentes y el `@theme` viejos de la lista; `pnpm remove @phosphor-icons/react`.
- [ ] `grep -rni "inmu\|phosphor\|glass\|archivo_black\|instrument" src` sin resultados.
- [ ] Todas las rutas responden (e2e de humo ampliado a las siete rutas).
- [ ] Gates en verde + `pnpm e2e`.

**Bloque 6 — Documentos de identidad** · commit "DESIGN, PRODUCT y skill identidad-visual de Bolívar Inmo"
- [ ] `.claude/skills/identidad-visual/SKILL.md` con lo aprobado.
- [ ] `DESIGN.md` y `PRODUCT.md` reescritos; `README.md` al día.
- [ ] `docs/FICHA.md`: grafía de la marca confirmada.

**Cierre**
- [ ] `/cerrar identidad-y-base`.

## Lo que se encontró al implementar

_(se completa al ejecutar)_
