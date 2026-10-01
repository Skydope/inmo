export type PropertyType = "house" | "apartment" | "lot"
export type Currency = "ARS" | "USD"
export type Operation = "sale" | "rent"

export type Property = {
  id: string
  title: string
  type: PropertyType
  price: number
  currency: Currency
  operation: Operation
  beds: number
  baths: number
  areaM2: number
  address: string
  lat: number
  lng: number
  photoCount: number
  coverUrl: string
  agency: { name: string; logoUrl: string; phone?: string; email?: string }
}

export type PropertyWithDistance = Property & { distanceKm?: number }
