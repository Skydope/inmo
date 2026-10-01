import { describe, expect, it } from "vitest"
import { formatDistanceKm, haversineKm } from "@/lib/geo"
import { BOLIVAR_CENTER } from "@/lib/brand"

describe("haversineKm", () => {
  it("returns ~0 for same point", () => {
    expect(haversineKm(BOLIVAR_CENTER, BOLIVAR_CENTER)).toBeLessThan(0.001)
  })

  it("measures ~1 km for a ~0.009° lat offset near Bolívar", () => {
    const near = { lat: BOLIVAR_CENTER.lat + 0.009, lng: BOLIVAR_CENTER.lng }
    const km = haversineKm(BOLIVAR_CENTER, near)
    expect(km).toBeGreaterThan(0.9)
    expect(km).toBeLessThan(1.1)
  })
})

describe("formatDistanceKm", () => {
  it("formats under 100m", () => {
    expect(formatDistanceKm(0.05)).toMatch(/100 m/)
  })

  it("uses comma decimal for short distances", () => {
    expect(formatDistanceKm(1.2)).toBe("a 1,2 km de vos")
  })
})
