import { describe, expect, it } from "vitest"
import { SEED_PROPERTIES } from "./seed"
import { aTarjeta } from "./tarjeta"
import type { Property } from "./types"

const base = SEED_PROPERTIES[0]
const con = (p: Partial<Property>): Property => ({ ...base, ...p })

describe("aTarjeta", () => {
  it("lleva solo lo que muestra la tarjeta (sin descripción)", () => {
    const t = aTarjeta(base)
    expect(t).not.toHaveProperty("description")
    expect(t.agencia).toEqual({ nombre: base.agency.name, logo: base.agency.logoUrl })
    expect(t.superficie).toBe("300 m²")
  })

  it("respeta la dirección oculta", () => {
    expect(aTarjeta(con({ showAddress: true })).direccion).toBe(base.address)
    expect(aTarjeta(con({ showAddress: false })).direccion).toBeNull()
  })

  it("recorta a 8 fotos", () => {
    const fotos = Array.from({ length: 12 }, (_, i) => `/f${i}.webp`)
    expect(aTarjeta(con({ photos: fotos })).fotos).toHaveLength(8)
  })

  it("los campos van en hectáreas", () => {
    const campo = SEED_PROPERTIES.find((p) => p.type === "campo")!
    expect(aTarjeta(campo).superficie).toMatch(/ha$/)
  })
})
