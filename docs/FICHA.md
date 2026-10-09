# Ficha — Bolívar Inmo

> Los datos propios del proyecto. Las specs los leen de acá; si un dato está en ⚠️, se
> pregunta antes de escribir código con un valor inventado.

| Dato | Valor | Estado |
|---|---|---|
| Nombre público | **Bolívar Inmo** en textos; logotipo "bolívar inmo" en minúscula | ✅ confirmado por Manuel (2026-10-08) |
| Dominio | `bolivarinmo.com.ar` | ⚠️ falta registrarlo en NIC.ar (🙋 Manuel) |
| Identidad | "El cartel y el plano": acción en azul plano `#1f4e79`, Encode Sans. Skill `identidad-visual` | ✅ elegida por Manuel (2026-10-08) |
| Ciudad | San Carlos de Bolívar, provincia de Buenos Aires (y las localidades del partido) | ✅ |
| Centro del mapa | `-36.2308, -61.1143` (`BOLIVAR_CENTER` en `src/lib/brand.ts`) | ✅ |
| Repo | `github.com/Skydope/inmo` (**público**), `origin` desde 2026-10-09. Antes: `github.com/Bridge-Bolivar/inmobiliaria` (privado, ya no se usa) | ⚠️ falta permiso de escritura para `Manuelgarcia1` (🙋 Skydope) |
| Dev | `pnpm dev` → `127.0.0.1:43123`. **Desde el celu**: `pnpm exec next dev --port 43123 --hostname 0.0.0.0` → `http://192.168.x.x:43123` | ✅ |
| Node / pnpm | Node 24 · pnpm 10.28.1 | ✅ |
| Supabase | Proyecto `hkojikwadtngrxtaumrg` ("Inmo"), **en otra organización** (no MatiasDev). Hoy solo Auth con Google | ✅ |
| Vercel | — | ⚠️ sin dato: ¿hay proyecto creado? |
| Mapa: librería | MapLibre GL 6.11.2 (BSD-3, gratis, sin límites) | ✅ |
| Mapa: tiles | Hoy **Carto sin API key** (fuera de sus términos desde el 29/09/2026). Pasa a **OpenFreeMap** en `resultados` y a **PMTiles propio** antes de lanzar | ⚠️ ver `roadmap/riesgos.md` |
| WhatsApp / mail del portal | — | ⚠️ falta (el pie y "Sumá tu inmobiliaria" lo necesitan) |
| Inmobiliarias reales | — | ⚠️ falta la lista (hoy hay 4 de prueba en `src/lib/agencies/seed.ts`) |
| Barrios / zonas | Lista provisional en `docs/hitos/hito-1/modelo-de-busqueda.md` § Zonas | ⚠️ confirmar con una inmobiliaria local |
