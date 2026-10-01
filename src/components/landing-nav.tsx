"use client"

import Link from "next/link"
import { useState } from "react"
import { List, X } from "@phosphor-icons/react"
import { ThemeToggle } from "@/components/theme-toggle"

const links = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "/propiedades", label: "Catálogo" },
  { href: "/propiedades?op=sale", label: "Ofertas" },
  { href: "#servicios", label: "Servicios" },
]

export function LandingNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex items-start justify-end">
      <nav
        aria-label="Principal"
        className="nav-tab absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 items-center gap-1 px-2 py-2.5 text-sm md:flex"
      >
        {links.map((l) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            className="rounded-full px-4 py-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <nav
        aria-label="Móvil"
        className="nav-tab relative mr-2 flex items-center gap-1 px-2 py-2 text-sm md:hidden"
      >
        {links.slice(0, 2).map((l) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            className="rounded-full px-3 py-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            {l.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="landing-nav-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="rounded-full p-2 transition hover:bg-black/5 dark:hover:bg-white/10"
        >
          {open ? (
            <X weight="bold" className="h-4 w-4" aria-hidden />
          ) : (
            <List weight="bold" className="h-4 w-4" aria-hidden />
          )}
        </button>
      </nav>

      {open ? (
        <nav
          id="landing-nav-menu"
          aria-label="Menú móvil"
          className="nav-tab absolute right-2 top-12 z-20 flex flex-col items-end gap-1 px-2 py-2 text-sm md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="nav-tab relative z-10 flex items-center gap-1 px-2 py-1.5 text-sm md:px-2.5 md:py-2">
        <Link
          href="/propiedades"
          className="rounded-full px-4 py-1.5 font-medium transition hover:bg-black/5 md:px-5 dark:hover:bg-white/10"
        >
          Explorar
        </Link>
        <ThemeToggle className="h-9 w-9 bg-transparent shadow-none hover:bg-black/5 dark:bg-transparent dark:hover:bg-white/10" />
      </div>
    </div>
  )
}
