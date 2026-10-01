"use client"

import dynamic from "next/dynamic"

export const PropertyMapDynamic = dynamic(
  () =>
    import("@/components/map/property-map").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full min-h-0 w-full place-items-center bg-[#1a1a1a] animate-pulse-soft">
        <p className="text-sm text-fg-muted">Cargando mapa…</p>
      </div>
    ),
  },
)
