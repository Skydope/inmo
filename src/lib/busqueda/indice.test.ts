import { describe, expect, it } from "vitest"
import { SEED_PROPERTIES } from "@/lib/properties/seed"
import { contarPorOpcion } from "./contar"
import { filtrarPropiedades } from "./filtrar"
import { indiceDeBusqueda } from "./indice"
import { leerBusqueda } from "./parametros"

const BUSQUEDAS = [
  "",
  "operacion=venta",
  "operacion=venta&tipo=casa,quinta&zona=centro,quintas",
  "operacion=alquiler&dorm=2&con=mascotas",
  "operacion=venta&moneda=USD&desde=50000&hasta=150000",
  "operacion=venta&tipo=terreno&moneda=ARS&hasta=20000000",
  "operacion=temporario&con=pileta",
  "zona=urdampilleta,pirovano",
]

describe("indiceDeBusqueda", () => {
  const indice = indiceDeBusqueda(SEED_PROPERTIES)

  it("filtra igual que las propiedades completas", () => {
    for (const qs of BUSQUEDAS) {
      const b = leerBusqueda(new URLSearchParams(qs))
      expect(filtrarPropiedades(indice, b).map((p) => p.id)).toEqual(
        filtrarPropiedades(SEED_PROPERTIES, b).map((p) => p.id)
      )
    }
  })

  it("cuenta igual", () => {
    const b = leerBusqueda(new URLSearchParams("operacion=venta"))
    expect(contarPorOpcion(indice, b, "tipo")).toEqual(contarPorOpcion(SEED_PROPERTIES, b, "tipo"))
  })

  it("lleva solo los campos que filtran", () => {
    expect(Object.keys(indice[0]).sort()).toEqual(
      ["baths", "beds", "currency", "features", "id", "operation", "price", "publishedAt", "type", "zone"].sort()
    )
  })
})
