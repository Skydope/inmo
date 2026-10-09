import Link from "next/link"
import type { ReactNode } from "react"
import { House, SignOut, Storefront } from "@/components/iconos"
import { Logo } from "@/components/marca/logo"
import { brandName } from "@/lib/brand"
import { cn } from "@/lib/utils"

const AGENCIA = "Norte Propiedades"

/** Cascarón de la cuenta ya abierta. En 360 px no hay riel: una sola columna. */
export function Panel({
  seccion,
  avisosHref,
  titulo,
  detalle = AGENCIA,
  accion,
  children,
}: {
  seccion: "avisos" | "datos"
  avisosHref: string
  titulo: string
  detalle?: string
  accion?: ReactNode
  children: ReactNode
}) {
  const items = [
    { id: "avisos" as const, href: avisosHref, label: "Avisos", Icono: House },
    { id: "datos" as const, href: "/cuenta/datos", label: "Datos", Icono: Storefront },
  ]

  return (
    <div className="min-h-dvh bg-papel lg:p-4">
      <div className="flex min-h-dvh flex-col lg:min-h-[calc(100dvh-2rem)] lg:flex-row lg:overflow-hidden lg:rounded-hoja lg:border lg:border-linea lg:bg-blanco">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-linea px-3 py-5 lg:flex">
          <Link
            href="/"
            aria-label={`${brandName}, ir al inicio`}
            className="inline-flex min-h-11 items-center px-3"
          >
            <Logo />
          </Link>
          <p className="mt-6 truncate px-3 text-sm text-tinta-suave">{AGENCIA}</p>
          <nav className="mt-4 flex flex-col gap-1" aria-label="Cuenta">
            {items.map((item) => {
              const activo = item.id === seccion
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-control px-3 text-base font-semibold",
                    activo ? "bg-papel text-tinta" : "text-tinta-suave hover:bg-papel hover:text-tinta",
                  )}
                >
                  <item.Icono className="size-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <Link
            href="/ingresar"
            className="mt-auto flex min-h-11 items-center gap-3 rounded-control px-3 text-base font-semibold text-tinta-suave hover:bg-papel hover:text-tinta"
          >
            <SignOut className="size-5" />
            Salir
          </Link>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col px-4 py-2 lg:px-8 lg:py-8">
          <header className="flex h-14 items-center justify-between lg:hidden">
            <Link href="/" aria-label={`${brandName}, ir al inicio`} className="inline-flex min-h-11 items-center">
              <Logo />
            </Link>
            <Link href="/ingresar" className="inline-flex min-h-11 items-center text-base font-semibold">
              Salir
            </Link>
          </header>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-4xl font-titulo">{titulo}</h1>
              {detalle ? <p className="mt-2 text-base text-tinta-suave">{detalle}</p> : null}
            </div>
            {accion}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
