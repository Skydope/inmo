import { describe, expect, it } from "vitest"
import {
  filterBolivarStreets,
  linesFromNominatim,
  direccionDesdeReverso,
  lugarDesdeNominatim,
  streetNamesFromPhoton,
} from "@/lib/streets"
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

  it("drops linestrings outside Bolivar municipality radius", () => {
    const lines = linesFromNominatim([
      {
        category: "highway",
        geojson: { type: "LineString", coordinates: [[-60.32, -36.87], [-60.33, -36.88]] },
      },
    ])
    expect(lines.features).toHaveLength(0)
  })
})

describe("filterBolivarStreets", () => {
  it("finds streets by prefix or word match ignoring case and accents", () => {
    expect(filterBolivarStreets("san martin")).toContain("Avenida San Martín")
    expect(filterBolivarStreets("alsina")).toContain("Avenida Alsina")
    expect(filterBolivarStreets("alvear")).toContain("Alvear")
    expect(filterBolivarStreets("lavalle")).toContain("Avenida Lavalle")
  })

  it("returns empty array on empty query", () => {
    expect(filterBolivarStreets("")).toEqual([])
    expect(filterBolivarStreets("   ")).toEqual([])
  })
})

describe("lugarDesdeNominatim", () => {
  it("toma el primer punto dentro de Bolívar", () => {
    const lugar = lugarDesdeNominatim([
      { lat: "-34.6", lon: "-58.4", display_name: "Buenos Aires" },
      { lat: String(BOLIVAR_CENTER.lat), lon: String(BOLIVAR_CENTER.lng), display_name: "San Martín 840" },
    ])
    expect(lugar?.nombre).toBe("San Martín 840")
    expect(lugar?.lat).toBeCloseTo(BOLIVAR_CENTER.lat)
  })

  it("sin puntos cerca devuelve null", () => {
    expect(lugarDesdeNominatim([{ lat: "-34.6", lon: "-58.4" }])).toBeNull()
    expect(lugarDesdeNominatim(null)).toBeNull()
  })
})

describe("direccionDesdeReverso", () => {
  it("separa calle y altura si el punto está en Bolívar", () => {
    expect(
      direccionDesdeReverso({
        lat: String(BOLIVAR_CENTER.lat),
        lon: String(BOLIVAR_CENTER.lng),
        address: { road: "Avenida San Martín", house_number: "840" },
      }),
    ).toEqual({ calle: "Avenida San Martín", altura: "840" })
  })

  it("deja la altura vacía cuando no hay número", () => {
    expect(
      direccionDesdeReverso({
        lat: String(BOLIVAR_CENTER.lat),
        lon: String(BOLIVAR_CENTER.lng),
        address: { road: "Belgrano" },
      }),
    ).toEqual({ calle: "Belgrano", altura: "" })
  })

  it("ignora un punto lejos o sin calle", () => {
    expect(
      direccionDesdeReverso({
        lat: "-34.6",
        lon: "-58.4",
        address: { road: "Corrientes", house_number: "100" },
      }),
    ).toBeNull()
    expect(direccionDesdeReverso({ error: "Unable to geocode" })).toBeNull()
  })
})
