import Link from "next/link"
import { brandName } from "@/lib/brand"

const links = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "/propiedades", label: "Catálogo" },
  { href: "/propiedades?op=sale", label: "Ofertas" },
  { href: "#agentes", label: "Agentes" },
]

export function LandingNav() {
  return (
    <div className="flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2.5 text-white">
        <span
          aria-hidden
          className="grid h-8 w-8 place-items-center rounded-full border border-white/40"
        >
          <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
            <path
              d="M16 4c4 4 7 7 7 12a7 7 0 1 1-14 0c0-5 3-8 7-12Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M16 10c2.2 2.4 3.8 4.2 3.8 7a3.8 3.8 0 1 1-7.6 0c0-2.8 1.6-4.6 3.8-7Z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </span>
        <span className="font-display text-lg tracking-tight">{brandName}</span>
      </Link>

      <nav
        aria-label="Principal"
        className="hidden items-center gap-6 text-sm text-white/90 md:flex"
      >
        {links.map((l) => (
          <Link key={l.href + l.label} href={l.href} className="hover:text-white">
            {l.label}
          </Link>
        ))}
      </nav>

      <Link
        href="/propiedades"
        className="rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white/90"
      >
        Explorar
      </Link>
    </div>
  )
}
