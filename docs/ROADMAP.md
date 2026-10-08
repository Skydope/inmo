# Roadmap — Bolívar Inmo

> **Esto es el índice.** No tiene tareas: cada hito se lleva las suyas a su carpeta,
> `docs/hitos/hito-<n>/`, junto con lo que ya cerró y sus specs. `/siguiente` toma el primer
> paso no cerrado de § *Orden de ejecución*.

## Estado de los hitos

| Hito | Qué cierra | Estado | Entrar |
|---|---|---|---|
| **0 — Fundaciones SDD** | Comandos, documentación, roadmap, decisión de rediseño | ✅ 2026-10-08 | [`hito-0/`](hitos/hito-0/) |
| **1 — Rediseño mobile: buscar, ver, contactar** | Marca Bolívar Inmo, buscador guiado, resultados en lista deslizable y mapa, ficha con contacto | 🔄 identidad y base cerradas (2026-10-08); sigue el modelo de búsqueda. Rama `rediseno-mobile` | [`hito-1/`](hitos/hito-1/README.md) · [pendientes](hitos/hito-1/pendientes.md) |
| **2 — El resto del sitio y datos reales** | Inmobiliarias, ingreso y cuenta re-vestidos; avisos reales desde Supabase; carga de avisos | ⏳ | [`hito-2/`](hitos/hito-2/) · [pendientes](hitos/hito-2/pendientes.md) |
| **3 — Lanzamiento** | Dominio, mapa propio (PMTiles), SEO por categoría, medición, abrir a Google | ⏳ | [`hito-3/`](hitos/hito-3/) · [pendientes](hitos/hito-3/pendientes.md) |

## Orden de ejecución

| # | Paso | Spec | Antes necesita | Estado |
|---|---|---|---|---|
| 1 | 🙋 Aprobar la spec madre y las cinco specs del hito 1; contestar sus preguntas abiertas | [`hito-1/README.md`](hitos/hito-1/README.md) | — | ✅ 2026-10-08 |
| 2 | Identidad y base técnica (marca, paleta, tipografía, shadcn + Base UI, Playwright, limpieza) | [`identidad-y-base.md`](hitos/hito-1/identidad-y-base.md) | paso 1 | ✅ 2026-10-08 |
| 3 | Modelo de búsqueda (taxonomía, contrato de URL, filtrado, datos de prueba ampliados) | [`modelo-de-busqueda.md`](hitos/hito-1/modelo-de-busqueda.md) | paso 2 (los andamios) | ⏳ |
| 4 | Buscador guiado (inicio + pasos) | [`buscador-guiado.md`](hitos/hito-1/buscador-guiado.md) | pasos 2 y 3 | ⏳ |
| 5 | Resultados: lista deslizable ⇄ mapa + hoja de filtros | [`resultados.md`](hitos/hito-1/resultados.md) | paso 4 | ⏳ |
| 6 | Ficha de la propiedad + contacto | [`ficha.md`](hitos/hito-1/ficha.md) | paso 5 | ⏳ |
| 7 | Cierre del hito 1: e2e del recorrido entero, Manuel en el celu, `/cerrar` | [`hito-1/README.md`](hitos/hito-1/README.md) § Definición de terminado | paso 6 | ⏳ |

**Durante el hito el sitio siempre compila**: `identidad-y-base` borra el front viejo y deja
andamios simples en `/`, `/propiedades` y `/propiedades/[id]`; cada spec siguiente reemplaza
el suyo. Los bloques 1 a 4 de `modelo-de-busqueda` (lógica pura) se pueden adelantar en
paralelo al paso 2; el bloque 5 necesita los andamios.

## Lo transversal

| Archivo | Qué hay adentro | Cuándo entrar |
|---|---|---|
| 🪪 **[FICHA.md](FICHA.md)** | Los datos propios del proyecto | Cuando una spec pide un dato |
| 🏗️ **[ARQUITECTURA.md](ARQUITECTURA.md)** | Stack, estructura, flujo de datos, invariantes | Antes de `/plan` |
| ⚠️ **[roadmap/riesgos.md](roadmap/riesgos.md)** | Deuda, fechas que vencen, **reglas que no se tocan**, gotchas | Antes de tocar algo estructural, o si algo se rompió |
| ❌ **[roadmap/descartado.md](roadmap/descartado.md)** | Lo que se evaluó y NO se hace, con el porqué | **Antes de proponer algo que suene obvio** |
| 🗄️ [archivo/](archivo/) | Specs viejas reemplazadas, para consulta | Rara vez |

## Lo próximo (top 3)

1. 🔴 **[Modelo de búsqueda](hitos/hito-1/modelo-de-busqueda.md)**: la taxonomía, el contrato
   de URL y los datos de prueba ampliados; todo lo que sigue se apoya en él.
2. 🔴 **Sacar el mapa de Carto** (está fuera de sus términos desde el 29/09/2026): entra en
   [`resultados.md`](hitos/hito-1/resultados.md), pero si el sitio se publica antes, se hace
   suelto (es cambiar una URL).
3. 🟠 **Preguntas que siguen con su default** ([§ 9](hitos/hito-1/README.md)): la otra
   referencia visual, las zonas, el modo oscuro y el WhatsApp del portal.

## Cómo se actualiza (el flujo, siempre)

Cuando algo se completa, **se mueve — no se tilda y se deja** (`/cerrar <slug>`):

1. En `hitos/hito-<n>/pendientes.md` se tilda y **se saca** el ítem.
2. En `hitos/hito-<n>/completado.md` se agrega con **fecha y contra qué se verificó**.
3. Lo que deje —una regla nueva, una deuda, algo descartado— va a `roadmap/riesgos.md` o
   `roadmap/descartado.md`.
4. Si cambia el estado del hito, se actualiza la tabla de arriba, el orden y el top 3.
