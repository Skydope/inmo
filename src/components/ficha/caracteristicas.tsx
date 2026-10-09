import { etiquetaCaracteristica } from "@/lib/busqueda"
import type { Property } from "@/lib/properties/types"

export function Caracteristicas({ propiedad }: { propiedad: Property }) {
  if (propiedad.features.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-2">
      {propiedad.features.map((caracteristica) => (
        <li key={caracteristica} className="rounded-full border border-linea bg-blanco px-3 py-1.5 text-sm">
          {etiquetaCaracteristica(caracteristica)}
        </li>
      ))}
    </ul>
  )
}
