# Completado — Hito 0: Fundaciones SDD

> Archivo histórico. No se borra nada.

## 2026-10-08 — Fundaciones SDD

Pedido de Manuel: *"un cambio radical del frontend… una super spec con SDD… usar lo de los
otros proyectos, fíjate por ejemplo el de Club del Cóctel… así dejamos todo anotado y lo
hacemos después con Plan Mode"*.

Qué quedó:

- `CLAUDE.md` del proyecto (no existía).
- `.claude/commands/`: `spec`, `plan`, `tasks`, `siguiente`, `cerrar`, calcados de
  `~/dev/clubdelcoctel/.claude/commands/` y adaptados a un portal inmobiliario.
- `docs/ROADMAP.md`, `docs/ARQUITECTURA.md`, `docs/FICHA.md`, `docs/roadmap/riesgos.md`,
  `docs/roadmap/descartado.md`, `docs/hitos/README.md`, `docs/hitos/_template.md`.
- El hito 1 especificado entero: spec madre + cinco specs con plan técnico y tareas.
- La spec anterior (`spec.md` en la raíz: navbar con operaciones y filtros en popovers) se
  archivó en `docs/archivo/2026-10-07-spec-navbar-y-filtros-popover.md`: la reemplaza el
  buscador guiado.
- Relevamiento de la referencia (tandilprop) y verificación de los términos de Carto (el mapa
  está fuera de términos desde el 29/09/2026).

Contra qué se verificó: es documentación; no hubo cambios de código. Los comandos se leyeron
contra los de Club del Cóctel; los componentes de Base UI (Drawer, Slider, ToggleGroup) contra
su documentación con `context7`; `next/form` contra `node_modules/next/dist/docs`; Carto
contra sus términos (carto.com/legal/basemap-terms, actualizados el 29/09/2026); OpenFreeMap
con un `curl` a `styles/positron` (200).
