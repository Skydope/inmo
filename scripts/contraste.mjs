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
  papel: "#efe8dc",
  blanco: "#f7f2ea",
  tinta: "#1a1a1a",
  "tinta-suave": "#6e675e",
  niebla: "#a8a297",
  linea: "#e4dcd0",
  trigo: "#c4a574",
  alerta: "#b4432f",
  noche: "#1a1a1a",
  "sobre-noche": "#f7f2ea",
  "plano-50": "#f3efe6",
  "plano-700": "#1a1a1a",
  "plano-800": "#3a3530",
}

// [texto, fondo, mínimo] — 4,5 texto normal, 3 texto grande o bordes que importan.
const PARES = [
  ["tinta", "papel", 4.5],
  ["tinta", "blanco", 4.5],
  ["tinta-suave", "papel", 4.5],
  ["tinta-suave", "blanco", 4.5],
  ["tinta", "trigo", 4.5],
  ["blanco", "alerta", 4.5],
  ["blanco", "tinta", 4.5],
  ["niebla", "tinta", 4.5],
  ["linea", "blanco", 1],
  ["blanco", "plano-700", 4.5],
  ["blanco", "plano-800", 4.5],
  ["plano-700", "papel", 4.5],
  ["plano-700", "blanco", 4.5],
  ["plano-700", "plano-50", 4.5],
  ["plano-800", "plano-50", 4.5],
  ["tinta", "plano-50", 4.5],
  ["sobre-noche", "noche", 4.5],
  ["niebla", "noche", 4.5],
]

// De noche los tokens de superficie se invierten. `noche` y `niebla` no.
const NOCHE = {
  papel: "#1a1a1a",
  blanco: "#262626",
  tinta: "#f3efe6",
  "tinta-suave": "#a8a297",
  "plano-700": "#c4a574",
  noche: "#1a1a1a",
  "sobre-noche": "#f7f2ea",
  niebla: "#a8a297",
}
const PARES_NOCHE = [
  ["tinta", "papel", 4.5],
  ["tinta-suave", "papel", 4.5],
  ["tinta-suave", "blanco", 4.5],
  ["blanco", "plano-700", 4.5],
  ["sobre-noche", "noche", 4.5],
  ["niebla", "noche", 4.5],
]

const args = process.argv.slice(2)
if (args.length > 0) {
  for (const par of args) {
    const [a, b] = par.split(":")
    console.log(`${a} sobre ${b}: ${contraste(a, b).toFixed(2)}`)
  }
} else {
  let falla = false
  const medir = (nombre, paleta, pares) => {
    for (const [texto, fondo, minimo] of pares) {
      const valor = contraste(paleta[texto], paleta[fondo])
      const ok = valor >= minimo
      if (!ok) falla = true
      console.log(`${ok ? "✓" : "✗"} ${nombre} ${texto} sobre ${fondo}: ${valor.toFixed(2)} (mínimo ${minimo})`)
    }
  }
  medir("día", PALETA, PARES)
  medir("noche", NOCHE, PARES_NOCHE)
  process.exitCode = falla ? 1 : 0
}
