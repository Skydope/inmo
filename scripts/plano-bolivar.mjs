#!/usr/bin/env node
// El plano de Bolívar para el pie del inicio: las calles del casco urbano, de OpenStreetMap,
// pasadas a datos estáticos (src/components/shell/plano-de-bolivar.datos.ts). Corre una sola vez
// (o cuando se quiera actualizar el plano):
//   node --network-family-autoselection-attempt-timeout=3000 scripts/plano-bolivar.mjs
// (el flag: con conexiones lentas, el intento de 250 ms por defecto de Node no alcanza).
// Datos © colaboradores de OpenStreetMap, licencia ODbL 1.0: la atribución va visible en el pie.
import { writeFileSync } from "node:fs"

// El casco urbano de San Carlos de Bolívar (≈ 4 × 4 km alrededor de la plaza).
const CAJA = { sur: -36.249, oeste: -61.1385, norte: -36.213, este: -61.09 }
const ANCHO = 1000
const TOLERANCIA = 0.75 // unidades del plano (≈ 4 m): Douglas-Peucker
const AVENIDAS = /^(trunk|primary|secondary|tertiary)(_link)?$/
const SERVIDORES = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]

const caja = `${CAJA.sur},${CAJA.oeste},${CAJA.norte},${CAJA.este}`
const consulta = `[out:json][timeout:90];
way["highway"~"^(trunk|primary|secondary|tertiary|unclassified|residential|living_street|pedestrian)(_link)?$"](${caja});
out geom(${caja}) qt;`

async function pedir() {
  for (const url of SERVIDORES) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "BolivarInmo-plano/1.0 (+https://bolivarinmo.com.ar)" },
        body: `data=${encodeURIComponent(consulta)}`,
      })
      if (r.ok) return await r.json()
      console.error(`${url}: ${r.status}`)
    } catch (e) {
      console.error(`${url}: ${e.message}`)
    }
  }
  throw new Error("Overpass no respondió: el pie queda sin plano hasta reintentar.")
}

// Proyección equirectangular corregida por la latitud: suficiente para 4 km.
const lat0 = ((CAJA.sur + CAJA.norte) / 2) * (Math.PI / 180)
const k = ANCHO / ((CAJA.este - CAJA.oeste) * Math.cos(lat0))
const ALTO = Math.round((CAJA.norte - CAJA.sur) * k)
const proyectar = ({ lat, lon }) => [(lon - CAJA.oeste) * Math.cos(lat0) * k, (CAJA.norte - lat) * k]

function douglasPeucker(puntos, tolerancia) {
  if (puntos.length < 3) return puntos
  const [ax, ay] = puntos[0]
  const [bx, by] = puntos.at(-1)
  const largo = Math.hypot(bx - ax, by - ay) || 1
  let maxima = 0
  let indice = 0
  for (let i = 1; i < puntos.length - 1; i++) {
    const [px, py] = puntos[i]
    const d = Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / largo
    if (d > maxima) [maxima, indice] = [d, i]
  }
  if (maxima <= tolerancia) return [puntos[0], puntos.at(-1)]
  return [...douglasPeucker(puntos.slice(0, indice + 1), tolerancia).slice(0, -1), ...douglasPeucker(puntos.slice(indice), tolerancia)]
}

// Un tramo como path SVG: enteros y movimientos relativos (lo más corto).
function aPath(puntos) {
  const enteros = puntos.map(([x, y]) => [Math.round(x), Math.round(y)])
  let d = `M${enteros[0][0]} ${enteros[0][1]}`
  for (let i = 1; i < enteros.length; i++) {
    const dx = enteros[i][0] - enteros[i - 1][0]
    const dy = enteros[i][1] - enteros[i - 1][1]
    if (dx || dy) d += `l${dx} ${dy}`
  }
  return d.includes("l") ? d : null
}

const datos = await pedir()
const calles = []
const avenidas = []
for (const via of [...datos.elements].sort((a, b) => a.id - b.id)) {
  if (!via.geometry?.length) continue
  const d = aPath(douglasPeucker(via.geometry.filter(Boolean).map(proyectar), TOLERANCIA))
  if (!d) continue
  ;(AVENIDAS.test(via.tags?.highway ?? "") ? avenidas : calles).push(d)
}

const salida = new URL("../src/components/shell/plano-de-bolivar.datos.ts", import.meta.url)
const contenido = `// Generado por scripts/plano-bolivar.mjs (${new Date().toISOString().slice(0, 10)}): no editar a mano.
// Datos © colaboradores de OpenStreetMap, licencia ODbL 1.0 (https://www.openstreetmap.org/copyright).
export const PLANO_DE_BOLIVAR = {
  ancho: ${ANCHO},
  alto: ${ALTO},
  avenidas: ${JSON.stringify(avenidas)},
  calles: ${JSON.stringify(calles)},
} as const
`
writeFileSync(salida, contenido)
console.log(`${avenidas.length} avenidas, ${calles.length} calles, ${(contenido.length / 1024).toFixed(1)} KB, ${ANCHO}×${ALTO}`)
