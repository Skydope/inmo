import { describe, expect, it } from "vitest"
import {
  initialMarkerState,
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

  it("clear resets both", () => {
    let s = markerReducer(initialMarkerState, { type: "expand", id: "bol-01" })
    s = markerReducer(s, { type: "clear" })
    expect(s).toEqual(initialMarkerState)
  })

  it("hover-card highlights without forcing expand", () => {
    const s = markerReducer(initialMarkerState, { type: "hover-card", id: "bol-03" })
    expect(s.selectedId).toBe("bol-03")
    expect(s.expandedId).toBeNull()
  })
})
