import Link from "next/link"
import { ChevronRight, X } from "lucide-react"
import type { Sugerencia } from "@/lib/busqueda"

/** "Casas en venta" → "casas en venta"; "PH en venta" queda igual. */
const enMinuscula = (titulo: string) =>
  /^\p{Lu}\p{Ll}/u.test(titulo) ? titulo.charAt(0).toLowerCase() + titulo.slice(1) : titulo

/**
 * Cuando la búsqueda da 0: nunca un callejón sin salida. Qué filtro sacar (con cuántas
 * aparecerían) y, si hace falta, volver a todas las de la operación.
 */
export function SinResultados({
  titulo,
  sugerencias,
  hrefDe,
  todas,
}: {
  titulo: string
  sugerencias: Sugerencia[]
  hrefDe: (s: Sugerencia) => string
  todas?: { href: string; texto: string }
}) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-8 pb-12 sm:max-w-none">
      <p className="text-xl leading-snug font-titulo text-balance">No hay {enMinuscula(titulo)} con esos filtros.</p>
      {sugerencias.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-tinta-suave">Probá sacando:</p>
          <ul className="flex flex-wrap gap-2">
            {sugerencias.map((s) => (
              <li key={s.clave}>
                <Link
                  href={hrefDe(s)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-linea bg-blanco px-3 text-sm font-semibold hover:border-tinta-suave"
                >
                  {s.etiqueta} <X className="size-4" aria-hidden="true" />
                  <span className="text-tinta-suave tabular-nums">· {s.conteo}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {todas ? (
        <Link href={todas.href} className="inline-flex min-h-11 w-fit items-center gap-1 font-semibold text-plano-700">
          {todas.texto} <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}
