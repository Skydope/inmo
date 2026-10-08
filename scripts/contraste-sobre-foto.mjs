#!/usr/bin/env node
// Contraste del texto blanco sobre la foto de fondo del inicio, contra el píxel MÁS CLARO
// detrás de cada texto (el peor caso). Criterio de buscador-guiado § Paso 1: ≥ 4,5.
// Uso (con el dev server arriba): node scripts/contraste-sobre-foto.mjs [url]
import { createRequire } from "node:module"
import { chromium, devices } from "@playwright/test"

const require = createRequire(createRequire(import.meta.url).resolve("next/package.json"))
const sharp = require("sharp")
const url = process.argv[2] ?? "http://127.0.0.1:43123/"

const lum = (r, g, b) => {
  const c = [r, g, b].map((v) => v / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

// Solo el texto que apoya directo sobre la foto. "Ver todas en el mapa" va en una píldora
// blanca (tinta sobre blanco: 16,5), no se mide acá.
const SELECTORES = ["main h1", "main h1 + p"]
let falla = false
const navegador = await chromium.launch()
for (const vp of [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 800 }]) {
  const pagina = await (await navegador.newContext({ ...devices["Pixel 7"], viewport: vp })).newPage()
  await pagina.goto(url, { waitUntil: "networkidle" })
  // Se esconde el texto para medir la foto + velo que queda detrás.
  const cajas = await pagina.evaluate((sels) => sels.map((s) => {
    const el = document.querySelector(s); const r = el.getBoundingClientRect()
    return { s, x: Math.max(0, r.x), y: Math.max(0, r.y), w: r.width, h: r.height }
  }), SELECTORES)
  await pagina.addStyleTag({ content: "main h1, main h1 + p { visibility: hidden !important }" })
  const png = await pagina.screenshot({ scale: "css" })
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true })
  for (const c of cajas) {
    let max = 0
    for (let y = Math.floor(c.y); y < Math.min(info.height, c.y + c.h); y++) {
      for (let x = Math.floor(c.x); x < Math.min(info.width, c.x + c.w); x++) {
        const i = (y * info.width + x) * info.channels
        max = Math.max(max, lum(data[i], data[i + 1], data[i + 2]))
      }
    }
    const contraste = 1.05 / (max + 0.05)
    if (contraste < 4.5) falla = true
    console.log(`${contraste >= 4.5 ? "✓" : "✗"} ${vp.width}×${vp.height} ${c.s}: ${contraste.toFixed(2)}`)
  }
}
await navegador.close()
process.exitCode = falla ? 1 : 0
