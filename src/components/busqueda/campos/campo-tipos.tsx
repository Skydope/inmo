import { IconoTipo } from "@/components/busqueda/icono-tipo"
import { Opcion } from "@/components/ui/opcion"
import { etiquetaTipo, tiposDe, type Operacion, type TipoPropiedad } from "@/lib/busqueda"

/**
 * Los tipos de la operación, lo más buscado primero. Un tipo sin avisos va al final,
 * atenuado y sin poder elegirse. Se puede elegir más de uno.
 */
export function CampoTipos({
  operacion,
  elegidos,
  conteo,
  variante = "tarjeta",
}: {
  operacion: Operacion | undefined
  elegidos: TipoPropiedad[]
  conteo: Record<string, number>
  variante?: "tarjeta" | "chip"
}) {
  const tipos = tiposDe(operacion)
  const conAvisos = tipos.filter((t) => (conteo[t] ?? 0) > 0 || elegidos.includes(t))
  const sinAvisos = tipos.filter((t) => !conAvisos.includes(t))

  return (
    <div className={variante === "tarjeta" ? "grid grid-cols-2 gap-2.5" : "flex flex-wrap gap-2"}>
      {[...conAvisos, ...sinAvisos].map((tipo) => {
        const vacio = sinAvisos.includes(tipo)
        return (
          <Opcion
            key={tipo}
            variante={variante}
            name="tipo"
            value={tipo}
            etiqueta={etiquetaTipo(tipo)}
            icono={<IconoTipo tipo={tipo} />}
            conteo={vacio ? undefined : conteo[tipo]}
            ayuda={vacio && variante === "tarjeta" ? "Sin avisos ahora" : undefined}
            defaultChecked={elegidos.includes(tipo)}
            disabled={vacio}
          />
        )
      })}
    </div>
  )
}
