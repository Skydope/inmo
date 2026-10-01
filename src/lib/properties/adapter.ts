import { SEED_PROPERTIES } from "@/lib/properties/seed"
import type { Property } from "@/lib/properties/types"

export async function getProperties(): Promise<Property[]> {
  return SEED_PROPERTIES
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return SEED_PROPERTIES.find((p) => p.id === id) ?? null
}
