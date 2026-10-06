import { describe, expect, it } from "vitest"
import {
  initialMarkerState,
  markerElementClass,
  markerReducer,
} from "@/lib/markers"

describe("markerReducer", () => {
  it("expands and selects a single marker", () => {
    const next = markerReducer(initialMarkerState, { type: "expand", id: "bol-01" })
    expect(next).toEqual({ expandedId: "bol-01", selectedId: "bol-01" })
  })

  it("keeps only one expanded at a time", () => {
    let s = markerReducer(initialMarkerState, { type: "expand", id: "bol-01" })
    s = markerReducer(s, { type: "expand", id: "bol-02" })
    expect(s.expandedId).toBe("bol-02")
    expect(s.selectedId).toBe("bol-02")
  })

  it("collapse clears expand but can keep selection via select", () => {
    let s = markerReducer(initialMarkerState, { type: "expand", id: "bol-01" })
    s = markerReducer(s, { type: "collapse" })
    expect(s.expandedId).toBeNull()
    expect(s.selectedId).toBe("bol-01")
  })

  it("deselect clears both the selection and the preview", () => {
    const expanded = markerReducer(initialMarkerState, { type: "expand", id: "bol-01" })
    const clean = markerReducer(expanded, { type: "deselect" })
    expect(clean.selectedId).toBeNull()
    expect(clean.expandedId).toBeNull()
  })

  it("keeps MapLibre classes when a pin opens", () => {
    expect(
      markerElementClass(
        "map-pin is-house maplibregl-marker maplibregl-marker-anchor-bottom",
        "house",
        true,
        true,
      ),
    ).toBe("map-pin is-house is-selected is-open maplibregl-marker maplibregl-marker-anchor-bottom")
  })

  it("hover-card highlights without forcing expand", () => {
    const s = markerReducer(initialMarkerState, { type: "hover-card", id: "bol-03" })
    expect(s.selectedId).toBe("bol-03")
    expect(s.expandedId).toBeNull()
  })
})
