import type {
  Currency,
  Operation,
  Property,
  PropertyType,
  PropertyWithDistance,
} from "@/lib/properties/types"
import { haversineKm } from "@/lib/geo"

export type SortKey = "recent" | "price-asc" | "price-desc" | "distance"
export type ViewMode = "map" | "grid"

export type PropertyFilters = {
  op?: Operation
  type?: PropertyType
  cur?: Currency
  min?: number
  max?: number
  beds?: number
  sort: SortKey
  view: ViewMode
}

export function parseFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): PropertyFilters {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) {
      return params.get(key) ?? undefined
    }
    const v = params[key]
    return Array.isArray(v) ? v[0] : v
  }

  const op = get("op")
  const type = get("type")
  const cur = get("cur")
  const sort = get("sort")
  const view = get("view")
  const min = get("min")
  const max = get("max")
  const beds = get("beds")

  const filters: PropertyFilters = {
    sort:
      sort === "price-asc" || sort === "price-desc" || sort === "distance"
        ? sort
        : "recent",
    view: view === "grid" ? "grid" : "map",
  }

  if (op === "sale" || op === "rent") filters.op = op
  if (type === "house" || type === "apartment" || type === "lot") filters.type = type
  if (cur === "ARS" || cur === "USD") filters.cur = cur

  if (min !== undefined && min !== "" && !Number.isNaN(Number(min))) {
    filters.min = Number(min)
  }
  if (max !== undefined && max !== "" && !Number.isNaN(Number(max))) {
    filters.max = Number(max)
  }
  if (beds !== undefined && beds !== "" && !Number.isNaN(Number(beds))) {
    filters.beds = Number(beds)
  }

  return filters
}

export function filtersToSearchParams(filters: PropertyFilters): URLSearchParams {
  const p = new URLSearchParams()
  if (filters.op) p.set("op", filters.op)
  if (filters.type) p.set("type", filters.type)
  if (filters.cur) p.set("cur", filters.cur)
  if (filters.min !== undefined) p.set("min", String(filters.min))
  if (filters.max !== undefined) p.set("max", String(filters.max))
  if (filters.beds !== undefined) p.set("beds", String(filters.beds))
  if (filters.sort !== "recent") p.set("sort", filters.sort)
  if (filters.view !== "map") p.set("view", filters.view)
  return p
}

/** Price range and price-sort only valid with a single currency selected. */
export function priceControlsEnabled(filters: PropertyFilters): boolean {
  return Boolean(filters.cur)
}

export function applyFilters(
  properties: Property[],
  filters: PropertyFilters,
  userPos?: { lat: number; lng: number } | null,
): PropertyWithDistance[] {
  let list: PropertyWithDistance[] = properties.filter((p) => {
    if (filters.op && p.operation !== filters.op) return false
    if (filters.type && p.type !== filters.type) return false
    if (filters.cur && p.currency !== filters.cur) return false
    if (filters.beds !== undefined && p.beds < filters.beds) return false
    if (priceControlsEnabled(filters)) {
      if (filters.min !== undefined && p.price < filters.min) return false
      if (filters.max !== undefined && p.price > filters.max) return false
    }
    return true
  })

  if (userPos) {
    list = list.map((p) => ({
      ...p,
      distanceKm: haversineKm(userPos, { lat: p.lat, lng: p.lng }),
    }))
  }

  const sort = filters.sort
  if (sort === "distance" && userPos) {
    list = [...list].sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
  } else if (sort === "price-asc" && priceControlsEnabled(filters)) {
    list = [...list].sort((a, b) => a.price - b.price)
  } else if (sort === "price-desc" && priceControlsEnabled(filters)) {
    list = [...list].sort((a, b) => b.price - a.price)
  }
  // "recent" keeps seed order

  return list
}
