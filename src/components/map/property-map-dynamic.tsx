"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import type { PropertyWithDistance } from "@/lib/properties/types"
import type { StreetLines } from "@/lib/streets"

const GoogleMapComponent = dynamic(
  () => import("@/components/map/google-property-map").then((m) => m.GooglePropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full min-h-0 w-full place-items-center bg-bg animate-pulse-soft">
        <p className="text-sm text-fg-muted">Cargando Google Maps…</p>
      </div>
    ),
  },
)

const CartoMapComponent = dynamic(
  () => import("@/components/map/property-map").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full min-h-0 w-full place-items-center bg-bg animate-pulse-soft">
        <p className="text-sm text-fg-muted">Cargando mapa Carto…</p>
      </div>
    ),
  },
)

export function PropertyMapDynamic(props: {
  properties: PropertyWithDistance[]
  selectedId: string | null
  expandedId: string | null
  center?: { lat: number; lng: number } | null
  street?: StreetLines | null
  onExpand: (id: string) => void
  onCollapse: () => void
  onSelect: (id: string) => void
}) {
  // Defaults to "google" on this branch so the user can immediately evaluate Google Maps
  const [provider, setProvider] = useState<"google" | "carto">("google")

  return (
    <div className="relative h-full w-full">
      {/* Map Implementation */}
      {provider === "google" ? (
        <GoogleMapComponent {...props} />
      ) : (
        <CartoMapComponent {...props} />
      )}

      {/* Provider Switcher Pill (for A/B testing & evaluation) */}
      <div className="absolute right-3 top-14 z-20 flex items-center gap-1 rounded-full bg-chrome/90 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md md:right-4 md:top-16">
        <button
          type="button"
          onClick={() => setProvider("google")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
            provider === "google"
              ? "bg-fg text-bg shadow-sm"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          <span>Google Maps</span>
          <span className="rounded-full bg-accent/20 px-1.5 py-0.2 text-[10px] text-accent">
            POIs
          </span>
        </button>

        <button
          type="button"
          onClick={() => setProvider("carto")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            provider === "carto"
              ? "bg-fg text-bg shadow-sm"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          Carto (OSM)
        </button>
      </div>
    </div>
  )
}
