import type { Currency, Operation, PropertyType } from "@/lib/properties/types"

export function formatPrice(price: number, currency: Currency): string {
  const formatted = new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
  }).format(price)
  return currency === "USD" ? `US$ ${formatted}` : `$ ${formatted}`
}

export function operationLabel(op: Operation): string {
  if (op === "sale") return "Venta"
  if (op === "rent") return "Alquiler"
  return "Temporaria"
}

export function formatPriceCompact(price: number, currency: Currency): string {
  const body =
    price >= 1_000_000
      ? `${trimNum(price / 1_000_000)}M`
      : price >= 1_000
        ? `${trimNum(price / 1_000)}k`
        : new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(price)
  return currency === "USD" ? `US$${body}` : `$${body}`
}

function trimNum(n: number): string {
  const rounded = Math.round(n * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

export function typeLabel(type: PropertyType): string {
  switch (type) {
    case "house":
      return "Casa"
    case "apartment":
      return "Depto"
    case "ph":
      return "PH"
    case "lot":
      return "Lote"
    case "commercial":
      return "Local"
    case "rural":
      return "Campo"
    case "vacational_house":
      return "Quinta"
  }
}
