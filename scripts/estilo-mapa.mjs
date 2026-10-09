#!/usr/bin/env node
// Arma public/mapa/estilo.json: el estilo "positron" de OpenFreeMap (gratis, sin API key, uso
// comercial permitido) recoloreado con la paleta de Bolívar Inmo. Los tiles, las fuentes y los
// íconos siguen viniendo de OpenFreeMap; cuando haya PMTiles propio (hito 3), se cambian las
// `sources` acá y se vuelve a correr.
// Uso: node scripts/estilo-mapa.mjs
import { writeFileSync, mkdirSync } from "node:fs"

const ORIGEN = "https://tiles.openfreemap.org/styles/positron"

// La paleta C del sitio (inicio-v2, 2026-10-09): gris azulado casi blanco, tinta y agua
// lavada. Un solo estilo: no hay modo oscuro.
const DIA = {
  papel: "#f4f6f8",
  manzana: "#eaeef2",
  edificio: "#dfe5eb",
  parque: "#c9dccb",
  agua: "#b7d0e0",
  linea: "#dde3e9",
  calle: "#ffffff",
  calleMenor: "#f0f3f6",
  tintaSuave: "#5b6670",
  tinta: "#1a1a1a",
  aguaTexto: "#5b6670",
  hint: "#5b6670",
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
