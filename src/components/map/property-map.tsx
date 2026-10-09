"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import * as maplibregl from "maplibre-gl"

// Next empaqueta maplibre y la URL del worker (import.meta.url) da 404. Estos dos archivos se
// copian de maplibre-gl/dist a public/maplibre: recopiarlos al actualizar maplibre.
maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")
import type { Map as MapLibreMap, Marker } from "maplibre-gl"
import { BOLIVAR_CENTER } from "@/lib/brand"
import { etiquetaTipo, nombreZona } from "@/lib/busqueda"
import { formatPrice, formatPriceCompact } from "@/lib/format"
import { encuadreInicial } from "@/lib/encuadre"
import { markerElementClass } from "@/lib/markers"
import type { Tarjeta } from "@/lib/properties/tarjeta"

/*
 * El mapa de resultados (MapLibre GL, BSD-3). Tiles de OpenFreeMap con un estilo propio
 * (scripts/estilo-mapa.mjs → public/mapa/estilo.json). Arranca plano y al norte; con dos dedos
 * se rota y se inclina (pedido de Manuel, 2026-10-08), y la brújula lo vuelve al norte.
 * Spec: docs/hitos/hito-1/resultados.md § Vista mapa.
 */
const ESTILO = "/mapa/estilo.json"
const ZOOM_CIUDAD = 13.5
// Más lejos que esto (por ejemplo, con propiedades en las localidades), los pines no elegidos
// pasan a puntos: los precios no entran.
const ZOOM_PUNTOS = 13.5
const ZOOM_AL_ELEGIR = 15

type Pin = { marker: Marker; el: HTMLDivElement; elegido: boolean }

function encuadrar(m: MapLibreMap, tarjetas: readonly Tarjeta[], animar: boolean, abajo: number) {
  if (tarjetas.length === 0) return
  const limites = new maplibregl.LngLatBounds()
  for (const t of tarjetas) limites.extend([t.lng, t.lat])
  m.fitBounds(limites, {
    padding: { top: 64, bottom: Math.max(48, abajo), left: 40, right: 40 },
    maxZoom: ZOOM_AL_ELEGIR,
    animate: animar,
  })
}

function esc(valor: string) {
  return valor.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  )
}

const etiquetaDePin = (t: Tarjeta) =>
  `${etiquetaTipo(t.type)} en ${nombreZona(t.zone)}, ${formatPrice(t.price, t.currency)}`

export function PropertyMap({
  tarjetas,
  sel,
  resaltada,
  margenInferior,
  onSeleccionar,
  onDeseleccionar,
}: {
  tarjetas: Tarjeta[]
  sel: string | undefined
  /** Escritorio: el pin de la tarjeta que tiene el mouse encima se destaca. */
  resaltada?: string
  /** Lo que tapa el panel de abajo: el mapa centra los pines por encima. */
  margenInferior: number
  onSeleccionar: (id: string) => void
  onDeseleccionar: () => void
}) {
  const contenedor = useRef<HTMLDivElement>(null)
  const mapa = useRef<MapLibreMap | null>(null)
  const pines = useRef<Map<string, Pin>>(new Map())
  const handlers = useRef({ onSeleccionar, onDeseleccionar })
  const margen = useRef(margenInferior)
  const inicio = useRef({ tarjetas, sel })
  const puntos = useRef(tarjetas)
  const hayElegida = useRef(sel !== undefined)
  // Las refs se actualizan después del render, no durante (regla de React 19).
  useLayoutEffect(() => {
    handlers.current = { onSeleccionar, onDeseleccionar }
    margen.current = margenInferior
    puntos.current = tarjetas
    hayElegida.current = sel !== undefined
  })

  // Crear el mapa una sola vez, encuadrando los resultados (o la propiedad elegida). Los
  // cambios de resultados y de elegido los manejan los efectos de abajo.
  useEffect(() => {
    if (!contenedor.current || mapa.current) return
    const { tarjetas: iniciales, sel: selInicial } = inicio.current
    const elegido = iniciales.find((t) => t.id === selInicial)
    const m = new maplibregl.Map({
      container: contenedor.current,
      style: ESTILO,
      center: elegido ? [elegido.lng, elegido.lat] : [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat],
      zoom: elegido ? ZOOM_AL_ELEGIR : ZOOM_CIUDAD,
      pitch: 0,
      bearing: 0,
      minZoom: 8,
      maxZoom: 18,
      maxPitch: 60,
      attributionControl: false,
    })
    // La atribución (OpenFreeMap © OpenMapTiles · OpenStreetMap) la trae el TileJSON de la fuente.
    m.addControl(new maplibregl.AttributionControl({ compact: true }), "top-left")
    m.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-right")

    if (!elegido && iniciales.length > 0) {
      // Si la mayoría está en la ciudad, se abre sobre la ciudad.
      const { ids } = encuadreInicial(iniciales)
      encuadrar(m, iniciales.filter((t) => ids.includes(t.id)), false, margen.current + 16)
    }

    const marcarLejos = () => {
      m.getContainer().classList.toggle("is-lejos", m.getZoom() < ZOOM_PUNTOS)
    }
    m.on("zoom", marcarLejos)
    marcarLejos()

    m.on("click", (e) => {
      const destino = e.originalEvent.target
      if (destino instanceof Element && destino.closest(".map-pin, .maplibregl-ctrl")) return
      handlers.current.onDeseleccionar()
    })

    mapa.current = m
    const pinesActuales = pines.current
    const observador = new ResizeObserver(() => m.resize())
    observador.observe(m.getContainer())
    return () => {
      observador.disconnect()
      pinesActuales.forEach((p) => p.marker.remove())
      pinesActuales.clear()
      m.remove()
      mapa.current = null
    }
  }, [])

  // Pines: uno por propiedad, con el precio compacto ("US$120k"); sin precio, "Consultar".
  useEffect(() => {
    const m = mapa.current
    if (!m) return
    const actuales = pines.current
    const ids = new Set(tarjetas.map((t) => t.id))
    for (const [id, pin] of actuales) {
      if (!ids.has(id)) {
        pin.marker.remove()
        actuales.delete(id)
      }
    }
    for (const t of tarjetas) {
      const elegido = t.id === sel
      const previo = actuales.get(t.id)
      if (previo) {
        if (previo.elegido !== elegido) {
          previo.el.className = markerElementClass(previo.el.className, t.type, elegido)
          previo.el.setAttribute("aria-pressed", String(elegido))
          previo.el.style.zIndex = elegido ? "10" : "1"
          previo.elegido = elegido
        }
        continue
      }
      const el = document.createElement("div")
      el.className = markerElementClass("", t.type, elegido)
      el.dataset.id = t.id
      el.setAttribute("role", "button")
      el.setAttribute("tabindex", "0")
      el.setAttribute("aria-label", etiquetaDePin(t))
      el.setAttribute("aria-pressed", String(elegido))
      el.style.zIndex = elegido ? "10" : "1"
      el.innerHTML = `<span class="map-pin-precio">${esc(formatPriceCompact(t.price, t.currency))}</span>`
      el.addEventListener("click", (e) => {
        e.stopPropagation()
        handlers.current.onSeleccionar(t.id)
      })
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handlers.current.onSeleccionar(t.id)
        }
      })
      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([t.lng, t.lat]).addTo(m)
      actuales.set(t.id, { marker, el, elegido })
    }
  }, [tarjetas, sel])

  // Escritorio: el pin de la tarjeta que tiene el mouse encima, destacado y por encima del resto.
  useEffect(() => {
    const pin = resaltada ? pines.current.get(resaltada) : undefined
    if (!pin) return
    pin.el.classList.add("is-resaltado")
    pin.el.style.zIndex = "20"
    return () => {
      pin.el.classList.remove("is-resaltado")
      pin.el.style.zIndex = pin.elegido ? "10" : "1"
    }
  }, [resaltada])

  // El panel de abajo (celular) cambia de alto al medirse: se vuelve a encuadrar si no hay
  // una propiedad elegida. En escritorio el margen es 0 y el mapa usa todo el alto.
  useEffect(() => {
    const m = mapa.current
    if (!m || hayElegida.current) return
    const { ids } = encuadreInicial(puntos.current)
    const cuales = puntos.current.filter((t) => ids.includes(t.id))
    encuadrar(m, cuales, false, margen.current + 16)
  }, [margenInferior])

  // El CSS de MapLibre le pone `position: relative` al contenedor y le gana a las utilidades de
  // Tailwind (van en una capa): el envoltorio es el absoluto y el mapa ocupa el 100 % adentro.
  return (
    <div className="absolute inset-0">
      <div ref={contenedor} className="h-full w-full" />
    </div>
  )
}
