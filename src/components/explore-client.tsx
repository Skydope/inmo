"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useReducer, useState, useTransition } from "react"
import { LayoutGrid, Map as MapIcon, Navigation } from "lucide-react"
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { BOLIVAR_CENTER } from "@/lib/brand"
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

  const userPos =
    gps.kind === "success" ? { lat: gps.lat, lng: gps.lng } : null

  const list = useMemo(
    () => applyFilters(properties, filters, userPos),
    [properties, filters, userPos],
  )

  const mapCenter = userPos ?? BOLIVAR_CENTER
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
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [markerState.selectedId])

  const showMap = filters.view === "map"

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 pb-10 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-fg md:text-4xl">Propiedades</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {list.length} resultado{list.length === 1 ? "" : "s"} en Bolívar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            onClick={locateMe}
            disabled={gps.kind === "pending"}
            aria-busy={gps.kind === "pending"}
          >
            <Navigation className="h-4 w-4" aria-hidden />
            {gps.kind === "pending" ? "Buscando…" : "Cerca mío"}
          </Button>

          <div className="glass flex rounded-full p-1 md:hidden">
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${showMap ? "bg-accent text-bg" : "text-fg-muted"}`}
              onClick={() => patch({ view: "map" })}
            >
              <MapIcon className="h-3.5 w-3.5" /> Mapa
            </button>
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${!showMap ? "bg-accent text-bg" : "text-fg-muted"}`}
              onClick={() => patch({ view: "grid" })}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Lista
            </button>
          </div>
        </div>
      </div>

      <FilterBar filters={filters} onChange={patch} gpsActive={Boolean(userPos)} />

      {banner ? (
        <div
          role="status"
          className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-fg"
        >
          {banner}
        </div>
      ) : null}

      {list.length === 0 ? (
        <div className="glass flex flex-col items-start gap-4 rounded-[1.5rem] p-8">
          <p className="font-display text-2xl">Sin resultados</p>
          <p className="text-fg-muted">Probá limpiar los filtros o ampliar el rango de precio.</p>
          <Link href="/propiedades">
            <Button>Limpiar filtros</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(320px,420px)_1fr] lg:items-start">
          <div
            className={`max-h-[calc(100dvh-11rem)] space-y-4 overflow-y-auto pr-1 ${showMap ? "hidden lg:block" : "block"}`}
          >
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

          <div
            className={`sticky top-24 h-[calc(100dvh-8rem)] min-h-[420px] ${showMap ? "block" : "hidden lg:block"}`}
          >
            <PropertyMapDynamic
              properties={list}
              selectedId={markerState.selectedId}
              expandedId={markerState.expandedId}
              center={mapCenter}
              onExpand={(id) => dispatchMarker({ type: "expand", id })}
              onCollapse={() => dispatchMarker({ type: "collapse" })}
              onSelect={(id) => dispatchMarker({ type: "select", id })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function FilterBar({
  filters,
  onChange,
  gpsActive,
}: {
  filters: PropertyFilters
  onChange: (partial: Partial<PropertyFilters>) => void
  gpsActive: boolean
}) {
  const priceOk = priceControlsEnabled(filters)

  return (
    <div className="glass flex flex-wrap items-center gap-2 rounded-[1.25rem] p-3">
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

      <label className="flex items-center gap-2 text-xs text-fg-muted">
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

      <label className={`flex items-center gap-2 text-xs ${priceOk ? "text-fg-muted" : "text-fg-muted/40"}`}>
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
      <label className={`flex items-center gap-2 text-xs ${priceOk ? "text-fg-muted" : "text-fg-muted/40"}`}>
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

      <label className="ml-auto flex items-center gap-2 text-xs text-fg-muted">
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
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value || "all"}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3 py-1.5 text-xs transition ${
            value === o.value
              ? "bg-accent text-bg"
              : "text-fg-muted hover:bg-white/5 hover:text-fg"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
