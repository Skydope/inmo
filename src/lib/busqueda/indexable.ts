import type { Busqueda } from "./parametros"

/**
 * Qué páginas de resultados se dejan indexar: las simples (a lo sumo una operación, un tipo y
 * una zona, sin más filtros ni orden). Las combinaciones raras son páginas casi vacías y
 * repetidas: van con noindex y canónica.
 */
export function esIndexable(b: Busqueda): boolean {
  return (
    b.tipos.length <= 1 &&
    b.zonas.length <= 1 &&
    b.dorm === undefined &&
    b.banos === undefined &&
    b.desde === undefined &&
    b.hasta === undefined &&
    b.con.length === 0 &&
    b.orden === "recientes"
  )
}
