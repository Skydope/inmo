# Inmo — portal inmobiliario Bolívar (front v1)

Front-only mock del portal local para **Bolívar, Buenos Aires**.  
Stack: Next.js (App Router) + TypeScript + Tailwind + MapLibre. Sin backend.

Marca TBD → wordmark placeholder vía constante `brandName` en `src/lib/brand.ts`.

## Correr en local

```bash
npm install
npm run dev
```

Abrí [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Dev server en `127.0.0.1:43123` |
| `npm test` | Unit tests (filtros, GPS, markers, haversine, contacto) |
| `npm run typecheck` | TypeScript |
| `npm run build` | Build de producción |

## Superficies

- `/` — landing ref-03 (hero glass, light/dark toggle, categorías, grid)
- `/propiedades` — Explorar: listado + mapa (force dark; URL-state de filtros)
- `/propiedades/[id]` — detalle + CTA contacto (`wa.me` / `tel` / `mailto`)

Tema: `ThemeProvider` + toggle luna/sol en el hero. Preferencia en `localStorage` (`inmo-theme`).

## Datos

Mock seed en `src/lib/properties/seed.ts`, acceso vía `getProperties()` (`src/lib/properties/adapter.ts`).  
Swap al backend de socios = cambiar el adapter.

## Spec / refs

Ver `docs/spec-alcance-v1.md` y `docs/references/`.
