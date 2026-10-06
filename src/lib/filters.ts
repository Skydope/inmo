import {
  PROPERTY_TYPES,
  type Currency,
  type Operation,
  type Property,
  type PropertyType,
} from "@/lib/properties/types"

export type SortKey = "recent" | "price-asc" | "price-desc"
export type ViewMode = "map" | "grid"

export type PropertyFilters = {
  op?: Operation
  type?: PropertyType
  cur?: Currency
  min?: number
  max?: number
  beds?: number
  /** Agency display name. Matches `property.agency.name`. */
  agency?: string
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
  const agency = get("agencia")?.trim()

  const filters: PropertyFilters = {
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "recent",
    view: view === "grid" ? "grid" : "map",
  }

  if (op === "sale" || op === "rent" || op === "temporary") filters.op = op
  if (type && (PROPERTY_TYPES as readonly string[]).includes(type)) {
    filters.type = type as PropertyType
  }
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
  if (agency) filters.agency = agency

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
  if (filters.agency) p.set("agencia", filters.agency)
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
): Property[] {
  let list = properties.filter((p) => {
    if (filters.op && p.operation !== filters.op) return false
    if (filters.type && p.type !== filters.type) return false
    if (filters.cur && p.currency !== filters.cur) return false
    if (filters.beds !== undefined && p.beds < filters.beds) return false
    if (filters.agency && p.agency.name !== filters.agency) return false
    if (priceControlsEnabled(filters)) {
      if (filters.min !== undefined && p.price < filters.min) return false
      if (filters.max !== undefined && p.price > filters.max) return false
    }
    return true
  })

  const sort = filters.sort
  if (sort === "price-asc" && priceControlsEnabled(filters)) {
    list = [...list].sort((a, b) => a.price - b.price)
  } else if (sort === "price-desc" && priceControlsEnabled(filters)) {
    list = [...list].sort((a, b) => b.price - a.price)
  }
  // "recent" keeps seed order

  return list
}
