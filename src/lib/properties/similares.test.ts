import { describe, expect, it } from "vitest"
import type { Property } from "./types"
import { similares } from "./similares"

function propiedad(p: Partial<Property> & Pick<Property, "id">): Property {
  return {
    operation: "venta",
    type: "casa",
    zone: "centro",
    title: p.id,
    description: "",
    price: 100_000,
    currency: "USD",
    address: "",
    showAddress: true,
    lat: 0,
    lng: 0,
    features: [],
    photos: [],
    publishedAt: "2026-09-30",
    agency: { id: "a", name: "A", logoUrl: "", address: "" },
    ...p,
  }
}

describe("similares", () => {
  const propia = propiedad({ id: "yo", price: 100_000 })
  const lista = [
    propia,
    propiedad({ id: "cara", zone: "centro", price: 200_000, type: "departamento" }),
    propiedad({ id: "cerca", zone: "centro", price: 110_000, type: "ph" }),
    propiedad({ id: "otra-zona", zone: "casariego", price: 100_000 }),
    propiedad({ id: "alquiler", operation: "alquiler", price: 100_000 }),
    propiedad({ id: "terreno", type: "terreno", price: 100_000 }),
    propiedad({ id: "pesos", zone: "centro", price: 100_000, currency: "ARS" }),
  ]

  it("excluye la propia, exige la misma operación y trata vivienda con vivienda", () => {
    expect(similares(propia, lista).map((p) => p.id)).toEqual(["cerca", "cara", "pesos", "otra-zona"])
  })

  it("respeta el máximo", () => {
    expect(similares(propia, lista, 2)).toHaveLength(2)
  })

  it("lo que no es vivienda solo se parece a su tipo", () => {
    const local = propiedad({ id: "local", type: "local" })
    const otras = [local, propiedad({ id: "otro", type: "local" }), propiedad({ id: "casa", type: "casa" })]
    expect(similares(local, otras).map((p) => p.id)).toEqual(["otro"])
  })
})
