import type { Agency } from "@/lib/agencies/types"

export const PROPERTY_TYPES = [
  "apartment",
  "house",
  "ph",
  "lot",
  "commercial",
  "rural",
  "vacational_house",
] as const

export type PropertyType = (typeof PROPERTY_TYPES)[number]
export type Currency = "ARS" | "USD"
export type Operation = "sale" | "rent" | "temporary"

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
  description?: string
  features?: string[]
  featured?: boolean
  agency: Agency
}
