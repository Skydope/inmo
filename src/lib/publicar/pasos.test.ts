import { describe, expect, it } from "vitest"
import {
  camposDeMedida,
  caracteristicasCompatibles,
  esPasoDeAviso,
  llevaExpensas,
  mover,
  tipoCompatible,
  tituloSugerido,
} from "./pasos"

describe("pasos del aviso", () => {
  it("un slug desconocido no es un paso", () => {
    expect(esPasoDeAviso("operacion")).toBe(true)
    expect(esPasoDeAviso("listo")).toBe(false)
    expect(esPasoDeAviso("video")).toBe(false)
  })

  it("las medidas dependen del tipo", () => {
    expect(camposDeMedida(null)).toContain("dormitorios")
    expect(camposDeMedida("casa")).toEqual(camposDeMedida(null))
    expect(camposDeMedida("terreno")).toEqual(["m2total"])
    expect(camposDeMedida("campo")).toEqual(["hectareas"])
    expect(camposDeMedida("cochera")).toEqual(["m2total"])
    expect(camposDeMedida("local")).toEqual(["m2total", "m2cubiertos", "banos", "cocheras"])
  })

  it("las expensas son de departamento y PH", () => {
    expect(llevaExpensas("departamento")).toBe(true)
    expect(llevaExpensas("ph")).toBe(true)
    expect(llevaExpensas("casa")).toBe(false)
    expect(llevaExpensas(null)).toBe(false)
  })

  it("al cambiar la operación se suelta lo que no aplica", () => {
    expect(tipoCompatible("venta", "terreno")).toBe("terreno")
    expect(tipoCompatible("temporario", "terreno")).toBeNull()
    expect(caracteristicasCompatibles("alquiler", ["mascotas", "apto-credito"])).toEqual(["mascotas"])
  })

  it("sugiere el título cuando hay tipo, zona y dormitorios", () => {
    expect(tituloSugerido({ tipo: "casa", zona: "centro", dormitorios: 3 })).toBe(
      "Casa de 3 dormitorios en Centro",
    )
    expect(tituloSugerido({ tipo: "casa", zona: "centro", dormitorios: 1 })).toBe(
      "Casa de 1 dormitorio en Centro",
    )
    expect(tituloSugerido({ tipo: "terreno", zona: "centro", dormitorios: 0 })).toBeNull()
    expect(tituloSugerido({ tipo: null, zona: "centro", dormitorios: 3 })).toBeNull()
  })

  it("subir y bajar cambian el orden y no se salen de la lista", () => {
    expect(mover(["a", "b", "c"], 0, 1)).toEqual(["b", "a", "c"])
    expect(mover(["a", "b", "c"], 0, -1)).toEqual(["a", "b", "c"])
    expect(mover(["a", "b"], 1, 1)).toEqual(["a", "b"])
  })
})
