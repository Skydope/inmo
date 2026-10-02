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

export function typeLabel(type: PropertyType): string {
  switch (type) {
    case "house":
      return "Casa"
    case "apartment":
      return "Depto"
    case "lot":
      return "Lote"
  }
}
