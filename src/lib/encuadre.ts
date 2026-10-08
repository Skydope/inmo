import { BOLIVAR_CENTER } from "@/lib/brand"
import { haversineKm } from "@/lib/geo"

/** Lo que se considera "la ciudad" para el encuadre del mapa. */
const RADIO_DE_LA_CIUDAD_KM = 6

/**
 * Qué propiedades encuadrar al abrir el mapa. Si la mayoría está en la ciudad, la ciudad
 * (las de los campos y las localidades la dejarían en un puñado de puntos) y cuántas quedan
 * afuera, para ofrecer "Ver todo". Si la mayoría está afuera, todas.
 */
export function encuadreInicial(puntos: readonly { id: string; lat: number; lng: number }[]): {
  ids: string[]
  afuera: number
} {
  const enCiudad = puntos.filter((p) => haversineKm(p, BOLIVAR_CENTER) <= RADIO_DE_LA_CIUDAD_KM)
  if (enCiudad.length * 2 > puntos.length && enCiudad.length < puntos.length) {
    return { ids: enCiudad.map((p) => p.id), afuera: puntos.length - enCiudad.length }
  }
  return { ids: puntos.map((p) => p.id), afuera: 0 }
}
