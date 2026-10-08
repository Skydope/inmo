import { describe, expect, it } from "vitest"
import { SEED_PROPERTIES } from "@/lib/properties/seed"
import { SEED_AGENCIES } from "./seed"
import { resumenDeInmobiliarias } from "./resumen"

const agencias = Object.values(SEED_AGENCIES)

describe("resumenDeInmobiliarias", () => {
  it("cuenta las propiedades de cada una como filtrarlas a mano", () => {
    const resumen = resumenDeInmobiliarias(SEED_PROPERTIES, agencias)
    for (const r of resumen) {
      const suyas = SEED_PROPERTIES.filter((p) => p.agency.id === r.id)
      expect(r.total).toBe(suyas.length)
      expect(r.venta).toBe(suyas.filter((p) => p.operation === "venta").length)
      expect(r.alquiler).toBe(suyas.filter((p) => p.operation !== "venta").length)
    }
  })

  it("respeta el orden de entrada e incluye las que no tienen propiedades", () => {
    const sinNada = { ...agencias[0], id: "sin-nada", name: "Sin Nada" }
    const resumen = resumenDeInmobiliarias(SEED_PROPERTIES, [...agencias, sinNada])
    expect(resumen.map((r) => r.id)).toEqual([...agencias.map((a) => a.id), "sin-nada"])
    expect(resumen.at(-1)).toMatchObject({ nombre: "Sin Nada", total: 0, venta: 0, alquiler: 0 })
  })

  it("lleva nombre, logo y dirección", () => {
    const [r] = resumenDeInmobiliarias(SEED_PROPERTIES, agencias)
    expect(r).toMatchObject({ nombre: agencias[0].name, logo: agencias[0].logoUrl, direccion: agencias[0].address })
  })
})
