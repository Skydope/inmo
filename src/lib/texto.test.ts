import { describe, expect, it } from "vitest"
import { cortarDescripcion, parrafos } from "@/lib/texto"

describe("cortarDescripcion", () => {
  it("un texto corto no tiene resto", () => {
    expect(cortarDescripcion("Casa con patio.")).toEqual({ inicio: "Casa con patio.", resto: null })
  })

  it("corta en el final de la oración que cabe en el límite", () => {
    const texto = `${"Palabra ".repeat(36)}Cierra acá. Y esto queda para leer después.`
    const { inicio, resto } = cortarDescripcion(texto, 300)
    expect(inicio.endsWith("Cierra acá.")).toBe(true)
    expect(resto).toBe("Y esto queda para leer después.")
  })
})

describe("parrafos", () => {
  it("parte por cualquier salto de línea y tira los vacíos", () => {
    expect(parrafos("Uno.\n\nDos.\nTres.")).toEqual(["Uno.", "Dos.", "Tres."])
  })
})
