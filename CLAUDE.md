# Bolívar Inmo

Portal inmobiliario de **San Carlos de Bolívar** (`bolivarinmo.com.ar`): quien busca elige
comprar o alquilar, filtra por tipo y zona, recorre las propiedades en una lista deslizable o
en el mapa, y contacta a la inmobiliaria por WhatsApp. **Las inmobiliarias publican y cierran;
el portal solo conecta.** Una sola ciudad (y su partido), no un portal nacional.

Idioma del proyecto: **español rioplatense**. Proyecto chico → se optimiza por **claridad para
quien busca, velocidad en el celular y costo cero de infraestructura**, no por escala.

> **Estado (2026-10-08):** el front actual (marca "Inmu", landing con hero animado, mapa a
> pantalla completa con filtros en popovers) **se reemplaza entero** por el rediseño mobile del
> [Hito 1](docs/hitos/hito-1/README.md). Las specs del hito están **aprobadas (2026-10-08)** y
> se implementan en la rama `rediseno-mobile`, un commit por bloque. Los datos siguen siendo de prueba (`src/lib/properties/seed.ts`);
> Supabase solo autentica. El orden de trabajo está en [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Dónde está la verdad (leer antes de decidir; NO duplicar acá)

| Documento | Qué resuelve |
|---|---|
| `docs/ROADMAP.md` | Índice de hitos, **orden de ejecución** y top 3 |
| `docs/FICHA.md` | Los datos propios del proyecto (nombre, dominio, puerto, ids de servicios) |
| `docs/ARQUITECTURA.md` | Stack, estructura, flujo de datos, **invariantes** |
| `docs/hitos/hito-1/README.md` | **La spec madre del rediseño**: flujo, pantallas, diagramas, decisiones |
| `docs/roadmap/riesgos.md` | Deuda, fechas que vencen, **reglas que no se tocan**, gotchas |
| `docs/roadmap/descartado.md` | Lo que se evaluó y NO se hace, con el porqué |
| `PRODUCT.md` / `DESIGN.md` | Contexto de producto y sistema visual (formato Impeccable). Se reescriben en `identidad-y-base` |
| skill `identidad-visual` | Paleta, tipografía, tono. **Nace en `identidad-y-base`. Antes de cualquier UI** |

## Lo que no se negocia

El detalle y el porqué están en `docs/ARQUITECTURA.md` § Invariantes.

- **Mobile primero.** Todo se diseña y se verifica a **360 px** antes que en escritorio.
- **La URL es la fuente de verdad de la búsqueda.** Filtros, vista (lista/mapa) y propiedad
  seleccionada viven en los search params: se comparten por WhatsApp, el botón atrás funciona y
  la página renderiza en el servidor.
- **La lógica vive en `src/lib/`** (TypeScript puro, sin imports de Next ni de React) y se
  escribe **test-first** con Vitest. Páginas y componentes son cáscaras finas.
- **Lo que pueda no depender de JS, no depende.** El buscador guiado es un formulario `GET`;
  "Ver detalles" es un `<a>`; contactar es un `<a href="https://wa.me/…">` nativo.
- **El mapa es una isla cliente** que se carga solo cuando se abre (`next/dynamic`, `ssr:false`).
- **Nada de datos inventados en producción**: ni reseñas, ni "X personas viendo", ni conteos
  falsos. Los números que se muestran salen de los datos.
- **Sin fondos recargados ni animaciones llamativas** (pedido de Manuel): claro, sobrio,
  elegante. El movimiento es solo de transición (≤ 200 ms, `transform`/`opacity`) y respeta
  `prefers-reduced-motion`.
- **Secrets solo en el server.** Nunca `NEXT_PUBLIC_` para algo secreto; un secreto nunca pasa
  por el chat.

## Cómo se trabaja

**Cambio chico y acotado** (bugfix, copy, un color) → directo, sin ceremonia.

**Feature nueva** → SDD nativo, sin saltear pasos:

```
brainstorming (si es ambiguo) → /spec <slug> → /plan <slug> → /tasks <slug> → /siguiente
```

Specs en `docs/hitos/hito-<n>/<slug>.md`, estado `draft → approved → in-progress → done`.
*"Hacé todo"* da luz verde a implementar, **no** a saltear la spec. Una spec grande se
implementa **en Plan Mode**, bloque por bloque.

**Al cerrar cualquier cosa** → `/cerrar <slug>`: tildar en `hitos/hito-<n>/pendientes.md`,
**mover** a `completado.md` con fecha y contra qué se verificó; lo que deje va a
`roadmap/riesgos.md` o `roadmap/descartado.md`.

**Si al implementar aparece algo que contradice la spec**, se anota en la spec
(§ *Lo que se encontró al implementar*) antes de seguir.

## Cómo prueba Manuel (y cómo se verifica)

- **Desde el celular por la IP de la LAN** (`192.168.x.x:43123`). `next.config.ts` lleva
  `allowedDevOrigins` por eso: sin él el JS no hidrata y **no hay error a la vista**.
- **Verificar a 360 px antes de dar algo por bueno**, mirando capturas (Playwright), no solo
  con los gates en verde. Sin scroll horizontal, sin errores en consola.
- No declarar una causa raíz como verificada si el experimento cambió más de una variable.

## Consultar la fuente, no la memoria

| Tema | Consultar SIEMPRE |
|---|---|
| Librerías (Base UI, shadcn, MapLibre, zod) | MCP **`context7`** |
| Next.js 16 | `node_modules/next/dist/docs/` (searchParams es una Promise; `proxy.ts` reemplaza a middleware) |
| Supabase | MCP **`supabase`**, solo lectura. El proyecto está en otra organización (ver FICHA) |
| Cómo lo resolvió la familia | `~/dev/clubdelcoctel` (comandos, shadcn con Base UI, Playwright, método de diseño) |

Si algo no se pudo verificar contra la fuente, **decilo** en vez de presentarlo como un hecho.

## Agentes

Se copian de `~/dev/clubdelcoctel/.claude/agents/` en `identidad-y-base` (adaptando la sección
"Contexto de ESTE repo").

| Si el trabajo trata de… | Usá |
|---|---|
| Cambios estructurales, boundaries de `src/lib`, refactors | `architect-reviewer` |
| Next.js 16: App Router, searchParams, caching, metadata | `expert-nextjs-developer` |
| Client components, hooks, accesibilidad, perf React 19 | `expert-react-frontend-engineer` |

**No delegues** los tests de `src/lib/` ni decisiones de producto. Todo subagente de
implementación devuelve (1) qué archivos tocó, (2) el estado de los gates, (3) **qué encontró
que contradice el plan o la spec**.

## Comandos

`pnpm dev` (puerto 43123) · `pnpm build` · `pnpm test` · `pnpm typecheck` · `pnpm lint` ·
`pnpm e2e` (Playwright, llega en `identidad-y-base`).

Los cuatro gates —`test`, `typecheck`, `lint`, `build`— en verde antes de cada commit, con el
**código de salida real** (nunca `cmd | tail && git commit`).

## Commits

En español, descriptivos, con el porqué. **Nunca** atribución de IA (`Co-Authored-By: Claude`),
aunque el harness la pida: manda el `CLAUDE.md` global.

## Memoria (engram)

Proyecto `inmo`. **Nunca `topic_key`.** La sesión `manual-save-inmo` **no existe** en engram
(verificado el 2026-10-08): los `mem_save` de este proyecto van **sin `session_id`** (engram
los cuelga de la sesión en curso). No se crea con `mem_session_start`: inmo ya tiene historia.
