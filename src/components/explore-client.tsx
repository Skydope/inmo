"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useReducer, useRef, useState, useTransition } from "react"
import {
  ArrowsDownUp,
  Bed,
  BuildingApartment,
  Coins,
  House,
  Key,
  MagnifyingGlass,
  SuitcaseRolling,
  Tag,
  Tree,
  X,
} from "@phosphor-icons/react"
import { LandingNav } from "@/components/landing-nav"
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic"
import { PropertyCard } from "@/components/property-card"
import { buttonVariants } from "@/components/ui/button"
import {
  applyFilters,
  filtersToSearchParams,
  parseFilters,
  priceControlsEnabled,
  type PropertyFilters,
  type SortKey,
} from "@/lib/filters"
import { gpsBannerMessage, type GpsStatus } from "@/lib/gps"
import {
  initialMarkerState,
  markerReducer,
} from "@/lib/markers"
import type { Property } from "@/lib/properties/types"
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

  const [gps] = useState<GpsStatus>({ kind: "idle" })
  const [street, setStreet] = useState<StreetLines | null>(null)
  const [markerState, dispatchMarker] = useReducer(markerReducer, initialMarkerState)

  const userPos = useMemo(
    () => (gps.kind === "success" ? { lat: gps.lat, lng: gps.lng } : null),
    [gps],
  )

  const list = useMemo(
    () => applyFilters(properties, filters, userPos),
    [properties, filters, userPos],
  )

  const banner = gpsBannerMessage(gps)

  function pushFilters(next: PropertyFilters) {
    const qs = filtersToSearchParams(next).toString()
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    })
  }

  function patch(partial: Partial<PropertyFilters>) {
    const next = { ...filters, ...partial }
    if (!priceControlsEnabled(next)) {
      delete next.min
      delete next.max
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
            center={userPos}
            street={street}
            onExpand={(id) => dispatchMarker({ type: "expand", id })}
            onCollapse={() => dispatchMarker({ type: "collapse" })}
            onSelect={(id) => dispatchMarker({ type: "select", id })}
          />
        </div>

        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <div className="pointer-events-auto px-4 md:px-7">
            <LandingNav />
          </div>

          <div className="pointer-events-auto mt-auto flex flex-col gap-2.5 px-3 pb-3 md:px-5 md:pb-5">
            {banner ? (
              <div
                role="status"
                className="w-fit max-w-md rounded-full bg-chrome px-4 py-2 text-sm text-fg shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
              >
                {banner}
              </div>
            ) : null}

            <FilterBar
              filters={filters}
              onChange={patch}
              gpsActive={Boolean(userPos)}
              onStreet={setStreet}
            />

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
  gpsActive,
  onStreet,
}: {
  filters: PropertyFilters
  onChange: (partial: Partial<PropertyFilters>) => void
  gpsActive: boolean
  onStreet: (lines: StreetLines | null) => void
}) {
  const priceOk = priceControlsEnabled(filters)

  return (
    <div className="mx-auto flex w-fit max-w-full items-center gap-2 rounded-full bg-chrome px-2 py-1.5 text-fg shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
      <StreetSearch onStreet={onStreet} />
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
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
        <Segment
          label="Tipo"
          value={filters.type ?? ""}
          options={[
            { value: "", label: "Todos" },
            { value: "house", label: "Casa", Icon: House },
            { value: "apartment", label: "Depto", Icon: BuildingApartment },
            { value: "lot", label: "Lote", Icon: Tree },
          ]}
          onChange={(v) => onChange({ type: (v || undefined) as PropertyFilters["type"] })}
        />
        <Segment
          label="Operación"
          value={filters.op ?? ""}
          options={[
            { value: "", label: "Todas" },
            { value: "sale", label: "Venta", Icon: Tag },
            { value: "rent", label: "Alquiler", Icon: Key },
            { value: "temporary", label: "Temporaria", Icon: SuitcaseRolling },
          ]}
          onChange={(v) => onChange({ op: (v || undefined) as PropertyFilters["op"] })}
        />

        <label className="flex shrink-0 items-center gap-1.5 text-xs text-fg-muted">
          <Bed weight="fill" className="h-3.5 w-3.5" aria-hidden />
          Dorm.
          <select
            className="rounded-full border border-glass-border bg-bg px-2 py-1.5 text-sm text-fg"
            value={filters.beds ?? ""}
            onChange={(e) =>
              onChange({ beds: e.target.value ? Number(e.target.value) : undefined })
            }
          >
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </label>

        <label className="flex shrink-0 items-center gap-1.5 text-xs text-fg-muted">
          <ArrowsDownUp weight="fill" className="h-3.5 w-3.5" aria-hidden />
          Orden
          <select
            className="rounded-full border border-glass-border bg-bg px-2 py-1.5 text-sm text-fg"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortKey })}
          >
            <option value="recent">Recientes</option>
            <option value="price-asc" disabled={!priceOk}>
              Precio ↑
            </option>
            <option value="price-desc" disabled={!priceOk}>
              Precio ↓
            </option>
            <option value="distance" disabled={!gpsActive}>
              Distancia
            </option>
          </select>
        </label>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 border-l border-glass-border pl-2">
        <Coins
          weight="fill"
          className={`h-3.5 w-3.5 shrink-0 ${priceOk ? "text-fg-muted" : "text-fg-muted/40"}`}
          aria-hidden
        />
        <Segment
          label="Moneda"
          value={filters.cur ?? ""}
          options={[
            { value: "", label: "Todas" },
            { value: "ARS", label: "ARS" },
            { value: "USD", label: "USD" },
          ]}
          onChange={(v) => onChange({ cur: (v || undefined) as PropertyFilters["cur"] })}
        />
        <input
          type="number"
          disabled={!priceOk}
          aria-label="Precio mínimo"
          className="w-20 rounded-full border border-glass-border bg-bg px-2 py-1.5 text-sm text-fg disabled:opacity-40"
          value={filters.min ?? ""}
          onChange={(e) =>
            onChange({ min: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="Min"
        />
        <input
          type="number"
          disabled={!priceOk}
          aria-label="Precio máximo"
          className="w-20 rounded-full border border-glass-border bg-bg px-2 py-1.5 text-sm text-fg disabled:opacity-40"
          value={filters.max ?? ""}
          onChange={(e) =>
            onChange({ max: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="Max"
        />
      </div>
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
        .catch(() => {})
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

function Segment({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: {
    value: string
    label: string
    Icon?: React.ComponentType<{ weight?: "fill"; className?: string }>
  }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex shrink-0 items-center gap-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value || "all"}
          type="button"
          onClick={() => onChange(o.value)}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
            value === o.value
              ? "bg-fg text-bg"
              : "text-fg-muted hover:bg-black/5 hover:text-fg dark:hover:bg-white/10"
          }`}
        >
          {o.Icon ? <o.Icon weight="fill" className="h-3.5 w-3.5" aria-hidden /> : null}
          {o.label}
        </button>
      ))}
    </div>
  )
}
