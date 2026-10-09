import Link from "next/link"
import type { ReactNode } from "react"
import { CaretLeft, House, Key, MapPin, SlidersHorizontal } from "@/components/iconos"
import {
  PASOS,
  etiquetaTipo,
  nombreZona,
  numeroDePaso,
  pasoAnterior,
  rutaDePaso,
  verboOperacion,
  type Busqueda,
  type Paso,
  type PasoEnBuscar,
} from "@/lib/busqueda"
import { cn } from "@/lib/utils"

/** "Casa, Casa quinta" o "Casa +2": entra en una línea. */
function lista(etiquetas: string[], maximo: number) {
  if (etiquetas.length <= maximo) return etiquetas.join(", ")
  return `${etiquetas.slice(0, maximo).join(", ")} +${etiquetas.length - maximo}`
}

const FASES: {
  id: Paso
  titulo: string
  detalle: string
  Icono: (props: { className?: string }) => ReactNode
}[] = [
  { id: "operacion", titulo: "Operación", detalle: "Comprar o alquilar", Icono: Key },
  { id: "tipo", titulo: "Tipo", detalle: "Casa, departamento, terreno", Icono: House },
  { id: "zona", titulo: "Zona", detalle: "Barrios y localidades", Icono: MapPin },
  { id: "detalles", titulo: "Detalles", detalle: "Precio y características", Icono: SlidersHorizontal },
]

/** Los cuatro pasos, como el alta: círculos a la izquierda en escritorio y centrados en el celu. */
export function PasosDeBusqueda({
  paso,
  busqueda,
  compacto = false,
  className,
}: {
  paso: PasoEnBuscar
  busqueda: Busqueda
  compacto?: boolean
  className?: string
}) {
  const actual = PASOS.indexOf(paso)

  return (
    <nav aria-label="Pasos de la búsqueda" className={className}>
      <ol className={cn(compacto ? "flex items-center justify-center" : "flex flex-col")}>
        {FASES.map((fase, indice) => {
          const hecho = indice < actual
          const esActual = indice === actual
          const bloqueado = indice > actual
          const linea = indice < actual
          const clase = cn(
            "flex text-left",
            compacto ? "size-11 items-center justify-center" : "min-h-11 w-full items-stretch gap-3 py-1",
            bloqueado && "cursor-default",
          )
          const marca = (
            <>
              <span className={cn("flex shrink-0 flex-col items-center", compacto ? undefined : "w-8")}>
                <Marca hecho={hecho} actual={esActual}>
                  <fase.Icono className="size-4" />
                </Marca>
                {compacto || indice === FASES.length - 1 ? null : (
                  <span aria-hidden className={cn("mt-1 w-px flex-1", linea ? "bg-plano-700" : "bg-linea")} />
                )}
              </span>
              {compacto ? null : (
                <span className="min-w-0 py-1 pr-2 pb-4">
                  <span className={cn("block text-sm font-semibold", esActual || hecho ? "text-tinta" : "text-tinta-suave")}>
                    {fase.titulo}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-tinta-suave">{fase.detalle}</span>
                </span>
              )}
            </>
          )

          return (
            <li key={fase.id} className={cn("flex", compacto ? "items-center" : undefined)}>
              {bloqueado ? (
                <span aria-disabled="true" className={clase}>
                  {marca}
                </span>
              ) : (
                <Link
                  href={rutaDePaso(fase.id, busqueda)}
                  aria-current={esActual ? "step" : undefined}
                  aria-label={fase.titulo}
                  className={clase}
                >
                  {marca}
                </Link>
              )}
              {compacto && indice < FASES.length - 1 ? (
                <span aria-hidden className={cn("h-px w-3", linea ? "bg-plano-700" : "bg-linea")} />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** ‹ y, en escritorio, lo elegido. En el celu los íconos van aparte, centrados. */
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
    <header>
      <div className="mx-auto flex h-14 w-full max-w-xl items-center gap-1 pr-4 pl-1">
        <Link
          href={rutaDePaso(anterior, busqueda)}
          aria-label="Volver al paso anterior"
          className="grid size-11 shrink-0 place-items-center rounded-control text-tinta hover:bg-papel"
        >
          <CaretLeft className="size-6" aria-hidden="true" />
        </Link>
        <p className="hidden min-w-0 flex-1 truncate font-semibold lg:block">{resumen}</p>
        <p className="hidden shrink-0 text-sm text-tinta-suave tabular-nums lg:block">
          {n} de {PASOS.length}
        </p>
      </div>
    </header>
  )
}

function Marca({
  hecho,
  actual,
  children,
}: {
  hecho: boolean
  actual: boolean
  children: ReactNode
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full border",
        hecho && "border-plano-700 bg-plano-700 text-blanco",
        actual && !hecho && "border-plano-700 bg-blanco text-tinta",
        !hecho && !actual && "border-linea bg-blanco text-tinta-suave",
      )}
    >
      {children}
    </span>
  )
}
