#!/usr/bin/env node
// Arma public/mapa/estilo.json: el estilo "positron" de OpenFreeMap (gratis, sin API key, uso
// comercial permitido) recoloreado con la paleta de Bolívar Inmo. Los tiles, las fuentes y los
// íconos siguen viniendo de OpenFreeMap; cuando haya PMTiles propio (hito 3), se cambian las
// `sources` acá y se vuelve a correr.
// Uso: node scripts/estilo-mapa.mjs
import { writeFileSync, mkdirSync } from "node:fs"

const ORIGEN = "https://tiles.openfreemap.org/styles/positron"

// La paleta (src/app/globals.css). El mapa es gris claro: lo único con color son los pines.
const P = {
  papel: "#f7f8f6",
  manzana: "#eff1ee",
  edificio: "#e6e9e5",
  parque: "#e3ebe2",
  agua: "#d4dee7",
  linea: "#dfe4e0",
  calle: "#ffffff",
  calleMenor: "#e9ece9",
  tintaSuave: "#56635c",
  tinta: "#17211c",
  aguaTexto: "#4c6a86",
}

const COLORES = {
  background: { "background-color": P.papel },
  park: { "fill-color": P.parque },
  water: { "fill-color": P.agua },
  landuse_residential: { "fill-color": P.manzana },
  landcover_wood: { "fill-color": P.parque },
  building: { "fill-color": P.edificio },
  waterway: { "line-color": P.agua },
  highway_minor: { "line-color": P.calleMenor },
  highway_major_casing: { "line-color": P.linea },
  highway_major_inner: { "line-color": P.calle },
  highway_motorway_casing: { "line-color": P.linea },
  "highway-name-minor": { "text-color": P.tintaSuave },
  "highway-name-major": { "text-color": P.tintaSuave },
  "highway-name-path": { "text-color": P.tintaSuave },
  water_name_point_label: { "text-color": P.aguaTexto },
  water_name_line_label: { "text-color": P.aguaTexto },
  label_other: { "text-color": P.tintaSuave },
  label_village: { "text-color": P.tinta },
  label_town: { "text-color": P.tinta },
  label_city: { "text-color": P.tinta },
  label_city_capital: { "text-color": P.tinta },
}

const respuesta = await fetch(ORIGEN)
if (!respuesta.ok) throw new Error(`No se pudo bajar ${ORIGEN}: ${respuesta.status}`)
const estilo = await respuesta.json()

let cambiadas = 0
for (const capa of estilo.layers) {
  const cambios = COLORES[capa.id]
  if (!cambios) continue
  capa.paint = { ...capa.paint, ...cambios }
  cambiadas++
}

estilo.name = "Bolívar Inmo (positron de OpenFreeMap)"
// Las fuentes de OpenFreeMap no traen atribución: va en el control del mapa
// (src/components/map/property-map.tsx).
mkdirSync("public/mapa", { recursive: true })
writeFileSync("public/mapa/estilo.json", JSON.stringify(estilo))
console.log(`public/mapa/estilo.json: ${estilo.layers.length} capas, ${cambiadas} recoloreadas`)
