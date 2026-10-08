# Hitos — Bolívar Inmo

Una carpeta por hito. **Todo lo de un hito vive junto**: sus tareas vivas, lo que ya cerró y
sus specs. El estado general y el orden están en [`../ROADMAP.md`](../ROADMAP.md).

```
hitos/hito-1/
├── README.md            la spec madre del hito: visión, flujo, diagramas, decisiones, índice
├── pendientes.md        lo único con tareas vivas
├── completado.md        lo cerrado, con fecha y verificación
└── buscador-guiado.md   una spec (spec + plan técnico + tareas)
```

Lo **transversal** no se parte por hito y vive en
[`../roadmap/riesgos.md`](../roadmap/riesgos.md) y
[`../roadmap/descartado.md`](../roadmap/descartado.md).

## Las specs

Cada feature con identidad propia es un archivo `hito-<n>/<slug>.md` que va acumulando, en
ese orden y en el mismo archivo:

1. **La spec**: el *qué* y el *por qué*, sin stack. La escribe `/spec <slug>`.
2. **El plan técnico**: el *cómo*. Lo escribe `/plan <slug>`.
3. **Las tareas**: checklist por bloques, ordenada por dependencia. Las escribe `/tasks <slug>`.

Estado en el frontmatter: `draft → approved → in-progress → done`. **Solo Manuel pasa una
spec a `approved`.** `/siguiente` no implementa una spec en `draft`.

**"Hacé todo" da luz verde a implementar, no a saltear la spec.**

## Al llegar a `done`

`/cerrar <slug>`: tildar en el `pendientes.md` del hito, **mover** el ítem a su
`completado.md` con fecha y verificación, y lo que deje va a `riesgos.md` o `descartado.md`.

## Plantilla

[`_template.md`](_template.md). Copiala, no la edites.
