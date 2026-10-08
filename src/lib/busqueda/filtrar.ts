import type { Busqueda } from "./parametros"
import {
  monedaPorDefecto,
  type Caracteristica,
  type Moneda,
  type Operacion,
  type Orden,
  type TipoPropiedad,
  type Zona,
} from "./taxonomia"

/**
 * Lo mínimo de una propiedad para filtrarla y ordenarla. `Property` lo cumple, y también el
 * índice compacto que viaja al cliente para contar en vivo en el buscador.
 */
export type Filtrable = {
  id: string
  operation: Operacion
  type: TipoPropiedad
  zone: Zona
  beds?: number
  baths?: number
  /** `null` = "Consultar precio". */
  price: number | null
  currency: Moneda
  features: readonly Caracteristica[]
  /** ISO, "2026-09-30". */
  publishedAt: string
}

/**
 * Semántica (spec § Semántica del filtro): entre parámetros, Y; dentro de tipo y zona, O; en
 * características, Y. Recibe una búsqueda ya normalizada (la de `leerBusqueda`).
 */
export function cumpleBusqueda(p: Filtrable, b: Busqueda): boolean {
  if (b.operacion && p.operation !== b.operacion) return false
  if (b.tipos.length > 0 && !b.tipos.includes(p.type)) return false
  if (b.zonas.length > 0 && !b.zonas.includes(p.zone)) return false
  if (b.dorm && (p.beds === undefined || p.beds < b.dorm)) return false
  if (b.banos && (p.baths === undefined || p.baths < b.banos)) return false
  if (b.desde !== undefined || b.hasta !== undefined) {
    if (p.price === null || p.currency !== b.moneda) return false
    if (b.desde !== undefined && p.price < b.desde) return false
    if (b.hasta !== undefined && p.price > b.hasta) return false
  }
  return b.con.every((c) => p.features.includes(c))
}

export function filtrarPropiedades<T extends Filtrable>(props: readonly T[], b: Busqueda): T[] {
  return props.filter((p) => cumpleBusqueda(p, b))
}

const porReciente = (a: Filtrable, b: Filtrable) =>
  b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id)

/**
 * `recientes`: la más nueva primero. Por precio: primero las de la moneda de la operación,
 * después la otra, cada grupo por precio; las sin precio al final. Nunca se convierte.
 */
export function ordenarPropiedades<T extends Filtrable>(
  props: readonly T[],
  orden: Orden,
  operacion: Operacion | undefined
): T[] {
  const copia = [...props]
  if (orden === "recientes") return copia.sort(porReciente)

  const moneda = monedaPorDefecto(operacion)
  const signo = orden === "precio-asc" ? 1 : -1
  const grupo = (p: Filtrable) => (p.price === null ? 2 : p.currency === moneda ? 0 : 1)
  return copia.sort(
    (a, b) =>
      grupo(a) - grupo(b) ||
      (a.price !== null && b.price !== null ? signo * (a.price - b.price) : 0) ||
      porReciente(a, b)
  )
}
