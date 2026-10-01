"use client"

import { useEffect, useRef } from "react"
import * as maplibregl from "maplibre-gl"
import type { Map as MapLibreMap, Marker } from "maplibre-gl"
import { BOLIVAR_CENTER } from "@/lib/brand"
import { formatPrice, operationLabel } from "@/lib/format"
import type { PropertyWithDistance } from "@/lib/properties/types"

const DARK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

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
  onExpand,
  onCollapse,
  onSelect,
}: {
  properties: PropertyWithDistance[]
  selectedId: string | null
  expandedId: string | null
  center?: { lat: number; lng: number } | null
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

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_STYLE,
      center: [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat],
      zoom: 13.2,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left")
    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: "© OpenStreetMap",
      }),
      "top-left",
    )
    map.on("click", () => handlersRef.current.onCollapse())
    mapRef.current = map

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
          padding: pad,
        })
        return
      }
      if (properties.length === 0) {
        map.easeTo({
          center: [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat],
          zoom: 13.2,
          padding: pad,
        })
        return
      }
      const bounds = new maplibregl.LngLatBounds()
      for (const property of properties) bounds.extend([property.lng, property.lat])
      map.fitBounds(bounds, { padding: pad, maxZoom: 15, duration: 600 })
    }

    frameRef.current = frame
    if (map.loaded()) frame()
    else map.once("load", () => frameRef.current())
  }, [properties, center])

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
        el.className = `map-marker-pill${isSelected ? " is-selected" : ""}`
        el.textContent = formatPrice(property.price, property.currency)
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
    <div className="map-stage relative h-full min-h-0 w-full bg-[#1a1a1a]">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}
