import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import {
  PASOS,
  etiquetaTipo,
  nombreZona,
  numeroDePaso,
  pasoAnterior,
  rutaDePaso,
  verboOperacion,
  type Busqueda,
  type PasoEnBuscar,
} from "@/lib/busqueda"

/** "Casa, Casa quinta" o "Casa +2": entra en una línea. */
function lista(etiquetas: string[], maximo: number) {
  if (etiquetas.length <= maximo) return etiquetas.join(", ")
  return `${etiquetas.slice(0, maximo).join(", ")} +${etiquetas.length - maximo}`
}

/** Reemplaza al header en los pasos 2 a 4: volver, lo elegido hasta acá y el progreso. */
export function BarraDePaso({ paso, busqueda }: { paso: PasoEnBuscar; busqueda: Busqueda }) {
  const anterior = pasoAnterior(paso) ?? "operacion"
  const n = numeroDePaso(paso)
  const resumen = [
    busqueda.operacion ? verboOperacion(busqueda.operacion) : null,
    busqueda.tipos.length ? lista(busqueda.tipos.map((t) => etiquetaTipo(t)), 2) : null,
    busqueda.zonas.length && paso === "detalles" ? lista(busqueda.zonas.map(nombreZona), 1) : null,
  ]
    .filter(Boolean)
    .join(" · ")

  return (
    <header className="sticky top-0 z-30 border-b border-linea bg-blanco">
      <div className="mx-auto flex h-14 max-w-xl items-center gap-1 pr-4 pl-1">
        <Link
          href={rutaDePaso(anterior, busqueda)}
          aria-label="Volver al paso anterior"
          className="grid size-11 shrink-0 place-items-center rounded-control text-tinta hover:bg-papel"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </Link>
        <p className="min-w-0 flex-1 truncate font-semibold">{resumen}</p>
        <p className="shrink-0 text-sm text-tinta-suave tabular-nums">
          {n} de {PASOS.length}
        </p>
      </div>
      <div
        className="h-1 bg-linea"
        role="progressbar"
        aria-label="Avance de la búsqueda"
        aria-valuemin={1}
        aria-valuemax={PASOS.length}
        aria-valuenow={n}
      >
        <div className="h-full bg-plano-700" style={{ width: `${(n / PASOS.length) * 100}%` }} />
      </div>
    </header>
  )
}
