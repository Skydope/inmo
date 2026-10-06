import { describe, expect, it } from "vitest"
import {
  applyFilters,
  filtersToSearchParams,
  parseFilters,
  priceControlsEnabled,
} from "@/lib/filters"
import { SEED_PROPERTIES } from "@/lib/properties/seed"
import type { Property } from "@/lib/properties/types"

describe("parseFilters / URL-state", () => {
  it("parses known query keys", () => {
    const f = parseFilters(
      new URLSearchParams("op=sale&type=house&cur=USD&min=50000&max=200000&beds=2&sort=price-asc&view=grid"),
    )
    expect(f).toEqual({
      op: "sale",
      type: "house",
      cur: "USD",
      min: 50000,
      max: 200000,
      beds: 2,
      sort: "price-asc",
      view: "grid",
    })
  })

  it("ignores unknown / invalid values", () => {
    const f = parseFilters(new URLSearchParams("op=foo&cur=EUR&sort=noise"))
    expect(f.op).toBeUndefined()
    expect(f.cur).toBeUndefined()
    expect(f.sort).toBe("recent")
    expect(f.view).toBe("map")
  })

  it("parses the temporary operation", () => {
    expect(parseFilters(new URLSearchParams("op=temporary")).op).toBe("temporary")
  })

  it("parses the extended property types", () => {
    expect(parseFilters(new URLSearchParams("type=ph")).type).toBe("ph")
    expect(parseFilters(new URLSearchParams("type=commercial")).type).toBe("commercial")
    expect(parseFilters(new URLSearchParams("type=vacational_house")).type).toBe(
      "vacational_house",
    )
    expect(parseFilters(new URLSearchParams("type=rural")).type).toBe("rural")
  })

  it("parses numeric price bounds", () => {
    const f = parseFilters(new URLSearchParams("cur=USD&min=20&max=900"))
    expect(f.min).toBe(20)
    expect(f.max).toBe(900)
    expect(f.cur).toBe("USD")
  })

  it("drops cleared keys on the way back to the URL", () => {
    const f = parseFilters(new URLSearchParams("type=house&min=100"))
    delete f.type
    delete f.min
    const qs = filtersToSearchParams(f).toString()
    expect(qs).not.toContain("type=")
    expect(qs).not.toContain("min=")
  })

  it("round-trips to search params", () => {
    const f = parseFilters(new URLSearchParams("op=rent&cur=ARS&view=grid"))
    const qs = filtersToSearchParams(f).toString()
    expect(qs).toContain("op=rent")
    expect(qs).toContain("cur=ARS")
    expect(qs).toContain("view=grid")
    expect(qs).not.toContain("sort=")
  })
})

describe("applyFilters", () => {
  it("filters by operation + type + currency", () => {
    const list = applyFilters(SEED_PROPERTIES, {
      op: "sale",
      type: "lot",
      cur: "USD",
      sort: "recent",
      view: "map",
    })
    expect(list.length).toBeGreaterThan(0)
    expect(list.every((p) => p.operation === "sale" && p.type === "lot" && p.currency === "USD")).toBe(
      true,
    )
  })

  it("filters by agency name from the query", () => {
    const name = SEED_PROPERTIES[0].agency.name
    const f = parseFilters(new URLSearchParams(`agencia=${encodeURIComponent(name)}`))
    expect(f.agency).toBe(name)
    const list = applyFilters(SEED_PROPERTIES, f)
    expect(list.length).toBeGreaterThan(0)
    expect(list.every((p) => p.agency.name === name)).toBe(true)
    expect(filtersToSearchParams(f).get("agencia")).toBe(name)
  })

  it("ignores min/max without currency", () => {
    const withRange = applyFilters(SEED_PROPERTIES, {
      min: 999999999,
      sort: "recent",
      view: "map",
    })
    expect(withRange.length).toBe(SEED_PROPERTIES.length)
    expect(priceControlsEnabled({ sort: "recent", view: "map" })).toBe(false)
  })

  it("applies price range only with cur set", () => {
    const list = applyFilters(SEED_PROPERTIES, {
      cur: "USD",
      min: 50000,
      max: 100000,
      sort: "price-asc",
      view: "map",
    })
    expect(list.every((p) => p.currency === "USD" && p.price >= 50000 && p.price <= 100000)).toBe(
      true,
    )
    expect(list[0].price).toBeLessThanOrEqual(list[list.length - 1]?.price ?? Infinity)
  })

  it("filters temporary (short-stay) listings", () => {
    const list = applyFilters(SEED_PROPERTIES, {
      op: "temporary",
      sort: "recent",
      view: "map",
    })
    expect(list.length).toBeGreaterThan(0)
    expect(list.every((p) => p.operation === "temporary")).toBe(true)
  })

  it("filters the extended types", () => {
    const list = applyFilters(EXTENDED, { type: "ph", sort: "recent", view: "map" })
    expect(list.map((p) => p.id)).toEqual(["p-ph"])
    const commercial = applyFilters(EXTENDED, {
      type: "commercial",
      sort: "recent",
      view: "map",
    })
    expect(commercial.map((p) => p.id)).toEqual(["p-commercial"])
  })
})

const EXTENDED: Property[] = [
  {
    id: "p-ph",
    title: "PH Luminoso centro",
    type: "ph",
    price: 45000,
    currency: "USD",
    operation: "sale",
    beds: 2,
    baths: 1,
    areaM2: 70,
    address: "Alvear 120",
    lat: -36.23,
    lng: -61.11,
    photoCount: 3,
    coverUrl: "/mock.jpg",
    agency: { name: "Bolívar Prop", logoUrl: "/logo.png", address: "Belgrano 100" },
  },
  {
    id: "p-commercial",
    title: "Local comercial estratégico",
    type: "commercial",
    price: 350000,
    currency: "ARS",
    operation: "rent",
    beds: 0,
    baths: 1,
    areaM2: 50,
    address: "San Martín 400",
    lat: -36.23,
    lng: -61.11,
    photoCount: 2,
    coverUrl: "/mock.jpg",
    agency: { name: "Bolívar Prop", logoUrl: "/logo.png", address: "Belgrano 100" },
  },
]
