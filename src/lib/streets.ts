import { BOLIVAR_CENTER } from "@/lib/brand"
import { haversineKm } from "@/lib/geo"

export const STREET_QUERY_MIN = 3
const MAX_KM = 15

export type StreetLines = {
  type: "FeatureCollection"
  features: {
    type: "Feature"
    properties: Record<string, never>
    geometry: { type: "LineString"; coordinates: [number, number][] }
  }[]
}

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] }
  properties?: {
    name?: string
    osm_key?: string
    countrycode?: string
  }
}

type NominatimHit = {
  category?: string
  geojson?: { type?: string; coordinates?: [number, number][] }
}

export function streetNamesFromPhoton(features: PhotonFeature[]): string[] {
  const seen = new Set<string>()
  const names: string[] = []
  for (const feature of features) {
    const props = feature.properties
    const coords = feature.geometry?.coordinates
    if (!props?.name || props.osm_key !== "highway" || !coords) continue
    if (props.countrycode && props.countrycode !== "AR") continue
    const km = haversineKm(BOLIVAR_CENTER, { lng: coords[0], lat: coords[1] })
    if (km > MAX_KM) continue
    const key = props.name.toLocaleLowerCase("es-AR")
    if (seen.has(key)) continue
    seen.add(key)
    names.push(props.name)
  }
  return names
}

export function linesFromNominatim(hits: NominatimHit[]): StreetLines {
  return {
    type: "FeatureCollection",
    features: hits.flatMap((hit) => {
      const geo = hit.geojson
      if (
        hit.category !== "highway" ||
        geo?.type !== "LineString" ||
        !geo.coordinates ||
        geo.coordinates.length < 2
      ) {
        return []
      }
      return [
        {
          type: "Feature" as const,
          properties: {},
          geometry: { type: "LineString" as const, coordinates: geo.coordinates },
        },
      ]
    }),
  }
}
