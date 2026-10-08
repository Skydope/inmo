import { filtrarPropiedades, type Filtrable } from "./filtrar"
import type { Busqueda } from "./parametros"
import { chipsDeBusqueda, type Chip } from "./resumen"
import { OPERACIONES, TIPOS, ZONAS, tiposDe } from "./taxonomia"

type Campo = "operacion" | "tipo" | "zona"

/**
 * Para cada opción de un campo, cuántas propiedades habría eligiendo **solo esa** en ese
 * campo, con el resto de la búsqueda igual. Es el número de las opciones del buscador
 * ("Comprar 48", "Casa 12", "Centro 7"). Un tipo que no aplica a la operación cuenta 0.
 */
export function contarPorOpcion(
  props: readonly Filtrable[],
  b: Busqueda,
  campo: Campo
): Record<string, number> {
  const conteo: Record<string, number> = {}
  if (campo === "operacion") {
    for (const { slug } of OPERACIONES) {
      conteo[slug] = filtrarPropiedades(props, { ...b, operacion: slug }).length
    }
  } else if (campo === "tipo") {
    const aplican = new Set(tiposDe(b.operacion))
    for (const { slug } of TIPOS) {
      conteo[slug] = aplican.has(slug) ? filtrarPropiedades(props, { ...b, tipos: [slug] }).length : 0
    }
  } else {
    for (const { slug } of ZONAS) {
      conteo[slug] = filtrarPropiedades(props, { ...b, zonas: [slug] }).length
    }
  }
  return conteo
}

export function contarResultados(props: readonly Filtrable[], b: Busqueda): number {
  return filtrarPropiedades(props, b).length
}

export type Sugerencia = Chip & { conteo: number }

/**
 * Cuando una búsqueda da 0: por cada filtro, cuántas aparecen si se saca **solo ese**. De más
 * a menos, sin los que igual dan 0. Así nunca hay un callejón sin salida.
 */
export function sugerenciasSinResultados(props: readonly Filtrable[], b: Busqueda): Sugerencia[] {
  return chipsDeBusqueda(b)
    .map((chip) => ({ ...chip, conteo: contarResultados(props, chip.sin) }))
    .filter((s) => s.conteo > 0)
    .sort((a, c) => c.conteo - a.conteo)
}
