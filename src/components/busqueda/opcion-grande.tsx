import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Una fila de la tarjeta del inicio: Comprar, Alquilar, Alquiler temporario. Es un link: un
 * toque y se pasa al paso 2, sin "Continuar". Con 0 propiedades no es link y lo dice.
 */
export function OpcionGrande({
  href,
  titulo,
  ayuda,
  icono,
  conteo,
  chica = false,
}: {
  href: string
  titulo: string
  ayuda?: string
  icono?: React.ReactNode
  conteo: number
  chica?: boolean
}) {
  const vacia = conteo === 0
  const contenido = (
    <>
      {icono ? (
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-control bg-plano-50 text-plano-700 [&_svg]:size-6 [&_svg]:stroke-[1.75]"
        >
          {icono}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn(chica ? "text-base font-semibold" : "text-2xl leading-none font-titulo")}>
          {titulo}
        </span>
        {ayuda || vacia ? (
          <span className={cn("text-sm text-tinta-suave", !chica && "mt-1")}>
            {vacia ? "Sin propiedades por ahora" : ayuda}
          </span>
        ) : null}
      </span>
      {vacia ? null : (
        <span className="flex shrink-0 items-center gap-1 text-sm text-tinta-suave tabular-nums">
          <span>
            {conteo}
            <span className="sr-only"> propiedades</span>
          </span>
          <ChevronRight className="size-5" aria-hidden="true" />
        </span>
      )}
    </>
  )

  const clases = cn(
    "flex items-center gap-4 px-4 text-tinta",
    chica ? "min-h-12 py-2" : "min-h-22 py-4"
  )

  if (vacia) return <div className={cn(clases, "opacity-60")}>{contenido}</div>
  return (
    <Link href={href} className={cn(clases, "transition-colors hover:bg-papel active:bg-plano-50")}>
      {contenido}
    </Link>
  )
}
