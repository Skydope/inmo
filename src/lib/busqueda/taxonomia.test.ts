import { describe, expect, it } from "vitest"
import {
  CARACTERISTICAS,
  OPERACIONES,
  ORDEN_DE_TIPOS,
  TIPOS,
  ZONAS,
  caracteristicasDe,
  esVivienda,
  etiquetaTipo,
  monedaPorDefecto,
  tiposDe,
  zonasDelGrupo,
} from "./taxonomia"

const slugs = (lista: readonly { slug: string }[]) => lista.map((x) => x.slug)

describe("taxonomía", () => {
  it("no repite slugs", () => {
    for (const lista of [OPERACIONES, TIPOS, ZONAS, CARACTERISTICAS]) {
      expect(new Set(slugs(lista)).size).toBe(lista.length)
    }
  })

  it("cada tipo tiene etiquetas e ícono", () => {
    for (const tipo of TIPOS) {
      expect(tipo.singular).not.toBe("")
      expect(tipo.plural).not.toBe("")
      expect(tipo.icono).not.toBe("")
    }
  })

  it("ordena los tipos por lo más buscado en cada operación", () => {
    expect(tiposDe("temporario")).toEqual(["quinta", "casa", "departamento"])
    expect(tiposDe("venta").slice(0, 3)).toEqual(["casa", "departamento", "terreno"])
    expect(tiposDe("alquiler")[0]).toBe("departamento")
  })

  it("el orden de cada operación tiene exactamente los tipos que aplican", () => {
    for (const op of slugs(OPERACIONES) as (keyof typeof ORDEN_DE_TIPOS)[]) {
      const aplican = TIPOS.filter((t) => (t.operaciones as readonly string[]).includes(op)).map((t) => t.slug)
      expect([...ORDEN_DE_TIPOS[op]].sort()).toEqual([...aplican].sort())
    }
  })

  it("sin operación devuelve todos los tipos, sin repetir", () => {
    expect(tiposDe(undefined)).toHaveLength(TIPOS.length)
  })

  it("sabe qué tipos son vivienda", () => {
    expect(esVivienda("casa")).toBe(true)
    expect(esVivienda("quinta")).toBe(true)
    expect(esVivienda("terreno")).toBe(false)
    expect(esVivienda("cochera")).toBe(false)
  })

  it("las características dependen de la operación", () => {
    expect(caracteristicasDe("venta")).toContain("apto-credito")
    expect(caracteristicasDe("venta")).not.toContain("mascotas")
    expect(caracteristicasDe("alquiler")).toContain("mascotas")
    expect(caracteristicasDe("alquiler")).not.toContain("apto-credito")
    expect(caracteristicasDe(undefined)).toHaveLength(CARACTERISTICAS.length)
  })

  it("la moneda por defecto sale de la operación", () => {
    expect(monedaPorDefecto("venta")).toBe("USD")
    expect(monedaPorDefecto("alquiler")).toBe("ARS")
    expect(monedaPorDefecto("temporario")).toBe("ARS")
    expect(monedaPorDefecto(undefined)).toBe("USD")
  })

  it("etiqueta tipos en singular y plural", () => {
    expect(etiquetaTipo("quinta")).toBe("Casa quinta")
    expect(etiquetaTipo("quinta", "plural")).toBe("Casas quinta")
  })

  it("agrupa las zonas", () => {
    expect(zonasDelGrupo("ciudad")).toContain("centro")
    expect(zonasDelGrupo("localidades")).toContain("urdampilleta")
    const total = ["ciudad", "afueras", "localidades"].flatMap((g) => zonasDelGrupo(g as "ciudad"))
    expect(total).toHaveLength(ZONAS.length)
  })
})
