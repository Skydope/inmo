import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

// Regla de ARQUITECTURA.md § Invariantes: src/lib es puro. Si algo de acá importa Next,
// React o usa el DOM, se rompe acá y no en un componente.
const CARPETA = __dirname
const PROHIBIDO = [/from\s+["']next/, /from\s+["']react/, /\bwindow\./, /\bdocument\./]

describe("frontera de src/lib/busqueda", () => {
  const archivos = readdirSync(CARPETA).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))

  it("hay módulos para revisar", () => {
    expect(archivos.length).toBeGreaterThan(5)
  })

  it.each(archivos)("%s no importa Next ni React ni usa el DOM", (archivo) => {
    const codigo = readFileSync(join(CARPETA, archivo), "utf8")
    for (const patron of PROHIBIDO) expect(codigo).not.toMatch(patron)
  })
})
