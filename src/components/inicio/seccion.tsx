import Link from "next/link"
import { CaretRight } from "@/components/iconos"
import { cn } from "@/lib/utils"

/** Una sección del inicio: título, una bajada opcional y "Ver todas ›" a la derecha. */
export function Seccion({
  id,
  titulo,
  bajada,
  ver,
  children,
  className,
}: {
  id: string
  titulo: string
  bajada?: string
  ver?: { href: string; texto: string }
  children: React.ReactNode
  className?: string
}) {
  return (
    <section aria-labelledby={id} className={cn("mx-auto w-full max-w-6xl pt-8 md:pt-14", className)}>
      <div className="flex items-center justify-between gap-4 px-4 pb-3">
        <div className="min-w-0">
          <h2 id={id} className="text-[1.375rem] leading-tight font-titulo md:text-2xl">
            {titulo}
          </h2>
          {bajada ? <p className="mt-1 text-sm text-tinta-suave">{bajada}</p> : null}
        </div>
        {ver ? (
          <Link
            href={ver.href}
            className="inline-flex min-h-11 shrink-0 items-center gap-0.5 text-sm font-semibold text-plano-700 hover:underline hover:underline-offset-4"
          >
            {ver.texto} <CaretRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  )
}
