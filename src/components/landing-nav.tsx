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
    <div className="relative flex items-start justify-end">
      <nav
        aria-label="Principal"
        className="nav-tab absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 items-center gap-1 px-2 py-2.5 text-sm text-neutral-900 md:flex"
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

      <nav
        aria-label="Móvil"
        className="nav-tab relative mr-2 flex items-center gap-1 px-2 py-2 text-sm text-neutral-900 md:hidden"
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

      <div className="nav-tab relative z-10 flex items-center gap-1 px-2 py-1.5 text-sm text-neutral-900 md:px-2.5 md:py-2">
        <Link
          href="/propiedades"
          className="rounded-full px-4 py-1.5 font-medium transition hover:bg-black/5 md:px-5"
        >
          Ingresar
        </Link>
        <ThemeToggle className="h-9 w-9 bg-transparent shadow-none hover:bg-black/5 dark:bg-transparent dark:hover:bg-black/5" />
      </div>
    </div>
  )
}
