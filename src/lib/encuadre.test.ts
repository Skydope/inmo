import { describe, expect, it } from "vitest"
import { BOLIVAR_CENTER } from "@/lib/brand"
import { encuadreInicial } from "@/lib/encuadre"

const enCiudad = (id: string, d = 0.01) => ({ id, lat: BOLIVAR_CENTER.lat + d, lng: BOLIVAR_CENTER.lng - d })
const lejos = (id: string) => ({ id, lat: -36.43, lng: -61.42 }) // Urdampilleta, a ~30 km

describe("encuadreInicial", () => {
  it("si la mayoría está en la ciudad, encuadra la ciudad y cuenta las de afuera", () => {
    const puntos = [enCiudad("a"), enCiudad("b", -0.01), enCiudad("c", 0.02), lejos("x")]
    expect(encuadreInicial(puntos)).toEqual({ ids: ["a", "b", "c"], afuera: 1 })
  })

  it("si todas están en la ciudad, encuadra todas", () => {
    expect(encuadreInicial([enCiudad("a"), enCiudad("b")])).toEqual({ ids: ["a", "b"], afuera: 0 })
  })

  it("si la mayoría está afuera, encuadra todas (no hay ciudad que mostrar)", () => {
    const puntos = [enCiudad("a"), lejos("x"), lejos("y")]
    expect(encuadreInicial(puntos)).toEqual({ ids: ["a", "x", "y"], afuera: 0 })
  })

  it("sin puntos no encuadra nada", () => {
    expect(encuadreInicial([])).toEqual({ ids: [], afuera: 0 })
  })
})
