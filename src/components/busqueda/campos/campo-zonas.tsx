import Link from "next/link"
import { Opcion } from "@/components/ui/opcion"
import { GRUPOS_DE_ZONA, nombreZona, zonasDelGrupo, type Zona } from "@/lib/busqueda"
import { cn } from "@/lib/utils"
import { BotonTodoBolivar } from "./boton-todo-bolivar"

/**
 * Las zonas agrupadas, con el conteo para lo que ya se eligió. Las zonas sin propiedades no
 * se muestran (salvo que vengan elegidas). "Todo Bolívar" limpia la selección: es un link al
 * mismo paso sin zonas, así también anda sin JavaScript.
 */
export function CampoZonas({
  elegidas,
  conteo,
  hrefTodo,
  total,
  modo = "link",
}: {
  elegidas: Zona[]
  conteo: Record<string, number>
  /** Solo en modo "link" (el paso del buscador). */
  hrefTodo?: string
  total: number
  /** "link": navega (anda sin JS). "boton": desmarca en el lugar (la hoja de filtros). */
  modo?: "link" | "boton"
}) {
  const todo = elegidas.length === 0
  return (
    <div className="flex flex-col gap-5">
      {modo === "boton" || !hrefTodo ? (
        <BotonTodoBolivar activo={todo} total={total} />
      ) : (
      <Link
        href={hrefTodo}
        aria-current={todo ? "true" : undefined}
        className={cn(
          "inline-flex min-h-11 w-fit items-center gap-2 rounded-full border px-4 font-semibold",
          todo ? "border-plano-700 bg-plano-700 text-blanco" : "border-linea bg-blanco hover:border-tinta-suave"
        )}
      >
        Todo Bolívar{" "}
        <span className={cn("text-sm font-normal tabular-nums", todo ? "text-blanco" : "text-tinta-suave")}>
          {total}
        </span>
      </Link>
      )}

      {GRUPOS_DE_ZONA.map((grupo) => {
        const zonas = zonasDelGrupo(grupo.slug).filter(
          (z) => (conteo[z] ?? 0) > 0 || elegidas.includes(z)
        )
        if (zonas.length === 0) return null
        return (
          <section key={grupo.slug} aria-label={grupo.nombre} className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-tinta-suave">{grupo.nombre}</h2>
            <div className="flex flex-wrap gap-2">
              {zonas.map((zona) => (
                <Opcion
                  key={zona}
                  variante="chip"
                  name="zona"
                  value={zona}
                  etiqueta={nombreZona(zona)}
                  conteo={conteo[zona] ?? 0}
                  defaultChecked={elegidas.includes(zona)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
