---
description: Corre el ciclo de cierre del roadmap para una spec o un pendiente
argument-hint: <slug o descripción del ítem>
---

Vas a **cerrar** algo terminado. Lo pendiente nunca se acumula al lado de lo hecho.

Qué se cierra: **$ARGUMENTS**

1. Buscá la spec (`docs/hitos/hito-*/$ARGUMENTS.md`) o el ítem en `pendientes.md`.
2. **Comprobá que esté terminado de verdad**: los criterios de aceptación tildados contra una
   verificación real (gates, e2e, capturas a 360 px, Manuel en su celular), no de memoria. Lo
   que no se pudo verificar se dice y queda como pendiente, no se tilda.
3. En `docs/hitos/hito-<n>/pendientes.md`: tildar y **sacar** el ítem.
4. En `docs/hitos/hito-<n>/completado.md`: agregarlo con **fecha y contra qué se verificó**
   (cantidad de tests, el e2e, las capturas, lo que haya).
5. Lo que deja: una regla nueva, una deuda o una fecha que vence → `docs/roadmap/riesgos.md`;
   algo evaluado y descartado → `docs/roadmap/descartado.md`.
6. Spec a `done` (frontmatter) con una sección de cierre: desvíos del plan y evidencia.
7. Actualizar el `README.md` del hito, la tabla y el top 3 de `docs/ROADMAP.md`, los datos
   nuevos en `docs/FICHA.md` y, si cambió el estado general, el bloque **Estado** de `CLAUDE.md`.
8. `mem_save` en engram (proyecto `inmo`, sin `session_id`: ver `CLAUDE.md` § Memoria).
