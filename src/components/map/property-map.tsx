"use client"

import { useEffect, useRef } from "react"
import * as maplibregl from "maplibre-gl"

// ponytail: Next bundles maplibre and the worker URL (import.meta.url) 404s.
// These two files are copied from maplibre-gl/dist. Recopy them when bumping maplibre.
maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")
import type { GeoJSONSource, Map as MapLibreMap, Marker } from "maplibre-gl"
import { useTheme } from "@/components/theme-provider"
import { BOLIVAR_CENTER } from "@/lib/brand"
import { formatPrice, operationLabel } from "@/lib/format"
import type { PropertyType, PropertyWithDistance } from "@/lib/properties/types"
import type { StreetLines } from "@/lib/streets"

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
  map.fitBounds(bounds, {
    padding: chromePadding(map),
    pitch: MAP_PITCH,
    bearing: MAP_BEARING,
    maxZoom: 16,
    duration: 700,
  })
}

/** Small filled glyphs in the Phosphor house / buildings / polygon family. */
const TYPE_ICON: Record<PropertyType, string> = {
  house: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 3.1 2.8 11h2.2v9h5.2v-5.6h3.6V20h5.2v-9h2.2L12 3.1z"/></svg>`,
  apartment: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3 21V8.2L9.5 5l6.5 3.2V21H3zm2.2-2h2.2v-2.4H5.2V19zm4.2 0h2.2v-2.4H9.4V19zM5.2 14h2.2v-2.4H5.2V14zm4.2 0h2.2v-2.4H9.4V14zM5.2 9.4h2.2V7H5.2v2.4zm4.2 0h2.2V7H9.4v2.4zM17.2 21V10.4h3.6V21h-3.6zm.9-7.2h1.8V12h-1.8v1.8zm0 3.2h1.8v-1.8h-1.8V17z"/></svg>`,
  lot: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3.5 8.2 12 4l8.5 4.2V16L12 20.2 3.5 16V8.2zm8.5 1.15L6.2 12v3.05L12 17.3l5.8-2.25V12L12 9.35z"/></svg>`,
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

export function PropertyMap({
  properties,
  selectedId,
  expandedId,
  center,
  street,
  onExpand,
  onCollapse,
  onSelect,
}: {
  properties: PropertyWithDistance[]
  selectedId: string | null
  expandedId: string | null
  center?: { lat: number; lng: number } | null
  street?: StreetLines | null
  onExpand: (id: string) => void
  onCollapse: () => void
  onSelect: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<Map<string, Marker>>(new Map())
  const frameRef = useRef<() => void>(() => {})
  const handlersRef = useRef({ onExpand, onCollapse, onSelect })
  handlersRef.current = { onExpand, onCollapse, onSelect }
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

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left")
    map.addControl(
      new maplibregl.AttributionControl({
        compact: false,
        customAttribution: "© OpenStreetMap",
      }),
      "bottom-right",
    )
    map.on("click", () => handlersRef.current.onCollapse())
    mapRef.current = map
    appliedTheme.current = themeRef.current

    const ro = new ResizeObserver(() => {
      map.resize()
      frameRef.current()
    })
    ro.observe(map.getContainer())

    return () => {
      ro.disconnect()
      markersRef.current.forEach((m) => m.remove())
      markersRef.current.clear()
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
      const pad = chromePadding(map)
      if (center) {
        map.easeTo({
          center: [center.lng, center.lat],
          zoom: Math.max(map.getZoom(), 14),
          pitch: MAP_PITCH,
          bearing: MAP_BEARING,
          padding: pad,
        })
        return
      }
      if (streetRef.current?.features.length) return
      map.easeTo({
        center: [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat],
        zoom: CITY_ZOOM,
        pitch: MAP_PITCH,
        bearing: MAP_BEARING,
        padding: pad,
        duration: 600,
      })
    }

    frameRef.current = frame
    if (map.loaded()) frame()
    else map.once("load", () => frameRef.current())
  }, [center])

  useEffect(() => {
    const map = mapRef.current
    if (!map || appliedTheme.current === theme) return
    appliedTheme.current = theme
    map.setStyle(STYLES[theme])
    map.once("style.load", () => {
      lockBarrios(map)
      drawStreet(map, streetRef.current ?? EMPTY_STREET, ACCENT[theme])
    })
  }, [theme])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const data = street ?? EMPTY_STREET
    const run = () => {
      drawStreet(map, data, ACCENT[themeRef.current])
      if (data.features.length) fitStreet(map, data)
    }
    if (map.isStyleLoaded()) run()
    else map.once("style.load", run)
  }, [street])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const existing = markersRef.current
    const nextIds = new Set(properties.map((p) => p.id))

    for (const [id, marker] of existing) {
      if (!nextIds.has(id)) {
        marker.remove()
        existing.delete(id)
      }
    }

    for (const property of properties) {
      const isExpanded = expandedId === property.id
      const isSelected = selectedId === property.id
      const el = document.createElement("div")

      if (isExpanded) {
        el.className = "map-marker-card"
        el.innerHTML = `
          <div style="height:110px;background:#2a2620;overflow:hidden">
            <img src="${property.coverUrl}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'" />
          </div>
          <div style="padding:10px 12px;color:#f3efe6">
            <div style="font-size:11px;color:#a8a297;margin-bottom:4px">${operationLabel(property.operation)}</div>
            <div style="font-family:var(--font-archivo),Impact,sans-serif;font-size:18px;letter-spacing:-0.02em">${formatPrice(property.price, property.currency)}</div>
            <div style="font-size:12px;color:#a8a297;margin-top:4px">${property.beds ? `${property.beds} dorm · ` : ""}${property.areaM2} m²</div>
            <div style="font-size:11px;color:#a8a297;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${property.address}</div>
          </div>
        `
        el.addEventListener("click", (e) => {
          e.stopPropagation()
          handlersRef.current.onSelect(property.id)
          window.location.href = `/propiedades/${property.id}`
        })
      } else {
        el.className = `map-pin is-${property.type}${isSelected ? " is-selected" : ""}`
        el.innerHTML = `<div class="map-pin-badge">${TYPE_ICON[property.type]}</div><div class="map-pin-price">${formatPrice(property.price, property.currency)}</div>`
        el.addEventListener("click", (e) => {
          e.stopPropagation()
          handlersRef.current.onExpand(property.id)
        })
      }

      el.style.zIndex = isExpanded ? "3" : isSelected ? "2" : "1"

      const prev = existing.get(property.id)
      if (prev) {
        prev.remove()
      }
      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([property.lng, property.lat])
        .addTo(map)
      existing.set(property.id, marker)
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
