import { Opcion } from "@/components/ui/opcion"
import {
  caracteristicasDe,
  etiquetaCaracteristica,
  type Caracteristica,
  type Operacion,
} from "@/lib/busqueda"

/** "Que tenga": cochera, pileta… Solo las que aplican a la operación. Todas a la vez (Y). */
export function CampoCaracteristicas({
  operacion,
  elegidas,
}: {
  operacion: Operacion | undefined
  elegidas: Caracteristica[]
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-semibold">Que tenga</h2>
      <div className="flex flex-wrap gap-2">
        {caracteristicasDe(operacion).map((c) => (
          <Opcion
            key={c}
            variante="chip"
            name="con"
            value={c}
            etiqueta={etiquetaCaracteristica(c)}
            defaultChecked={elegidas.includes(c)}
          />
        ))}
      </div>
    </div>
  )
}
