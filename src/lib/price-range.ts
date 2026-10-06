import type { Currency } from "@/lib/properties/types"

/** Slider domain. USD listings top out well under 500k; ARS under 100M. */
export const PRICE_BOUNDS: Record<Currency, { min: number; max: number }> = {
  USD: { min: 0, max: 500_000 },
  ARS: { min: 0, max: 100_000_000 },
}

export function clampPriceRange(
  min: number,
  max: number,
  absMin: number,
  absMax: number,
): { min: number; max: number } {
  const boundedMin = Math.max(absMin, Math.min(min, absMax))
  const boundedMax = Math.max(boundedMin, Math.min(max, absMax))
  return { min: boundedMin, max: boundedMax }
}
