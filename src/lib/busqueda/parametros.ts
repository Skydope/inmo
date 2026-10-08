import { z } from "zod"
import { leerMonto } from "./numeros"
import {
  MONEDAS,
  OPERACIONES,
  ORDENES,
  VISTAS,
  ZONAS,
  caracteristicasDe,
  esCaracteristica,
  esTipo,
  esVivienda,
  esZona,
  monedaPorDefecto,
  tiposDe,
  type Caracteristica,
  type Moneda,
  type Operacion,
  type Orden,
  type TipoPropiedad,
  type Vista,
  type Zona,
} from "./taxonomia"

/**
 * El contrato de URL de la búsqueda (docs/hitos/hito-1/modelo-de-busqueda.md § Contrato de
 * URL). La URL es la fuente de verdad: se comparte, el botón atrás funciona y la página
 * renderiza en el servidor. Un valor inválido se ignora; nunca rompe la página.
 */
export type Busqueda = {
  operacion?: Operacion
  tipos: TipoPropiedad[]
  zonas: Zona[]
  /** Al menos n dormitorios; 4 = 4 o más. */
  dorm?: 1 | 2 | 3 | 4
  /** Al menos n baños; 3 = 3 o más. */
  banos?: 1 | 2 | 3
  /** Solo existe si hay `desde` o `hasta`. */
  moneda?: Moneda
  desde?: number
  hasta?: number
  con: Caracteristica[]
  orden: Orden
  vista: Vista
  /** La propiedad elegida en resultados (la misma en la lista y en el mapa). */
  sel?: string
}

export const BUSQUEDA_VACIA: Busqueda = {
  tipos: [],
  zonas: [],
  con: [],
  orden: "recientes",
  vista: "lista",
}

type Entrada = URLSearchParams | Record<string, string | string[] | undefined>

/** Todos los valores de un parámetro: repetidos (`tipo=a&tipo=b`) o con comas (`tipo=a,b`). */
function valores(entrada: Entrada, clave: string): string[] {
  const crudos =
    entrada instanceof URLSearchParams
      ? entrada.getAll(clave)
      : [entrada[clave]].flat().filter((v): v is string => typeof v === "string")
  return crudos.flatMap((v) => v.split(",")).map((v) => v.trim()).filter(Boolean)
}

const primero = (entrada: Entrada, clave: string) => valores(entrada, clave)[0]

/** Entero escrito solo con dígitos ("1e9" no vale), dentro de un rango. */
const entero = (min: number, max: number) =>
  z
    .string()
    .regex(/^\d{1,15}$/)
    .transform(Number)
    .pipe(z.number().int().min(min).max(max))

const ESQUEMA = {
  operacion: z.enum(OPERACIONES.map((o) => o.slug) as [Operacion, ...Operacion[]]),
  dorm: entero(1, 4),
  banos: entero(1, 3),
  moneda: z.enum(MONEDAS),
  orden: z.enum(ORDENES),
  vista: z.enum(VISTAS),
  sel: z.string().regex(/^[a-z0-9-]{1,64}$/),
}

/** `undefined` si el valor no pasa el esquema. */
function leerCon<T>(esquema: z.ZodType<T>, valor: string | undefined): T | undefined {
  if (valor === undefined) return undefined
  const r = esquema.safeParse(valor)
  return r.success ? r.data : undefined
}

/** Los montos aceptan el punto de miles: ver numeros.ts. */
const monto = (valor: string | undefined) => (valor === undefined ? undefined : leerMonto(valor))

const enOrden = <T extends string>(elegidos: Iterable<T>, orden: readonly T[]): T[] => {
  const set = new Set(elegidos)
  return orden.filter((x) => set.has(x))
}

/**
 * Deja la búsqueda en su forma canónica: sin repetidos, en el orden de la taxonomía, sin lo
 * que no aplica a la operación y con la moneda solo si hay precio.
 */
export function normalizarBusqueda(b: Busqueda): Busqueda {
  const tipos = enOrden(b.tipos, tiposDe(b.operacion))
  const zonas = enOrden(b.zonas, ZONAS.map((z) => z.slug))
  const con = enOrden(b.con, caracteristicasDe(b.operacion))
  const hayVivienda = tipos.length === 0 || tipos.some(esVivienda)

  let { desde, hasta } = b
  if (desde !== undefined && hasta !== undefined && desde > hasta) [desde, hasta] = [hasta, desde]
  const hayPrecio = desde !== undefined || hasta !== undefined

  const normal: Busqueda = { tipos, zonas, con, orden: b.orden, vista: b.vista }
  if (b.operacion) normal.operacion = b.operacion
  if (hayVivienda && b.dorm) normal.dorm = b.dorm
  if (hayVivienda && b.banos) normal.banos = b.banos
  if (hayPrecio) {
    normal.moneda = b.moneda ?? monedaPorDefecto(b.operacion)
    if (desde !== undefined) normal.desde = desde
    if (hasta !== undefined) normal.hasta = hasta
  }
  if (b.sel) normal.sel = b.sel
  return normal
}

/**
 * Lee la búsqueda de la URL (un `URLSearchParams` o los `searchParams` de Next).
 * `vista` y `sel` solo se leen con `conVista`: son de resultados, no de los pasos.
 */
export function leerBusqueda(entrada: Entrada, opciones: { conVista?: boolean } = {}): Busqueda {
  const b: Busqueda = {
    operacion: leerCon(ESQUEMA.operacion, primero(entrada, "operacion")),
    tipos: valores(entrada, "tipo").filter(esTipo),
    zonas: valores(entrada, "zona").filter(esZona),
    dorm: leerCon(ESQUEMA.dorm, primero(entrada, "dorm")) as Busqueda["dorm"],
    banos: leerCon(ESQUEMA.banos, primero(entrada, "banos")) as Busqueda["banos"],
    moneda: leerCon(ESQUEMA.moneda, primero(entrada, "moneda")),
    desde: monto(primero(entrada, "desde")),
    hasta: monto(primero(entrada, "hasta")),
    con: valores(entrada, "con").filter(esCaracteristica),
    orden: leerCon(ESQUEMA.orden, primero(entrada, "orden")) ?? "recientes",
    vista: (opciones.conVista && leerCon(ESQUEMA.vista, primero(entrada, "vista"))) || "lista",
    sel: opciones.conVista ? leerCon(ESQUEMA.sel, primero(entrada, "sel")) : undefined,
  }
  return normalizarBusqueda(b)
}

/**
 * La query canónica, sin el "?". Los valores por defecto no se escriben y las comas de los
 * multivalores no se escapan (los slugs son [a-z0-9-]).
 */
export function escribirBusqueda(entrada: Busqueda): string {
  const b = normalizarBusqueda(entrada)
  const partes: [string, string | number | undefined][] = [
    ["operacion", b.operacion],
    ["tipo", b.tipos.join(",") || undefined],
    ["zona", b.zonas.join(",") || undefined],
    ["dorm", b.dorm],
    ["banos", b.banos],
    ["moneda", b.moneda],
    ["desde", b.desde],
    ["hasta", b.hasta],
    ["con", b.con.join(",") || undefined],
    ["orden", b.orden === "recientes" ? undefined : b.orden],
    ["vista", b.vista === "lista" ? undefined : b.vista],
    ["sel", b.sel],
  ]
  return partes
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .join("&")
}

export function hrefDeBusqueda(ruta: string, b: Busqueda): string {
  const qs = escribirBusqueda(b)
  return qs ? `${ruta}?${qs}` : ruta
}
