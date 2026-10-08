# Completado — Hito 1: Rediseño mobile

> Archivo histórico de este hito. Cada ítem sale de [`pendientes.md`](pendientes.md) o de
> una spec y llega acá **con fecha y contra qué se verificó**. No se borra nada.

## 2026-10-08 — Specs aprobadas

Manuel aprobó la spec madre y las cinco specs ("arranca", y lo confirmó al preguntarle).
Contestó: marca **Bolívar Inmo** (logotipo "bolívar inmo"), **alquiler temporario chico en el
inicio**, commits en la rama **`rediseno-mobile`**. El resto de § 9 corre con su default.

## 2026-10-08 — Paleta elegida: B, azul plano

Manuel vio `/muestra` en su celular (por la IP de la LAN) y eligió **B** ("B"). El color de
acción es `plano-700` `#1f4e79` (blanco encima 8,66). La A, verde palmera, va a
`roadmap/descartado.md`. Verificado: `node scripts/contraste.mjs` con todos los pares en ✓.

## 2026-10-08 — Identidad y base técnica ([`identidad-y-base.md`](identidad-y-base.md))

Qué quedó: marca Bolívar Inmo (isotipo + "bolívar inmo"), tokens con contraste medido (azul
plano), Encode Sans, lucide, shadcn sobre Base UI (button, toggle, toggle-group, drawer,
dialog, input, label, badge, separator, skeleton), la opción grande, la etiqueta "cartel", el
shell (header, menú, pie), Playwright en cuatro proyectos, la skill `identidad-visual`,
`DESIGN.md` y `PRODUCT.md` nuevos, y el front de "Inmu" retirado: `/`, `/propiedades` y
`/propiedades/[id]` son andamios hasta las specs siguientes.

Contra qué se verificó: gates en verde (32 tests de Vitest, typecheck, lint en 0 errores
—había 9 en `main`—, build); 30 e2e en verde en Android chico, iPhone (WebKit) y escritorio;
contrastes medidos por script; capturas a 360 y 390 px miradas; Manuel aprobó la paleta en su
celular. El detalle y los desvíos están en el cierre de la spec.
