"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import {
  BuildingApartment,
  CaretDown,
  House,
  Key,
  List,
  Storefront,
  SuitcaseRolling,
  Tag,
  Tree,
  X,
} from "@phosphor-icons/react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export type NavParams = { op: string | null; type: string | null }

const OPERATIONS = [
  { op: "sale", label: "Comprar", Icon: Tag },
  { op: "rent", label: "Alquilar", Icon: Key },
] as const

const MARKETS = [
  { type: "house", label: "Casas", Icon: House },
  { type: "apartment", label: "Departamentos", Icon: BuildingApartment },
  { type: "lot", label: "Terrenos", Icon: Tree },
] as const

const EXTRA_LINKS = [
  { href: "/propiedades?op=temporary", label: "Hoteles", Icon: SuitcaseRolling },
  { href: "/inmobiliarias", label: "Inmobiliarias", Icon: Storefront },
] as const

export function navItemActive(href: string, pathname: string, params: NavParams) {
  if (href === "/inmobiliarias") return pathname === "/inmobiliarias"
  if (pathname !== "/propiedades") return false
  const wanted = new URL(href, "http://local").searchParams
  if ((params.op ?? null) !== wanted.get("op")) return false
  const wantedType = wanted.get("type")
  return !wantedType || params.type === wantedType
}

export function LandingNav() {
  return (
    <Suspense fallback={<Bar params={{ op: null, type: null }} />}>
      <BarWithSearch />
    </Suspense>
  )
}

function BarWithSearch() {
  const sp = useSearchParams()
  return <Bar params={{ op: sp.get("op"), type: sp.get("type") }} />
}

function Bar({ params }: { params: NavParams }) {
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
        {OPERATIONS.map((operation) => (
          <div key={operation.op} className="group relative">
            <NavLink
              href={`/propiedades?op=${operation.op}`}
              label={operation.label}
              Icon={operation.Icon}
              pathname={pathname}
              params={params}
            >
              <CaretDown
                weight="fill"
                className="h-3 w-3 opacity-60 transition group-hover:rotate-180"
                aria-hidden
              />
            </NavLink>
            <div className="invisible absolute left-0 top-full z-20 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="flex min-w-48 flex-col gap-0.5 rounded-card bg-chrome p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
                {MARKETS.map((market) => (
                  <NavLink
                    key={market.type}
                    href={`/propiedades?op=${operation.op}&type=${market.type}`}
                    label={market.label}
                    Icon={market.Icon}
                    pathname={pathname}
                    params={params}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
        {EXTRA_LINKS.map((l) => (
          <NavLink
            key={l.href}
            href={l.href}
            label={l.label}
            Icon={l.Icon}
            pathname={pathname}
            params={params}
          />
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
          className="nav-tab absolute right-0 top-12 z-20 flex flex-col items-stretch gap-0.5 px-2 py-2 text-sm md:hidden"
        >
          {OPERATIONS.map((operation) => (
            <div key={operation.op} className="flex flex-col gap-0.5">
              <NavLink
                href={`/propiedades?op=${operation.op}`}
                label={operation.label}
                Icon={operation.Icon}
                pathname={pathname}
                params={params}
                onClick={() => setOpen(false)}
              />
              {MARKETS.map((market) => (
                <NavLink
                  key={market.type}
                  href={`/propiedades?op=${operation.op}&type=${market.type}`}
                  label={market.label}
                  Icon={market.Icon}
                  pathname={pathname}
                  params={params}
                  onClick={() => setOpen(false)}
                  sub
                />
              ))}
            </div>
          ))}
          {EXTRA_LINKS.map((l) => (
            <NavLink
              key={l.href}
              href={l.href}
              label={l.label}
              Icon={l.Icon}
              pathname={pathname}
              params={params}
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
  Icon,
  pathname,
  params,
  onClick,
  sub,
  children,
}: {
  href: string
  label: string
  Icon: React.ComponentType<{ weight?: "fill"; className?: string }>
  pathname: string
  params: NavParams
  onClick?: () => void
  sub?: boolean
  children?: React.ReactNode
}) {
  const active = navItemActive(href, pathname, params)
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full transition",
        sub ? "py-1.5 pl-6 pr-4" : "px-3.5 py-1.5",
        active ? "bg-fg text-bg" : "hover:bg-black/5 dark:hover:bg-white/10",
      )}
    >
      <Icon weight="fill" className="h-4 w-4 shrink-0" aria-hidden />
      <span className="flex-1 whitespace-nowrap">{label}</span>
      {children}
    </Link>
  )
}
