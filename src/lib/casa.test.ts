import { describe, expect, it } from "vitest"
import { FOTO_DE_LA_CASA, PRIMER_PLANO, poligonoEnPorcentaje, techoEn } from "./casa"

describe("la foto de la casa", () => {
  it("mide 1672 × 941 (día y noche tienen el mismo encuadre)", () => {
    expect(FOTO_DE_LA_CASA).toEqual({ ancho: 1672, alto: 941 })
  })

  it("el primer plano cierra por abajo, a lo ancho de toda la foto", () => {
    expect(PRIMER_PLANO.at(-2)).toEqual([1672, 941])
    expect(PRIMER_PLANO.at(-1)).toEqual([0, 941])
  })
})

describe("poligonoEnPorcentaje", () => {
  it("pasa el contorno a % de la foto, con dos decimales", () => {
    const p = poligonoEnPorcentaje()
    expect(p.startsWith("0% 75.45%, 29.25% 75.45%, 29.25% 65.14%")).toBe(true)
    expect(p.endsWith("100% 100%, 0% 100%")).toBe(true)
    expect(p.split(", ")).toHaveLength(PRIMER_PLANO.length)
  })
})

describe("techoEn", () => {
  it("es el borde de arriba del primer plano en esa columna de la foto", () => {
    expect(techoEn(300)).toBe(710) // el pasto, a la izquierda de la casa
    expect(techoEn(836)).toBeCloseTo(488.9, 1) // el centro de la foto: la losa de arriba
    expect(techoEn(1330)).toBeCloseTo(438.8, 1) // cerca de la punta del techo
  })

  it("en el alero toma lo más alto (el techo, no la pared de abajo)", () => {
    expect(techoEn(640)).toBeLessThan(527)
  })

  it("la losa sube hacia la derecha con pendiente constante", () => {
    const pendiente = (techoEn(700) - techoEn(1200)) / 500
    expect(pendiente).toBeCloseTo(77 / 760, 4)
  })
})
