import type { Property } from "@/lib/properties/types"
import type { Agency } from "./types"

/** Una inmobiliaria con cuántas propiedades tiene publicadas. */
export type ResumenDeInmobiliaria = {
  id: string
  nombre: string
  logo: string
  direccion: string
  total: number
  venta: number
  /** Alquiler y temporario. */
  alquiler: number
}

/**
 * Cada inmobiliaria con sus conteos, en el orden en que vienen (también las que no tienen
 * nada publicado). Lo usan el inicio y `/inmobiliarias`.
 */
export function resumenDeInmobiliarias(
  props: readonly Pick<Property, "agency" | "operation">[],
  agencias: readonly Agency[]
): ResumenDeInmobiliaria[] {
  return agencias.map((a) => {
    const suyas = props.filter((p) => p.agency.id === a.id)
    const venta = suyas.filter((p) => p.operation === "venta").length
    return {
      id: a.id,
      nombre: a.name,
      logo: a.logoUrl,
      direccion: a.address,
      total: suyas.length,
      venta,
      alquiler: suyas.length - venta,
    }
  })
}
