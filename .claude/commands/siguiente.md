---
description: Ejecuta el próximo bloque del roadmap (docs/ROADMAP.md § Orden de ejecución)
argument-hint: "[slug o número de paso, opcional]"
---

Vas a avanzar **un paso** del roadmap. Lo que está especificado no se rediseña: se ejecuta.

Paso pedido (si viene vacío, el primero que no esté ✅): **$ARGUMENTS**

1. Leé `docs/ROADMAP.md` § *Orden de ejecución* y `docs/FICHA.md`. Elegí el paso: el pedido, o
   el primero no cerrado. **No saltees pasos**: si el anterior no está cerrado, decilo y pará.
2. Abrí la spec del paso (`docs/hitos/hito-<n>/<slug>.md`) entera, y la spec madre del hito
   (`README.md` de su carpeta). Leé también `docs/roadmap/riesgos.md` § Reglas que no se tocan.
3. **La spec tiene que estar `approved`.** Si está en `draft`, mostrale a Manuel las preguntas
   abiertas y pará hasta que la apruebe.
4. Chequeá los 🙋 del paso contra la realidad. Si falta alguno, hacé todo lo que no dependa de
   él y dale a Manuel el paso a paso exacto.
5. **Entrá en Plan Mode** y ejecutá la spec **bloque por bloque**, en el orden de sus tareas:
   - tests de `src/lib` primero, vistos en rojo;
   - cada bloque cierra con `pnpm test`, `pnpm typecheck`, `pnpm lint` y `pnpm build` en verde
     (código de salida real) y **un commit** en español, sin atribución de IA;
   - en los 👀, capturas a 360 px con Playwright y se le muestra a Manuel antes de seguir;
   - se van tildando las tareas `- [x]` en la spec a medida que se cierran.
6. Lo que encuentres que contradiga la spec o sea un gotcha nuevo: anotalo en la spec
   (§ *Lo que se encontró al implementar*).
7. Al terminar el paso: `/cerrar <slug>`, guardá en engram (`mem_save`, proyecto `inmo`,
   sin `session_id`: ver `CLAUDE.md` § Memoria) y decí en tres líneas qué quedó hecho, qué queda en manos
   de Manuel y cuál es el paso que sigue.
