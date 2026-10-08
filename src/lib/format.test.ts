import { describe, expect, it } from "vitest"
import { formatArea, formatPrice, formatPriceCompact } from "@/lib/format"

describe("formatPrice", () => {
  it("escribe el precio en la moneda en que se publicó", () => {
    expect(formatPrice(120_000, "USD")).toBe("US$ 120.000")
    expect(formatPrice(450_000, "ARS")).toBe("$ 450.000")
  })

  it("sin precio dice 'Consultar precio'", () => {
    expect(formatPrice(null, "USD")).toBe("Consultar precio")
  })
})

describe("formatPriceCompact", () => {
  it("shortens thousands and millions and keeps small amounts", () => {
    expect(formatPriceCompact(150_000, "USD")).toBe("US$150k")
    expect(formatPriceCompact(45_000_000, "ARS")).toBe("$45M")
    expect(formatPriceCompact(900, "USD")).toBe("US$900")
  })

  it("sin precio dice 'Consultar'", () => {
    expect(formatPriceCompact(null, "USD")).toBe("Consultar")
  })
})

describe("formatArea", () => {
  it("usa hectáreas para campos y m² para lo demás; la total antes que la cubierta", () => {
    expect(formatArea({ areaHa: 120 })).toBe("120 ha")
    expect(formatArea({ areaTotalM2: 300, areaCoveredM2: 180 })).toBe("300 m²")
    expect(formatArea({ areaCoveredM2: 65 })).toBe("65 m²")
    expect(formatArea({})).toBeNull()
  })
})
