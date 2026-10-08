import Link from "next/link"
import { ChevronRight, Map as MapIcono, X } from "lucide-react"
import type { Sugerencia } from "@/lib/busqueda"
import { hrefDeBusqueda } from "@/lib/busqueda"

/** La última tarjeta del carrusel: no hay más, pero se puede ampliar o ir al mapa. */
export function FinDeResultados({
  total,
  ampliar,
  hrefMapa,
}: {
  total: number
  ampliar: Sugerencia[]
  hrefMapa: string
}) {
  return (
    <div className="flex w-full flex-col justify-center gap-4 rounded-tarjeta border border-dashed border-linea bg-blanco p-6">
      <p className="text-xl font-titulo">
        Viste {total === 1 ? "la única propiedad" : `las ${total} propiedades`}.
      </p>
      {ampliar.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-tinta-suave">Probá ampliando:</p>
          <ul className="flex flex-wrap gap-2">
            {ampliar.map((s) => (
              <li key={s.clave}>
                <Link
                  href={hrefDeBusqueda("/propiedades", s.sin)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-linea px-3 text-sm font-semibold hover:border-tinta-suave"
                >
                  {s.etiqueta} <X className="size-4" aria-hidden="true" />
                  <span className="text-tinta-suave tabular-nums">· {s.conteo}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <Link href={hrefMapa} className="inline-flex min-h-11 w-fit items-center gap-2 font-semibold text-plano-700">
        <MapIcono className="size-5" aria-hidden="true" /> Verlas en el mapa
        <ChevronRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  )
}
