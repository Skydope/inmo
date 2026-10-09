"use client"

import { useEffect, useRef } from "react"
import * as maplibregl from "maplibre-gl"
import { useTheme } from "@/components/theme-provider"

maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")

const ESTILO = { light: "/mapa/estilo.json", dark: "/mapa/estilo-noche.json" } as const

/** Polígono aproximado de `metros` alrededor del punto. */
function circulo(lng: number, lat: number, metros: number, pasos = 64): [number, number][] {
  const latRad = (lat * Math.PI) / 180
  const mPorGradoLat = 111_320
  const mPorGradoLng = 111_320 * Math.cos(latRad)
  const coords: [number, number][] = []
  for (let i = 0; i <= pasos; i++) {
    const angulo = (i / pasos) * 2 * Math.PI
    coords.push([
      lng + (metros * Math.cos(angulo)) / mPorGradoLng,
      lat + (metros * Math.sin(angulo)) / mPorGradoLat,
    ])
  }
  return coords
}

/** Mapa quieto: un pin, o un círculo de ~300 m si la dirección no se muestra. */
export function MapaChico({
  lat,
  lng,
  pin,
}: {
  lat: number
  lng: number
  pin: boolean
}) {
  const { theme } = useTheme()
  const contenedor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contenedor.current
    if (!el) return
    const mapa = new maplibregl.Map({
      container: el,
      style: ESTILO[theme],
      center: [lng, lat],
      zoom: pin ? 15 : 14,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    })
    mapa.on("load", () => {
      if (pin) {
        const marca = document.createElement("div")
        marca.className = "size-4 rounded-full border-2 border-blanco bg-plano-700 shadow"
        new maplibregl.Marker({ element: marca }).setLngLat([lng, lat]).addTo(mapa)
        return
      }
      const coords = circulo(lng, lat, 300)
      mapa.addSource("area", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [coords] } },
      })
      mapa.addLayer({
        id: "area",
        type: "fill",
        source: "area",
        paint: { "fill-color": "#1a1a1a", "fill-opacity": 0.18 },
      })
      mapa.addLayer({
        id: "area-linea",
        type: "line",
        source: "area",
        paint: { "line-color": "#1a1a1a", "line-width": 1.5 },
      })
      const limites = new maplibregl.LngLatBounds(coords[0], coords[0])
      for (const coord of coords) limites.extend(coord)
      mapa.fitBounds(limites, { padding: 24, animate: false })
    })
    return () => mapa.remove()
  }, [lat, lng, pin, theme])

  return <div ref={contenedor} className="size-full" />
}
