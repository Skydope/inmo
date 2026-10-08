---
description: Escribe una especificación (el QUÉ y el POR QUÉ, sin stack) en docs/hitos/hito-<n>/
argument-hint: <nombre-feature> [descripción breve]
---

Vas a crear o actualizar la **especificación** de una feature siguiendo SDD nativo.

Feature / pedido del usuario: **$ARGUMENTS**

Pasos:
1. Si el pedido es ambiguo, hacé 2-3 preguntas de clarificación ANTES de escribir (o usá la skill `brainstorming`).
2. Leé `docs/ARQUITECTURA.md`, `docs/ROADMAP.md` y la spec madre del hito
   (`docs/hitos/hito-<n>/README.md`) para encuadrar la feature en el sistema real: un portal
   inmobiliario de una ciudad, mobile primero, con la URL como fuente de verdad de la búsqueda.
   No propongas nada que contradiga la arquitectura sin marcarlo.
2b. **OBLIGATORIO antes de escribir**: leé `docs/roadmap/descartado.md` y
    `docs/hitos/hito-<n>/pendientes.md`. Si la feature ya está descartada, decilo de entrada con
    el porqué y qué dato nuevo la reabriría. Si está anotada como pendiente, la spec la
    reemplaza: mencioná el ítem para moverlo al cerrar.
3. Escribí la spec en `docs/hitos/hito-<n>/<slug>.md` copiando `docs/hitos/_template.md`:
   - frontmatter con estado `draft` y fecha;
   - **Problema**, **Objetivo** (comportamiento observable, NADA de stack);
   - **Historias de usuario** — "Como <quien busca | inmobiliaria | admin> quiero <X> para <Y>";
   - **Pantallas** — wireframe ASCII a **360 px** y el comportamiento de cada control;
   - **Criterios de aceptación** verificables (Given/When/Then cuando aplique). "Se ve lindo"
     no es un criterio; "a 360 px el primer pliegue muestra X sin scroll" sí;
   - **Alcance** (entra / no entra), **Riesgos**, **Preguntas abiertas**.
4. NO escribas plan técnico ni tareas todavía (eso es `/plan` y `/tasks`).
5. Al terminar, decí el path del archivo y resumí en 3 líneas. Sugerí `/plan` cuando Manuel la apruebe.
