import { describe, expect, it } from "vitest"
import { clampPriceRange } from "@/lib/price-range"

describe("clampPriceRange", () => {
  it("restringe min y max a los límites globales", () => {
    const res = clampPriceRange(-50, 1500, 0, 1000)
    expect(res.min).toBe(0)
    expect(res.max).toBe(1000)
  })

  it("no permite que min sea superior a max", () => {
    const res = clampPriceRange(500, 200, 0, 1000)
    expect(res.min).toBe(500)
    expect(res.max).toBe(500)
  })
})
