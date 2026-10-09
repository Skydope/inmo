import Image from "next/image"
import Link from "next/link"
import { IconoTipo } from "@/components/busqueda/icono-tipo"
import type { Bento as FormaDelBento, Categoria } from "@/lib/inicio"
import { cn } from "@/lib/utils"
import { Seccion } from "./seccion"

function Celda({ c, grande, dosGrandes }: { c: Categoria; grande: boolean; dosGrandes: boolean }) {
  const propiedades = `${c.cantidad} ${c.cantidad === 1 ? "propiedad" : "propiedades"}`
  return (
    <li className={cn("min-w-0", grande && "col-span-2", grande && !dosGrandes && "lg:row-span-2")}>
      <Link
        href={c.href}
        aria-label={`${c.titulo}, ${propiedades}`}
        className="group flex h-full flex-col overflow-hidden rounded-control border border-linea bg-blanco transition-colors hover:border-tinta-suave"
      >
        {/* La foto a sangre arriba; la franja blanca con el texto abajo: nada escrito sobre la foto. */}
        <span
          className={cn(
            "relative block w-full bg-papel",
            grande ? "aspect-[2/1]" : "aspect-[4/3]",
            grande && !dosGrandes && "lg:aspect-auto lg:flex-1"
          )}
        >
          {c.foto ? (
            <Image
              src={c.foto}
              alt=""
              fill
              sizes={grande ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 270px, 50vw"}
              className="object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
          ) : (
            <span className="grid size-full place-items-center text-tinta-suave">
              <IconoTipo tipo={c.tipo} className="size-10" />
            </span>
          )}
        </span>
        <span className="flex min-h-12 items-center justify-between gap-2 px-3 py-2">
          <span className="truncate text-[0.9375rem] leading-tight font-semibold">{c.titulo}</span>
          <span className="shrink-0 text-sm text-tinta-suave tabular-nums">{c.cantidad}</span>
        </span>
      </Link>
    </li>
  )
}

/**
 * "Buscá por tipo" como bento (spec inicio-v2): la categoría con más propiedades a lo ancho,
 * cuatro chicas debajo; en escritorio la grande ocupa 2 × 2 a la izquierda. La forma la decide
 * `formaDelBento` (sin huecos). Lo que queda afuera, en "Ver todos los tipos".
 */
export function Bento({ bento }: { bento: FormaDelBento | null }) {
  if (!bento) return null
  const { grandes, chicas, restantes } = bento
  const dosGrandes = grandes.length === 2
  return (
    <Seccion
      id="por-tipo"
      titulo="Buscá por tipo"
      ver={restantes > 0 ? { href: "/propiedades", texto: "Ver todos los tipos" } : undefined}
    >
      <ul aria-label="Tipos de propiedad" className="grid grid-cols-2 gap-2 px-4 lg:grid-cols-4 lg:gap-3">
        {grandes.map((c) => (
          <Celda key={`${c.operacion}-${c.tipo}`} c={c} grande dosGrandes={dosGrandes} />
        ))}
        {chicas.map((c) => (
          <Celda key={`${c.operacion}-${c.tipo}`} c={c} grande={false} dosGrandes={dosGrandes} />
        ))}
      </ul>
    </Seccion>
  )
}
