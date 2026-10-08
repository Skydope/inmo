---
description: Convierte el plan de una spec en una checklist de tareas accionables
argument-hint: <slug-feature>
---

Vas a derivar la **lista de tareas** ejecutables del plan técnico.

Feature (slug): **$ARGUMENTS**

Pasos:
1. Buscá `docs/hitos/hito-*/$ARGUMENTS.md` (spec + plan técnico). Si falta el plan, pedí correr `/plan` primero.
2. Completá la sección **## Tareas** del mismo archivo, como checklist `- [ ]` agrupada en
   **bloques** (cada bloque termina en un commit), ordenada por dependencia:
   - Cada tarea: chica, verificable, con el/los archivo(s) que toca.
   - Orden TDD: **tests de `src/lib` primero (vistos en rojo)** → lógica → datos → componentes
     → páginas → e2e → verificación mirando a 360 px.
   - Cada bloque cierra con `pnpm test`, `pnpm typecheck`, `pnpm lint` y `pnpm build` en verde.
   - Marcá con 🙋 lo que tiene que hacer o decidir Manuel, y con 👀 los momentos en que se le
     muestra algo en el celular antes de seguir.
   - **Últimas tareas, siempre**: el cierre del roadmap (`/cerrar <slug>`).
3. Al final, recordá: implementar con Plan Mode si el cambio es grande, e ir tildando `- [x]`.
4. NO implementes en este paso; solo dejá la checklist lista.
