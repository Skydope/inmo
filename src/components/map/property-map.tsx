"use client"

import { useEffect, useRef } from "react"
import * as maplibregl from "maplibre-gl"

// ponytail: Next bundles maplibre and the worker URL (import.meta.url) 404s.
// These two files are copied from maplibre-gl/dist. Recopy them when bumping maplibre.
maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")
import type { GeoJSONSource, Map as MapLibreMap, Marker } from "maplibre-gl"
import { useTheme } from "@/components/theme-provider"
import { BOLIVAR_CENTER } from "@/lib/brand"
import { formatPrice, formatPriceCompact } from "@/lib/format"
import type { PropertyType, Property } from "@/lib/properties/types"
import { markerElementClass } from "@/lib/markers"
import { getStreetMidpoint, type StreetLines } from "@/lib/streets"

const STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
} as const
const MAP_PITCH = 48
const MAP_BEARING = -18
// Carto only draws suburb/neighbourhood labels from zoom 12. Floor there so they never drop out.
const MIN_ZOOM = 12
const CITY_ZOOM = 13.7
const ACCENT = { light: "#1a1a1a", dark: "#c4a574" } as const
const EMPTY_STREET: StreetLines = { type: "FeatureCollection", features: [] }

function drawStreet(map: MapLibreMap, data: StreetLines, color: string) {
  if (!map.isStyleLoaded()) return
  const src = map.getSource("street") as GeoJSONSource | undefined
  if (!src) {
    map.addSource("street", { type: "geojson", data })
    map.addLayer({
      id: "street-line",
      type: "line",
      source: "street",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": color, "line-width": 6, "line-opacity": 0.95 },
    })
    return
  }
  src.setData(data)
  if (map.getLayer("street-line")) map.setPaintProperty("street-line", "line-color", color)
}

function fitStreet(map: MapLibreMap, data: StreetLines) {
  const bounds = new maplibregl.LngLatBounds()
  for (const feature of data.features) {
    for (const coord of feature.geometry.coordinates) bounds.extend(coord)
  }
  if (bounds.isEmpty()) return
  const h = map.getContainer().clientHeight || 640
  const pad = {
    top: 60,
    bottom: Math.min(160, Math.round(h * 0.22)),
    left: 40,
    right: 40,
  }
  const cam = map.cameraForBounds(bounds, {
    padding: pad,
    bearing: MAP_BEARING,
    maxZoom: 16.2,
  })
  if (cam && typeof cam.zoom === "number") {
    map.easeTo({
      center: cam.center,
      zoom: Math.max(14.8, Math.min(16.2, cam.zoom)),
      pitch: 24,
      bearing: MAP_BEARING,
      duration: 700,
    })
  } else {
    const mid = getStreetMidpoint(data)
    if (mid) {
      map.easeTo({
        center: [mid.lng, mid.lat],
        zoom: 15.5,
        pitch: 24,
        bearing: MAP_BEARING,
        duration: 700,
      })
    }
  }
}

function updateStreetMarker(
  map: MapLibreMap,
  data: StreetLines | null,
  markerRef: React.MutableRefObject<Marker | null>,
) {
  if (markerRef.current) {
    markerRef.current.remove()
    markerRef.current = null
  }
  if (!data?.features.length) return

  const mid = getStreetMidpoint(data)
  const streetName = data.name || data.features[0]?.properties?.name
  if (!mid || !streetName) return

  const el = document.createElement("div")
  el.className = "map-street-marker"
  el.innerHTML = `<div class="map-street-pill"><svg viewBox="0 0 256 256" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M224,120H136V40h40a8,8,0,0,0,0-16H80a8,8,0,0,0,0,16h40v80H32a8,8,0,0,0-5.66,13.66l24,24a8,8,0,0,0,11.32,0L78.34,136H120v80H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16H136V136h72l16.68,16.68a8,8,0,0,0,11.32,0l24-24A8,8,0,0,0,224,120Z"/></svg><span>${esc(streetName)}</span></div>`

  markerRef.current = new maplibregl.Marker({ element: el, anchor: "bottom" })
    .setLngLat([mid.lng, mid.lat])
    .addTo(map)
}

/** Small filled glyphs in the Phosphor house / buildings / polygon family. */
const ICON_HOUSE = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 3.1 2.8 11h2.2v9h5.2v-5.6h3.6V20h5.2v-9h2.2L12 3.1z"/></svg>`
const ICON_APARTMENT = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3 21V8.2L9.5 5l6.5 3.2V21H3zm2.2-2h2.2v-2.4H5.2V19zm4.2 0h2.2v-2.4H9.4V19zM5.2 14h2.2v-2.4H5.2V14zm4.2 0h2.2v-2.4H9.4V14zM5.2 9.4h2.2V7H5.2v2.4zm4.2 0h2.2V7H9.4v2.4zM17.2 21V10.4h3.6V21h-3.6zm.9-7.2h1.8V12h-1.8v1.8zm0 3.2h1.8v-1.8h-1.8V17z"/></svg>`
const ICON_LOT = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3.5 8.2 12 4l8.5 4.2V16L12 20.2 3.5 16V8.2zm8.5 1.15L6.2 12v3.05L12 17.3l5.8-2.25V12L12 9.35z"/></svg>`

const TYPE_ICON: Record<PropertyType, string> = {
  house: ICON_HOUSE,
  apartment: ICON_APARTMENT,
  ph: ICON_APARTMENT,
  lot: ICON_LOT,
  commercial: ICON_APARTMENT,
  rural: ICON_LOT,
  vacational_house: ICON_HOUSE,
}

function esc(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  )
}

function previewHtml(property: Property) {
  const meta = [
    property.beds > 0 ? `${property.beds} dorm` : "",
    property.baths > 0 ? `${property.baths} baños` : "",
    `${property.areaM2} m²`,
  ]
    .filter(Boolean)
    .join(" · ")
  return `<div class="map-pin-preview">
    <img src="${esc(property.coverUrl)}" alt="" />
    <div class="map-pin-preview-body">
      <p class="map-pin-preview-title">${esc(property.title)}</p>
      <p class="map-pin-preview-address">${esc(property.address)}</p>
      <p class="map-pin-preview-price">${esc(formatPrice(property.price, property.currency))}</p>
      <p class="map-pin-preview-meta">${esc(meta)}</p>
      <a class="map-pin-detail" href="/propiedades/${esc(property.id)}">Ver detalle</a>
    </div>
  </div>`
}

function lockBarrios(map: MapLibreMap) {
  for (const id of ["place_suburbs", "place_hamlet"]) {
    if (map.getLayer(id)) map.setLayerZoomRange(id, MIN_ZOOM, 24)
  }
}

/** ponytail: bottom pad is a fraction of the map so the filmstrip doesn't cover the houses; if the strip grows past ~45% of the viewport, raise the cap. */
function chromePadding(map: MapLibreMap) {
  const h = map.getContainer().clientHeight || 640
  return {
    top: Math.min(88, Math.round(h * 0.14)),
    bottom: Math.min(360, Math.round(h * 0.46)),
    left: 40,
    right: 40,
  }
}

type MarkerEntry = {
  marker: Marker
  el: HTMLDivElement
  isExpanded: boolean
  isSelected: boolean
}

export function PropertyMap({
  properties,
  selectedId,
  expandedId,
  street,
  onExpand,
  onCollapse,
  onDeselect,
  onSelect,
}: {
  properties: Property[]
  selectedId: string | null
  expandedId: string | null
  street?: StreetLines | null
  onExpand: (id: string) => void
  onCollapse: () => void
  onDeselect: () => void
  onSelect: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Map<string, MarkerEntry>>(new Map())
  const streetMarkerRef = useRef<Marker | null>(null)
  const frameRef = useRef<() => void>(() => {})
  const handlersRef = useRef({ onExpand, onCollapse, onDeselect, onSelect })
  handlersRef.current = { onExpand, onCollapse, onDeselect, onSelect }
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme
  const appliedTheme = useRef(theme)
  const streetRef = useRef<StreetLines | null>(street ?? null)
  streetRef.current = street ?? null
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLES[themeRef.current],
      center: [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat],
      zoom: CITY_ZOOM,
      minZoom: MIN_ZOOM,
      pitch: MAP_PITCH,
      bearing: MAP_BEARING,
      attributionControl: false,
    })

    map.on("style.load", () => {
      lockBarrios(map)
      drawStreet(map, streetRef.current ?? EMPTY_STREET, ACCENT[themeRef.current])
    })

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: "© OpenStreetMap",
      }),
      "top-left",
    )
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left")
    // MapLibre adds compact-show on init, so the credit starts expanded.
    const attrib = map.getContainer().querySelector(".maplibregl-ctrl-attrib")
    attrib?.classList.remove("maplibregl-compact-show")
    attrib?.removeAttribute("open")
    map.on("click", (e) => {
      const target = e.originalEvent.target
      if (target instanceof Element && target.closest(".map-pin, .maplibregl-ctrl")) return
      handlersRef.current.onDeselect()
    })
    mapRef.current = map
    appliedTheme.current = themeRef.current

    const ro = new ResizeObserver(() => {
      map.resize()
      frameRef.current()
    })
    ro.observe(map.getContainer())

    return () => {
      ro.disconnect()
      markersRef.current.forEach((m) => m.marker.remove())
      markersRef.current.clear()
      if (streetMarkerRef.current) {
        streetMarkerRef.current.remove()
        streetMarkerRef.current = null
      }
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const frame = () => {
      const h = map.getContainer().clientHeight
      if (h < 200) return
      if (streetRef.current?.features.length) return
      map.easeTo({
        center: [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat],
        zoom: CITY_ZOOM,
        pitch: MAP_PITCH,
        bearing: MAP_BEARING,
        padding: chromePadding(map),
        duration: 600,
      })
    }

    frameRef.current = frame
    if (map.loaded()) frame()
    else map.once("load", () => frameRef.current())
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || appliedTheme.current === theme) return
    appliedTheme.current = theme
    map.setStyle(STYLES[theme], { diff: false })
    map.once("style.load", () => {
      lockBarrios(map)
      drawStreet(map, streetRef.current ?? EMPTY_STREET, ACCENT[theme])
      updateStreetMarker(map, streetRef.current, streetMarkerRef)
    })
  }, [theme])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const data = street ?? EMPTY_STREET
    const run = () => {
      drawStreet(map, data, ACCENT[themeRef.current])
      if (data.features.length) {
        fitStreet(map, data)
      }
      updateStreetMarker(map, street ?? null, streetMarkerRef)
    }
    if (map.isStyleLoaded()) run()
    else map.once("style.load", run)
  }, [street])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const existing = markersRef.current
    const nextIds = new Set(properties.map((p) => p.id))

    for (const [id, entry] of existing) {
      if (!nextIds.has(id)) {
        entry.marker.remove()
        existing.delete(id)
      }
    }

    for (const property of properties) {
      const isExpanded = expandedId === property.id
      const isSelected = selectedId === property.id
      const prev = existing.get(property.id)

      if (prev) {
        if (prev.isExpanded === isExpanded && prev.isSelected === isSelected) {
          continue
        }

        const el = prev.el
        el.className = markerElementClass(el.className, property.type, isSelected, isExpanded)
        el.style.zIndex = isExpanded || isSelected ? "10" : "1"
        el.setAttribute("aria-expanded", String(isExpanded))

        if (prev.isExpanded !== isExpanded) {
          el.innerHTML = `${
            isExpanded
              ? previewHtml(property)
              : `<div class="map-pin-price">${esc(formatPriceCompact(property.price, property.currency))}</div>`
          }<div class="map-pin-badge">${TYPE_ICON[property.type]}</div>`
        }

        prev.isExpanded = isExpanded
        prev.isSelected = isSelected
        continue
      }

      const el = document.createElement("div")
      el.setAttribute("role", "button")
      el.setAttribute("tabindex", "0")
      el.setAttribute("aria-label", `${property.title}, ${formatPrice(property.price, property.currency)}`)
      el.setAttribute("aria-expanded", String(isExpanded))
      el.className = markerElementClass(el.className, property.type, isSelected, isExpanded)
      el.innerHTML = `${
        isExpanded
          ? previewHtml(property)
          : `<div class="map-pin-price">${esc(formatPriceCompact(property.price, property.currency))}</div>`
      }<div class="map-pin-badge">${TYPE_ICON[property.type]}</div>`
      el.style.zIndex = isExpanded || isSelected ? "10" : "1"

      el.addEventListener("click", (e) => {
        e.stopPropagation()
        const target = e.target as HTMLElement
        if (target.closest(".map-pin-detail")) return
        if (el.classList.contains("is-open") && target.closest(".map-pin-badge")) {
          handlersRef.current.onCollapse()
        } else if (!el.classList.contains("is-open")) {
          handlersRef.current.onExpand(property.id)
        }
      })

      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (el.classList.contains("is-open")) {
            handlersRef.current.onCollapse()
          } else {
            handlersRef.current.onExpand(property.id)
          }
        }
      })

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([property.lng, property.lat])
        .addTo(map)

      existing.set(property.id, {
        marker,
        el,
        isExpanded,
        isSelected,
      })
    }
  }, [properties, selectedId, expandedId])

  return (
    <div
      className={`map-stage relative h-full min-h-0 w-full ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-[#f4f0e8]"}`}
    >
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}
