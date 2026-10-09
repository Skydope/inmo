"use client"

import { useEffect, useRef } from "react"
import * as maplibregl from "maplibre-gl"
import { BOLIVAR_CENTER } from "@/lib/brand"

maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")

const ESTILO = "/mapa/estilo.json"

/** Mapa chico de la oficina. El pin es el logo elegido en el paso anterior. */
export function MapaOficina({
  lat,
  lng,
  logo,
  onMover,
}: {
  lat: number | null
  lng: number | null
  logo: string
  onMover: (lugar: { lat: number; lng: number }) => void
}) {
  const caja = useRef<HTMLDivElement>(null)
  const mapa = useRef<maplibregl.Map | null>(null)
  const pin = useRef<maplibregl.Marker | null>(null)
  const logoRef = useRef(logo)
  const alMover = useRef(onMover)
  logoRef.current = logo
  alMover.current = onMover

  useEffect(() => {
    if (!caja.current || mapa.current) return
    const m = new maplibregl.Map({
      container: caja.current,
      style: ESTILO,
      center: [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    })
    m.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right")
    m.getCanvas().style.cursor = "crosshair"
    const alClick = (event: maplibregl.MapMouseEvent) => {
      alMover.current({ lat: event.lngLat.lat, lng: event.lngLat.lng })
    }
    m.on("click", alClick)
    mapa.current = m
    return () => {
      m.off("click", alClick)
      pin.current?.remove()
      m.remove()
      mapa.current = null
    }
  }, [])

  useEffect(() => {
    const m = mapa.current
    if (!m || lat == null || lng == null) return
    const poner = () => {
      const el = document.createElement("div")
      el.className = "size-11 overflow-hidden rounded-full border-2 border-blanco bg-blanco shadow"
      const img = document.createElement("img")
      img.src = logoRef.current
      img.alt = ""
      img.className = "size-full object-cover"
      el.append(img)
      pin.current?.remove()
      const marca = new maplibregl.Marker({ element: el, anchor: "center", draggable: true })
        .setLngLat([lng, lat])
        .addTo(m)
      marca.on("dragend", () => {
        const p = marca.getLngLat()
        alMover.current({ lat: p.lat, lng: p.lng })
      })
      pin.current = marca
      const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      m.easeTo({ center: [lng, lat], zoom: 16, duration: suave ? 400 : 0 })
    }
    if (m.loaded()) poner()
    else m.once("load", poner)
  }, [lat, lng])

  useEffect(() => {
    const img = pin.current?.getElement().querySelector("img")
    if (img) img.src = logo
  }, [logo])

  return <div ref={caja} className="h-56 w-full overflow-hidden rounded-control border border-linea" />
}
