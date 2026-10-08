import type { Currency, Property } from "@/lib/properties/types"

const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 })

/** "US$ 120.000", "$ 450.000"; sin precio, "Consultar precio". Nunca convierte monedas. */
export function formatPrice(price: number | null, currency: Currency): string {
  if (price === null) return "Consultar precio"
  const formatted = numero.format(price)
  return currency === "USD" ? `US$ ${formatted}` : `$ ${formatted}`
}

/** Para los pines del mapa: "US$150k", "$45M"; sin precio, "Consultar". */
export function formatPriceCompact(price: number | null, currency: Currency): string {
  if (price === null) return "Consultar"
  const body =
    price >= 1_000_000
      ? `${trimNum(price / 1_000_000)}M`
      : price >= 1_000
        ? `${trimNum(price / 1_000)}k`
        : numero.format(price)
  return currency === "USD" ? `US$${body}` : `$${body}`
}

function trimNum(n: number): string {
  const rounded = Math.round(n * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

/** La superficie principal: hectáreas en campos; si no, la total o la cubierta. */
export function formatArea(
  p: Pick<Property, "areaHa" | "areaTotalM2" | "areaCoveredM2">
): string | null {
  if (p.areaHa) return `${numero.format(p.areaHa)} ha`
  const m2 = p.areaTotalM2 ?? p.areaCoveredM2
  return m2 ? `${numero.format(m2)} m²` : null
}
