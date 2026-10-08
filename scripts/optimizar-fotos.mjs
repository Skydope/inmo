#!/usr/bin/env node
// Pasa fotos a WebP con un ancho máximo, para que el celular no baje 1 MB por foto.
// Uso: node scripts/optimizar-fotos.mjs <ancho> <calidad> <foto>...
//   ej: node scripts/optimizar-fotos.mjs 1200 76 public/images/properties/*.jpg
//       node scripts/optimizar-fotos.mjs 1600 72 ~/Descargas/dron.jpg   (la del inicio)
// Deja el .webp al lado del original (mismo nombre). El original no se toca.
// sharp no es dependencia directa: viene con Next, se resuelve desde ahí.
import { createRequire } from "node:module"
import { statSync } from "node:fs"

const require = createRequire(createRequire(import.meta.url).resolve("next/package.json"))
const sharp = require("sharp")

const [ancho, calidad, ...fotos] = process.argv.slice(2)
if (!ancho || !calidad || fotos.length === 0) {
  console.error("Uso: node scripts/optimizar-fotos.mjs <ancho> <calidad> <foto>...")
  process.exit(1)
}

for (const foto of fotos) {
  const salida = foto.replace(/\.(jpe?g|png|webp)$/i, ".webp")
  if (salida === foto) {
    console.error(`salteada (ya es .webp o extensión rara): ${foto}`)
    continue
  }
  const info = await sharp(foto)
    .rotate()
    .resize({ width: Number(ancho), withoutEnlargement: true })
    .webp({ quality: Number(calidad) })
    .toFile(salida)
  const antes = Math.round(statSync(foto).size / 1024)
  const despues = Math.round(statSync(salida).size / 1024)
  console.log(`${foto} → ${salida}: ${info.width}×${info.height}, ${antes} KB → ${despues} KB`)
}
