import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

const links = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "/propiedades", label: "Catálogo" },
  { href: "/propiedades?op=sale", label: "Ofertas" },
  { href: "#agentes", label: "Agentes" },
]

export function LandingNav() {
  return (
    <div className="relative flex items-center justify-end gap-2 md:gap-3">
      <nav
        aria-label="Principal"
        className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white px-2 py-1.5 text-sm text-neutral-900 shadow-sm dark:bg-white/92 md:flex"
      >
        {links.map((l) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            className="rounded-full px-4 py-1.5 transition hover:bg-black/5"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 md:gap-3">
        <nav
          aria-label="Móvil"
          className="flex items-center gap-1 rounded-full bg-white px-2 py-1.5 text-sm text-neutral-900 shadow-sm dark:bg-white/92 md:hidden"
        >
          {links.slice(0, 2).map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="rounded-full px-3 py-1.5"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/propiedades"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-white/90 dark:bg-white/92 dark:hover:bg-white"
        >
          Ingresar
        </Link>
        <ThemeToggle />
      </div>
    </div>
  )
}
