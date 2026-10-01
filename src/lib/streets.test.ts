import { describe, expect, it } from "vitest"
import { linesFromNominatim, streetNamesFromPhoton } from "@/lib/streets"
import { BOLIVAR_CENTER } from "@/lib/brand"

describe("streetNamesFromPhoton", () => {
  it("keeps nearby highway names and drops parks, duplicates, and other towns", () => {
    const names = streetNamesFromPhoton([
      {
        geometry: { coordinates: [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat] },
        properties: { name: "Mitre", osm_key: "highway", countrycode: "AR" },
      },
      {
        geometry: { coordinates: [BOLIVAR_CENTER.lng + 0.001, BOLIVAR_CENTER.lat] },
        properties: { name: "Mitre", osm_key: "highway", countrycode: "AR" },
      },
      {
        geometry: { coordinates: [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat] },
        properties: { name: "Plaza San Martín", osm_key: "leisure", countrycode: "AR" },
      },
      {
        geometry: { coordinates: [-60.32, -36.87] },
        properties: { name: "Mitre", osm_key: "highway", countrycode: "AR" },
      },
    ])
    expect(names).toEqual(["Mitre"])
  })
})

describe("linesFromNominatim", () => {
  it("keeps highway linestrings only", () => {
    const lines = linesFromNominatim([
      {
        category: "highway",
        geojson: { type: "LineString", coordinates: [[-61.11, -36.23], [-61.12, -36.23]] },
      },
      { category: "highway", geojson: { type: "Point", coordinates: [-61.11, -36.23] } },
      { category: "amenity", geojson: { type: "LineString", coordinates: [[0, 0], [1, 1]] } },
    ])
    expect(lines.features).toHaveLength(1)
    expect(lines.features[0].geometry.coordinates).toHaveLength(2)
  })
})
