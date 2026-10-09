"use client"

import { useEffect, useRef, useState } from "react"
import * as maplibregl from "maplibre-gl"

maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")

const ESTILO = "/mapa/estilo.json"

/** Pin del aviso. Se pide solo en el paso de ubicación. */
export function MapaPin({
  lat,
  lng,
  onMover,
}: {
  lat: number
  lng: number
  onMover: (lugar: { lat: number; lng: number }) => void
}) {
  const caja = useRef<HTMLDivElement>(null)
  const pin = useRef<maplibregl.Marker | null>(null)
  const alMover = useRef(onMover)
  const [inicio] = useState(() => ({ lat, lng }))

  useEffect(() => {
    alMover.current = onMover
  }, [onMover])

  useEffect(() => {
    const nodo = caja.current
    if (!nodo) return
    const m = new maplibregl.Map({
      container: nodo,
      style: ESTILO,
      center: [inicio.lng, inicio.lat],
      zoom: 15,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    })
    m.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right")
    m.getCanvas().style.cursor = "crosshair"
    const el = document.createElement("div")
    el.className = "size-8 rounded-full border-2 border-blanco bg-plano-700 shadow"
    const marca = new maplibregl.Marker({ element: el, anchor: "center", draggable: true })
      .setLngLat([inicio.lng, inicio.lat])
      .addTo(m)
    marca.on("dragend", () => {
      const p = marca.getLngLat()
      alMover.current({ lat: p.lat, lng: p.lng })
    })
    const alClick = (event: maplibregl.MapMouseEvent) => {
      alMover.current({ lat: event.lngLat.lat, lng: event.lngLat.lng })
    }
    m.on("click", alClick)
    pin.current = marca
    return () => {
      m.off("click", alClick)
      marca.remove()
      m.remove()
      pin.current = null
    }
  }, [inicio])

  useEffect(() => {
    pin.current?.setLngLat([lng, lat])
  }, [lat, lng])

  return <div ref={caja} className="h-56 w-full overflow-hidden rounded-control border border-linea" />
}
