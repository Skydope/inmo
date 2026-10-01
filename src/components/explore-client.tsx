"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useReducer, useState, useTransition } from "react"
import { NavigationArrow } from "@phosphor-icons/react"
import { LandingNav } from "@/components/landing-nav"
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import {
  applyFilters,
  filtersToSearchParams,
  parseFilters,
  priceControlsEnabled,
  type PropertyFilters,
  type SortKey,
} from "@/lib/filters"
import { gpsBannerMessage, requestGps, type GpsStatus } from "@/lib/gps"
import {
  initialMarkerState,
  markerReducer,
} from "@/lib/markers"
import type { Property } from "@/lib/properties/types"

export function ExploreClient({ properties }: { properties: Property[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  )

  const [gps, setGps] = useState<GpsStatus>({ kind: "idle" })
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
    if (next.sort === "distance" && !userPos) {
      // keep requested; GPS button will enable meaningful sort
    }
    pushFilters(next)
  }

  const locateMe = useCallback(async () => {
    setGps({ kind: "pending" })
    const status = await requestGps(
      typeof navigator !== "undefined" ? navigator.geolocation : null,
    )
    setGps(status)
    if (status.kind === "success") {
      pushFilters({ ...filters, sort: "distance" })
    }
  }, [filters, pathname]) // eslint-disable-line react-hooks/exhaustive-deps

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
        <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem]">
          <PropertyMapDynamic
            properties={list}
            selectedId={markerState.selectedId}
            expandedId={markerState.expandedId}
            center={userPos}
            onExpand={(id) => dispatchMarker({ type: "expand", id })}
            onCollapse={() => dispatchMarker({ type: "collapse" })}
            onSelect={(id) => dispatchMarker({ type: "select", id })}
          />
        </div>

        <div className="pointer-events-none relative flex h-full flex-col">
          <div className="pointer-events-auto">
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
              count={list.length}
              onChange={patch}
              gpsActive={Boolean(userPos)}
              gpsPending={gps.kind === "pending"}
              onLocate={locateMe}
            />

            {list.length === 0 ? (
              <div className="flex w-fit max-w-md flex-col items-start gap-3 rounded-[1.5rem] bg-chrome p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <p className="font-display text-2xl">Sin resultados</p>
                <p className="text-sm text-fg-muted">
                  Probá limpiar los filtros o ampliar el rango de precio.
                </p>
                <Link href="/propiedades">
                  <Button>Limpiar filtros</Button>
                </Link>
              </div>
            ) : (
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1">
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
  count,
  onChange,
  gpsActive,
  gpsPending,
  onLocate,
}: {
  filters: PropertyFilters
  count: number
  onChange: (partial: Partial<PropertyFilters>) => void
  gpsActive: boolean
  gpsPending: boolean
  onLocate: () => void
}) {
  const priceOk = priceControlsEnabled(filters)

  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-full bg-chrome px-2 py-1.5 text-fg shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
      <p className="shrink-0 px-2 text-xs text-fg-muted">
        {count} en Bolívar
      </p>
      <button
        type="button"
        onClick={onLocate}
        disabled={gpsPending}
        aria-busy={gpsPending}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-fg px-3 py-1.5 text-xs font-medium text-bg hover:opacity-90 disabled:opacity-60"
      >
        <NavigationArrow weight="fill" className="h-3.5 w-3.5" aria-hidden />
        {gpsPending ? "Buscando…" : "Cerca mío"}
      </button>
      <Segment
        label="Operación"
        value={filters.op ?? ""}
        options={[
          { value: "", label: "Todas" },
          { value: "sale", label: "Venta" },
          { value: "rent", label: "Alquiler" },
        ]}
        onChange={(v) => onChange({ op: (v || undefined) as PropertyFilters["op"] })}
      />
      <Segment
        label="Tipo"
        value={filters.type ?? ""}
        options={[
          { value: "", label: "Todos" },
          { value: "house", label: "Casa" },
          { value: "apartment", label: "Depto" },
          { value: "lot", label: "Lote" },
        ]}
        onChange={(v) => onChange({ type: (v || undefined) as PropertyFilters["type"] })}
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

      <label className="flex shrink-0 items-center gap-2 text-xs text-fg-muted">
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

      <label className={`flex shrink-0 items-center gap-2 text-xs ${priceOk ? "text-fg-muted" : "text-fg-muted/40"}`}>
        Min
        <input
          type="number"
          disabled={!priceOk}
          className="w-24 rounded-full border border-glass-border bg-bg px-2 py-1.5 text-sm text-fg disabled:opacity-40"
          value={filters.min ?? ""}
          onChange={(e) =>
            onChange({ min: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="—"
        />
      </label>
      <label className={`flex shrink-0 items-center gap-2 text-xs ${priceOk ? "text-fg-muted" : "text-fg-muted/40"}`}>
        Max
        <input
          type="number"
          disabled={!priceOk}
          className="w-24 rounded-full border border-glass-border bg-bg px-2 py-1.5 text-sm text-fg disabled:opacity-40"
          value={filters.max ?? ""}
          onChange={(e) =>
            onChange({ max: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="—"
        />
      </label>

      <label className="ml-auto flex shrink-0 items-center gap-2 text-xs text-fg-muted">
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
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex shrink-0 items-center gap-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value || "all"}
          type="button"
          onClick={() => onChange(o.value)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition ${
            value === o.value
              ? "bg-fg text-bg"
              : "text-fg-muted hover:bg-black/5 hover:text-fg dark:hover:bg-white/10"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
