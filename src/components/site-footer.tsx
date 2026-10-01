import Link from "next/link"
import { brandName } from "@/lib/brand"

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Catálogo" },
  { href: "/propiedades?type=house", label: "Casas" },
  { href: "/propiedades?type=apartment", label: "Departamentos" },
  { href: "/propiedades?op=rent", label: "Alquiler" },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-glass-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl tracking-tight text-fg">
            {brandName}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-fg-muted">
            Portal inmobiliario local de San Carlos de Bolívar, Buenos Aires.
          </p>
        </div>
        <nav aria-label="Pie de página" className="flex flex-col gap-2 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="text-fg-muted transition hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-sm sm:text-right">
          <a
            href="mailto:hola@inmo.local"
            className="text-fg-muted transition hover:text-fg"
          >
            hola@inmo.local
          </a>
          <p className="text-xs text-fg-muted">
            © {new Date().getFullYear()} {brandName} · Hecho en Bolívar
          </p>
        </div>
      </div>
    </footer>
  )
}
