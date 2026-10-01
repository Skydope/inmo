import { describe, expect, it } from "vitest"
import { countAt } from "@/components/count-up"

describe("countAt", () => {
  it("starts at 0 and ends on the value", () => {
    expect(countAt(2012, 0)).toBe(0)
    expect(countAt(2012, 1)).toBe(2012)
  })

  it("is past halfway by the middle of the ease", () => {
    const mid = countAt(100, 0.5)
    expect(mid).toBeGreaterThan(50)
    expect(mid).toBeLessThan(100)
  })
})
