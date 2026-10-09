import { hrefDeBusqueda, type Busqueda } from "./parametros"

/** El buscador guiado: una pregunta por pantalla, cada una con su URL. */
export const PASOS = ["operacion", "tipo", "zona", "detalles"] as const
export type Paso = (typeof PASOS)[number]

/** Los pasos que viven en `/buscar/[paso]` (el primero es el inicio). */
export const PASOS_EN_BUSCAR = ["tipo", "zona", "detalles"] as const
export type PasoEnBuscar = (typeof PASOS_EN_BUSCAR)[number]

export const esPasoEnBuscar = (x: string): x is PasoEnBuscar =>
  (PASOS_EN_BUSCAR as readonly string[]).includes(x)

export function pasoSiguiente(paso: Paso): Paso | "resultados" {
  const i = PASOS.indexOf(paso)
  return PASOS[i + 1] ?? "resultados"
}

export function pasoAnterior(paso: Paso): Paso | null {
  const i = PASOS.indexOf(paso)
  return i > 0 ? PASOS[i - 1] : null
}

/** 1 a 4, para el "2 de 4" de la barra de paso. */
export const numeroDePaso = (paso: Paso) => PASOS.indexOf(paso) + 1

export function rutaDePaso(paso: Paso | "resultados", b: Busqueda): string {
  if (paso === "operacion") return "/"
  if (paso === "resultados") return hrefDeBusqueda("/propiedades", { ...b, vista: "mapa", sel: undefined })
  return hrefDeBusqueda(`/buscar/${paso}`, { ...b, vista: "mapa", sel: undefined })
}

/** Sin operación elegida, solo se puede estar en el primer paso. */
export function pasoAccesible(paso: Paso, b: Busqueda): boolean {
  return paso === "operacion" || b.operacion !== undefined
}
