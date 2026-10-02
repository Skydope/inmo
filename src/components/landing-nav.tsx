"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { House, List, X } from "@phosphor-icons/react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const links = [
  { href: "/propiedades?op=sale", label: "Comprar" },
  { href: "/propiedades?op=rent", label: "Alquilar" },
  { href: "/inmobiliarias", label: "Inmobiliarias" },
]

export function navItemActive(href: string, pathname: string, op: string | null) {
  if (href === "/inmobiliarias") return pathname === "/inmobiliarias"
  if (pathname !== "/propiedades") return false
  const wanted = new URL(href, "http://local").searchParams.get("op")
  return (op ?? null) === wanted
}

export function LandingNav() {
  return (
    <Suspense fallback={<Bar op={null} />}>
      <BarWithSearch />
    </Suspense>
  )
}

function BarWithSearch() {
  const op = useSearchParams().get("op")
  return <Bar op={op} />
}

function Bar({ op }: { op: string | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative flex items-start justify-between">
      <Link
        href="/"
        aria-label="Inicio"
        className="nav-tab relative z-10 flex items-center px-3.5 py-2.5 md:px-4 md:py-3"
      >
        <House weight="fill" className="h-5 w-5" aria-hidden />
      </Link>

      <nav
        aria-label="Principal"
        className="nav-tab absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 items-center gap-1 px-2 py-2.5 text-sm md:flex"
      >
        {links.map((l) => (
          <NavLink key={l.href} href={l.href} label={l.label} pathname={pathname} op={op} />
        ))}
      </nav>

      <div className="nav-tab relative z-10 flex items-center gap-1 px-2 py-1.5 text-sm md:px-2.5 md:py-2">
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
          className="nav-tab absolute right-0 top-12 z-20 flex flex-col items-end gap-1 px-2 py-2 text-sm md:hidden"
        >
          {links.map((l) => (
            <NavLink
              key={l.href}
              href={l.href}
              label={l.label}
              pathname={pathname}
              op={op}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
      ) : null}
    </div>
  )
}

function NavLink({
  href,
  label,
  pathname,
  op,
  onClick,
}: {
  href: string
  label: string
  pathname: string
  op: string | null
  onClick?: () => void
}) {
  const active = navItemActive(href, pathname, op)
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 transition",
        active ? "bg-fg text-bg" : "hover:bg-black/5 dark:hover:bg-white/10",
      )}
    >
      {label}
    </Link>
  )
}
