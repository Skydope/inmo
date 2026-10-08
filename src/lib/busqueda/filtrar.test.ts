import { describe, expect, it } from "vitest"
import { contarPorOpcion } from "./contar"
import { filtrarPropiedades, ordenarPropiedades, type Filtrable } from "./filtrar"
import { BUSQUEDA_VACIA, type Busqueda } from "./parametros"
import { TIPOS, ZONAS } from "./taxonomia"

let n = 0
const prop = (p: Partial<Filtrable> = {}): Filtrable => ({
  id: `p-${String(++n).padStart(2, "0")}`,
  operation: "venta",
  type: "casa",
  zone: "centro",
  beds: 3,
  baths: 2,
  price: 100_000,
  currency: "USD",
  features: [],
  publishedAt: "2026-09-01",
  ...p,
})

const buscar = (b: Partial<Busqueda>): Busqueda => ({ ...BUSQUEDA_VACIA, ...b })
const ids = (lista: Filtrable[]) => lista.map((p) => p.id)

describe("filtrarPropiedades", () => {
  const casaCentro = prop({ id: "casa-centro" })
  const quintaQuintas = prop({ id: "quinta", type: "quinta", zone: "quintas", features: ["pileta", "parrilla"] })
  const deptoAlquiler = prop({ id: "depto", operation: "alquiler", type: "departamento", price: 450_000, currency: "ARS", beds: 1, baths: 1 })
  const terreno = prop({ id: "terreno", type: "terreno", zone: "casariego", beds: undefined, baths: undefined, price: 30_000 })
  const consultar = prop({ id: "consultar", price: null })
  const enPesos = prop({ id: "en-pesos", price: 90_000_000, currency: "ARS" })
  const todas = [casaCentro, quintaQuintas, deptoAlquiler, terreno, consultar, enPesos]

  it("sin filtros devuelve todas", () => {
    expect(filtrarPropiedades(todas, BUSQUEDA_VACIA)).toHaveLength(todas.length)
  })

  it("filtra por operación", () => {
    expect(ids(filtrarPropiedades(todas, buscar({ operacion: "alquiler" })))).toEqual(["depto"])
  })

  it("tipo y zona son O dentro de cada uno e Y entre sí", () => {
    expect(ids(filtrarPropiedades(todas, buscar({ tipos: ["casa", "quinta"] })))).toEqual(["casa-centro", "quinta", "consultar", "en-pesos"])
    expect(ids(filtrarPropiedades(todas, buscar({ tipos: ["casa", "quinta"], zonas: ["quintas"] })))).toEqual(["quinta"])
    expect(ids(filtrarPropiedades(todas, buscar({ zonas: ["centro", "casariego"], tipos: ["terreno"] })))).toEqual(["terreno"])
  })

  it("las características son Y: tiene que tener todas", () => {
    expect(ids(filtrarPropiedades(todas, buscar({ con: ["pileta"] })))).toEqual(["quinta"])
    expect(ids(filtrarPropiedades(todas, buscar({ con: ["pileta", "cochera"] })))).toEqual([])
  })

  it("dormitorios y baños son 'al menos'; sin el dato queda afuera solo si el filtro está activo", () => {
    expect(ids(filtrarPropiedades(todas, buscar({ dorm: 2 })))).not.toContain("depto")
    expect(ids(filtrarPropiedades(todas, buscar({ dorm: 2 })))).not.toContain("terreno")
    expect(ids(filtrarPropiedades(todas, buscar({ banos: 2 })))).toContain("casa-centro")
    expect(ids(filtrarPropiedades(todas, BUSQUEDA_VACIA))).toContain("terreno")
  })

  it("el precio filtra solo en la moneda del filtro y deja afuera 'Consultar precio'", () => {
    const enDolares = ids(filtrarPropiedades(todas, buscar({ moneda: "USD", hasta: 100_000 })))
    expect(enDolares).toEqual(["casa-centro", "quinta", "terreno"])
    expect(enDolares).not.toContain("consultar")
    expect(enDolares).not.toContain("en-pesos")
    expect(ids(filtrarPropiedades(todas, buscar({ moneda: "USD", desde: 50_000 })))).toEqual(["casa-centro", "quinta"])
    expect(ids(filtrarPropiedades(todas, buscar({ moneda: "ARS", desde: 1 })))).toEqual(["depto", "en-pesos"])
  })

  it("el caso de la spec: casas o quintas en venta en Centro, 2+ dorm, hasta US$ 150.000, con pileta", () => {
    const buena = prop({ id: "buena", type: "quinta", zone: "centro", beds: 2, price: 140_000, features: ["pileta"] })
    const cara = prop({ id: "cara", type: "quinta", zone: "centro", beds: 2, price: 160_000, features: ["pileta"] })
    const sinPileta = prop({ id: "sin-pileta", zone: "centro", beds: 3, price: 120_000 })
    const otraZona = prop({ id: "otra-zona", zone: "casariego", beds: 3, price: 120_000, features: ["pileta"] })
    const b = buscar({ operacion: "venta", tipos: ["casa", "quinta"], zonas: ["centro"], dorm: 2, moneda: "USD", hasta: 150_000, con: ["pileta"] })
    expect(ids(filtrarPropiedades([buena, cara, sinPileta, otraZona], b))).toEqual(["buena"])
  })
})

describe("ordenarPropiedades", () => {
  it("recientes: la más nueva primero, empate por id", () => {
    const a = prop({ id: "a", publishedAt: "2026-09-01" })
    const b = prop({ id: "b", publishedAt: "2026-10-01" })
    const c = prop({ id: "c", publishedAt: "2026-09-01" })
    expect(ids(ordenarPropiedades([a, b, c], "recientes", "venta"))).toEqual(["b", "a", "c"])
  })

  it("por precio: primero la moneda de la operación, después la otra, y sin precio al final", () => {
    const usdCaro = prop({ id: "usd-caro", price: 200_000 })
    const usdBarato = prop({ id: "usd-barato", price: 50_000 })
    const ars = prop({ id: "ars", price: 10_000_000, currency: "ARS" })
    const sinPrecio = prop({ id: "sin-precio", price: null })
    const lista = [sinPrecio, ars, usdCaro, usdBarato]
    expect(ids(ordenarPropiedades(lista, "precio-asc", "venta"))).toEqual(["usd-barato", "usd-caro", "ars", "sin-precio"])
    expect(ids(ordenarPropiedades(lista, "precio-desc", "venta"))).toEqual(["usd-caro", "usd-barato", "ars", "sin-precio"])
    expect(ids(ordenarPropiedades(lista, "precio-asc", "alquiler"))[0]).toBe("ars")
  })

  it("no modifica la lista que recibe", () => {
    const lista = [prop({ id: "x", publishedAt: "2026-01-01" }), prop({ id: "y", publishedAt: "2026-02-01" })]
    ordenarPropiedades(lista, "recientes", undefined)
    expect(ids(lista)).toEqual(["x", "y"])
  })
})

describe("contarPorOpcion", () => {
  const lista = [
    prop({ type: "casa", zone: "centro" }),
    prop({ type: "casa", zone: "casariego" }),
    prop({ type: "quinta", zone: "quintas" }),
    prop({ type: "departamento", zone: "centro", operation: "alquiler" }),
    prop({ type: "terreno", zone: "centro" }),
  ]

  it("para cada tipo, cuántas habría eligiendo solo ese (igual que filtrar uno por uno)", () => {
    const b = buscar({ operacion: "venta", zonas: ["centro"] })
    const conteo = contarPorOpcion(lista, b, "tipo")
    for (const tipo of TIPOS.map((t) => t.slug)) {
      expect(conteo[tipo] ?? 0).toBe(filtrarPropiedades(lista, { ...b, tipos: [tipo] }).length)
    }
    expect(conteo.casa).toBe(1)
    expect(conteo.terreno).toBe(1)
  })

  it("un tipo que no aplica a la operación cuenta 0", () => {
    expect(contarPorOpcion(lista, buscar({ operacion: "alquiler" }), "tipo").terreno).toBe(0)
  })

  it("cuenta por zona y por operación", () => {
    const porZona = contarPorOpcion(lista, buscar({ operacion: "venta", tipos: ["casa"] }), "zona")
    expect(porZona.centro).toBe(1)
    expect(porZona.casariego).toBe(1)
    expect(porZona.quintas).toBe(0)
    expect(Object.keys(porZona)).toHaveLength(ZONAS.length)
    expect(contarPorOpcion(lista, BUSQUEDA_VACIA, "operacion")).toEqual({ venta: 4, alquiler: 1, temporario: 0 })
  })
})
