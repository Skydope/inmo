import { resumenDeInmobiliarias, type ResumenDeInmobiliaria } from "@/lib/agencies/resumen"
import type { Agency } from "@/lib/agencies/types"
import {
  BUSQUEDA_VACIA,
  OPERACIONES,
  ORDEN_DE_TIPOS,
  ZONAS,
  etiquetaTipo,
  hrefDeBusqueda,
  nombreZona,
  operacionEnFrase,
  type Operacion,
  type TipoPropiedad,
  type Zona,
} from "@/lib/busqueda"
import type { Property } from "@/lib/properties/types"

/*
 * Lo que muestra el inicio debajo del buscador, contado de los datos: nada inventado. Cada
 * sección tiene un mínimo; si no llega, la función devuelve vacío y la sección no va.
 * Spec: docs/hitos/hito-1/inicio-y-pie.md.
 */

const MINIMO_DE_DESTACADAS = 3
const MINIMO_DE_CATEGORIAS = 2
const MINIMO_PARA_LOS_NUMEROS = 10

const masNuevaPrimero = (a: Pick<Property, "publishedAt">, b: Pick<Property, "publishedAt">) =>
  b.publishedAt.localeCompare(a.publishedAt)

/** Las `n` publicadas más recientemente. */
export function recientes<T extends Pick<Property, "publishedAt">>(props: readonly T[], n = 8): T[] {
  return [...props].sort(masNuevaPrimero).slice(0, n)
}

/** Las que la inmobiliaria marcó como destacadas, las más nuevas primero (3 o más, o nada). */
export function destacadas<T extends Pick<Property, "publishedAt" | "featured">>(props: readonly T[]): T[] {
  const marcadas = props.filter((p) => p.featured).sort(masNuevaPrimero)
  return marcadas.length >= MINIMO_DE_DESTACADAS ? marcadas : []
}

export type Categoria = {
  operacion: Operacion
  tipo: TipoPropiedad
  /** "Casas en venta". */
  titulo: string
  cantidad: number
  /** La portada de la más reciente con foto; `null` si ninguna tiene. */
  foto: string | null
  href: string
}

/** Una tarjeta por operación + tipo con propiedades, de la que más tiene a la que menos. */
export function categoriasDelInicio(props: readonly Property[]): Categoria[] {
  const categorias: Categoria[] = []
  for (const { slug: operacion } of OPERACIONES) {
    for (const tipo of ORDEN_DE_TIPOS[operacion]) {
      const suyas = props.filter((p) => p.operation === operacion && p.type === tipo)
      if (suyas.length === 0) continue
      const conFoto = suyas.filter((p) => p.photos.length > 0).sort(masNuevaPrimero)
      categorias.push({
        operacion,
        tipo,
        titulo: `${etiquetaTipo(tipo, "plural")} ${operacionEnFrase(operacion)}`,
        cantidad: suyas.length,
        foto: conFoto[0]?.photos[0] ?? null,
        href: hrefDeBusqueda("/propiedades", { ...BUSQUEDA_VACIA, operacion, tipos: [tipo] }),
      })
    }
  }
  // sort es estable: a igual cantidad queda el orden de la taxonomía.
  categorias.sort((a, b) => b.cantidad - a.cantidad)
  return categorias.length >= MINIMO_DE_CATEGORIAS ? categorias : []
}

export type ZonaConConteo = { zona: Zona; nombre: string; cantidad: number; href: string }

/** Las zonas con al menos una propiedad, de la que más tiene a la que menos. */
export function zonasConPropiedades(props: readonly Pick<Property, "zone">[]): ZonaConConteo[] {
  return ZONAS.map(({ slug: zona }) => ({
    zona,
    nombre: nombreZona(zona),
    cantidad: props.filter((p) => p.zone === zona).length,
    href: hrefDeBusqueda("/propiedades", { ...BUSQUEDA_VACIA, zonas: [zona] }),
  }))
    .filter((z) => z.cantidad > 0)
    .sort((a, b) => b.cantidad - a.cantidad)
}

/** Las inmobiliarias que publican, de la que más tiene a la que menos. */
export function inmobiliariasDelInicio(props: readonly Property[]): ResumenDeInmobiliaria[] {
  const agencias = new Map<string, Agency>()
  for (const p of props) agencias.set(p.agency.id, p.agency)
  return resumenDeInmobiliarias(props, [...agencias.values()]).sort((a, b) => b.total - a.total)
}

export type NumerosDelPortal = { propiedades: number; inmobiliarias: number; zonas: number }

/** La franja de números (con menos de 10 propiedades, `null`: no luce). */
export function numerosDelPortal(props: readonly Property[]): NumerosDelPortal | null {
  if (props.length < MINIMO_PARA_LOS_NUMEROS) return null
  return {
    propiedades: props.length,
    inmobiliarias: new Set(props.map((p) => p.agency.id)).size,
    zonas: new Set(props.map((p) => p.zone)).size,
  }
}

/**
 * La frase de arriba de la hoja: qué es esto, en una línea de historia, y los números del
 * portal metidos en una oración (no en una franja de cifras). Sin números, solo lo fijo.
 */
export function fraseDelPortal(numeros: NumerosDelPortal | null): string {
  const fija = "En Bolívar, todas las propiedades en un solo lugar. Las publican las inmobiliarias de la ciudad."
  if (!numeros) return fija
  const { propiedades, inmobiliarias, zonas } = numeros
  return `${fija} Hoy hay ${propiedades}, de ${inmobiliarias} ${inmobiliarias === 1 ? "inmobiliaria" : "inmobiliarias"}, en ${zonas} ${zonas === 1 ? "zona" : "zonas"}.`
}
