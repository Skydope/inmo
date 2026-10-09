import { describe, expect, it } from "vitest"
import { sugerenciasSinResultados } from "./contar"
import type { Filtrable } from "./filtrar"
import { BUSQUEDA_VACIA, escribirBusqueda, type Busqueda } from "./parametros"
import { pasoAccesible, pasoAnterior, pasoSiguiente, rutaDePaso } from "./pasos"
import { indicadorMasCercano, limitesDePrecio, rangosDePrecio, redondearLindo } from "./precios"
import { chipsDeBusqueda, filtrosActivos, tituloDeBusqueda } from "./resumen"

const buscar = (b: Partial<Busqueda>): Busqueda => ({ ...BUSQUEDA_VACIA, ...b })

let n = 0
const prop = (p: Partial<Filtrable> = {}): Filtrable => ({
  id: `r-${++n}`,
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

describe("tituloDeBusqueda", () => {
  it("un tipo, una operación, una zona", () => {
    expect(tituloDeBusqueda(buscar({ operacion: "venta", tipos: ["casa"], zonas: ["centro"] }))).toBe("Casas en venta en Centro")
  })
  it("dos tipos van con 'y'; las siglas no se pasan a minúscula", () => {
    expect(tituloDeBusqueda(buscar({ operacion: "venta", tipos: ["casa", "quinta"] }))).toBe("Casas y casas quinta en venta en Bolívar")
    expect(tituloDeBusqueda(buscar({ operacion: "alquiler", tipos: ["departamento", "ph"] }))).toBe("Departamentos y PH en alquiler en Bolívar")
  })
  it("tres tipos o ninguno: 'Propiedades'", () => {
    expect(tituloDeBusqueda(buscar({ tipos: ["casa", "ph", "quinta"] }))).toBe("Propiedades en Bolívar")
    expect(tituloDeBusqueda(BUSQUEDA_VACIA)).toBe("Propiedades en Bolívar")
  })
  it("varias zonas y temporario", () => {
    expect(tituloDeBusqueda(buscar({ operacion: "alquiler", zonas: ["centro", "casariego", "colombo"] }))).toBe("Propiedades en alquiler en 3 zonas")
    expect(tituloDeBusqueda(buscar({ operacion: "temporario", tipos: ["quinta"] }))).toBe("Casas quinta en alquiler temporario en Bolívar")
  })
})

describe("chipsDeBusqueda y filtrosActivos", () => {
  const b = buscar({ operacion: "venta", tipos: ["casa"], zonas: ["centro"], dorm: 2, moneda: "USD", hasta: 150_000, con: ["pileta"] })

  it("un chip por cosa que se puede sacar, con la búsqueda sin ella", () => {
    const chips = chipsDeBusqueda(b)
    expect(chips.map((c) => c.etiqueta)).toEqual(["Casa", "Centro", "2+ dorm.", "Hasta US$ 150.000", "Pileta"])
    const sinPrecio = chips.find((c) => c.clave === "precio")!.sin
    expect(escribirBusqueda(sinPrecio)).toBe("operacion=venta&tipo=casa&zona=centro&dorm=2&con=pileta")
  })

  it("el rango de precio se escribe entero", () => {
    expect(chipsDeBusqueda(buscar({ moneda: "ARS", desde: 300_000, hasta: 500_000 }))[0].etiqueta).toBe("$ 300.000 a $ 500.000")
    expect(chipsDeBusqueda(buscar({ moneda: "USD", desde: 50_000 }))[0].etiqueta).toBe("Desde US$ 50.000")
  })

  it("la operación no cuenta como filtro", () => {
    expect(filtrosActivos(b)).toBe(5)
    expect(filtrosActivos(buscar({ operacion: "venta" }))).toBe(0)
  })
})

describe("sugerenciasSinResultados", () => {
  it("dice qué filtro sacar y cuántas aparecen, de más a menos, sin los que dan 0", () => {
    const props = [
      prop({ zone: "centro", features: [] }),
      prop({ zone: "casariego", features: ["pileta"] }),
      prop({ zone: "casariego", features: [] }),
    ]
    const b = buscar({ operacion: "venta", zonas: ["centro"], con: ["pileta"], tipos: ["ph"] })
    const sugerencias = sugerenciasSinResultados(props, b)
    expect(sugerencias.every((s) => s.conteo > 0)).toBe(true)
    expect(sugerencias.map((s) => s.etiqueta)).toEqual([])
    const b2 = buscar({ operacion: "venta", zonas: ["centro"], con: ["pileta"] })
    expect(sugerenciasSinResultados(props, b2).map((s) => [s.etiqueta, s.conteo])).toEqual([
      ["Centro", 1],
      ["Pileta", 1],
    ])
  })
})

describe("precios", () => {
  it("redondea a dos cifras significativas", () => {
    expect(redondearLindo(137_500)).toBe(140_000)
    expect(redondearLindo(487_000)).toBe(490_000)
    expect(redondearLindo(52_300)).toBe(52_000)
    expect(redondearLindo(9_850)).toBe(9_900)
    expect(redondearLindo(0)).toBe(0)
  })

  it("con menos de 4 precios en la moneda no sugiere rangos", () => {
    const props = [prop({ price: 1 }), prop({ price: 2 }), prop({ price: 3 }), prop({ price: null })]
    expect(rangosDePrecio(props, BUSQUEDA_VACIA, "USD")).toEqual([])
  })

  it("arma hasta 4 rangos contiguos sacados de los cuartiles, ignorando el filtro de precio actual", () => {
    const precios = Array.from({ length: 100 }, (_, i) => (i + 1) * 3_000)
    const props = precios.map((price) => prop({ price }))
    const rangos = rangosDePrecio(props, buscar({ moneda: "USD", hasta: 10_000 }), "USD")
    expect(rangos).toHaveLength(4)
    expect(rangos[0].desde).toBeUndefined()
    expect(rangos[3].hasta).toBeUndefined()
    for (let i = 0; i < 3; i++) expect(rangos[i].hasta).toBe(rangos[i + 1].desde)
  })

  it("solo cuenta la moneda pedida", () => {
    const props = [1, 2, 3, 4, 5].map((i) => prop({ price: i * 100_000, currency: "ARS" }))
    expect(rangosDePrecio(props, BUSQUEDA_VACIA, "USD")).toEqual([])
    expect(rangosDePrecio(props, BUSQUEDA_VACIA, "ARS").length).toBeGreaterThan(0)
    expect(limitesDePrecio(props, BUSQUEDA_VACIA, "ARS")).toEqual({ min: 100_000, max: 500_000 })
  })

  it("cuando los indicadores coinciden, el lado elige cuál se mueve", () => {
    expect(indicadorMasCercano(20, 100, 0, 100, 20, 80)).toBe("min")
    expect(indicadorMasCercano(80, 100, 0, 100, 20, 80)).toBe("max")
    expect(indicadorMasCercano(39, 100, 0, 100, 40, 40)).toBe("min")
    expect(indicadorMasCercano(41, 100, 0, 100, 40, 40)).toBe("max")
  })
})

describe("pasos", () => {
  it("la secuencia operacion → tipo → zona → detalles → resultados", () => {
    expect(pasoSiguiente("operacion")).toBe("tipo")
    expect(pasoSiguiente("detalles")).toBe("resultados")
    expect(pasoAnterior("tipo")).toBe("operacion")
    expect(pasoAnterior("operacion")).toBeNull()
  })

  it("la ruta de cada paso arrastra la búsqueda", () => {
    const b = buscar({ operacion: "venta", tipos: ["casa"] })
    expect(rutaDePaso("zona", b)).toBe("/buscar/zona?operacion=venta&tipo=casa")
    expect(rutaDePaso("resultados", b)).toBe("/propiedades?operacion=venta&tipo=casa")
    expect(rutaDePaso("operacion", b)).toBe("/")
  })

  it("sin operación solo se puede estar en el primer paso", () => {
    expect(pasoAccesible("tipo", BUSQUEDA_VACIA)).toBe(false)
    expect(pasoAccesible("operacion", BUSQUEDA_VACIA)).toBe(true)
    expect(pasoAccesible("zona", buscar({ operacion: "alquiler" }))).toBe(true)
  })
})
