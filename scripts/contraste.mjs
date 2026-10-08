#!/usr/bin/env node
// Contraste WCAG 2.x entre pares de colores de la paleta.
// Uso: node scripts/contraste.mjs            → mide los pares de la paleta
//      node scripts/contraste.mjs '#fff:#1e5b45' …  → mide los pares que se pasen
// La salida se pega en el comentario de cada token en src/app/globals.css.

const luminancia = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const contraste = (a, b) => {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (oscuro + 0.05)
}

const PALETA = {
  papel: "#f7f8f6",
  blanco: "#ffffff",
  tinta: "#17211c",
  "tinta-suave": "#56635c",
  linea: "#dfe4e0",
  "palmera-50": "#ecf4ef",
  "palmera-700": "#1e5b45",
  "palmera-800": "#174836",
  trigo: "#e3b04b",
  alerta: "#b4432f",
  "plano-50": "#eaf0f6",
  "plano-700": "#1f4e79",
  "plano-800": "#183d5f",
}

// [texto, fondo, mínimo] — 4,5 texto normal, 3 texto grande o bordes que importan.
const PARES = [
  ["tinta", "papel", 4.5],
  ["tinta", "blanco", 4.5],
  ["tinta-suave", "papel", 4.5],
  ["tinta-suave", "blanco", 4.5],
  ["blanco", "palmera-700", 4.5],
  ["blanco", "palmera-800", 4.5],
  ["palmera-700", "papel", 4.5],
  ["palmera-700", "blanco", 4.5],
  ["palmera-700", "palmera-50", 4.5],
  ["tinta", "palmera-50", 4.5],
  ["tinta", "trigo", 4.5],
  ["blanco", "alerta", 4.5],
  ["blanco", "tinta", 4.5],
  ["linea", "blanco", 1],
  ["blanco", "plano-700", 4.5],
  ["blanco", "plano-800", 4.5],
  ["plano-700", "papel", 4.5],
  ["plano-700", "plano-50", 4.5],
  ["tinta", "plano-50", 4.5],
]

const args = process.argv.slice(2)
if (args.length > 0) {
  for (const par of args) {
    const [a, b] = par.split(":")
    console.log(`${a} sobre ${b}: ${contraste(a, b).toFixed(2)}`)
  }
} else {
  let falla = false
  for (const [texto, fondo, minimo] of PARES) {
    const valor = contraste(PALETA[texto], PALETA[fondo])
    const ok = valor >= minimo
    if (!ok) falla = true
    console.log(`${ok ? "✓" : "✗"} ${texto} sobre ${fondo}: ${valor.toFixed(2)} (mínimo ${minimo})`)
  }
  process.exitCode = falla ? 1 : 0
}
