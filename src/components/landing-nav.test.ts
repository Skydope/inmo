import { describe, expect, it } from "vitest"
import { navItemActive } from "./landing-nav"

describe("navItemActive", () => {
  it("marks only the matching category", () => {
    expect(navItemActive("/propiedades?op=sale", "/propiedades", "sale")).toBe(true)
    expect(navItemActive("/propiedades?op=rent", "/propiedades", "sale")).toBe(false)
    expect(navItemActive("/inmobiliarias", "/inmobiliarias", null)).toBe(true)
    expect(navItemActive("/propiedades?op=sale", "/propiedades/bol-01", "sale")).toBe(false)
    expect(navItemActive("/inmobiliarias", "/propiedades", "sale")).toBe(false)
  })
})
