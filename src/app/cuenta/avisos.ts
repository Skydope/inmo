import { nombreZona } from "@/lib/busqueda/taxonomia"
import { formatPrice } from "@/lib/format"
import { SEED_PROPERTIES } from "@/lib/properties/seed"

/** Tres avisos fijos de Norte. Los números salen del seed; no hay visitas ni porcentajes. */
export type EstadoDeAviso = "publicado" | "borrador"

export type AvisoDeCuenta = {
  id: string
  titulo: string
  precio: string
  zona: string
  foto: string
  estado: EstadoDeAviso
}

function aviso(id: string, estado: EstadoDeAviso): AvisoDeCuenta {
  const propiedad = SEED_PROPERTIES.find((item) => item.id === id)
  if (!propiedad) throw new Error(`Aviso de cuenta sin seed: ${id}`)
  return {
    id: propiedad.id,
    titulo: propiedad.title,
    precio: formatPrice(propiedad.price, propiedad.currency),
    zona: nombreZona(propiedad.zone),
    foto: propiedad.photos[0] ?? "",
    estado,
  }
}

export const AVISOS_DE_CUENTA: AvisoDeCuenta[] = [
  aviso("bol-01", "publicado"),
  aviso("bol-03", "publicado"),
  aviso("bol-15", "borrador"),
]
