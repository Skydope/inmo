import { formatArea } from "@/lib/format"
import type { Property } from "./types"

/**
 * Lo que necesita una tarjeta de resultados (y el pin del mapa), y nada más: es lo que viaja
 * al cliente. Sin descripción y con hasta 8 fotos. Si la inmobiliaria ocultó la dirección,
 * acá no llega.
 */
export type Tarjeta = Pick<
  Property,
  | "id"
  | "operation"
  | "type"
  | "zone"
  | "title"
  | "price"
  | "currency"
  | "expenses"
  | "beds"
  | "baths"
  | "garages"
  | "lat"
  | "lng"
  | "featured"
> & {
  direccion: string | null
  superficie: string | null
  fotos: string[]
  agencia: { nombre: string; logo: string }
}

const MAXIMO_DE_FOTOS = 8

export function aTarjeta(p: Property): Tarjeta {
  return {
    id: p.id,
    operation: p.operation,
    type: p.type,
    zone: p.zone,
    title: p.title,
    price: p.price,
    currency: p.currency,
    expenses: p.expenses,
    beds: p.beds,
    baths: p.baths,
    garages: p.garages,
    lat: p.lat,
    lng: p.lng,
    featured: p.featured,
    direccion: p.showAddress ? p.address : null,
    superficie: formatArea(p),
    fotos: p.photos.slice(0, MAXIMO_DE_FOTOS),
    agencia: { nombre: p.agency.name, logo: p.agency.logoUrl },
  }
}
