---
slug: inicio-v2
hito: 1
estado: approved
creada: 2026-10-09
---

# Inicio v2: el primer pantallazo y la hoja, rehechos

> Pedido de Manuel (2026-10-09), después de ver el inicio en el celu con el navbar nuevo:
> *"No me gusta la card, el color… algo más profesional. Es el primer pantallazo: tiene que
> verse qué estás buscando, Comprar, Alquilar, Alquiler temporario, y subirlo más arriba, está
> muy abajo. Cuando scrolleás se hace la animación esa rara que se superpone por arriba del
> hero: hacela distinta, que no sea tan molesta. El color crema de fondo, a ver si podemos
> poner alguno mejor. Capaz un bento grid en Buscá por tipo. Recién publicadas y Destacadas se
> quedan, pero más compacto."*
>
> Decisiones que tomó Manuel al especificar (2026-10-09): **la foto se queda pero más baja,
> con el buscador arriba** · **scroll normal** (sin hoja que sube sobre la foto quieta) ·
> **fondo casi blanco** en vez del crema.
>
> Reemplaza, en lo que se superponen, a [`vivi-bolivar.md`](vivi-bolivar.md) (el hero y la
> hoja) y a [`inicio-y-pie.md`](inicio-y-pie.md) (las secciones de abajo). El pie no cambia.
> **Reabre** dos ítems de `roadmap/descartado.md`: el *bento de categorías* (descartado el
> 2026-10-08 "hasta que Manuel lo pida": lo pidió) y la excepción de *efectos atados al scroll*
> (la hoja, la frase que se enciende y la barra que aparecía): se retiran. El plano del pie
> que se dibuja al entrar **se queda**: no molesta y está al fondo.

## Problema

- **El buscador está abajo de todo.** A 360 × 780 la tarjeta "¿Qué estás buscando?" arranca
  en el píxel 570 (medido 2026-10-09) y a 360 × 640 queda cortada bajo el pliegue: hay que
  bajar la vista hasta el fondo para encontrar la única acción que importa. En Zonaprop, Argenprop y Airbnb el buscador está en el centro del primer pliegue.
- **La tarjeta no se ve profesional.** Fondo crema sobre foto cálida: se funde con la madera
  y el pasto; las opciones parecen chips sueltos y el "Ver todas en el mapa" flota aparte.
- **El scroll molesta.** La foto queda quieta y la página le sube por encima con sombra: se
  siente como un error de capas, no como un efecto. Y arrastra una frase de siete renglones
  en letra de cartel que pesa más que las secciones.
- **El crema** (`#efe8dc`) apaga las fotos y ensucia el azul. Ningún portal grande usa fondo
  cálido: Airbnb, Zonaprop y Rightmove van en blanco; Mercado Libre en gris `#f5f5f5` con
  tarjetas blancas (medido por el agente, 2026-10-09).
- **Las secciones de abajo son largas y todas iguales**: cinco carruseles seguidos, cada uno
  con tarjetas grandes, y "Por zona" es una pared de 14 chips en 12 filas (602 px). El inicio
  mide **6 pantallas** a 360 × 780 (4696 px, medido), y el pie solo ocupa 1,6.

## Objetivo

A 360 px, **sin scroll**, se ve: el navbar, la casa, "Viví Bolívar" y la tarjeta
"¿Qué estás buscando?" entera, con Comprar, Alquilar y Alquiler temporario y sus conteos. La
página scrollea como cualquier página. Debajo, el inicio cuenta qué hay en no más de cinco
pantallas: lo recién publicado, los tipos en una grilla, las destacadas, las zonas, las
inmobiliarias y la invitación a sumarse. Todo sobre fondo casi blanco, con tarjetas blancas y
el azul plano como único color de acción.

## Historias de usuario

- Como **quien entra desde el celu**, quiero ver qué puedo hacer (comprar, alquilar,
  temporario) apenas carga, sin bajar, para empezar a buscar en un toque.
- Como **quien entra a mirar**, quiero bajar y ver lo nuevo y los tipos de propiedad de un
  vistazo, sin que la página haga cosas raras al scrollear.
- Como **quien sabe qué quiere** ("casas en venta"), quiero un acceso directo grande en la
  grilla de tipos.
- Como **quien mira fotos**, quiero que las fotos se vean como son: sobre fondo claro y
  neutro, no teñidas por un fondo de color.
- Como **inmobiliaria**, quiero seguir encontrando cómo sumarme al final del inicio.

## Pantallas

### El hero, a 360 × 780 (navbar de 56 px arriba, fijo)

```
┌────────────────────────────────────┐ 0
│ ▣ bolívar inmo        [Ingresar] ☰ │ navbar, 56 px (no cambia)
├────────────────────────────────────┤ 56
│ ░░░░░░░░ foto de la casa ░░░░░░░░░ │ la foto a sangre (sin radio ni margen), 300 px
│ ░░░░░        VIVÍ          ░░░░░░░ │ de alto; VIVÍ BOLÍVAR más chico que hoy (≈ 56 px
│ ░░░░░     BOLÍVAR          ░░░░░░░ │ la palabra), siempre con el techo delante de la R
│ ░░░░ (techo de la casa delante) ░░ │
│   ┌──────────────────────────────┐ │ 324  ← la tarjeta sube 32 px sobre la foto:
│   │ ¿Qué estás buscando?         │ │       blanca pura, borde `linea`, radio 16,
│   │ ────────────────────────────  │ │       sombra "flota", padding 16, título 22 px
│   │ 🔑 Comprar       22 en venta ›│ │       a la IZQUIERDA (centrado se ve "de plantilla")
│   │ ────────────────────────────  │ │
│   │ 🏠 Alquilar    11 en alquiler ›│ │ las opciones son FILAS de una lista (56 px),
│   │ ────────────────────────────  │ │ separadas por `linea`, no mini-tarjetas: ícono
│   │ 📅 Alquiler temporario     3 ›│ │ 22 px azul sin círculo, título 17 px/600, conteo
│   │ ════════════════════════════  │ │ a la derecha 14 px gris `tabular-nums`, caret
│   │ 🗺 Ver todas en el mapa      ›│ │ cuarta fila, 44 px, link azul: deja de ser una
│   └──────────────────────────────┘ │ 568   píldora suelta que compite con el título
│                                    │
│  Recién publicadas      Ver todas ›│ 600   arranca la primera sección
│  ┌──────┐ ┌──────┐                 │ 640   y a 780 asoman las tarjetas: la invitación
│  │ foto │ │ foto │                 │       a bajar
└────────────────────────────────────┘ 780
```

- A **360 × 640** (Android chico) la tarjeta termina en el px 568: entra entera y asoma el
  título de "Recién publicadas". La tarjeta **nunca** queda cortada por el pliegue en ninguna
  de las dos alturas.
- La foto **no es sticky**. Al scrollear, se va con la página; nada le pasa por encima.
- "Viví Bolívar" sigue siendo el `h1`, con el techo delante de la R (lo de `vivi-bolivar`),
  pero a un tamaño que entre en una foto más baja: la regla es *"la base de la R tapada
  entre 15 % y 50 %"*, igual que hoy, verificada a las mismas cinco anchuras.
- **Las opciones** de la tarjeta son links al paso 2 con la operación (sin cambios de
  comportamiento ni de URL); con conteo 0, sin link. Sin JS anda igual.
- **"Ver todas en el mapa"** pasa adentro de la tarjeta, como cuarta fila, link en azul. La
  píldora azul llena se va: el azul señala **un solo** "avanzar" por pantalla, y acá lo
  principal es elegir la operación.
- **La frase** ("En Bolívar, todas las propiedades en un solo lugar. Hoy hay 36…") deja de
  ser el cartel de siete renglones: pasa a Encode Sans 17–20 px en `tinta-suave`, dos o tres
  líneas, sin encenderse al scrollear. Va entre el hero y Recién publicadas.

### El hero, a 1280 px

```
┌──────────────────────────────────────────────────────────────────┐
│ ▣ bolívar inmo    Comprar Alquilar Temporario Mapa Inmob. [Ingresar]│
├──────────────────────────────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░  VIVÍ                                                        ░ │ foto a sangre de 440 px
│ ░  BOLÍVAR            (la casa a la derecha, como hoy)         ░ │ de alto
│ ░                                                              ░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ 496
│    ┌──────────────────────────────────────────────────┐          │ la tarjeta (720 px) a la
│    │ ¿Qué estás buscando?                             │          │ izquierda del contenedor,
│    │ [🔑 Comprar 22 ›] [🏠 Alquilar 11 ›] [📅 Temporario 3 ›]│   │ solapando 72 px el borde
│    │ 🗺 Ver todas en el mapa ›                        │          │ de abajo de la foto; las
│    └──────────────────────────────────────────────────┘          │ opciones en 3 columnas
└──────────────────────────────────────────────────────────────────┘
```

### La hoja (lo de abajo), a 360 px

```
┌────────────────────────────────────┐
│ En Bolívar, todas las propiedades  │ 1 · la frase: una línea, 17 px, gris. Los números
│ en un solo lugar. Hoy hay 36, de 4 │     siguen saliendo de los datos (`fraseDelPortal`)
│ inmobiliarias, en 14 zonas.        │
├────────────────────────────────────┤
│ Recién publicadas       Ver todas ›│ 2 · carrusel COMPACTO: tarjeta de 160 px (dos
│ [▣ foto 4:3 ][▣ foto 4:3 ][▣ fo… → │     enteras a 360), foto 4:3 de 120 px, etiqueta de
│  US$ 48.000  │ $ 180.000  │        │     operación 11 px, precio 17 px, "Casa en Centro"
│  Casa·Centro │ Quinta·Zo… │        │     14 px truncado. Sección ≈ 256 px (hoy 369). Sin
│  3 amb·120m² │ 3 amb·3000 │        │     flechas en el celu (sí con mouse). 8 tarjetas
├────────────────────────────────────┤
│ Buscá por tipo                     │ 3 · BENTO: 2 columnas, gap 8. La categoría con más
│ ┌────────────────────────────────┐ │     propiedades ocupa las dos columnas (176 px);
│ │ foto a sangre                  │ │     después 4 celdas de 148 px. Cada celda: foto
│ │ Casas en venta              12 │ │     arriba + FRANJA BLANCA de 48 px con el título
│ ├───────────────┬────────────────┤ │     (15 px/600) y el conteo a la derecha (gris,
│ │ foto          │ foto           │ │     tabular). Sin texto sobre la foto, sin velo.
│ │ Deptos venta 7│ Casas alq.   5 │ │     Radio 12, borde `linea`. Total: 5 categorías,
│ ├───────────────┼────────────────┤ │     3 filas, sin huecos (~590 px con el título).
│ │ foto          │ foto           │ │     Las demás (hay 15 en los datos de prueba), en
│ │ Lotes venta  4│ Quintas temp. 3│ │     "Ver todos los tipos ›" (hoy a /propiedades).
│ └───────────────┴────────────────┘ │
├────────────────────────────────────┤
│ Destacadas              Ver todas ›│ 4 · tarjeta compacta ANCHA (224 px, 1,5 visibles):
│ [▣ Destacada ][▣ Destacada ][▣ … → │     chip "Destacada" en trigo, precio 18, título y
│                                    │     UNA línea de datos (13 px). Se va la tarjeta
│                                    │     grande con flechas de fotos y "Ver detalles"
│                                    │     (537 px hoy). Solo si hay 3 o más.
├────────────────────────────────────┤
│ Por zona                           │ 5 · UNA fila que se desliza (carrusel de chips), no
│ (Centro 14)(Zona de quintas 5)(B…→ │     una pared: chips de 44 px, 2 filas como máximo
│ (Barrio Las Flores 3)(Norte 2)(… → │     en el celu. Las 14 zonas entran igual, deslizando.
├────────────────────────────────────┤
│ Inmobiliarias de Bolívar           │ 6 · como hoy (logo, nombre, "12 propiedades"),
│ [◫ ][◫ ][◫ … →   Ver todas ›       │     tarjeta más chica (40 % del ancho)
├────────────────────────────────────┤
│ ¿Sos inmobiliaria de Bolívar?      │ 7 · banda azul claro (`plano-50`), como hoy
│ Publicá tus propiedades.[Ingresar] │
├────────────────────────────────────┤
│ PIE                                │ igual, pero el plano se acorta a ~240 px de alto
│                                    │ (hoy el pie mide 1243 px: 1,6 pantallas)
└────────────────────────────────────┘
```

- **Ritmo**: 32 px entre secciones en el celu, 56 en escritorio; dentro de una sección,
  12 px entre el título (22 px) y el contenido. Suma estimada a 360 × 780: hero 512 + frase
  110 + recién 256 + bento 590 + destacadas 330 + zonas 150 + inmobiliarias 200 + sos 180 +
  pie 600 ≈ **2980 px = 3,8 pantallas** (hoy 6). Todas las secciones arrancan en el **mismo borde
  izquierdo** (16 px a 360, el contenedor de 72 rem en escritorio); los carruseles sangran
  hasta el borde de la pantalla, no se cortan contra el contenedor.
- **Escritorio**: Recién publicadas y Destacadas en grilla de 4 (sin carrusel); el bento en
  4 columnas con la grande 2 × 2 a la izquierda y las cuatro chicas a la derecha; Por zona
  en una fila con "ver más" si no entran; Inmobiliarias en grilla de 4.

### Fondo y superficies (reemplaza los tokens crema de Matías)

Manuel eligió "blanco con gris muy claro". Dos candidatas, medidas con
`scripts/contraste.mjs` (2026-10-09); `tinta` sigue `#1a1a1a`, tarjetas y navbar `#ffffff`:

| | **C · gris azulado (default)** | A · gris neutro (ML/Airbnb) |
|---|---|---|
| `papel` (fondo) | `#f4f6f8` | `#f7f7f7` |
| `linea` (borde) | `#dde3e9` | `#e3e3e3` |
| `tinta-suave` | `#5b6670` | `#5f6368` |
| tinta / papel | 16,07 | 16,25 |
| tinta-suave / papel · / tarjeta | 5,42 · 5,87 | 5,65 · 6,05 |
| tarjeta vs papel | 1,08 | 1,07 |
| azul `#1f4e79` / papel | 8,00 | 8,09 |

**Default C**: es del mismo lado que el azul plano (fondo y acción, una sola familia, como un
plano heliográfico) y, por frío, hace resaltar la madera, el pasto y el ladrillo de las fotos
en vez de fundirse con ellos como el crema. A es la alternativa neutra si C se ve "azulado"
en el celu. En las dos, la tarjeta se separa del fondo apenas (1,07–1,08): **siempre lleva
borde `linea`**. `plano-50` contra el fondo da 1,09: la opción elegida sigue necesitando el
borde azul, como ya dice la skill.

El par `noche` / `sobre-noche` del pie y de la etiqueta de operación no cambia; `trigo`
queda solo para "Destacada" (tinta encima 7,4). **El `themeColor`** del `<meta>` pasa al
`papel` nuevo.

## Alcance

**Entra:**
- El hero: foto más baja (no sticky), título más chico, la tarjeta rediseñada y subida, "Ver
  todas en el mapa" adentro, en las dos alturas de celu y en escritorio.
- Sacar la hoja, la sombra, la frase que se enciende y Archivo Black de la frase (queda solo
  en "VIVÍ BOLÍVAR" y en el pie). La píldora azul "Ver todas en el mapa" se va (entra en la
  tarjeta). Sacar Instrument Serif si no la usa nadie más que la línea
  del pie (verificar; si solo es esa línea, pasa a Encode y se saca la fuente: 20 KB menos).
- Los tokens de fondo y superficie nuevos, aplicados a **todo el sitio** (son tokens: cambia
  todo junto). Verificar con capturas que resultados, ficha, buscar, publicar e ingresar siguen
  bien (los bordes `linea` sobre blanco se ven apenas: es lo esperado).
- Tarjeta compacta para los carruseles del inicio (precio, título, atributos; sin flechas en
  el celu).
- El bento de "Buscá por tipo" (5 categorías + "Ver todos los tipos").
- "Por zona" como fila deslizable de chips.
- El plano del pie más bajo (~240 px), para que el pie no mida 1,6 pantallas.
- Las secciones con el mismo borde y el mismo ritmo.
- Los e2e del inicio actualizados (los de la hoja, la barra y la frase que se enciende se
  retiran; entran los del primer pliegue y del bento).

**No entra:**
- La escala tipográfica y el sistema de botones de todo el sitio: es la spec `refaccion-ui`
  (próxima). Acá se usan los tamaños que ya existen.
- Una página de tipos de propiedad (`/tipos`): "Ver todos los tipos" lleva a `/propiedades`
  hasta que exista.
- Un buscador con selects en el hero (estilo Zonaprop): duplicaría el buscador guiado y mete
  selects nativos pobres en Android; lo que pidió Manuel lo resuelve subir la tarjeta.
- Cambiar la foto de la casa o su licencia (sigue el pendiente 🟡 de `pendientes.md`).
- El pie.
- Librerías de movimiento, parallax, contadores (siguen en `descartado.md`).

## Criterios de aceptación

- [ ] A **360 × 640** y a **360 × 780**, sin scroll, se ven enteros: el navbar, "Viví
      Bolívar", la tarjeta con sus tres opciones y "Ver todas en el mapa". Ningún borde de la
      tarjeta queda cortado por el pliegue.
- [ ] A 360 px la tarjeta arranca **antes del 45 %** del alto de la pantalla (hoy: 74 %).
- [ ] El hero **no es sticky**: con `scrollY = 600`, el `h1` ya no está en el viewport y no
      hay ningún elemento con `position: sticky` ni `animation-timeline` en el inicio, salvo
      el plano del pie.
- [ ] El techo tapa la base de la R entre 15 % y 50 % y no tapa la B, a 360, 390, 412, 768 y
      1280 px (igual que `vivi-bolivar`).
- [ ] Contraste del título contra el cielo ≥ 3 (medido con `scripts/contraste-sobre-foto.mjs`).
- [ ] Tokens: `node scripts/contraste.mjs` con todos los pares en ✓ con los valores nuevos.
- [ ] En el bento, el texto va en la franja blanca (tinta sobre blanco), nunca sobre la foto;
      cada celda es un `<a>` de ≥ 44 px con nombre accesible "Casas en venta, 12 propiedades".
- [ ] El bento no deja huecos. La forma la decide `src/lib/inicio.ts` (test-first): 5 o más
      categorías → 1 grande + 4 chicas; 4 → 2 grandes + 2 chicas; 3 → 1 grande + 2 chicas;
      2 → 2 grandes; menos de 2 → la sección no se muestra.
- [ ] Las categorías del bento son las de más propiedades, y "Ver todos los tipos" existe
      solo si quedaron categorías afuera.
- [ ] Recién publicadas: a 360 px se ven **dos tarjetas enteras** sin scroll horizontal de
      la página; precio ≥ 17 px; la sección mide ≤ 280 px.
- [ ] Destacadas: sin flechas de fotos ni "Ver detalles" dentro de la tarjeta; sección
      ≤ 350 px a 360 px.
- [ ] Por zona: a 360 px ocupa como máximo **2 filas** (≤ 110 px de alto) y se desliza.
- [ ] El inicio entero a 360 × 780 mide **≤ 4,5 pantallas** (≤ 3500 px) con los datos de
      prueba (hoy 4696 px).
- [ ] Todas las secciones de la hoja arrancan en el mismo `x` (± 1 px) a 360 y a 1280.
- [ ] Sin scroll horizontal en ninguna anchura; sin errores en consola.
- [ ] Sin JS, el inicio se ve entero y las opciones del filtro y las celdas del bento andan.
- [ ] Lighthouse mobile: inicio ≥ 90, accesibilidad 100. Sin MapLibre en la carga.
- [ ] Capturas de `/`, `/propiedades`, una ficha, `/buscar/tipo`, `/publicar/operacion` e
      `/ingresar` a 360 px con los tokens nuevos, revisadas (nada con contraste roto).
- [ ] 👀 Manuel lo recorre en el celu.

## Riesgos

- **La foto más baja con el título adentro**: a 360 × 640 el título puede quedar chico o
  pisado. Nos enteramos con la verificación del techo a cinco anchuras y dos alturas.
- **Los tokens cambian todo el sitio de golpe**: algo que dependía del crema (velos, etiquetas,
  el logo del pie) puede quedar raro. Nos enteramos con las capturas de las seis rutas.
- **El bento con fotos repetidas**: varias categorías usan la misma foto de prueba (los tipos
  sin fotos propias, pendiente 🟡). Con datos reales se arregla solo; con los de prueba puede
  verse repetido: no es un bug de esta spec.
- **Lighthouse**: el bento suma hasta 5 fotos arriba del pliegue siguiente. Se cargan `lazy` y
  con `sizes` justos; solo la de la casa lleva `priority`.

## Preguntas abiertas

- **Fondo C o A**: se decide viendo las dos en el celu (`/muestra` con las dos lado a lado).
  Default: **C**.
- **La frase**: ¿queda la oración con números ("Hoy hay 36, de 4 inmobiliarias, en 14
  zonas") discreta, o se saca y los números van solo en el pie? Default: **queda, discreta**,
  17–20 px gris, dos o tres líneas.
- **Instrument Serif**: si la única que la usa es la línea del pie, ¿se saca? Default: **sí**.
- **"Ver todos los tipos"**: ¿va a `/propiedades` o se arma la página de tipos en esta spec?
  Default: `/propiedades`, página en el hito 2.

---

## Plan técnico

### Enfoque

Cuatro bloques, cada uno deja el sitio compilando y con los gates en verde: (1) **tokens**:
el fondo nuevo en `globals.css` + `contraste.mjs` + `/muestra` con C y A lado a lado para que
Manuel elija; (2) **hero y scroll**: el hero deja de ser sticky y de medir `100svh`, la
tarjeta se rehace como lista y se solapa; se borran la hoja, la frase que se enciende y la
barra; (3) **la hoja compacta**: bento (lógica en `src/lib/inicio.ts` test-first), tarjeta
compacta, zonas en fila, plano del pie más bajo; (4) **cierre**: e2e, Lighthouse, capturas
de las seis rutas, documentación (skill, `DESIGN.md`, `descartado.md`, `riesgos.md`). Todo
server components y CSS: no entra ningún `"use client"` nuevo (el carrusel ya lo es).

### Archivos/módulos afectados

| Archivo | Qué cambia |
|---|---|
| `src/app/globals.css` | Tokens `papel`/`blanco`/`linea`/`tinta-suave` nuevos (con contrastes en el comentario). `.vivi-hero` sin `sticky`; `.vivi-marco` con alto fijo (`18.75rem` celu / `27.5rem` lg) en vez de `100svh`, sin radio ni margen; `.vivi-titulo` recalibrado al alto nuevo (**a verificar**: el título se mide en `cqh` del `.casa`, con 300 px da ≈ 54 px; y el apoyo en el techo —`techoEn`, en px de la foto escalada— tiene que seguir dando 15–50 % de la R; si no, se ajusta `--zoom`/`--fy` del celu). Se borran `.hoja`, `.frase` y su `@supports` (la frase que se enciende); queda el `@supports` del plano. `font-voz` se va si Instrument Serif se saca. `--sombra-flota` como token nuevo (la única sombra del inicio) |
| `src/components/inicio/hero.tsx` | Sin `mt-auto`; la foto arriba y la tarjeta debajo con margen negativo (`-mt-8`), `relative z-10`; en lg, contenedor con la tarjeta a la izquierda y `-mt-18`. "Ver todas en el mapa" sale de acá |
| `src/components/inicio/filtro.tsx` | La tarjeta como lista: `<nav>` blanco, borde `linea`, `rounded-tarjeta`, sombra token; título 22 px a la izquierda; opciones `<li>` de 56 px separadas por `divide-y`; cuarta fila "Ver todas en el mapa" (link azul). En lg, `grid-cols-3` para las opciones y la cuarta fila debajo. Sigue sin JS |
| `src/components/inicio/frase.tsx` | Un `<p>` en Encode 17–20 px `tinta-suave`, sin spans por palabra |
| `src/app/page.tsx` | Sin `<div className="hoja">`; las secciones directas en `<main>`; `Bento` en lugar de `PorTipo` |
| `src/lib/inicio.ts` + `inicio.test.ts` | Nuevo: `formaDelBento(categorias)` → `{ grandes: Categoria[], chicas: Categoria[], restantes: number }` según la regla por n (ver Tests). `categoriasDelInicio` no cambia |
| `src/components/inicio/bento.tsx` (nuevo, reemplaza `por-tipo.tsx`) | Grilla CSS: 2 columnas en celu, 4 en lg; celda = `<Link>` con foto (`next/image`, `fill`, `sizes` por tamaño de celda, `loading="lazy"`) + franja blanca con título y conteo; `aria-label="Casas en venta, 12 propiedades"`; "Ver todos los tipos ›" en el encabezado de `Seccion` solo si `restantes > 0` |
| `src/components/resultados/tarjeta-propiedad.tsx` | Variante `chica` a 160 px (foto 4:3, etiqueta 11 px, precio 17, título 14 truncado); variante nueva `destacada` de 224 px (chip trigo, precio 18, una línea de datos). Las variantes `grande`/`flotante`/`grilla` no se tocan |
| `src/components/inicio/destacadas.tsx`, `recien-publicadas.tsx` | Usan las variantes nuevas; sin `w-[85%] max-w-sm` |
| `src/components/inicio/por-zona.tsx` | De `flex-wrap` a `CarruselHorizontal` con dos filas (`grid-rows-2 grid-flow-col`) |
| `src/components/inicio/seccion.tsx` | `py-6 md:py-10` → `pt-8 md:pt-14` (el ritmo único); título 22 px |
| `src/components/shell/pie.tsx` | `pt-40 md:pt-56` del cierre → `pt-24 md:pt-40` (plano ≈ 240 px) |
| `src/app/layout.tsx` | `themeColor` al `papel` nuevo; si se saca Instrument Serif, se va `Instrument_Serif` y `--font-instrument` |
| `src/app/muestra/page.tsx` | Bloque "Fondo: C y A" con dos tarjetas de propiedad sobre cada fondo, para elegir desde el celu |
| `scripts/contraste.mjs` | `PALETA` con los valores elegidos; los pares nuevos (tarjeta vs papel ≥ 1,05 como par informativo) |
| `e2e/inicio.spec.ts`, `e2e/tipografia.spec.ts` | Ver Tests |
| **Se borran** | `src/components/inicio/por-tipo.tsx`; las reglas `.hoja`/`.frase`/`barra` en CSS; `src/app/inicio/...` nada más. `vivi-bolivar.md` y `inicio-y-pie.md` reciben una nota en § *Lo que se encontró al implementar* apuntando acá |

### Datos

- **Sin cambios** en `Property`, en el seed ni en el contrato de URL. El bento usa los mismos
  `href` de `categoriasDelInicio` (`/propiedades?operacion=…&tipo=…`); "Ver todos los tipos"
  va a `/propiedades`.
- `formaDelBento` es una función pura sobre `Categoria[]` ya ordenadas: no cuenta ni filtra.

### Tests (TDD)

**Primero, en rojo, `src/lib/inicio.test.ts` → `formaDelBento`:**
- 5 o más categorías → 1 grande + 4 chicas, `restantes = n − 5`, las de más propiedades
  primero (la grande es la primera).
- 4 → 2 grandes + 2 chicas, `restantes = 0`. 3 → 1 + 2. 2 → 2 grandes + 0.
- 1 o 0 → `null` (la sección no va). Con los datos de prueba: 15 categorías → `restantes = 10`.
- No muta el arreglo de entrada.

**e2e (`e2e/inicio.spec.ts`), después del código:**
- Se **retiran**: "la hoja empieza con la frase… y sigue en orden" (se reescribe sin "hoja":
  el orden de las secciones), "la frase se enciende al bajar" (ya no se enciende).
- Se **cambian**: "a 360×640 … entran sin scroll" pasa a verificar la tarjeta entera y la
  cuarta fila "Ver todas en el mapa" **dentro** del `<nav>`; el techo se sigue midiendo.
- **Nuevos**: la tarjeta arranca antes del 45 % del alto a 360×640 y 360×780; con
  `scrollY = 600` el `h1` no está en el viewport y ningún elemento del inicio tiene
  `position: sticky` ni `animation-timeline` (salvo `.plano path`); el bento tiene 5 celdas
  (`<a>` con nombre accesible), sin huecos (las celdas cubren la grilla: la suma de sus
  `boundingBox` ≈ el ancho de la sección en cada fila) y "Ver todos los tipos" existe;
  Recién publicadas muestra dos tarjetas enteras; Por zona mide ≤ 110 px; `scrollHeight` del
  inicio ≤ 3500 px a 360×780; las secciones comparten el `x` del título.
- `e2e/tipografia.spec.ts`: si Instrument Serif se saca, el test pasa a "ninguna fuente que
  no sea Encode Sans o Archivo Black".
- Lighthouse `/` ≥ 90 (como en `resultados`, con el script que ya se usó).

### Riesgos

- **El título en 300 px de foto**: la foto se escala con `--zoom 1.36` y `--fy 1` (apoyada
  abajo). Con un marco bajo y ancho, la casa puede quedar demasiado grande o el techo muy
  alto. Se verifica con el test del techo a 5 anchuras **antes** de tocar la tarjeta; si falla,
  se ajustan `--zoom`/`--fy` solo para el celu.
- **Los tokens pegan en todo el sitio**: hay velos y etiquetas que asumían el crema
  (`ingresar/page.tsx` con `from-black/70`, el logo del pie, "Destacada"). Se capturan las seis
  rutas a 360 px antes de dar por bueno el bloque 1.
- **Deuda que toca**: `riesgos.md` dice "no sacar el `@custom-variant dark`": ya se sacó el
  2026-10-09 con el modo oscuro; esa línea se actualiza. La skill sigue nombrando lucide y "la
  página que sube": se corrige en el bloque 4.
- **Fotos repetidas en el bento** con los datos de prueba (pendiente 🟡 de fotos propias).
- **`images.qualities`**: la tarjeta compacta pide fotos a 75; el bento, a 75; nada nuevo.

### Alternativas consideradas

- **Hero estilo Zonaprop con selects** (tipo y zona en el primer pliegue): duplica el buscador
  guiado y el conteo del botón necesita JS. Descartado en la spec (§ No entra).
- **Mantener la hoja pero más suave** (sin sombra): Manuel eligió scroll normal; además la
  hoja obligaba al `sticky` + `100svh` que es lo que empuja la tarjeta abajo.
- **Bento con texto sobre la foto y velo**: pide medir contraste contra el velo en cada foto y
  la skill prohíbe velos sobre fotos. Franja blanca: contraste fijo, sin medir por foto.
- **Mostrar las 15 categorías en el bento** (3 filas de 1+4): más largo que la sección de
  hoy; 5 + "Ver todos" cumple el objetivo de ≤ 4,5 pantallas.
- **Carrusel con librería** y **animaciones con JS**: ya en `descartado.md` (2026-10-08).
- **Fondo blanco puro `#ffffff`**: las tarjetas no se separan del fondo sin sombra, y las
  sombras por tarjeta están fuera de la identidad. Gris muy claro + tarjeta blanca + borde.

## Tareas

### Bloque 1 — Fondo nuevo (commit: "Inicio v2: fondo claro, chau crema")

- [ ] `src/app/muestra/page.tsx`: bloque "Fondo" con las dos paletas (C `#f4f6f8` y A
      `#f7f7f7`) lado a lado, cada una con una tarjeta de propiedad real y un botón azul.
- [ ] 👀 Manuel elige C o A viendo `/muestra` en el celu. Si no contesta, C.
- [ ] `scripts/contraste.mjs`: `PALETA` con la elegida; agregar el par informativo
      `blanco` vs `papel`. `node scripts/contraste.mjs` todo en ✓.
- [ ] `src/app/globals.css`: tokens `papel`, `blanco`, `linea`, `tinta-suave`; comentario de
      cabecera reescrito (sin "papel cálido"); contrastes pegados. `--sombra-flota` nuevo.
- [ ] `src/app/layout.tsx`: `themeColor` al `papel` nuevo.
- [ ] Capturas a 360 px de `/`, `/propiedades`, `/propiedades/bol-01`, `/buscar/tipo?operacion=venta`,
      `/publicar/operacion`, `/ingresar` y mirarlas: nada con contraste roto, el logo del pie
      entero, "Destacada" legible, el velo de `/ingresar` bien sobre blanco.
- [ ] `docs/roadmap/riesgos.md`: sacar el gotcha "no sacar el `@custom-variant dark`" (ya no
      existe el modo oscuro).
- [ ] Gates: `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` en verde.

### Bloque 2 — Hero y scroll (commit: "Inicio v2: el buscador en el primer pliegue, scroll normal")

- [ ] `src/app/globals.css`: `.vivi-hero` sin `sticky` ni `@media (min-height)`;
      `.vivi-marco` con alto fijo `18.75rem` (celu) / `27.5rem` (lg), sin radio ni padding;
      borrar `.hoja`.
- [ ] Verificar el techo **antes de seguir**: `E2E_BASE_URL=… pnpm exec playwright test
      e2e/inicio.spec.ts -g "techo"` en verde a 360/390/412/768/1280. Si falla, ajustar
      `--zoom`/`--fy` del `.casa` para el celu y el `clamp` de `.vivi-titulo`.
- [ ] `src/components/inicio/filtro.tsx`: la tarjeta como lista (blanca, borde, radio 16,
      `--sombra-flota`, título 22 px a la izquierda; filas de 56 px con `divide-y`; ícono 22 px
      azul sin círculo; conteo a la derecha en `tinta-suave` tabular + caret; `:active`
      `plano-50`; con 0, fila gris sin link); cuarta fila "Ver todas en el mapa" (link azul,
      44 px, ícono `MapTrifold`). En lg: opciones en `grid-cols-3`, la cuarta fila debajo.
- [ ] `src/components/inicio/hero.tsx`: la foto arriba a sangre; la tarjeta debajo con
      `-mt-8 relative z-10 mx-4` (lg: contenedor `max-w-6xl`, tarjeta de `45rem` a la
      izquierda, `-mt-18`); sacar la píldora "Ver todas en el mapa" y el `mt-auto`.
- [ ] `src/components/inicio/frase.tsx`: un `<p>` en Encode 17 px (lg: 20) `tinta-suave`,
      `max-w-2xl`, sin spans. `globals.css`: borrar `.frase` y su `@supports` (queda el del
      plano).
- [ ] `src/app/page.tsx`: sin `<div className="hoja">`; las secciones directas en `<main>`.
- [ ] Instrument Serif: `grep -rn "font-voz\|font-instrument" src` → si solo la línea del pie,
      pasarla a `font-titulo` (Encode 700) y sacar `Instrument_Serif` de `layout.tsx` y
      `font-voz` de `globals.css`. `e2e/tipografia.spec.ts` pasa a "solo Encode Sans y
      Archivo Black".
- [ ] e2e `e2e/inicio.spec.ts`: reescribir "entran sin scroll" (tarjeta entera + cuarta fila
      dentro del `<nav>`, a 360×640 **y** 360×780 vía `page.setViewportSize`); nuevos: "la
      tarjeta arranca antes del 45 %"; "con scrollY 600 el h1 se fue y nada es sticky ni tiene
      animation-timeline salvo .plano path". Retirar "la frase se enciende".
- [ ] 👀 Manuel ve el hero en el celu (de arriba y bajando).
- [ ] Gates en verde.

### Bloque 3 — La hoja compacta (commit: "Inicio v2: bento de tipos y secciones compactas")

- [ ] **Test primero, en rojo**: `src/lib/inicio.test.ts` → `formaDelBento`: n ≥ 5 → 1 + 4 y
      `restantes = n − 5`; 4 → 2 + 2; 3 → 1 + 2; 2 → 2 + 0; ≤ 1 → `null`; con el seed,
      `restantes = 10`; no muta la entrada.
- [ ] `src/lib/inicio.ts`: `formaDelBento` (y su tipo `Bento`). `pnpm test` en verde.
- [ ] `src/components/inicio/bento.tsx` (nuevo): grilla 2 col (lg: 4 col, la grande 2×2 a la
      izquierda); celda `<Link aria-label="Casas en venta, 12 propiedades">` con foto
      (`fill`, `sizes` por celda, lazy) o `IconoTipo` si no hay foto, y franja blanca de 48 px
      (título 15/600 + conteo tabular a la derecha); radio 12, borde `linea`, `:hover`
      borde `tinta-suave`. `Seccion` con `ver={{ href: "/propiedades", texto: "Ver todos los
      tipos" }}` solo si `restantes > 0`. Borrar `por-tipo.tsx`.
- [ ] `src/components/resultados/tarjeta-propiedad.tsx`: variante `chica` a 160 px (foto 4:3,
      etiqueta 11 px, precio 17, título 14 truncado); variante nueva `destacada` de 224 px
      (chip trigo arriba a la izquierda, precio 18, título, **una** línea de datos 13 px). No
      tocar `grande`/`flotante`/`grilla`.
- [ ] `recien-publicadas.tsx`: `chica`. `destacadas.tsx`: `destacada`, sin `w-[85%]`. Si una
      propiedad está en las dos, sacarla de Recién (`src/lib/inicio.ts`, con test).
- [ ] `por-zona.tsx`: `CarruselHorizontal` con `grid grid-rows-2 grid-flow-col` (dos filas
      deslizables); chips de 44 px como hoy.
- [ ] `seccion.tsx`: `pt-8 md:pt-14`, título 22 px; mismo `px-4` para todas; los carruseles
      sangran al borde de la pantalla (`-mx-4 px-4` o `scroll-padding`).
- [ ] `src/components/shell/pie.tsx`: cierre `pt-24 md:pt-40` (plano ≈ 240 px).
- [ ] `src/app/page.tsx`: `Bento` en lugar de `PorTipo`.
- [ ] e2e `e2e/inicio.spec.ts`: "la hoja empieza con la frase…" → "las secciones van en
      orden" (sin la palabra hoja); nuevos: bento con 5 `<a>` con nombre accesible y sin
      huecos + "Ver todos los tipos"; Recién publicadas con dos tarjetas enteras; Por zona
      ≤ 110 px; `scrollHeight` ≤ 3500 a 360×780; mismo `x` de los títulos de sección a 360 y
      1280. Ajustar "una categoría lleva a su búsqueda" al bento.
- [ ] Capturas a 360 × 780 de todo el inicio (scroll completo) y a 1280: mirarlas.
- [ ] 👀 Manuel baja por el inicio en el celu.
- [ ] Gates en verde.

### Bloque 4 — Cierre (commit: "Inicio v2: verificación y documentación")

- [ ] Lighthouse mobile en `/` (≥ 90, accesibilidad 100) con el script de `resultados`; sin
      MapLibre en la carga. Anotar los números en § *Lo que se encontró al implementar*.
- [ ] Sin JS (`e2e/inicio-sin-js.spec.ts`): la tarjeta y las celdas del bento andan.
- [ ] `.claude/skills/identidad-visual/SKILL.md`: paleta nueva (hex y contrastes), íconos
      Phosphor, § Movimiento sin "la página que sube" (queda solo el plano del pie), bento como
      patrón del inicio.
- [ ] `DESIGN.md`: colores y el inicio como quedó.
- [ ] `docs/roadmap/descartado.md`: reabrir "bento de categorías" (Manuel lo pidió el
      2026-10-09) y la excepción de efectos de scroll (se retiran salvo el plano); nuevos
      descartes: hero con selects, fondo blanco puro, texto sobre foto en el bento.
- [ ] `vivi-bolivar.md` e `inicio-y-pie.md`: nota en § *Lo que se encontró al implementar*
      apuntando a esta spec.
- [ ] Gates en verde.
- [ ] 🙋 Permiso de escritura en `Skydope/inmo` (hoy `Manuelgarcia1` solo lee) y push de
      `main`.
- [ ] `/cerrar inicio-v2`: tildar en `pendientes.md`, mover a `completado.md` con fecha y
      contra qué se verificó; lo que quede (fotos propias para el bento, página de tipos) a
      `riesgos.md` / `hito-2/pendientes.md`.

## Lo que se encontró al implementar

_(se completa al ejecutar)_
