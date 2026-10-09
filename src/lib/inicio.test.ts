import { describe, expect, it } from "vitest"
import { SEED_PROPERTIES } from "@/lib/properties/seed"
import type { Property } from "@/lib/properties/types"
import {
  categoriasDelInicio,
  destacadas,
  formaDelBento,
  fraseDelPortal,
  inmobiliariasDelInicio,
  numerosDelPortal,
  recientes,
  zonasConPropiedades,
} from "./inicio"

const base = SEED_PROPERTIES[0]
const prop = (p: Partial<Property>): Property => ({ ...base, featured: false, ...p })

describe("recientes", () => {
  it("se pueden excluir ids (las que ya están en Destacadas no se repiten)", () => {
    const props = [
      prop({ id: "a", publishedAt: "2026-09-03" }),
      prop({ id: "b", publishedAt: "2026-09-02" }),
      prop({ id: "c", publishedAt: "2026-09-01" }),
    ]
    expect(recientes(props, 2, new Set(["a"])).map((p) => p.id)).toEqual(["b", "c"])
  })

  it("de la más nueva a la más vieja, cortadas en n", () => {
    const r = recientes(SEED_PROPERTIES, 5)
    expect(r).toHaveLength(5)
    const fechas = r.map((p) => p.publishedAt)
    expect(fechas).toEqual([...fechas].sort().reverse())
    const masNueva = SEED_PROPERTIES.map((p) => p.publishedAt).sort().at(-1)
    expect(r[0].publishedAt).toBe(masNueva)
  })

  it("no cambia el arreglo de entrada", () => {
    const copia = [...SEED_PROPERTIES]
    recientes(SEED_PROPERTIES, 3)
    expect(SEED_PROPERTIES).toEqual(copia)
  })
})

describe("destacadas", () => {
  it("solo las marcadas, las más nuevas primero", () => {
    const d = destacadas(SEED_PROPERTIES)
    expect(d.length).toBe(SEED_PROPERTIES.filter((p) => p.featured).length)
    expect(d.every((p) => p.featured)).toBe(true)
  })

  it("con menos de 3, nada (la sección no va)", () => {
    const dos = [prop({ id: "a", featured: true }), prop({ id: "b", featured: true }), prop({ id: "c" })]
    expect(destacadas(dos)).toEqual([])
  })
})

describe("formaDelBento", () => {
  const cat = (n: number) =>
    Array.from({ length: n }, (_, i) =>
      categoriasDelInicio(SEED_PROPERTIES)[0] && { ...categoriasDelInicio(SEED_PROPERTIES)[0], titulo: `c${i}`, cantidad: n - i }
    )

  it("con 5 o más: una grande (la de más propiedades) y cuatro chicas; el resto queda afuera", () => {
    const f = formaDelBento(cat(7))!
    expect(f.grandes.map((c) => c.titulo)).toEqual(["c0"])
    expect(f.chicas.map((c) => c.titulo)).toEqual(["c1", "c2", "c3", "c4"])
    expect(f.restantes).toBe(2)
  })

  it("con 4: dos grandes y dos chicas; con 3: una y dos; con 2: dos grandes", () => {
    expect(formaDelBento(cat(4))).toMatchObject({ grandes: [{ titulo: "c0" }, { titulo: "c1" }], restantes: 0 })
    expect(formaDelBento(cat(4))!.chicas.map((c) => c.titulo)).toEqual(["c2", "c3"])
    expect(formaDelBento(cat(3))!.grandes.map((c) => c.titulo)).toEqual(["c0"])
    expect(formaDelBento(cat(3))!.chicas.map((c) => c.titulo)).toEqual(["c1", "c2"])
    expect(formaDelBento(cat(2))).toMatchObject({ grandes: [{ titulo: "c0" }, { titulo: "c1" }], chicas: [], restantes: 0 })
  })

  it("con menos de 2, nada (la sección no va)", () => {
    expect(formaDelBento(cat(1))).toBeNull()
    expect(formaDelBento([])).toBeNull()
  })

  it("con los datos de prueba quedan 10 afuera, y no muta la entrada", () => {
    const todas = categoriasDelInicio(SEED_PROPERTIES)
    const copia = [...todas]
    expect(formaDelBento(todas)!.restantes).toBe(todas.length - 5)
    expect(todas).toEqual(copia)
  })
})

describe("categoriasDelInicio", () => {
  const props = [
    prop({ id: "c1", operation: "venta", type: "casa", publishedAt: "2026-09-01", photos: ["/vieja.webp"] }),
    prop({ id: "c2", operation: "venta", type: "casa", publishedAt: "2026-09-20", photos: ["/nueva.webp"] }),
    prop({ id: "c3", operation: "venta", type: "casa", publishedAt: "2026-09-25", photos: [] }),
    prop({ id: "d1", operation: "alquiler", type: "departamento", publishedAt: "2026-09-10", photos: [] }),
  ]

  it("una por operación y tipo, de la que más tiene a la que menos", () => {
    const c = categoriasDelInicio(props)
    expect(c.map((x) => [x.titulo, x.cantidad])).toEqual([
      ["Casas en venta", 3],
      ["Departamentos en alquiler", 1],
    ])
  })

  it("la foto es la de la más reciente que tiene foto; sin ninguna, null", () => {
    const [casas, deptos] = categoriasDelInicio(props)
    expect(casas.foto).toBe("/nueva.webp")
    expect(deptos.foto).toBeNull()
  })

  it("el link es la búsqueda de esa categoría", () => {
    expect(categoriasDelInicio(props)[0].href).toBe("/propiedades?operacion=venta&tipo=casa")
  })

  it("con menos de 2 categorías, nada", () => {
    expect(categoriasDelInicio(props.slice(0, 3))).toEqual([])
  })

  it("con los datos de prueba, la suma da el total", () => {
    const c = categoriasDelInicio(SEED_PROPERTIES)
    expect(c.reduce((n, x) => n + x.cantidad, 0)).toBe(SEED_PROPERTIES.length)
  })
})

describe("zonasConPropiedades", () => {
  it("las zonas con al menos una, con su conteo, de más a menos", () => {
    const z = zonasConPropiedades(SEED_PROPERTIES)
    expect(z.every((x) => x.cantidad > 0)).toBe(true)
    expect(z.reduce((n, x) => n + x.cantidad, 0)).toBe(SEED_PROPERTIES.length)
    const cantidades = z.map((x) => x.cantidad)
    expect(cantidades).toEqual([...cantidades].sort((a, b) => b - a))
    const centro = z.find((x) => x.zona === "centro")!
    expect(centro.cantidad).toBe(SEED_PROPERTIES.filter((p) => p.zone === "centro").length)
    expect(centro).toMatchObject({ nombre: "Centro", href: "/propiedades?zona=centro" })
  })
})

describe("inmobiliariasDelInicio", () => {
  it("las que publican, de la que más tiene a la que menos", () => {
    const i = inmobiliariasDelInicio(SEED_PROPERTIES)
    expect(i.length).toBe(new Set(SEED_PROPERTIES.map((p) => p.agency.id)).size)
    expect(i.every((x) => x.total > 0)).toBe(true)
    const totales = i.map((x) => x.total)
    expect(totales).toEqual([...totales].sort((a, b) => b - a))
  })
})

describe("numerosDelPortal", () => {
  it("propiedades, inmobiliarias y zonas, contadas de los datos", () => {
    expect(numerosDelPortal(SEED_PROPERTIES)).toEqual({
      propiedades: SEED_PROPERTIES.length,
      inmobiliarias: new Set(SEED_PROPERTIES.map((p) => p.agency.id)).size,
      zonas: new Set(SEED_PROPERTIES.map((p) => p.zone)).size,
    })
  })

  it("con menos de 10 propiedades, nada (la franja no va)", () => {
    expect(numerosDelPortal(SEED_PROPERTIES.slice(0, 9))).toBeNull()
  })
})

describe("fraseDelPortal", () => {
  const FIJA = "En Bolívar, todas las propiedades en un solo lugar. Las publican las inmobiliarias de la ciudad."

  it("cuenta qué es esto y suma los números del portal", () => {
    expect(fraseDelPortal(numerosDelPortal(SEED_PROPERTIES))).toBe(
      `${FIJA} Hoy hay 36, de 4 inmobiliarias, en 14 zonas.`
    )
  })

  it("en singular cuando hay una sola inmobiliaria o una sola zona", () => {
    expect(fraseDelPortal({ propiedades: 12, inmobiliarias: 1, zonas: 1 })).toBe(
      `${FIJA} Hoy hay 12, de 1 inmobiliaria, en 1 zona.`
    )
  })

  it("sin números (pocas propiedades), solo lo que no cambia", () => {
    expect(fraseDelPortal(null)).toBe(FIJA)
  })
})
