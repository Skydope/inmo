import type { Agency } from "@/lib/agencies/types"
import type {
  Caracteristica,
  Moneda,
  Operacion,
  TipoPropiedad,
  Zona,
} from "@/lib/busqueda/taxonomia"

/** Identificadores en inglés (como el resto del código); valores de dominio en español,
 *  los mismos de la URL (ver docs/ARQUITECTURA.md § Modelo de datos). */
export type Currency = Moneda

export type Property = {
  id: string
  operation: Operacion
  type: TipoPropiedad
  zone: Zona
  /** "Casa de 3 dormitorios con patio". */
  title: string
  description: string
  /** `null` = "Consultar precio". */
  price: number | null
  currency: Currency
  /** ARS por mes (departamentos, PH). */
  expenses?: number
  /** "Belgrano 450". */
  address: string
  /** `false`: en la ficha se ve solo la zona y el mapa marca un área, no un punto. */
  showAddress: boolean
  /** Si `showAddress` es `false`, la inmobiliaria carga una ubicación aproximada. */
  lat: number
  lng: number
  areaTotalM2?: number
  areaCoveredM2?: number
  /** Campos: se muestra en hectáreas. */
  areaHa?: number
  /** Ambientes. */
  rooms?: number
  beds?: number
  baths?: number
  garages?: number
  /** 0 = a estrenar. */
  ageYears?: number
  features: Caracteristica[]
  /** La primera es la portada. Puede estar vacía. */
  photos: string[]
  /** ISO, "2026-09-30". */
  publishedAt: string
  featured?: boolean
  agency: Agency
}
