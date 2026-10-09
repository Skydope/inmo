import Link from "next/link"
import type { ZonaConConteo } from "@/lib/inicio"
import { CarruselHorizontal } from "./carrusel-horizontal"
import { Seccion } from "./seccion"

/** Las zonas con propiedades, en dos filas que se deslizan (no una pared de chips). */
export function PorZona({ zonas }: { zonas: ZonaConConteo[] }) {
  if (zonas.length === 0) return null
  return (
    <Seccion id="por-zona" titulo="Por zona">
      <CarruselHorizontal etiqueta="Zonas" className="[&>ul]:grid [&>ul]:grid-flow-col [&>ul]:grid-rows-2 [&>ul]:gap-2">
        {zonas.map((z) => (
          <li key={z.zona} className="snap-start">
            <Link
              href={z.href}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-linea bg-blanco px-4 font-semibold whitespace-nowrap transition-colors hover:border-tinta-suave"
            >
              {z.nombre}
              <span className="text-sm font-normal text-tinta-suave tabular-nums">{z.cantidad}</span>
            </Link>
          </li>
        ))}
      </CarruselHorizontal>
    </Seccion>
  )
}
