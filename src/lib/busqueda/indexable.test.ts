import { describe, expect, it } from "vitest"
import { esIndexable } from "./indexable"
import { BUSQUEDA_VACIA, type Busqueda } from "./parametros"

const b = (x: Partial<Busqueda>): Busqueda => ({ ...BUSQUEDA_VACIA, ...x })

describe("esIndexable", () => {
  it("las búsquedas simples se indexan", () => {
    expect(esIndexable(BUSQUEDA_VACIA)).toBe(true)
    expect(esIndexable(b({ operacion: "venta" }))).toBe(true)
    expect(esIndexable(b({ operacion: "venta", tipos: ["casa"], zonas: ["centro"] }))).toBe(true)
  })

  it("las combinaciones raras no (páginas casi vacías y repetidas)", () => {
    expect(esIndexable(b({ operacion: "venta", tipos: ["casa", "quinta"] }))).toBe(false)
    expect(esIndexable(b({ zonas: ["centro", "casariego"] }))).toBe(false)
    expect(esIndexable(b({ operacion: "venta", dorm: 2 }))).toBe(false)
    expect(esIndexable(b({ operacion: "venta", moneda: "USD", hasta: 100000 }))).toBe(false)
    expect(esIndexable(b({ operacion: "venta", con: ["pileta"] }))).toBe(false)
    expect(esIndexable(b({ operacion: "venta", orden: "precio-asc" }))).toBe(false)
  })
})
