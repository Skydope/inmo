import Link from "next/link"
import { List, Map as MapIcono, SlidersHorizontal } from "lucide-react"
import type { Vista } from "@/lib/busqueda"
import { cn } from "@/lib/utils"

/**
 * Lista / Mapa y el botón de filtros. Son links: sin JavaScript navegan; con JavaScript se
 * interceptan y cambian la vista sin pedir nada al servidor.
 */
export function SelectorDeVista({
  vista,
  hrefLista,
  hrefMapa,
  onCambiar,
  hrefFiltros,
  onFiltros,
  filtros,
}: {
  vista: Vista
  hrefLista: string
  hrefMapa: string
  onCambiar: (vista: Vista) => void
  hrefFiltros: string
  onFiltros?: () => void
  filtros: number
}) {
  const opcion = (v: Vista, href: string, Icono: typeof List, texto: string) => (
    <Link
      href={href}
      replace
      scroll={false}
      aria-current={vista === v ? "page" : undefined}
      onClick={(e) => {
        e.preventDefault()
        onCambiar(v)
      }}
      className={cn(
        "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[0.6rem] font-semibold transition-colors",
        vista === v ? "bg-blanco text-tinta shadow-sm" : "text-tinta-suave hover:text-tinta"
      )}
    >
      <Icono className="size-5" aria-hidden="true" />
      {texto}
    </Link>
  )

  return (
    <div className="mx-auto flex w-full max-w-xl items-center gap-2 px-4 pt-3 lg:hidden">
      <nav aria-label="Cómo ver los resultados" className="flex flex-1 gap-1 rounded-control bg-linea/70 p-1">
        {opcion("lista", hrefLista, List, "Lista")}
        {opcion("mapa", hrefMapa, MapIcono, "Mapa")}
      </nav>
      <Link
        href={hrefFiltros}
        onClick={(e) => {
          if (!onFiltros) return
          e.preventDefault()
          onFiltros()
        }}
        className="relative inline-flex min-h-[3.25rem] items-center gap-2 rounded-control border border-linea bg-blanco px-3.5 font-semibold"
      >
        <SlidersHorizontal className="size-5" aria-hidden="true" />
        Filtros
        {filtros > 0 ? (
          <span className="grid size-5 place-items-center rounded-full bg-plano-700 text-xs text-blanco tabular-nums">
            {filtros}
            <span className="sr-only"> activos</span>
          </span>
        ) : null}
      </Link>
    </div>
  )
}
