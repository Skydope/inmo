---
slug: inicio-y-pie
hito: 1
estado: draft
creada: 2026-10-08
---

# Inicio con contenido y pie completo

> Lo que va **debajo de la foto del inicio** y **el pie de todo el sitio**. Pedido de Manuel
> (2026-10-08), después de ver el buscador andando: *"el inicio quedó ahora muy pobre, siento
> que no tiene nada cuando scrolleas… agregale algo más lindo, más estético, como tenía el
> otro… ver propiedades más recientes, últimas propiedades subidas, ver inmobiliarias… el
> acceso rápido de algunas cards, siempre deslizando como carrusel… y después poner ver todas
> las inmobiliarias… que quede un poco más formal, estético, que tenga más contenido. Y un
> buen footer hay que hacer, fundamental."*
>
> Reemplaza el bloque 6 de [`resultados.md`](resultados.md) ("Recién publicadas en el inicio").

## Problema

- Debajo de la foto, el inicio tiene un solo bloque de texto con un link a inmobiliarias. Se
  siente vacío y poco profesional al bajar.
- El pie es mínimo: logo, una línea y cuatro links.
- El inicio viejo tenía cosas que sí servían (categorías con su conteo, destacadas, números
  del portal) y se fueron con la limpieza.

## Objetivo

Al bajar del buscador, el inicio muestra **contenido real que invita a entrar**, de a una
sección por vez y siempre deslizando: lo recién publicado, accesos rápidos por categoría, las
destacadas, las inmobiliarias de la ciudad y una invitación a las inmobiliarias. Termina en un
**pie completo y formal**. Todo con datos reales: nada inventado.

## Historias de usuario

- Como **quien entra a mirar sin una idea fija**, quiero ver lo último que se publicó, para
  enterarme de lo nuevo sin buscar.
- Como **quien sabe qué quiere** ("casas en venta", "quintas"), quiero un acceso directo de un
  toque.
- Como **quien busca**, quiero ver qué inmobiliarias publican, para confiar en el sitio y
  contactar a la que conozco.
- Como **inmobiliaria de Bolívar**, quiero ver cómo sumarme.
- Como **cualquiera que llega al fondo**, quiero encontrar todos los accesos y saber quién
  está detrás del sitio.

## Pantallas (360 px)

```
┌────────────────────────────────────┐
│ (foto + buscador: lo de hoy)        │ primer pliegue, sin cambios
├────────────────────────────────────┤
│ 36 propiedades · 4 inmobiliarias ·  │ franja de números (de los datos, sin animar)
│ 14 zonas                            │
├────────────────────────────────────┤
│ Recién publicadas       Ver todas › │ título + link
│ [▣ tarjeta][▣ tarjeta][▣ tarj…  →   │ carrusel: tarjeta chica (foto, precio, qué, dónde)
├────────────────────────────────────┤
│ Buscá por tipo                      │
│ [foto      ][foto      ][foto…  →   │ carrusel de categorías: foto de una propiedad de
│ Casas en   │Departamen-│            │ ese tipo, "Casas en venta" y "7 propiedades"
│ venta · 7  │tos · 4    │            │ (solo las que tienen propiedades)
├────────────────────────────────────┤
│ Destacadas              Ver todas › │ solo si hay 3 o más destacadas (dato real)
│ [▣▣▣ tarjeta grande ][▣▣▣ tar… →    │
├────────────────────────────────────┤
│ Por zona                            │
│ (Centro 7) (Casariego 4) (Quintas 5)│ chips de zona con conteo → resultados de esa zona
├────────────────────────────────────┤
│ Inmobiliarias de Bolívar            │
│ [◫ logo   ][◫ logo   ][◫ lo…  →     │ carrusel: logo, nombre, dirección, "12 propiedades"
│ Norte     │Centro    │              │
│ Ver todas las inmobiliarias ›       │
├────────────────────────────────────┤
│ ¿Sos inmobiliaria de Bolívar?       │ banda formal (fondo plano-50)
│ Publicá tus propiedades acá.        │
│ [ Ingresar ]                        │
├────────────────────────────────────┤
│ PIE (fondo tinta, letra clara)      │
│ ▣ bolívar inmo                      │
│ Las propiedades de las inmobiliarias│
│ de Bolívar, en un solo lugar.       │
│ Buscar        Por tipo              │ dos columnas a 360 px, cuatro en escritorio
│ Comprar       Casas                 │
│ Alquilar      Departamentos         │
│ Temporario    Terrenos              │
│ Ver en mapa   Casas quinta          │
│ Inmobiliarias Campos                │
│ Ver todas                           │
│ ¿Sos inmobiliaria? Ingresar         │
│ ─────────────────────────────────── │
│ © 2026 Bolívar Inmo · San Carlos de │
│ Bolívar, Buenos Aires               │
│ Las propiedades las publican las    │
│ inmobiliarias: precios y datos son  │
│ responsabilidad de cada una.        │
└────────────────────────────────────┘
```

### Comportamiento

- **Carruseles**: el mismo scroll-snap nativo del resto del sitio, asoma la tarjeta siguiente,
  flechas en escritorio. Sin autoplay ni animaciones.
- **Recién publicadas**: las 8 más nuevas (`publishedAt`), tarjeta `chica`. "Ver todas" →
  `/propiedades` (orden recientes).
- **Buscá por tipo**: una tarjeta por combinación operación + tipo con propiedades (por ejemplo
  "Casas en venta · 6", "Departamentos en alquiler · 4", "Casas quinta para fin de semana · 2"),
  ordenadas por cantidad. La foto es la de la propiedad más reciente de esa combinación; sin
  foto, el ícono del tipo. Link a `/propiedades?operacion=…&tipo=…`.
- **Destacadas**: las que la inmobiliaria marcó (`featured`). Si hay menos de 3, la sección no
  va.
- **Por zona**: las zonas con propiedades, con su conteo, como chips; link a resultados de esa
  zona.
- **Inmobiliarias**: una tarjeta por inmobiliaria con logo, nombre, dirección y cuántas
  propiedades tiene publicadas. Tocar → `/inmobiliarias` en esa inmobiliaria. Debajo, "Ver
  todas las inmobiliarias ›".
- **Números del portal**: propiedades, inmobiliarias y zonas con propiedades, contados de los
  datos. Sin contadores animados (descartados).
- **¿Sos inmobiliaria?**: banda con un botón a `/ingresar`. Cuando haya WhatsApp del portal
  (⚠️ FICHA), se suma "Escribinos".
- **El pie** va en **todas** las pantallas que hoy tienen pie (inicio, inmobiliarias,
  ingreso…): fondo `tinta`, letra `blanco` y un gris claro medido para lo secundario. Solo
  links a páginas que existen. Sin redes sociales hasta tenerlas.

## Alcance

**Entra:** las seis secciones debajo de la foto, el pie nuevo, las funciones de datos con sus
tests, y llevar el pie nuevo a las pantallas que lo usan.

**No entra:** páginas nuevas ("Sobre nosotros", contacto, legales: se suman cuando existan,
con su spec); newsletter; redes sociales; animaciones de entrada ([descartado](../../roadmap/descartado.md)).

## Criterios de aceptación

- [ ] Debajo de la foto del inicio se ven, en este orden: números, recién publicadas, buscá
      por tipo, destacadas (si hay 3+), por zona, inmobiliarias, ¿sos inmobiliaria?, pie.
- [ ] Todos los números y conteos salen de los datos (tests de las funciones).
- [ ] Cada carrusel se desliza con scroll-snap y asoma la tarjeta siguiente a 360 px; ninguna
      página tiene scroll horizontal.
- [ ] "Ver todas" y cada tarjeta llevan a resultados con la búsqueda correcta (e2e).
- [ ] El pie tiene las cuatro columnas en escritorio y dos a 360 px; todo lo que se toca mide
      ≥ 44 px; el texto pasa 4,5 de contraste sobre `tinta` (medido).
- [ ] Lighthouse mobile del inicio sigue ≥ 90 (las fotos de los carruseles cargan diferido).
- [ ] Detector de Impeccable sin hallazgos en el inicio.
- [ ] 👀 Manuel lo ve en el celu.

## Riesgos

- **Más fotos en el inicio pesa más**: todas con `next/image`, `loading="lazy"` y `sizes`
  chicos (las tarjetas miden ~240 px).
- **Con pocos datos reales, secciones flacas**: cada sección se oculta si no llega a un mínimo
  (destacadas 3, categorías 2, inmobiliarias 1).

## Preguntas abiertas

- ¿El pie oscuro (fondo `tinta`) o claro? *(Default: oscuro, más formal y cierra la página.)*
- ¿Va la franja de números? Con datos de prueba son chicos. *(Default: sí; se oculta si hay
  menos de 10 propiedades.)*

---

## Plan técnico

### Enfoque

Funciones puras en `src/lib/inicio.ts` (recientes, destacadas, categorías con conteo y foto,
zonas con conteo, números del portal) y `src/lib/agencies/resumen.ts` (inmobiliarias con sus
conteos: se saca de `src/app/inmobiliarias/page.tsx` para reusarlo). Un componente de
carrusel genérico liviano (`CarruselHorizontal`, scroll-snap + flechas en escritorio) que
usan las cuatro secciones deslizables. El inicio sigue siendo server component; los
carruseles son lo único cliente (por las flechas). El pie nuevo reemplaza a
`src/components/shell/pie.tsx`.

### Archivos

| Archivo | Qué |
|---|---|
| `src/lib/inicio.ts` (+ test) | `recientes(props, n)`, `destacadas(props)`, `categoriasDelInicio(props)`, `zonasConPropiedades(props)`, `numerosDelPortal(props, agencias)` |
| `src/lib/agencies/resumen.ts` (+ test) | `resumenDeInmobiliarias(props, agencias)`: id, nombre, logo, dirección, conteos por operación; lo usan el inicio y `/inmobiliarias` |
| `src/components/inicio/carrusel-horizontal.tsx` | `"use client"`: scroll-snap, asoma la siguiente, flechas en escritorio |
| `src/components/inicio/seccion.tsx` | Título + "Ver todas ›" |
| `src/components/inicio/{numeros,recien-publicadas,por-tipo,destacadas,por-zona,inmobiliarias,sos-inmobiliaria}.tsx` | Las secciones (server) |
| `src/components/shell/pie.tsx` | Pie nuevo (oscuro, columnas, legal) |
| `src/app/page.tsx` | Las secciones debajo de la foto |
| `src/app/inmobiliarias/page.tsx` | Usa `resumenDeInmobiliarias` |
| `e2e/inicio.spec.ts` | Secciones, links, pie, sin scroll horizontal |

### Tests (TDD)

1. `inicio.test.ts`: recientes ordena por fecha y corta en n; destacadas filtra `featured`;
   categorías agrupa por operación + tipo, ordena por cantidad, elige la foto más reciente y
   omite las vacías; zonas con conteo sin las de 0; números del portal.
2. `resumen.test.ts`: conteos por inmobiliaria iguales a filtrar a mano.
3. E2E: las secciones en orden; "Ver todas" de recién publicadas va a `/propiedades`; una
   tarjeta de categoría va a la búsqueda de esa categoría; "Ver todas las inmobiliarias" va a
   `/inmobiliarias`; el pie tiene sus links; sin scroll horizontal a 360 px.

### Alternativas consideradas

- **Grillas verticales** en vez de carruseles: Manuel pidió "siempre deslizando como
  carrusel".
- **Volver a traer el inicio viejo** (hero animado, contadores que suben, revelados al hacer
  scroll): descartado por la dirección visual; se recupera **el contenido** (categorías,
  destacadas, números), no los efectos.

## Tareas

**Bloque 1 — Datos del inicio** · commit "Inicio: recientes, categorías, zonas y números desde los datos"
- [ ] `inicio.test.ts` → `inicio.ts`; `resumen.test.ts` → `resumen.ts`.
- [ ] `/inmobiliarias` pasa a usar `resumenDeInmobiliarias`.
- [ ] Gates en verde.

**Bloque 2 — Secciones** · commit "Inicio: secciones deslizables debajo del buscador"
- [ ] `carrusel-horizontal.tsx`, `seccion.tsx` y las siete secciones.
- [ ] `src/app/page.tsx` con las secciones.
- [ ] E2E de secciones y links.
- [ ] Gates + `pnpm e2e`.

**Bloque 3 — Pie** · commit "Pie completo de Bolívar Inmo"
- [ ] `pie.tsx` nuevo; contraste del gris claro sobre `tinta` medido con `scripts/contraste.mjs`.
- [ ] E2E del pie (links, 44 px).
- [ ] Gates + `pnpm e2e`.

**Bloque 4 — Mirar**
- [ ] Capturas a 360, 390 y 1280; detector de Impeccable; Lighthouse mobile del inicio ≥ 90.
- [ ] 👀 Manuel en el celu.

**Cierre**
- [ ] `/cerrar inicio-y-pie`.

## Lo que se encontró al implementar

_(se completa al ejecutar)_
