import Link from "next/link"
import { Logo } from "@/components/marca/logo"
import { brandName } from "@/lib/brand"

const ENLACES = [
  { href: "/", texto: "Buscar" },
  { href: "/propiedades?vista=mapa", texto: "Mapa" },
  { href: "/inmobiliarias", texto: "Inmobiliarias" },
  { href: "/ingresar", texto: "Ingresar" },
] as const

export function Pie() {
  return (
    <footer className="mt-auto border-t border-linea bg-blanco">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8">
        <Logo className="text-lg" />
        <p className="max-w-sm text-sm text-tinta-suave">
          Las propiedades de las inmobiliarias de Bolívar, en un solo lugar.
        </p>
        <nav aria-label="Pie" className="flex flex-wrap gap-x-1 gap-y-1">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="inline-flex min-h-11 items-center rounded-control px-2 text-sm font-semibold text-tinta hover:bg-papel"
            >
              {enlace.texto}
            </Link>
          ))}
        </nav>
        <p className="text-[0.8125rem] text-tinta-suave">© 2026 {brandName}</p>
      </div>
    </footer>
  )
}
