import { filtrarPropiedades, type Filtrable } from "./filtrar"
import type { Busqueda } from "./parametros"
import type { Moneda } from "./taxonomia"

export type RangoDePrecio = { desde?: number; hasta?: number }

/**
 * Qué indicador toma el gesto. Si los dos coinciden, a la izquierda es el mínimo
 * y a la derecha el máximo: el de arriba ya no se queda con los dos.
 */
export function indicadorMasCercano(
  x: number,
  ancho: number,
  min: number,
  max: number,
  minimo: number,
  maximo: number
): "min" | "max" {
  const p = ancho > 0 ? Math.min(1, Math.max(0, x / ancho)) : 0
  const v = min + p * (max - min)
  const dMin = Math.abs(v - minimo)
  const dMax = Math.abs(v - maximo)
  if (dMin < dMax) return "min"
  if (dMax < dMin) return "max"
  const medio = max > min ? (minimo - min) / (max - min) : 0
  return p <= medio ? "min" : "max"
}

/** Dos cifras significativas: 137.500 → 140.000. Los rangos se leen de un vistazo. */
export function redondearLindo(n: number): number {
  if (n <= 0) return 0
  const paso = 10 ** (Math.floor(Math.log10(n)) - 1)
  return Math.round(n / paso) * paso
}

/**
 * Hasta 4 rangos sugeridos, sacados de los cuartiles de los precios de la búsqueda (sin su
 * filtro de precio) en la moneda pedida. Salen de los datos: en pesos, unos rangos fijos
 * envejecerían en meses. Con menos de 4 precios, ninguno.
 */
/** Extremos de la moneda, para el rango con dos indicadores. */
export function limitesDePrecio(
  props: readonly Filtrable[],
  b: Busqueda,
  moneda: Moneda
): { min: number; max: number } | null {
  const sinPrecio: Busqueda = { ...b, desde: undefined, hasta: undefined, moneda: undefined }
  const precios = filtrarPropiedades(props, sinPrecio)
    .filter((p) => p.price !== null && p.currency === moneda)
    .map((p) => p.price as number)
  if (precios.length === 0) return null
  const min = Math.min(...precios)
  const max = Math.max(...precios)
  return min < max ? { min, max } : null
}

export function rangosDePrecio(
  props: readonly Filtrable[],
  b: Busqueda,
  moneda: Moneda
): RangoDePrecio[] {
  const sinPrecio: Busqueda = { ...b, desde: undefined, hasta: undefined, moneda: undefined }
  const precios = filtrarPropiedades(props, sinPrecio)
    .filter((p) => p.price !== null && p.currency === moneda)
    .map((p) => p.price as number)
    .sort((a, c) => a - c)
  if (precios.length < 4) return []

  const cuartil = (q: number) => precios[Math.floor(q * (precios.length - 1))]
  const cortes = [...new Set([0.25, 0.5, 0.75].map((q) => redondearLindo(cuartil(q))))].filter(
    (c) => c > 0
  )
  if (cortes.length === 0) return []

  const rangos: RangoDePrecio[] = [{ hasta: cortes[0] }]
  for (let i = 1; i < cortes.length; i++) rangos.push({ desde: cortes[i - 1], hasta: cortes[i] })
  rangos.push({ desde: cortes[cortes.length - 1] })
  return rangos
}
