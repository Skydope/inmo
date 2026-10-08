"use client"

import dynamic from "next/dynamic"

export const PropertyMapDynamic = dynamic(
  () => import("@/components/map/property-map").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full min-h-0 w-full place-items-center bg-papel">
        <p className="text-sm text-tinta-suave">Cargando mapa…</p>
      </div>
    ),
  },
)
