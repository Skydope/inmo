"use client"

import dynamic from "next/dynamic"

export const PropertyMapDynamic = dynamic(
  () =>
    import("@/components/map/property-map").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full min-h-[420px] place-items-center rounded-[1.5rem] border border-glass-border glass animate-pulse-soft">
        <p className="text-sm text-fg-muted">Cargando mapa…</p>
      </div>
    ),
  },
)
