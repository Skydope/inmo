#!/usr/bin/env node
// Contraste de VIVÍ BOLÍVAR contra el cielo de la foto del inicio, de día (título en tinta) y
// de noche (título blanco). Mide la foto detrás de las letras, sin el título, y solo por encima
// del techo (lo de abajo lo tapa la casa). Toma el percentil 1 del peor lado (el píxel más
// oscuro de día, el más claro de noche) para no depender de un píxel suelto. Es texto grande:
// el mínimo es 3:1 (spec vivi-bolivar).
// Uso (con el dev server arriba): node scripts/contraste-sobre-foto.mjs [url]
import { createRequire } from "node:module"
import { chromium } from "@playwright/test"

const require = createRequire(createRequire(import.meta.url).resolve("next/package.json"))
const sharp = require("sharp")
const url = process.argv[2] ?? "http://localhost:43123/"

const lum = (r, g, b) => {
  const c = [r, g, b].map((v) => v / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const TINTA = lum(0x17, 0x21, 0x1c)
const BLANCO = 1

// El contorno del primer plano, como en src/lib/casa.ts.
const PRIMER_PLANO = [[0,710],[489,710],[489,613],[670,604],[670,536],[598,527],[598,513],[1358,436],[1456,496],[1456,510],[1435,513],[1435,540],[1500,535],[1500,526],[1552,526],[1627,569],[1627,710],[1672,710],[1672,941],[0,941]]
const techoEn = (x) => {
  let techo = 941
  PRIMER_PLANO.forEach(([x1, y1], i) => {
    const [x2, y2] = PRIMER_PLANO[(i + 1) % PRIMER_PLANO.length]
    if (x1 === x2 || x < Math.min(x1, x2) || x > Math.max(x1, x2)) return
    techo = Math.min(techo, y1 + ((x - x1) / (x2 - x1)) * (y2 - y1))
  })
  return techo
}

let falla = false
const navegador = await chromium.launch()
for (const esquema of ["light", "dark"]) {
  for (const vp of [{ width: 360, height: 640 }, { width: 390, height: 844 }, { width: 1280, height: 800 }, { width: 1920, height: 1080 }]) {
    const pagina = await navegador.newPage({ viewport: vp, colorScheme: esquema, deviceScaleFactor: 1 })
    await pagina.goto(url, { waitUntil: "networkidle" })
    await pagina.evaluate(() => Promise.all([...document.querySelectorAll(".casa-foto img")].map((i) => i.decode().catch(() => {}))))
    const { titulo, foto } = await pagina.evaluate(() => ({
      titulo: [...document.querySelectorAll(".vivi-titulo > span")].map((s) => s.getBoundingClientRect().toJSON()),
      foto: document.querySelector(".casa-foto").getBoundingClientRect().toJSON(),
    }))
    await pagina.addStyleTag({ content: ".vivi-titulo { visibility: hidden !important }" })
    const png = await pagina.screenshot()
    const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true })
    const s = foto.height / 941
    const fondos = []
    for (const c of titulo) {
      for (let y = Math.max(0, Math.floor(c.y)); y < Math.min(info.height, c.y + c.height); y++) {
        for (let x = Math.max(0, Math.floor(c.x)); x < Math.min(info.width, c.x + c.width); x++) {
          // Solo el cielo: lo que queda 3 px o más por encima del techo.
          if (y > foto.y + techoEn((x - foto.x) / s) * s - 3) continue
          const i = (y * info.width + x) * info.channels
          fondos.push(lum(data[i], data[i + 1], data[i + 2]))
        }
      }
    }
    fondos.sort((a, b) => a - b)
    const deDia = esquema === "light"
    const peor = deDia ? fondos[Math.floor(fondos.length * 0.01)] : fondos[Math.ceil(fondos.length * 0.99) - 1]
    const contraste = deDia ? (peor + 0.05) / (TINTA + 0.05) : (BLANCO + 0.05) / (peor + 0.05)
    if (contraste < 3) falla = true
    console.log(`${contraste >= 3 ? "✓" : "✗"} ${deDia ? "día  " : "noche"} ${vp.width}×${vp.height}: ${contraste.toFixed(2)}`)
    await pagina.close()
  }
}
await navegador.close()
process.exitCode = falla ? 1 : 0
