/**
 * Las clases de un pin del mapa. Conserva las de MapLibre (posicionamiento) al cambiar de
 * estado: elegido o lejos (con el mapa alejado, los pines no elegidos son puntos).
 */
export function markerElementClass(current: string, type: string, selected: boolean) {
  const lib = current.split(/\s+/).filter((name) => name.startsWith("maplibregl-"))
  const own = ["map-pin", `is-${type}`]
  if (selected) own.push("is-selected")
  return [...own, ...lib].join(" ")
}
