# Hito 2 — El resto del sitio y datos reales

⏳ sin specs todavía

Lo que el hito 1 deja afuera a propósito: re-vestir las pantallas que no son del recorrido de
búsqueda, y pasar de datos de prueba a **avisos reales cargados por las inmobiliarias** en
Supabase (proyecto `hkojikwadtngrxtaumrg`, ver FICHA).

Las specs se escriben con `/spec <slug>` cuando el hito 1 esté cerrado. Candidatas:

| Spec | Qué cubriría |
|---|---|
| `inmobiliarias` | Directorio re-vestido + página de cada inmobiliaria con sus propiedades |
| `ingreso-y-cuenta` | `/ingresar`, `/cuenta` con la identidad nueva |
| `datos-reales` | Esquema en Supabase con la taxonomía del hito 1, adapter real, RLS |
| `carga-de-avisos` | Que una inmobiliaria habilitada cargue y edite sus avisos (`/publicar`) |

| Archivo | Qué guarda |
|---|---|
| 📋 [`pendientes.md`](pendientes.md) | Lo anotado para este hito |
| ✅ `completado.md` | Se crea con el primer cierre |
