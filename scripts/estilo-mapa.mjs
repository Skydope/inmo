#!/usr/bin/env node
// Arma public/mapa/estilo.json: el estilo "positron" de OpenFreeMap (gratis, sin API key, uso
// comercial permitido) recoloreado con la paleta de Bolívar Inmo. Los tiles, las fuentes y los
// íconos siguen viniendo de OpenFreeMap; cuando haya PMTiles propio (hito 3), se cambian las
// `sources` acá y se vuelve a correr.
// Uso: node scripts/estilo-mapa.mjs
import { writeFileSync, mkdirSync } from "node:fs"

const ORIGEN = "https://tiles.openfreemap.org/styles/positron"

// Día: papel, tinta y agua lavada. De noche el acento de los nombres (hints) es oro.
const DIA = {
  papel: "#efe8dc",
  manzana: "#e7dfd2",
  edificio: "#ddd4c6",
  parque: "#b7c9ae",
  agua: "#a8c4d4",
  linea: "#e4dcd0",
  calle: "#f7f2ea",
  calleMenor: "#ebe3d6",
  tintaSuave: "#6e675e",
  tinta: "#1a1a1a",
  aguaTexto: "#6e675e",
  hint: "#6e675e",
}

const NOCHE = {
  papel: "#1a1a1a",
  manzana: "#22201c",
  edificio: "#2a2723",
  parque: "#1b3326",
  agua: "#163040",
  linea: "#3a3530",
  calle: "#2e2a26",
  calleMenor: "#26221e",
  tintaSuave: "#a8a297",
  tinta: "#f3efe6",
  aguaTexto: "#c4a574",
  hint: "#c4a574",
}

const coloresDe = (p) => ({
  background: { "background-color": p.papel },
  park: { "fill-color": p.parque },
  water: { "fill-color": p.agua },
  landuse_residential: { "fill-color": p.manzana },
  landcover_wood: { "fill-color": p.parque },
  building: { "fill-color": p.edificio },
  waterway: { "line-color": p.agua },
  highway_minor: { "line-color": p.calleMenor },
  highway_major_casing: { "line-color": p.linea },
  highway_major_inner: { "line-color": p.calle },
  highway_motorway_casing: { "line-color": p.linea },
  "highway-name-minor": { "text-color": p.hint },
  "highway-name-major": { "text-color": p.hint },
  "highway-name-path": { "text-color": p.hint },
  water_name_point_label: { "text-color": p.aguaTexto },
  water_name_line_label: { "text-color": p.aguaTexto },
  label_other: { "text-color": p.tintaSuave },
  label_village: { "text-color": p.tinta },
  label_town: { "text-color": p.tinta },
  label_city: { "text-color": p.tinta },
  label_city_capital: { "text-color": p.tinta },
})

const respuesta = await fetch(ORIGEN)
if (!respuesta.ok) throw new Error(`No se pudo bajar ${ORIGEN}: ${respuesta.status}`)
const estilo = await respuesta.json()

function pintar(base, paleta, nombre, archivo) {
  const estilo = structuredClone(base)
  let cambiadas = 0
  const colores = coloresDe(paleta)
  for (const capa of estilo.layers) {
    const cambios = colores[capa.id]
    if (!cambios) continue
    capa.paint = { ...capa.paint, ...cambios }
    cambiadas++
  }
  estilo.name = nombre
  writeFileSync(archivo, JSON.stringify(estilo))
  console.log(`${archivo}: ${estilo.layers.length} capas, ${cambiadas} recoloreadas`)
}

// Las fuentes de OpenFreeMap no traen atribución: va en el control del mapa
// (src/components/map/property-map.tsx).
mkdirSync("public/mapa", { recursive: true })
pintar(estilo, DIA, "Bolívar Inmo (positron de OpenFreeMap)", "public/mapa/estilo.json")
pintar(estilo, NOCHE, "Bolívar Inmo noche", "public/mapa/estilo-noche.json")
