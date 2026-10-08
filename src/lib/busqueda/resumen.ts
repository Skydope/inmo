import { formatPrice } from "@/lib/format"
import type { Busqueda } from "./parametros"
import {
  etiquetaCaracteristica,
  etiquetaTipo,
  nombreZona,
  operacionEnFrase,
  type TipoPropiedad,
} from "./taxonomia"

/** "Casas" → "casas", pero "PH" queda "PH". */
const enMinuscula = (texto: string) =>
  texto === texto.toUpperCase() ? texto : texto.charAt(0).toLowerCase() + texto.slice(1)

function sujeto(tipos: TipoPropiedad[]): string {
  if (tipos.length === 1) return etiquetaTipo(tipos[0], "plural")
  if (tipos.length === 2) {
    return `${etiquetaTipo(tipos[0], "plural")} y ${enMinuscula(etiquetaTipo(tipos[1], "plural"))}`
  }
  return "Propiedades"
}

/**
 * El `<h1>` y el `<title>` de resultados: "Casas en venta en Centro", "Propiedades en
 * alquiler en 3 zonas", "Propiedades en Bolívar".
 */
export function tituloDeBusqueda(b: Busqueda): string {
  const partes = [sujeto(b.tipos)]
  if (b.operacion) partes.push(operacionEnFrase(b.operacion))
  if (b.zonas.length === 1) partes.push(`en ${nombreZona(b.zonas[0])}`)
  else if (b.zonas.length > 1) partes.push(`en ${b.zonas.length} zonas`)
  else partes.push("en Bolívar")
  return partes.join(" ")
}

export type Chip = {
  /** Qué representa: "tipo:casa", "zona:centro", "dorm", "banos", "precio", "con:pileta". */
  clave: string
  etiqueta: string
  /** La búsqueda sin este filtro: para el link que lo saca. */
  sin: Busqueda
}

function etiquetaDePrecio(b: Busqueda): string {
  const moneda = b.moneda ?? "USD"
  if (b.desde !== undefined && b.hasta !== undefined) {
    return `${formatPrice(b.desde, moneda)} a ${formatPrice(b.hasta, moneda)}`
  }
  if (b.hasta !== undefined) return `Hasta ${formatPrice(b.hasta, moneda)}`
  return `Desde ${formatPrice(b.desde ?? 0, moneda)}`
}

/** Un chip por cada cosa que se puede sacar de la búsqueda. La operación no es un chip. */
export function chipsDeBusqueda(b: Busqueda): Chip[] {
  const chips: Chip[] = []
  for (const tipo of b.tipos) {
    chips.push({ clave: `tipo:${tipo}`, etiqueta: etiquetaTipo(tipo), sin: { ...b, tipos: b.tipos.filter((t) => t !== tipo) } })
  }
  for (const zona of b.zonas) {
    chips.push({ clave: `zona:${zona}`, etiqueta: nombreZona(zona), sin: { ...b, zonas: b.zonas.filter((z) => z !== zona) } })
  }
  if (b.dorm) chips.push({ clave: "dorm", etiqueta: `${b.dorm}+ dorm.`, sin: { ...b, dorm: undefined } })
  if (b.banos) chips.push({ clave: "banos", etiqueta: `${b.banos}+ baños`, sin: { ...b, banos: undefined } })
  if (b.desde !== undefined || b.hasta !== undefined) {
    chips.push({
      clave: "precio",
      etiqueta: etiquetaDePrecio(b),
      sin: { ...b, desde: undefined, hasta: undefined, moneda: undefined },
    })
  }
  for (const c of b.con) {
    chips.push({ clave: `con:${c}`, etiqueta: etiquetaCaracteristica(c), sin: { ...b, con: b.con.filter((x) => x !== c) } })
  }
  return chips
}

/** El número del badge de "Filtros": todo menos la operación. */
export function filtrosActivos(b: Busqueda): number {
  return chipsDeBusqueda(b).length
}
