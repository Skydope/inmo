import Link from "next/link"
import type { ZonaConConteo } from "@/lib/inicio"
import { Seccion } from "./seccion"

export function PorZona({ zonas }: { zonas: ZonaConConteo[] }) {
  if (zonas.length === 0) return null
  return (
    <Seccion id="por-zona" titulo="Por zona">
      <ul className="flex flex-wrap gap-2 px-4">
        {zonas.map((z) => (
          <li key={z.zona}>
            <Link
              href={z.href}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-linea bg-blanco px-4 font-semibold transition-colors hover:border-tinta-suave"
            >
              {z.nombre}
              <span className="text-sm font-normal text-tinta-suave tabular-nums">{z.cantidad}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Seccion>
  )
}
