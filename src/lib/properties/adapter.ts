import { SEED_PROPERTIES } from "@/lib/properties/seed"
import type { Property } from "@/lib/properties/types"

const FAKE_LATENCY_MS = 280

/** Swap this adapter for the socios backend — no UI refactor. */
export async function getProperties(): Promise<Property[]> {
  await new Promise((r) => setTimeout(r, FAKE_LATENCY_MS))
  return SEED_PROPERTIES
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const all = await getProperties()
  return all.find((p) => p.id === id) ?? null
}
