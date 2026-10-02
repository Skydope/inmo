"use client"

import Link from "next/link"
import { Suspense, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { usePathname, useSearchParams } from "next/navigation"
import {
  BuildingApartment,
  CaretDown,
  House,
  List,
  SignIn,
  Tree,
  X,
} from "@phosphor-icons/react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export type NavParams = { op: string | null; type: string | null }

const OPERATIONS = [
  { op: "sale", label: "Comprar" },
  { op: "rent", label: "Alquilar" },
] as const

const MARKETS = [
  { type: "house", label: "Casas", Icon: House },
  { type: "apartment", label: "Departamentos", Icon: BuildingApartment },
  { type: "lot", label: "Terrenos", Icon: Tree },
] as const

const EXTRA_LINKS = [
  { href: "/propiedades?op=temporary", label: "Hoteles" },
  { href: "/inmobiliarias", label: "Inmobiliarias" },
] as const

/** Pins once the sheet has covered a hero header, or a plain header has scrolled off. */
export function navShouldPin(scrollY: number, coverAt: number | null, anchorTop: number) {
  if (coverAt != null) return scrollY > coverAt
  return anchorTop < 0
}

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
  const [pinned, setPinned] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => {
      if (!mq.matches) {
        setPinned(false)
        return
      }
      const hero = anchor.closest("[data-cover-hero]")
      const coverAt = hero instanceof HTMLElement ? hero.offsetHeight - 92 : null
      setPinned(navShouldPin(window.scrollY, coverAt, anchor.getBoundingClientRect().top))
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    mq.addEventListener("change", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      mq.removeEventListener("change", update)
    }
  }, [])

  const surface = (bar: boolean) => (
    <NavSurface
      bar={bar}
      open={open && bar === pinned}
      onToggle={() => setOpen((v) => !v)}
      onNavigate={() => setOpen(false)}
      pathname={pathname}
      params={params}
    />
  )

  return (
    <div ref={anchorRef}>
      {surface(false)}
      {pinned ? createPortal(surface(true), document.body) : null}
    </div>
  )
}

function NavSurface({
  bar,
  open,
  onToggle,
  onNavigate,
  pathname,
  params,
}: {
  bar: boolean
  open: boolean
  onToggle: () => void
  onNavigate: () => void
  pathname: string
  params: NavParams
}) {
  return (
    <div
      className={cn(
        bar
          ? "fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-black/10 bg-bg-elevated px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:border-white/10"
          : "relative flex items-start justify-between",
      )}
    >
      <div className={cn("relative z-10 flex items-center", !bar && "nav-tab")}>
        <button
          type="button"
          onClick={onToggle}
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
          href="/"
          aria-label="Inicio"
          className={cn("flex items-center", bar ? "p-2" : "px-3.5 py-2.5 md:px-4 md:py-3")}
        >
          <House weight="fill" className="h-5 w-5" aria-hidden />
        </Link>
      </div>

      <nav
        aria-label="Principal"
        className="nav-tab absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 items-center gap-1 px-2 py-2.5 text-sm md:flex"
      >
        {OPERATIONS.map((operation) => (
          <div key={operation.op} className="group relative">
            <NavLink
              href={`/propiedades?op=${operation.op}`}
              label={operation.label}
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
            pathname={pathname}
            params={params}
          />
        ))}
      </nav>

      <div
        className={cn(
          "relative z-10 flex items-center gap-1 text-sm",
          !bar && "nav-tab px-2 py-1.5 md:px-2.5 md:py-2",
        )}
      >
        <Link
          href="/ingresar"
          aria-label="Ingresar"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-fg px-3 text-sm font-medium text-bg transition hover:opacity-90 md:h-auto md:w-auto md:px-3.5 md:py-1.5"
        >
          <SignIn weight="fill" className="h-4 w-4 md:hidden" aria-hidden />
          <span className="text-sm font-medium">Ingresar</span>
        </Link>
        <ThemeToggle className="h-9 w-9 bg-transparent shadow-none hover:bg-black/5 dark:bg-transparent dark:hover:bg-white/10" />
      </div>

      {open ? (
        <nav
          id="landing-nav-menu"
          aria-label="Menú móvil"
          className="absolute left-0 top-full z-20 mt-2 flex w-max max-w-[calc(100vw-1.5rem)] flex-col items-stretch gap-0.5 rounded-card bg-chrome p-1.5 text-sm shadow-[0_12px_40px_rgba(0,0,0,0.22)] md:hidden"
        >
          {OPERATIONS.map((operation) => (
            <div key={operation.op} className="flex flex-col gap-0.5">
              <NavLink
                href={`/propiedades?op=${operation.op}`}
                label={operation.label}
                pathname={pathname}
                params={params}
                onClick={onNavigate}
              />
              {MARKETS.map((market) => (
                <NavLink
                  key={market.type}
                  href={`/propiedades?op=${operation.op}&type=${market.type}`}
                  label={market.label}
                  Icon={market.Icon}
                  pathname={pathname}
                  params={params}
                  onClick={onNavigate}
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
              pathname={pathname}
              params={params}
              onClick={onNavigate}
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
  Icon?: React.ComponentType<{ weight?: "fill"; className?: string }>
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
      {Icon ? (
        <Icon weight="fill" className="h-4 w-4 shrink-0" aria-hidden />
      ) : null}
      <span className="flex-1 whitespace-nowrap">{label}</span>
      {children}
    </Link>
  )
}
