import { Bathtub, Bed, Calendar, Car, House, Ruler, type IconProps } from "@/components/iconos"
import { datosClave, type IconoDato } from "@/lib/properties/datos-clave"
import type { Property } from "@/lib/properties/types"

const ICONOS: Record<IconoDato, React.ComponentType<IconProps>> = {
  superficie: Ruler,
  dormitorios: Bed,
  banos: Bathtub,
  ambientes: House,
  cocheras: Car,
  antiguedad: Calendar,
}

export function DatosClave({ propiedad }: { propiedad: Property }) {
  const datos = datosClave(propiedad)
  if (datos.length === 0) return null
  return (
    <ul className="grid grid-cols-4 gap-y-3 rounded-tarjeta bg-blanco px-2 py-3">
      {datos.map((dato) => {
        const Icono = ICONOS[dato.icono]
        return (
          <li key={`${dato.icono}-${dato.etiqueta}`} className="flex flex-col items-center gap-0.5 px-1 text-center">
            <Icono className="size-4 text-tinta-suave" aria-hidden="true" />
            <span className="font-titulo text-lg leading-tight tabular-nums">{dato.valor}</span>
            <span className="text-xs text-tinta-suave">{dato.etiqueta}</span>
          </li>
        )
      })}
    </ul>
  )
}
