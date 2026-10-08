import type { Property } from "@/lib/properties/types"
import type { Filtrable } from "./filtrar"

/**
 * Lo mínimo de cada propiedad para filtrar y contar en el cliente (el conteo en vivo del
 * buscador). Con 1.000 avisos son ~60 KB; con más de ~2.000 conviene pedir el conteo al
 * servidor (ver docs/roadmap/riesgos.md).
 */
export function indiceDeBusqueda(props: readonly Property[]): Filtrable[] {
  return props.map((p) => ({
    id: p.id,
    operation: p.operation,
    type: p.type,
    zone: p.zone,
    beds: p.beds,
    baths: p.baths,
    price: p.price,
    currency: p.currency,
    features: p.features,
    publishedAt: p.publishedAt,
  }))
}
