"use client"

import dynamic from "next/dynamic"

/** El mapa de resultados. Aparte del resto de la página: MapLibre no entra en el primer JS. */
export const PropertyMapDynamic = dynamic(
  () => import("@/components/map/property-map").then((m) => m.PropertyMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center bg-papel">
        <p className="text-sm text-tinta-suave">Cargando mapa…</p>
      </div>
    ),
  }
)
