import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { ResumenDeInmobiliaria } from "@/lib/agencies/resumen"
import { CarruselHorizontal, ItemDeCarrusel } from "./carrusel-horizontal"
import { Seccion } from "./seccion"

function Conteo({ r }: { r: ResumenDeInmobiliaria }) {
  const partes = [
    r.venta > 0 ? `${r.venta} en venta` : null,
    r.alquiler > 0 ? `${r.alquiler} en alquiler` : null,
  ].filter(Boolean)
  return <span className="text-sm text-tinta-suave tabular-nums">{partes.join(" · ")}</span>
}

/** Quién publica: genera confianza y lleva a contactar a la que uno ya conoce. */
export function Inmobiliarias({ inmobiliarias }: { inmobiliarias: ResumenDeInmobiliaria[] }) {
  if (inmobiliarias.length === 0) return null
  return (
    <Seccion
      id="inmobiliarias"
      titulo="Inmobiliarias de Bolívar"
      bajada="Todas las propiedades las publican ellas: consultás directo."
    >
      <CarruselHorizontal etiqueta="Inmobiliarias">
        {inmobiliarias.map((r) => (
          <ItemDeCarrusel key={r.id} className="w-64">
            <Link
              href={`/inmobiliarias#${r.id}`}
              className="flex w-full flex-col gap-3 rounded-tarjeta border border-linea bg-blanco p-4 transition-colors hover:border-tinta-suave"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- logos SVG chicos */}
              <img src={r.logo} alt="" width={48} height={48} loading="lazy" className="size-12 rounded-full border border-linea object-cover" />
              <span className="flex flex-col gap-0.5">
                <span className="leading-tight font-semibold">{r.nombre}</span>
                <span className="truncate text-sm text-tinta-suave">{r.direccion}</span>
              </span>
              <Conteo r={r} />
            </Link>
          </ItemDeCarrusel>
        ))}
      </CarruselHorizontal>
      <div className="px-4 pt-3">
        <Link
          href="/inmobiliarias"
          className="inline-flex min-h-11 items-center gap-0.5 font-semibold text-plano-700 hover:underline hover:underline-offset-4"
        >
          Ver todas las inmobiliarias <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </Seccion>
  )
}
