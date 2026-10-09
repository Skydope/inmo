import { describe, expect, it } from "vitest"
import { nacionalArgentino } from "@/lib/telefono"

describe("nacionalArgentino", () => {
  it("deja el resto después del 54", () => {
    expect(nacionalArgentino("5492314421101")).toBe("92314421101")
    expect(nacionalArgentino("+54 9 2314 42-1101")).toBe("92314421101")
  })

  it("saca el 0 de un fijo escrito con la característica", () => {
    expect(nacionalArgentino("02314 42-7654")).toBe("2314427654")
  })
})