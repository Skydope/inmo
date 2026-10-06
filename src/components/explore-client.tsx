"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useId, useMemo, useReducer, useRef, useState, useTransition } from "react"
import {
  ArrowsDownUp,
  Bed,
  CaretDown,
  MagnifyingGlass,
  PlusCircle,
  Storefront,
  X,
} from "@phosphor-icons/react"
import { LandingNav } from "@/components/landing-nav"
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic"
import { PropertyCard } from "@/components/property-card"
import { buttonVariants } from "@/components/ui/button"
import { formatPriceCompact } from "@/lib/format"
import {
  applyFilters,
  filtersToSearchParams,
  parseFilters,
  priceControlsEnabled,
  type PropertyFilters,
  type SortKey,
} from "@/lib/filters"
import { clampPriceRange, PRICE_BOUNDS } from "@/lib/price-range"
import {
  initialMarkerState,
  markerReducer,
} from "@/lib/markers"
import type { Currency, Operation, Property, PropertyType } from "@/lib/properties/types"
import { cn } from "@/lib/utils"
import { filterBolivarStreets, STREET_QUERY_MIN, type StreetLines } from "@/lib/streets"

export function ExploreClient({ properties }: { properties: Property[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  )

  const [street, setStreet] = useState<StreetLines | null>(null)
  const [markerState, dispatchMarker] = useReducer(markerReducer, initialMarkerState)

  const list = useMemo(() => applyFilters(properties, filters), [properties, filters])

  function pushFilters(next: PropertyFilters) {
    const qs = filtersToSearchParams(next).toString()
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    })
  }

  function patch(partial: Partial<PropertyFilters>) {
    const next = { ...filters, ...partial }
    if (!priceControlsEnabled(next)) {
      next.min = undefined
      next.max = undefined
      if (next.sort === "price-asc" || next.sort === "price-desc") next.sort = "recent"
    }
    pushFilters(next)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dispatchMarker({ type: "collapse" })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!markerState.selectedId) return
    const el = document.getElementById(`card-${markerState.selectedId}`)
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [markerState.selectedId])

  return (
    <div className="px-2 pb-2 pt-2 md:px-3 md:pb-3 md:pt-3">
      <div className="relative h-[calc(100dvh-1rem)] md:h-[calc(100dvh-1.5rem)]">
        <div className="absolute inset-0 z-0 isolate overflow-hidden rounded-panel md:rounded-sheet">
          <PropertyMapDynamic
            properties={list}
            selectedId={markerState.selectedId}
            expandedId={markerState.expandedId}
            street={street}
            onExpand={(id) => dispatchMarker({ type: "expand", id })}
            onCollapse={() => dispatchMarker({ type: "collapse" })}
            onDeselect={() => dispatchMarker({ type: "deselect" })}
            onSelect={(id) => dispatchMarker({ type: "select", id })}
          />
        </div>

        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <div className="pointer-events-auto px-4 md:px-7">
            <LandingNav />
          </div>

          <div className="pointer-events-auto mt-auto flex flex-col gap-2.5 px-3 pb-3 md:px-5 md:pb-5">
            <FilterBar filters={filters} onChange={patch} onStreet={setStreet} />

            {list.length === 0 ? (
              <div className="flex w-fit max-w-md flex-col items-start gap-3 rounded-card bg-chrome p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <p className="font-display text-2xl">Sin resultados</p>
                <p className="text-sm text-fg-muted">
                  Probá limpiar los filtros o ampliar el rango de precio.
                </p>
                <Link href="/propiedades" className={buttonVariants()}>
                  Limpiar filtros
                </Link>
              </div>
            ) : (
              <div className="-mx-3 -my-3 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-3 py-3">
                {list.map((p) => (
                  <PropertyCard
                    key={p.id}
                    id={`card-${p.id}`}
                    property={p}
                    selected={markerState.selectedId === p.id}
                    onHover={(id) => dispatchMarker({ type: "hover-card", id })}
                    onSelect={(id) => dispatchMarker({ type: "select", id })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterBar({
  filters,
  onChange,
  onStreet,
}: {
  filters: PropertyFilters
  onChange: (partial: Partial<PropertyFilters>) => void
  onStreet: (lines: StreetLines | null) => void
}) {
  const priceOk = priceControlsEnabled(filters)
  const [menu, setMenu] = useState<FilterMenu | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!barRef.current?.contains(e.target as Node)) setMenu(null)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(null)
    }
    document.addEventListener("mousedown", onDown)
    window.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  function toggle(id: FilterMenu) {
    setMenu((current) => (current === id ? null : id))
  }

  const typeName = TYPE_OPTIONS.find((o) => o.value === filters.type)?.label ?? "Tipo"

  return (
    <div
      ref={barRef}
      className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-1.5 rounded-3xl bg-chrome px-2 py-1.5 text-fg shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:w-fit sm:rounded-full"
    >
      <StreetSearch onStreet={onStreet} />
      {filters.agency ? (
        <button
          type="button"
          onClick={() => onChange({ agency: undefined })}
          className="inline-flex max-w-48 shrink-0 items-center gap-1.5 rounded-full bg-fg px-3 py-1.5 text-xs font-medium text-bg"
        >
          <span className="truncate">{filters.agency}</span>
          <span aria-hidden>×</span>
          <span className="sr-only">Quitar filtro de inmobiliaria</span>
        </button>
      ) : null}
      <FilterMenuButton
        label={opLabel(filters.op)}
        icon={<Storefront weight="fill" className="h-3.5 w-3.5" aria-hidden />}
        active={Boolean(filters.op)}
        open={menu === "operation"}
        onToggle={() => toggle("operation")}
      >
        <MenuHeader
          title="Operación"
          onClear={filters.op ? () => onChange({ op: undefined }) : undefined}
        />
        {OPERATION_OPTIONS.map((o) => (
          <MenuOption
            key={o.value}
            selected={filters.op === o.value}
            onClick={() => {
              onChange({ op: filters.op === o.value ? undefined : o.value })
              setMenu(null)
            }}
          >
            {o.label}
          </MenuOption>
        ))}
      </FilterMenuButton>
      <FilterMenuButton
        label={typeName}
        active={Boolean(filters.type)}
        open={menu === "type"}
        onToggle={() => toggle("type")}
      >
        <MenuHeader
          title="Tipo"
          onClear={filters.type ? () => onChange({ type: undefined }) : undefined}
        />
        {TYPE_OPTIONS.map((o) => (
          <MenuOption
            key={o.value}
            selected={filters.type === o.value}
            onClick={() => {
              onChange({ type: filters.type === o.value ? undefined : o.value })
              setMenu(null)
            }}
          >
            {o.label}
          </MenuOption>
        ))}
      </FilterMenuButton>
      <FilterMenuButton
        label={bedsLabel(filters.beds)}
        icon={<Bed weight="fill" className="h-3.5 w-3.5" aria-hidden />}
        active={filters.beds != null}
        open={menu === "rooms"}
        onToggle={() => toggle("rooms")}
      >
        <MenuHeader
          title="Ambientes"
          onClear={filters.beds != null ? () => onChange({ beds: undefined }) : undefined}
        />
        <MenuOption
          selected={filters.beds == null}
          onClick={() => {
            onChange({ beds: undefined })
            setMenu(null)
          }}
        >
          Cualquiera
        </MenuOption>
        {BED_OPTIONS.map((o) => (
          <MenuOption
            key={o.value}
            selected={filters.beds === o.value}
            onClick={() => {
              onChange({ beds: filters.beds === o.value ? undefined : o.value })
              setMenu(null)
            }}
          >
            {o.label}
          </MenuOption>
        ))}
      </FilterMenuButton>
      <PriceFilter
        filters={filters}
        open={menu === "price"}
        onToggle={() => toggle("price")}
        onChange={onChange}
      />
      <FilterMenuButton
        label={sortLabel(filters.sort)}
        icon={<ArrowsDownUp weight="fill" className="h-3.5 w-3.5" aria-hidden />}
        active={filters.sort !== "recent"}
        open={menu === "sort"}
        onToggle={() => toggle("sort")}
        align="end"
      >
        {SORTS.map((o) => (
          <MenuOption
            key={o.value}
            selected={filters.sort === o.value}
            disabled={o.needsCurrency ? !priceOk : false}
            onClick={() => {
              onChange({ sort: o.value })
              setMenu(null)
            }}
          >
            {o.label}
          </MenuOption>
        ))}
      </FilterMenuButton>
      <Link
        href="/publicar"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-fg px-3.5 py-1.5 text-xs font-medium text-bg transition hover:opacity-90"
      >
        <PlusCircle weight="fill" className="h-4 w-4" aria-hidden />
        Crear aviso
      </Link>
    </div>
  )
}

function StreetSearch({ onStreet }: { onStreet: (lines: StreetLines | null) => void }) {
  const [q, setQ] = useState("")
  const [names, setNames] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isPickedRef = useRef(false)

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [])

  useEffect(() => {
    if (isPickedRef.current) {
      isPickedRef.current = false
      return
    }

    const query = q.trim()
    const ac = new AbortController()

    const t = setTimeout(() => {
      if (query.length < STREET_QUERY_MIN) {
        setNames([])
        setOpen(false)
        return
      }

      // Predictive search starts after debounce timer as requested
      const local = filterBolivarStreets(query)
      if (local.length > 0) {
        setNames(local)
        setOpen(true)
      }

      fetch(`/api/streets?q=${encodeURIComponent(query)}`, { signal: ac.signal })
        .then((r) => r.json())
        .then((data: { names?: string[] }) => {
          if (data.names && data.names.length > 0) {
            const combined = Array.from(new Set([...local, ...data.names])).slice(0, 10)
            setNames(combined)
            setOpen(true)
          } else if (local.length > 0) {
            setNames(local)
            setOpen(true)
          } else {
            setNames([])
            setOpen(false)
          }
        })
        .catch(() => {
          if (local.length === 0) {
            setNames(["Error al buscar calles"])
            setOpen(true)
          }
        })
    }, 280)

    return () => {
      clearTimeout(t)
      ac.abort()
    }
  }, [q])

  async function pick(name: string) {
    isPickedRef.current = true
    setQ(name)
    setOpen(false)
    try {
      const res = await fetch(`/api/streets?name=${encodeURIComponent(name)}`)
      const data = (await res.json()) as StreetLines
      data.name = data.name || name
      onStreet(data.features?.length ? data : null)
    } catch {
      onStreet(null)
    }
  }

  function clear() {
    isPickedRef.current = false
    setQ("")
    setNames([])
    setOpen(false)
    onStreet(null)
  }

  return (
    <div ref={containerRef} className="relative shrink-0 w-48 sm:w-56 md:w-64">
      <div className="relative flex items-center">
        <MagnifyingGlass
          weight="fill"
          className="pointer-events-none absolute left-3 h-4 w-4 shrink-0 text-fg-muted"
          aria-hidden
        />
        <input
          value={q}
          placeholder="Calle…"
          aria-label="Buscar calle"
          autoComplete="off"
          onChange={(e) => {
            const value = e.target.value
            isPickedRef.current = false
            setQ(value)
            if (!value.trim()) {
              onStreet(null)
              setNames([])
              setOpen(false)
            }
          }}
          onFocus={() => {
            if (names.length > 0) setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false)
          }}
          className="w-full truncate rounded-full border border-glass-border bg-bg pl-9 pr-8 py-1.5 text-xs sm:text-sm text-fg placeholder:text-fg-muted outline-none transition focus:border-fg/40"
        />
        {q ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Limpiar calle"
            className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-full text-fg-muted hover:text-fg transition"
          >
            <X weight="bold" className="h-3 w-3" aria-hidden />
          </button>
        ) : null}
      </div>

      {open && names.length > 0 ? (
        <ul className="absolute bottom-full left-0 z-30 mb-2 max-h-48 w-full overflow-hidden rounded-2xl border border-glass-border bg-chrome py-1 text-xs sm:text-sm text-fg shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-md">
          {names.map((name) => (
            <li key={name}>
              <button
                type="button"
                title={name}
                className="block w-full truncate px-3.5 py-1.5 text-left text-xs sm:text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
                onClick={() => pick(name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

const TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Departamento" },
  { value: "house", label: "Casa" },
  { value: "ph", label: "PH" },
  { value: "lot", label: "Terreno" },
  { value: "commercial", label: "Local comercial" },
  { value: "rural", label: "Campo" },
  { value: "vacational_house", label: "Quinta vacacional" },
]

const BED_OPTIONS = [
  { value: 1, label: "1+ dorm." },
  { value: 2, label: "2+ dorm." },
  { value: 3, label: "3+ dorm." },
  { value: 4, label: "4+ dorm." },
] as const

const SORTS: { value: SortKey; label: string; needsCurrency?: boolean }[] = [
  { value: "recent", label: "Recientes" },
  { value: "price-asc", label: "Precio ↑", needsCurrency: true },
  { value: "price-desc", label: "Precio ↓", needsCurrency: true },
]

type FilterMenu = "operation" | "type" | "rooms" | "price" | "sort"

const OPERATION_OPTIONS: { value: Operation; label: string }[] = [
  { value: "sale", label: "Venta" },
  { value: "rent", label: "Alquiler" },
  { value: "temporary", label: "Temporal" },
]

function rangeLabelShift(pct: number) {
  if (pct < 12) return "translateX(0)"
  if (pct > 88) return "translateX(-100%)"
  return "translateX(-50%)"
}

function bedsLabel(beds?: number) {
  if (beds == null) return "Ambientes"
  return BED_OPTIONS.find((o) => o.value === beds)?.label ?? `${beds}+ dorm.`
}

function sortLabel(sort: SortKey) {
  if (sort === "recent") return "Orden"
  return SORTS.find((o) => o.value === sort)?.label ?? "Orden"
}

function opLabel(op?: Operation) {
  if (!op) return "Operación"
  return OPERATION_OPTIONS.find((o) => o.value === op)?.label ?? "Operación"
}

function FilterMenuButton({
  label,
  icon,
  active,
  open,
  onToggle,
  align = "start",
  panelClassName,
  children,
}: {
  label: string
  icon?: React.ReactNode
  active?: boolean
  open: boolean
  onToggle: () => void
  align?: "start" | "end"
  panelClassName?: string
  children: React.ReactNode
}) {
  const id = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !panelRef.current) return
    const buttons = panelRef.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])")
    if (buttons.length > 0) buttons[0].focus()
  }, [open])

  function onPanelKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()
    const panel = panelRef.current
    if (!panel) return
    const buttons = Array.from(panel.querySelectorAll<HTMLButtonElement>("button:not([disabled])"))
    const idx = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (idx === -1) return
    const next = e.key === "ArrowDown" ? (idx + 1) % buttons.length : (idx - 1 + buttons.length) % buttons.length
    buttons[next].focus()
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? `${id}-panel` : undefined}
        onClick={onToggle}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition",
          active || open
            ? "bg-fg text-bg"
            : "text-fg-muted hover:bg-black/5 hover:text-fg dark:hover:bg-white/10",
        )}
      >
        {icon}
        <span className="max-w-40 truncate whitespace-nowrap">{label}</span>
        <CaretDown
          weight="fill"
          className={cn("h-3 w-3 opacity-60 transition", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={`${id}-panel`}
          role="menu"
          aria-labelledby={id}
          onKeyDown={onPanelKeyDown}
          className={cn(
            "absolute bottom-full z-30 mb-2 min-w-52 rounded-2xl border border-glass-border bg-chrome p-2 text-sm shadow-[0_12px_40px_rgba(0,0,0,0.22)]",
            align === "end" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

function MenuHeader({ title, onClear }: { title: string; onClear?: () => void }) {
  return (
    <div className="mb-1 flex items-center justify-between px-2 py-1">
      <span className="text-xs font-medium text-fg-muted">{title}</span>
      {onClear ? (
        <button type="button" onClick={onClear} className="text-xs font-medium text-accent">
          Limpiar
        </button>
      ) : null}
    </div>
  )
}

function MenuOption({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "block w-full rounded-xl px-3 py-1.5 text-left text-sm transition disabled:opacity-40",
        selected ? "bg-fg text-bg" : "hover:bg-black/5 dark:hover:bg-white/10",
      )}
    >
      {children}
    </button>
  )
}

function PriceFilter({
  filters,
  open,
  onToggle,
  onChange,
}: {
  filters: PropertyFilters
  open: boolean
  onToggle: () => void
  onChange: (partial: Partial<PropertyFilters>) => void
}) {
  const cur: Currency = filters.cur ?? "USD"
  const bounds = PRICE_BOUNDS[cur]
  const [draft, setDraft] = useState<{ min: number; max: number } | null>(null)
  const draftRef = useRef(draft)
  const pending = useRef(false)
  const min = draft?.min ?? filters.min ?? bounds.min
  const max = draft?.max ?? filters.max ?? bounds.max
  const span = bounds.max - bounds.min || 1
  const left = ((min - bounds.min) / span) * 100
  const right = ((max - bounds.min) / span) * 100
  const ranged = filters.min != null || filters.max != null
  const trigger = ranged
    ? `${formatPriceCompact(filters.min ?? bounds.min, cur)}–${formatPriceCompact(filters.max ?? bounds.max, cur)}`
    : filters.cur
      ? filters.cur === "USD"
        ? "USD"
        : "Pesos"
      : "Precio"

  useEffect(() => {
    draftRef.current = null
    pending.current = false
    setDraft(null)
  }, [filters.cur, filters.min, filters.max])

  function commit(nextMin: number, nextMax: number, currency: Currency) {
    const domain = PRICE_BOUNDS[currency]
    const clamped = clampPriceRange(nextMin, nextMax, domain.min, domain.max)
    onChange({
      cur: currency,
      min: clamped.min <= domain.min ? undefined : clamped.min,
      max: clamped.max >= domain.max ? undefined : clamped.max,
    })
  }

  function preview(nextMin: number, nextMax: number) {
    const clamped = clampPriceRange(nextMin, nextMax, bounds.min, bounds.max)
    pending.current = true
    draftRef.current = clamped
    setDraft(clamped)
  }

  function flush() {
    const d = draftRef.current
    if (!pending.current || !d) return
    pending.current = false
    const nextMin = d.min <= bounds.min ? undefined : d.min
    const nextMax = d.max >= bounds.max ? undefined : d.max
    if (nextMin === filters.min && nextMax === filters.max) {
      draftRef.current = null
      setDraft(null)
      return
    }
    onChange({ cur, min: nextMin, max: nextMax })
  }

  const flushRef = useRef(flush)
  flushRef.current = flush
  useEffect(() => {
    function onUp() {
      flushRef.current()
    }
    window.addEventListener("pointerup", onUp)
    return () => window.removeEventListener("pointerup", onUp)
  }, [])

  return (
    <FilterMenuButton
      label={trigger}
      active={Boolean(filters.cur) || ranged}
      open={open}
      onToggle={onToggle}
      align="end"
      panelClassName="w-80 p-3"
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium">Precio</span>
        <button
          type="button"
          onClick={() => onChange({ cur: undefined, min: undefined, max: undefined })}
          className="text-sm font-medium text-accent"
        >
          Limpiar
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <PriceField label="Min." value={min} onCommit={(n) => commit(n, max, cur)} />
        <PriceField label="Max." value={max} onCommit={(n) => commit(min, n, cur)} />
      </div>
      <div className="dual-range relative mt-8 h-7">
        <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-black/10 dark:bg-white/15" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `${left}%`, width: `${Math.max(0, right - left)}%` }}
        />
        <span
          className="pointer-events-none absolute -top-5 text-[11px] whitespace-nowrap text-fg-muted"
          style={{ left: `${left}%`, transform: rangeLabelShift(left) }}
        >
          {formatPriceCompact(min, cur)}
        </span>
        <span
          className="pointer-events-none absolute -top-5 text-[11px] whitespace-nowrap text-fg-muted"
          style={{ left: `${right}%`, transform: rangeLabelShift(right) }}
        >
          {formatPriceCompact(max, cur)}
        </span>
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={min}
          aria-label="Precio mínimo"
          style={{ zIndex: min > bounds.min + span / 2 ? 5 : 3 }}
          onChange={(e) => preview(Number(e.target.value), max)}
          onPointerUp={flush}
          onKeyUp={flush}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={max}
          aria-label="Precio máximo"
          style={{ zIndex: 4 }}
          onChange={(e) => preview(min, Number(e.target.value))}
          onPointerUp={flush}
          onKeyUp={flush}
        />
      </div>
      <div className="mt-4 flex rounded-full bg-bg p-1" role="group" aria-label="Moneda">
        {(
          [
            ["ARS", "Pesos ($)"],
            ["USD", "USD (u$s)"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filters.cur === value}
            onClick={() => onChange({ cur: value, min: undefined, max: undefined })}
            className={cn(
              "flex-1 rounded-full px-3 py-1.5 text-xs transition",
              filters.cur === value ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </FilterMenuButton>
  )
}

function PriceField({
  label,
  value,
  onCommit,
}: {
  label: string
  value: number
  onCommit: (n: number) => void
}) {
  return (
    <label className="relative block min-w-0 flex-1 rounded-xl border border-glass-border bg-bg px-3 pt-5 pb-2 focus-within:border-accent">
      <span className="absolute top-1.5 left-3 text-[10px] text-fg-muted">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        aria-label={label}
        onChange={(e) => {
          if (e.target.value === "") return
          const n = Number(e.target.value)
          if (Number.isNaN(n)) return
          onCommit(n)
        }}
        className="w-full bg-transparent text-sm text-fg outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </label>
  )
}
