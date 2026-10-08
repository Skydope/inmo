---
description: Convierte una spec de docs/hitos/hito-<n>/ en un plan técnico
argument-hint: <slug-feature>
---

Vas a escribir el **plan técnico** para una feature ya especificada.

Feature (slug): **$ARGUMENTS**

Pasos:
1. Buscá la spec en `docs/hitos/hito-*/$ARGUMENTS.md`. Si no existe, pedí que se corra `/spec` primero.
2. Leé `docs/ARQUITECTURA.md` (stack real: Next 16 App Router, `src/lib` puro y testeado,
   shadcn sobre Base UI, MapLibre, URL como fuente de verdad) y `docs/roadmap/riesgos.md`
   (deuda abierta y **reglas que no se tocan**). Para "Alternativas consideradas", chequeá
   `docs/roadmap/descartado.md`: si una alternativa ya se descartó, citá esa decisión.
3. Verificá contra la fuente lo que el plan asuma de una librería (`context7`; para Next 16,
   `node_modules/next/dist/docs/`). Lo que no se pudo verificar se marca "a verificar".
4. Completá la sección **## Plan técnico** del mismo archivo con:
   - **Enfoque** — la estrategia en 3-5 líneas.
   - **Archivos/módulos afectados** — rutas concretas, y qué se borra.
   - **Datos** — cambios en tipos, seed y contrato de URL.
   - **Tests (TDD)** — qué tests de `src/lib` se escriben PRIMERO; qué cubre el e2e.
   - **Riesgos** — qué puede romper, qué deuda toca.
   - **Alternativas consideradas** — y por qué se descartaron.
5. NO implementes. Al terminar, sugerí `/tasks $ARGUMENTS`.
