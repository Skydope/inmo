import { describe, expect, it } from "vitest"
import { markerElementClass } from "@/lib/markers"

describe("markerElementClass", () => {
  it("conserva las clases de MapLibre al elegir un pin", () => {
    expect(
      markerElementClass("map-pin is-casa maplibregl-marker maplibregl-marker-anchor-bottom", "casa", true)
    ).toBe("map-pin is-casa is-selected maplibregl-marker maplibregl-marker-anchor-bottom")
  })

  it("al soltarlo saca la marca de elegido", () => {
    expect(markerElementClass("map-pin is-casa is-selected maplibregl-marker", "casa", false)).toBe(
      "map-pin is-casa maplibregl-marker"
    )
  })
})
