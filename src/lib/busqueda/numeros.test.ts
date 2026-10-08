import { describe, expect, it } from "vitest"
import { escribirMonto, leerMonto } from "./numeros"

describe("leerMonto", () => {
  it("acepta dígitos solos o con punto de miles bien puesto", () => {
    expect(leerMonto("45000")).toBe(45000)
    expect(leerMonto("45.000")).toBe(45000)
    expect(leerMonto("1.250.000")).toBe(1250000)
    expect(leerMonto(" 120.000 ")).toBe(120000)
    expect(leerMonto("0")).toBe(0)
  })

  it("rechaza lo que no es un monto entero", () => {
    for (const malo of ["", "abc", "-5", "1e9", "4.5", "45,000", "45.00", "12.3456", "999999999999999999999"]) {
      expect(leerMonto(malo)).toBeUndefined()
    }
  })
})

describe("escribirMonto", () => {
  it("pone el punto de miles", () => {
    expect(escribirMonto(45000)).toBe("45.000")
    expect(escribirMonto(1250000)).toBe("1.250.000")
    expect(escribirMonto(undefined)).toBe("")
  })
})
