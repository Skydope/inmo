import { describe, expect, it } from "vitest"
import { navItemActive, navShouldPin } from "./landing-nav"

const params = (op: string | null, type: string | null = null) => ({ op, type })

describe("navShouldPin", () => {
  it("pins after the hero sheet covers the bar, and after a plain header scrolls off", () => {
    expect(navShouldPin(0, 700, 12)).toBe(false)
    expect(navShouldPin(701, 700, 12)).toBe(true)
    expect(navShouldPin(0, null, 12)).toBe(false)
    expect(navShouldPin(40, null, -1)).toBe(true)
  })
})

describe("navItemActive", () => {
  it("marks the matching operation, ignoring type when the link has none", () => {
    expect(navItemActive("/propiedades?op=sale", "/propiedades", params("sale"))).toBe(true)
    expect(navItemActive("/propiedades?op=sale", "/propiedades", params("rent"))).toBe(false)
    expect(navItemActive("/propiedades?op=rent", "/propiedades", params("rent"))).toBe(true)
    expect(navItemActive("/propiedades?op=temporary", "/propiedades", params("temporary"))).toBe(true)
    expect(navItemActive("/inmobiliarias", "/inmobiliarias", params(null))).toBe(true)
    expect(navItemActive("/propiedades?op=sale", "/propiedades/bol-01", params("sale"))).toBe(false)
    expect(navItemActive("/inmobiliarias", "/propiedades", params("sale"))).toBe(false)
  })

  it("requires the exact market when the link targets a type", () => {
    expect(
      navItemActive("/propiedades?op=sale&type=house", "/propiedades", params("sale", "house")),
    ).toBe(true)
    expect(
      navItemActive("/propiedades?op=sale&type=house", "/propiedades", params("sale", "lot")),
    ).toBe(false)
    expect(navItemActive("/propiedades?op=sale&type=house", "/propiedades", params("sale"))).toBe(
      false,
    )
  })
})
