import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { OPERACIONES, TIPOS, caracteristicasDe, tiposDe } from "@/lib/busqueda/taxonomia"
import { SEED_PROPERTIES } from "./seed"

describe("datos de prueba", () => {
  it("cubren los diez tipos y las tres operaciones", () => {
    expect(new Set(SEED_PROPERTIES.map((p) => p.type))).toEqual(new Set(TIPOS.map((t) => t.slug)))
    expect(new Set(SEED_PROPERTIES.map((p) => p.operation))).toEqual(new Set(OPERACIONES.map((o) => o.slug)))
  })

  it("tienen ids únicos", () => {
    expect(new Set(SEED_PROPERTIES.map((p) => p.id)).size).toBe(SEED_PROPERTIES.length)
  })

  it("cada propiedad usa un tipo y características que aplican a su operación", () => {
    for (const p of SEED_PROPERTIES) {
      expect(tiposDe(p.operation)).toContain(p.type)
      for (const c of p.features) expect(caracteristicasDe(p.operation)).toContain(c)
    }
  })

  it("las coordenadas caen dentro del partido de Bolívar", () => {
    for (const p of SEED_PROPERTIES) {
      expect(p.lat).toBeGreaterThan(-36.7)
      expect(p.lat).toBeLessThan(-35.9)
      expect(p.lng).toBeGreaterThan(-61.8)
      expect(p.lng).toBeLessThan(-60.7)
    }
  })

  it("las fotos existen en public/", () => {
    for (const p of SEED_PROPERTIES) {
      for (const foto of p.photos) expect(existsSync(join(process.cwd(), "public", foto))).toBe(true)
    }
  })

  it("traen los casos borde a propósito", () => {
    expect(SEED_PROPERTIES.some((p) => p.price === null)).toBe(true)
    expect(SEED_PROPERTIES.some((p) => p.operation === "venta" && p.currency === "ARS")).toBe(true)
    expect(SEED_PROPERTIES.some((p) => !p.showAddress)).toBe(true)
    expect(SEED_PROPERTIES.some((p) => p.photos.length === 0)).toBe(true)
    expect(SEED_PROPERTIES.some((p) => p.ageYears === 0)).toBe(true)
  })
})
