"use client"

import Link from "next/link"
import { useState } from "react"
import { House, List, X } from "@phosphor-icons/react"
import { ThemeToggle } from "@/components/theme-toggle"

const links = [
  { href: "/propiedades?op=sale", label: "Comprar" },
  { href: "/propiedades?op=rent", label: "Alquilar" },
  { href: "/inmobiliarias", label: "Inmobiliarias" },
]

export function LandingNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex items-start justify-between">
      <Link
        href="/"
        aria-label="Inicio"
        className="nav-tab relative z-10 ml-2 flex items-center px-3.5 py-2.5 md:ml-0 md:px-4 md:py-3"
      >
        <House weight="fill" className="h-5 w-5" aria-hidden />
      </Link>

      <nav
        aria-label="Principal"
        className="nav-tab absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 items-center gap-1 px-2 py-2.5 text-sm md:flex"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full px-4 py-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="nav-tab relative z-10 mr-2 flex items-center gap-1 px-2 py-1.5 text-sm md:mr-0 md:px-2.5 md:py-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="landing-nav-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="rounded-full p-2 transition hover:bg-black/5 md:hidden dark:hover:bg-white/10"
        >
          {open ? (
            <X weight="bold" className="h-4 w-4" aria-hidden />
          ) : (
            <List weight="bold" className="h-4 w-4" aria-hidden />
          )}
        </button>
        <Link
          href="/ingresar"
          className="rounded-full bg-fg px-3.5 py-1.5 text-sm font-medium text-bg transition hover:opacity-90"
        >
          Ingresar
        </Link>
        <ThemeToggle className="h-9 w-9 bg-transparent shadow-none hover:bg-black/5 dark:bg-transparent dark:hover:bg-white/10" />
      </div>

      {open ? (
        <nav
          id="landing-nav-menu"
          aria-label="Menú móvil"
          className="nav-tab absolute right-2 top-12 z-20 flex flex-col items-end gap-1 px-2 py-2 text-sm md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  )
}
