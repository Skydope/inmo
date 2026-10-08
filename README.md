# Bolívar Inmo

Portal inmobiliario de **San Carlos de Bolívar** (`bolivarinmo.com.ar`): las propiedades en
venta y alquiler de las inmobiliarias de la ciudad, en un solo lugar. Mobile primero.

Stack: Next.js 16 (App Router) + TypeScript + Tailwind 4 + shadcn sobre Base UI + MapLibre.
Supabase solo para el ingreso de inmobiliarias (Google). Los avisos son datos de prueba.

**Cómo se trabaja** (SDD, specs, roadmap): [`CLAUDE.md`](CLAUDE.md) y
[`docs/ROADMAP.md`](docs/ROADMAP.md). El rediseño en curso: [`docs/hitos/hito-1/`](docs/hitos/hito-1/README.md).

## Correr en local

```bash
pnpm install
pnpm dev                                                   # 127.0.0.1:43123
pnpm exec next dev --port 43123 --hostname 0.0.0.0         # para abrirlo desde el celu por la IP de la LAN
```

## Scripts

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Dev server en `127.0.0.1:43123` |
| `pnpm test` | Tests de la lógica (`src/lib`, Vitest) |
| `pnpm typecheck` | TypeScript |
| `pnpm lint` | ESLint |
| `pnpm build` | Build de producción |
| `pnpm e2e` | Playwright: Android chico (360×640), iPhone (WebKit), escritorio y sin JS. Si `pnpm dev` está corriendo: `E2E_BASE_URL=http://127.0.0.1:43123 pnpm e2e` |
| `node scripts/contraste.mjs` | Contraste WCAG de la paleta |

## Pantallas

- `/` — inicio (andamio; lo reemplaza el buscador guiado)
- `/propiedades` — resultados (andamio; lo reemplaza la lista deslizable ⇄ mapa)
- `/propiedades/[id]` — ficha (andamio)
- `/inmobiliarias`, `/ingresar`, `/cuenta`, `/publicar`
- `/muestra` — muestra de identidad, solo en desarrollo

## Datos

Seed en `src/lib/properties/seed.ts`, acceso vía `getProperties()` / `getPropertyById()`
(`src/lib/properties/adapter.ts`). Pasar a datos reales = cambiar el adapter por dentro.
