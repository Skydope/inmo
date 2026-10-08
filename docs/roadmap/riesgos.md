# Riesgos — Bolívar Inmo

> Lo transversal: no se parte por hito. Se lee entero antes de tocar algo estructural.

## Reglas que no se tocan

1. **La URL es la fuente de verdad de la búsqueda** (ver `ARQUITECTURA.md` § Invariantes).
   Nada de estado de filtros en `localStorage`, contexto global o cookies.
2. **`src/lib/` puro y test-first.** Un test nuevo se ve en rojo antes de escribir el código.
3. **Contactar es un `<a>` nativo** a `wa.me` / `tel:` / `mailto:`. Nunca un `<button
   onClick>` que arma la URL en el cliente: dentro del navegador de Instagram o con JS lento,
   un botón que depende de JS es una consulta perdida en silencio.
4. **El mapa no entra en la carga inicial** de `/` ni de `/propiedades` en vista lista.
5. **Atribución de OpenStreetMap visible** en todo mapa (la exigen OSM y cualquier proveedor
   de tiles). No se tapa con la tarjeta flotante.
6. **Nada de datos inventados en producción.**
7. **Los cuatro gates en verde** con código de salida real antes de cada commit.

## Fechas que vencen

| Fecha | Qué | Qué hacer |
|---|---|---|
| **ya vencido (29/09/2026)** | Carto cambió sus términos: sus basemaps exigen API key propia. El código usa `basemaps.cartocdn.com` **sin key** (`src/components/map/property-map.tsx`). Sin key puede poner marca de agua o bloquear sin aviso | Pasar a OpenFreeMap (tarea de `resultados.md`). Si el sitio se publica antes del hito 1, hacerlo suelto |
| 30/11/2026 → 01/12/2026 | Fin de la transición de Carto para claves viejas de uso comercial; desde el 1/12 rige el tope comercial (1 M de pedidos de tiles/mes gratis) | Ya no aplica si se migró a OpenFreeMap |

Fuente: [CARTO Basemaps Terms](https://carto.com/legal/basemap-terms/) (actualizados el
29/09/2026), leídos el 2026-10-08.

## Deuda abierta

- **OpenFreeMap no garantiza disponibilidad** (se sostiene con donaciones). Es la solución
  para el hito 1; antes de lanzar se sirve un **PMTiles propio** del partido de Bolívar
  (pendiente en `hito-3`). Hasta entonces, si OpenFreeMap cae, el mapa queda vacío: la lista
  sigue andando.
- **Los datos son de prueba.** Las fotos de los tipos nuevos (quinta, campo, local, galpón…)
  hay que conseguirlas (🙋 en `modelo-de-busqueda.md`).
- **La lista de zonas es provisional** (salió de fuentes públicas viejas). Confirmar con una
  inmobiliaria local antes de lanzar.
- **Pines como marcadores HTML**: andan bien hasta ~150 propiedades en pantalla. Más que eso
  → pasar a una capa GeoJSON con símbolos (GPU) y clustering.
- **`/inmobiliarias`, `/ingresar`, `/cuenta`, `/publicar`** quedan con el shell nuevo pero
  sin re-vestir hasta el hito 2.
- **"Ver catálogo" de `/inmobiliarias` no filtra**: arma `/propiedades?agencia=<nombre>`,
  pero `agencia` no está en el contrato de URL (`modelo-de-busqueda.md`) y se ignora: muestra
  todas. Resolver con un parámetro `inmobiliaria=<id>` (spec propia) o sacando el link.

## Gotchas del stack

- **`allowedDevOrigins`** en `next.config.ts`: sin él, desde el celu por IP el JS no hidrata y
  no hay error a la vista.
- **Next 16**: `searchParams` es una `Promise` (hay que `await`); `useSearchParams` en un
  client component necesita un `<Suspense>` arriba o rompe el build estático.
- **`window.history.replaceState`** se integra con el router de Next (desde 14.1): sirve para
  `vista` y `sel` sin pedirle nada al servidor.
- **Worker de MapLibre** self-hosteado en `public/maplibre/` (`maplibre-gl-shared.mjs`,
  `maplibre-gl-worker.mjs`): si se actualiza `maplibre-gl`, hay que actualizar esas copias.
- **Gestos que compiten**: el carrusel desliza en horizontal, el Drawer de Base UI se cierra
  deslizando hacia abajo, y el mapa usa todos los gestos. Dentro de un Drawer, lo que desliza
  en horizontal lleva `data-base-ui-swipe-ignore`. La tarjeta flotante del mapa **no** es un
  Drawer (ver `resultados.md`).
- **El CLI de shadcn (4.21) puede escribir `import { cn } from "cn"`** en vez del alias
  `@/lib/utils` e instalar un paquete npm llamado `cn`. **Cada vez que se agregue un
  componente con el CLI**: `grep -rn 'from "cn"' src` vacío y `cn` fuera de `package.json`.
- **`dark:` en Tailwind 4 es `prefers-color-scheme` por defecto**: los componentes de shadcn
  traen clases `dark:`. `globals.css` las ata a una clase `.dark` que nunca se pone; no sacar
  ese `@custom-variant` mientras no haya modo oscuro.
- **Inputs a 16 px como mínimo**: con menos, Safari de iPhone hace zoom al tocar el campo.
- **`allowedDevOrigins` tiene que incluir `127.0.0.1`**: con el dev server levantado con
  `--hostname 0.0.0.0`, entrar por `127.0.0.1` sirve el HTML pero **no hidrata** (sin error
  visible). Los e2e corren contra `localhost`.
- **No usar `loading.tsx`** (regla, 2026-10-08): (1) con el streaming que habilita, la respuesta
  ya salió cuando corren `redirect()`/`notFound()` y el código queda en 200; (2) **sin
  JavaScript la página queda en el esqueleto para siempre**: el contenido llega en streaming y lo
  que lo pone en lugar del esqueleto es un script. Rompe "lo que puede andar sin JS, anda sin
  JS". Los parámetros válidos de una ruta, con `dynamicParams = false`.
- **`next/form` no pasa la `ref` al `<form>`**: se escucha desde un elemento de adentro con
  `closest("form")`.
- **Next 16 exige `images.qualities`**: una calidad que no esté en la lista se redondea a la más
  cercana. Hoy: 55 (fotos con velo) y 75.
- **Next 16 no levanta dos dev servers en el mismo proyecto**: si `pnpm dev` está corriendo
  (por ejemplo, para que Manuel mire en el celu), `pnpm e2e` falla al arrancar el suyo. Se
  corre contra el que ya está: `E2E_BASE_URL=http://127.0.0.1:43123 pnpm e2e`.
- **WebKit del e2e** (proyecto `iphone`) necesita `libavif16` en el sistema
  (`sudo apt-get install libavif16`, instalado el 2026-10-08). En `next dev`, WebKit a veces no
  abre el websocket de recarga en caliente (`/_next/hmr`): el e2e de humo lo ignora.
- **Alto de pantalla en el celu**: usar `svh`/`dvh`, no `vh`. El navegador de Instagram deja
  menos alto que Safari: probar con 360 × 640.
- **Scroll-snap en iOS**: `scroll-snap-stop: always` evita que un deslizamiento rápido salte
  tres tarjetas.
