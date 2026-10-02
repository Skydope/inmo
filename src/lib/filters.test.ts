import { describe, expect, it } from "vitest"
import {
  applyFilters,
  filtersToSearchParams,
  parseFilters,
  priceControlsEnabled,
} from "@/lib/filters"
import { SEED_PROPERTIES } from "@/lib/properties/seed"
import { BOLIVAR_CENTER } from "@/lib/brand"

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

  it("sorts by distance when GPS active", () => {
    const list = applyFilters(
      SEED_PROPERTIES,
      { sort: "distance", view: "map" },
      BOLIVAR_CENTER,
    )
    expect(list[0].distanceKm).toBeDefined()
    for (let i = 1; i < list.length; i++) {
      expect(list[i].distanceKm!).toBeGreaterThanOrEqual(list[i - 1].distanceKm!)
    }
  })
})
