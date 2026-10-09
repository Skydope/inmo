import { esVivienda } from "@/lib/busqueda"
import type { Property } from "./types"

function distanciaDePrecio(candidato: Property, referencia: Property): number {
  if (referencia.price === null || candidato.price === null) return Number.POSITIVE_INFINITY
  if (candidato.currency !== referencia.currency) return Number.POSITIVE_INFINITY
  return Math.abs(candidato.price - referencia.price)
}

/**
 * Hasta `max` propiedades de la misma operación. Una vivienda se parece a cualquier
 * vivienda; el resto, solo a su tipo. Primero la misma zona, después el precio más cercano.
 */
export function similares(p: Property, todas: readonly Property[], max = 6): Property[] {
  const vivienda = esVivienda(p.type)
  const candidatos = todas.filter((otra) => {
    if (otra.id === p.id || otra.operation !== p.operation) return false
    return vivienda ? esVivienda(otra.type) : otra.type === p.type
  })
  candidatos.sort((a, b) => {
    const zona = Number(a.zone !== p.zone) - Number(b.zone !== p.zone)
    if (zona !== 0) return zona
    return distanciaDePrecio(a, p) - distanciaDePrecio(b, p)
  })
  return candidatos.slice(0, max)
}
