"use client"

import dynamic from "next/dynamic"

/** El mapa no entra en la carga inicial: se pide recién al abrir la vista mapa. */
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

/** Pedir el código del mapa antes de que haga falta (cuando la lista ya se ve). */
export const precargarMapa = () => import("@/components/map/property-map")
