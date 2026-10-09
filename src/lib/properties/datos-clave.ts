import type { Property } from "./types"

export type IconoDato =
  | "superficie"
  | "dormitorios"
  | "banos"
  | "ambientes"
  | "cocheras"
  | "antiguedad"

export type DatoClave = {
  valor: string
  etiqueta: string
  icono: IconoDato
}

const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 })

/**
 * Los datos que existen, en el orden de la ficha. Nunca un 0, un vacío ni un "—".
 * En un campo, las hectáreas reemplazan a los m².
 */
export function datosClave(p: Pick<
  Property,
  | "areaHa"
  | "areaTotalM2"
  | "areaCoveredM2"
  | "beds"
  | "baths"
  | "rooms"
  | "garages"
  | "ageYears"
>): DatoClave[] {
  const datos: DatoClave[] = []
  if (p.areaHa) {
    datos.push({ valor: `${numero.format(p.areaHa)} ha`, etiqueta: "hectáreas", icono: "superficie" })
  } else {
    if (p.areaTotalM2) {
      datos.push({ valor: `${numero.format(p.areaTotalM2)} m²`, etiqueta: "total", icono: "superficie" })
    }
    if (p.areaCoveredM2) {
      datos.push({ valor: `${numero.format(p.areaCoveredM2)} m²`, etiqueta: "cubierta", icono: "superficie" })
    }
  }
  if (p.beds) datos.push({ valor: String(p.beds), etiqueta: "dorm.", icono: "dormitorios" })
  if (p.baths) datos.push({ valor: String(p.baths), etiqueta: "baños", icono: "banos" })
  if (p.rooms) datos.push({ valor: String(p.rooms), etiqueta: "amb.", icono: "ambientes" })
  if (p.garages) datos.push({ valor: String(p.garages), etiqueta: "coch.", icono: "cocheras" })
  if (p.ageYears === 0) datos.push({ valor: "A estrenar", etiqueta: "antigüedad", icono: "antiguedad" })
  else if (p.ageYears) datos.push({ valor: String(p.ageYears), etiqueta: "años", icono: "antiguedad" })
  return datos.slice(0, 8)
}
