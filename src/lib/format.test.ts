import { describe, expect, it } from "vitest"
import { formatPriceCompact } from "@/lib/format"

describe("formatPriceCompact", () => {
  it("shortens thousands and millions and keeps small amounts", () => {
    expect(formatPriceCompact(150_000, "USD")).toBe("US$150k")
    expect(formatPriceCompact(45_000_000, "ARS")).toBe("$45M")
    expect(formatPriceCompact(900, "USD")).toBe("US$900")
  })
})
