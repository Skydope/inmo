---
name: identidad-visual
description: >
  Identidad de marca de Bolívar Inmo: "el cartel y el plano". Paleta (papel, tinta y el azul
  plano como único color de acción), tipografía Encode Sans en dos anchos, forma, tono de
  copy, fotos y movimiento. Consultar SIEMPRE antes de crear o modificar cualquier cosa que
  vea quien busca o la inmobiliaria —pantallas, componentes, mails, placas— y antes de
  elegir un color, una fuente o escribir un título.
---

# Identidad visual — Bolívar Inmo

Fuente de verdad de cómo se ve y cómo habla la marca. **Si algo falta acá, se decide y se
documenta acá**, nunca improvisado dentro de un componente. Los tokens viven en
`src/app/globals.css`, con los contrastes medidos ahí (`node scripts/contraste.mjs`); acá
está el porqué. La spec que la creó es `docs/hitos/hito-1/identidad-y-base.md`.

## La idea

**Una herramienta, no una vidriera.** Quien entra viene a encontrar una propiedad en
Bolívar. Pedido de Manuel: **simple pero elegante, claro, sin fondos recargados ni
animaciones llamativas**, y más profesional que tandilprop.

La identidad sale de los dos objetos del mundo inmobiliario de un pueblo:

- **El cartel de "VENDE"** clavado en el frente de la casa: letra compacta y pesada, color
  liso, contraste total. → Precios, preguntas, títulos y la etiqueta de operación.
- **El plano de la ciudad**: papel blanco, líneas finas, precisión. → La base clara, los
  bordes finos, la grilla de 4 px. Y el color: **el azul de las copias heliográficas**, como
  se copiaban los planos.

Lo que **no** es: ni crema, ni serif en itálica, ni vidrio, ni dorado, ni gradientes de
color, ni sombras de color. Fotos de fondo, solo en el inicio y con los controles sobre blanco.

**El inicio es la excepción con carácter** (spec `vivi-bolivar`, 2026-10-08): la casa de
campo de día o de noche, **VIVÍ BOLÍVAR** enorme con el techo delante de las letras, pestañas
color papel sobre la foto y la página que sube por encima. Todo lo demás sigue siendo
herramienta.

## Paleta

| Token | Hex | Rol |
|---|---|---|
| `papel` | `#f7f8f6` | Fondo de la página. Nunca crema |
| `blanco` | `#ffffff` | Superficies: tarjetas, hojas, barras fijas, header |
| `tinta` | `#17211c` | Texto principal e íconos |
| `tinta-suave` | `#56635c` | Texto secundario: dirección, datos, ayudas |
| `linea` | `#dfe4e0` | Bordes y divisores. **Nunca texto** (1,29) |
| `plano-700` | `#1f4e79` | **Acción**: botón principal, opción elegida, pin activo, links |
| `plano-800` | `#183d5f` | Hover / presionado del botón principal |
| `plano-50` | `#eaf0f6` | Fondo de una opción elegida (con borde `plano-700`) |
| `trigo` | `#e3b04b` | Acento escaso: "Destacada". **Nunca botón** |
| `alerta` | `#b4432f` | Errores |

### El azul es avanzar

`plano-700` es **lo único azul liso** de la interfaz: continuar, ver propiedades, consultar,
lo elegido, el pin activo. No se usa de decoración, ni en íconos sueltos, ni en fondos de
sección. Si algo azul no avanza, está mal.

### Contrastes que importan (medidos, WCAG)

- `tinta` sobre `papel` 15,5 · sobre `blanco` 16,5
- `tinta-suave` sobre `papel` 5,9 · sobre `blanco` 6,3
- blanco sobre `plano-700` 8,7 · sobre `plano-800` 11,2
- `plano-700` como texto sobre `papel` 8,1 · sobre `plano-50` 7,6
- `tinta` sobre `plano-50` 14,4 · sobre `trigo` 8,3
- blanco sobre `alerta` 5,6

### Historia, para no repetirla

- **2026-10-08**: en `/muestra`, Manuel eligió desde su celular la **B, azul plano**, sobre la
  A, verde palmera (`#1e5b45`, "la ciudad de las palmeras"). Los neutros son los que vio y
  aprobó.
- El sistema anterior ("papel cálido": crema `#efe8dc`, Archivo Black, Instrument Serif,
  vidrio, dorado) se retiró: el detector de Impeccable marca el fondo crema como superficie
  "por defecto" de diseño hecho por IA.
- **2026-10-08 (más tarde)**: Manuel pidió volver al hero de esa versión (la casa, VIVÍ
  BOLÍVAR). Vuelve **la composición**, no el sistema: sin crema ni dorado. VIVÍ BOLÍVAR y la
  frase de la hoja van en Archivo Black (la frase, en oración); Instrument Serif queda solo
  en la línea del pie, derecha. Las secciones y la tipografía de todo lo demás quedan como
  estaban ("grande, negrita, que cualquier gente de cualquier edad lo puede ver").

## Tipografía

**Una sola familia: Encode Sans** (Impallari Type, Argentina), variable en peso y en ancho
(`wdth` 75–125), con `next/font/google` en `layout.tsx`.

- **La voz del cartel** (utilidad `font-titulo`): peso 700, ancho 87,5 %, tracking −0,01 em.
  Preguntas de cada paso (32 px), precio de ficha (30 px), precio de tarjeta (24 px),
  títulos de sección (20 px).
- **Etiqueta de operación** (`EtiquetaOperacion`): 12 px, ancho 75 %, 700, mayúsculas,
  tracking 0,06 em, fondo `tinta`, letra blanca. **Es el único lugar con mayúsculas.**
- **Texto**: ancho normal, 16 px (nunca menos de 14; 13 solo para notas legales).
- **Botones y opciones**: 600, 16–17 px.
- **Números que cambian** (precios, conteos): `tabular-nums`. Encode Sans trae cifras
  tabulares (verificado).
- **Logotipo**: "**bolívar** inmo" en minúscula, como el dominio; en textos, "Bolívar Inmo".
- **Display** (utilidad `font-display`): **Archivo Black**, mayúsculas, tracking −0,02 em.
  **Solo** "VIVÍ BOLÍVAR" (el hero del inicio y el cierre del pie). Encode Sans estirada
  redondeaba la B. Es la otra excepción a la regla de las mayúsculas.
- **La frase de la hoja**: la misma Archivo Black, en oración y desde 24 px. No va en
  mayúsculas (un párrafo en cartel no se lee) y los números quedan en tinta: el azul es
  para avanzar, no para decorar una cifra.
- **La voz** (utilidad `font-voz`): **Instrument Serif** 400, derecha (Rodrigo Fuenzalida y
  Jordan Egstad, OFL; `preload: false`). **Solo** la línea del pie del inicio. Nunca menos
  de 24 px, nunca en itálica, nunca en controles, títulos de sección, precios ni datos.

## Forma y espacio

- Grilla de 4 px; margen lateral de 16 px a 360 px.
- Radios: `rounded-control` 12 px (botones, opciones, inputs) · `rounded-tarjeta` 16 px ·
  `rounded-hoja` 24 px (arriba de las hojas) · píldora solo para chips y pines.
- Sombras neutras y solo en lo que flota (tarjeta del mapa, barras fijas, hojas). El resto se
  separa con `linea`.
- **Todo lo que se toca mide ≥ 44 px.** El botón principal de cada pantalla mide 56 px.

## Componentes

- **Botón** (`src/components/ui/button.tsx`): variantes `default` (primario azul),
  `secondary` (azul suave), `outline` (blanco con borde), `ghost`, `link`. Tamaños `default`
  44 px, `lg` 56 px. Los nombres quedan en inglés porque los usa el resto de shadcn.
- **Opción** (`opcion.tsx`): `<input>` nativo dentro de un `<label>`; elegida = borde y fondo
  azul **y un ✓** (no solo color). Variantes `tarjeta` (pasos) y `chip` (zonas,
  características).
- **Shell**: header blanco de 56 px con el logo y el menú (hoja desde la derecha); pie
  blanco.
- Componentes de shadcn sobre Base UI. **Al agregar uno con el CLI, revisar sus imports**: en
  shadcn 4.21 escribió `from "cn"` e instaló un paquete npm con ese nombre.

## Íconos

**lucide-react**, trazo 1,75: 20 px en controles, 24 px en las opciones de los pasos. Tipos de
propiedad: `House`, `Building2`, `Building`, `Trees`, `LandPlot`, `Tractor`, `Store`,
`BriefcaseBusiness`, `Warehouse`, `CarFront`. WhatsApp: `MessageCircle` (lucide no trae logos
de marcas).

## Fotos

- 4:3 en tarjetas y fichas, sin filtros ni velos.
- Sin foto: fondo `papel` con el ícono del tipo en `tinta-suave` (nunca una foto genérica).
- La pantalla de ingreso mantiene su composición de referencia: acceso a la izquierda, foto
  de Bolívar a la derecha (`PRODUCT.md`).
- **El inicio lleva la casa de campo de día y de noche** (spec `vivi-bolivar`, 2026-10-08;
  reemplaza la foto de la plaza): `<picture>` que sigue `prefers-color-scheme`, una sola
  descarga, sin velo. VIVÍ BOLÍVAR va en `tinta` de día y en blanco de noche (≥ 3:1 contra el
  cielo, medido) y el techo de la casa se repite encima de las letras. Los controles van en
  la tarjeta **blanca y lisa** del filtro. La foto es ilustrativa (no es una casa de Bolívar).
- **Fotos de prueba**: libres (Wikimedia Commons, Unsplash), con autor y licencia anotados en
  `public/images/CREDITOS.md`. Las de licencia CC BY / BY-SA llevan crédito visible donde se
  muestran en producción.

## Movimiento

Solo de transición (aparecer una hoja, cambiar de paso): 150–200 ms, `ease-out`, solo
`transform` y `opacity`. Sin entradas animadas, sin parallax, sin contadores que suben, sin
zoom al pasar el mouse. `prefers-reduced-motion` apaga todo.

**Excepción del inicio** (`vivi-bolivar`): efectos atados al scroll, **en CSS puro**:
- la hoja que sube sobre la foto (`position: sticky`);
- la frase que se enciende palabra por palabra cambiando el **color** (de `tinta-suave` a
  `tinta`, nunca la opacidad: siempre ≥ 4,5);
- el plano del pie que se dibuja;
- la barra fija que aparece cuando la hoja tapa las pestañas.

Todo detrás de `@supports (animation-timeline: …)` y `prefers-reduced-motion:
no-preference`: sin soporte o con movimiento reducido, quieto y completo. Con el atajo
`animation` se pierde `animation-timeline`: siempre propiedades sueltas.

## Tono de copy

Vos, directo, sin signos de exclamación, sin promesas. Dice qué pasa al tocar.

| Sí | No |
|---|---|
| ¿Qué estás buscando? | ¡Encontrá el hogar de tus sueños! |
| Ver 12 propiedades | Buscar |
| No hay casas en Centro con esos filtros. Probá sacando uno: | No se encontraron resultados |
| Consultar por WhatsApp | Contactar ahora |
| Esta propiedad ya no está publicada | Error 404 |

## Modo oscuro

**No hay, y no se suma** (Manuel, 2026-10-09; antes "no en el hito 1"). Ningún portal grande
(Zonaprop, Argenprop, ML Inmuebles, Airbnb, Idealista) lo tiene en la web: las fotos son el
producto y sobre fondo oscuro pierden. Una sola paleta, de día. Sin clases `dark:`, sin
`.dark`, sin `prefers-color-scheme` (el hero ya no tiene foto de noche).
