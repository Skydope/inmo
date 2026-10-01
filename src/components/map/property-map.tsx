"use client"

import { useEffect, useRef } from "react"
import * as maplibregl from "maplibre-gl"
import type { Map as MapLibreMap, Marker } from "maplibre-gl"
import { BOLIVAR_CENTER } from "@/lib/brand"
import { formatPrice, operationLabel } from "@/lib/format"
import type { PropertyWithDistance } from "@/lib/properties/types"

const DARK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

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
  const handlersRef = useRef({ onExpand, onCollapse, onSelect })
  handlersRef.current = { onExpand, onCollapse, onSelect }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_STYLE,
      center: [BOLIVAR_CENTER.lng, BOLIVAR_CENTER.lat],
      zoom: 13.2,
      attributionControl: {
        compact: true,
        customAttribution: "© OpenStreetMap",
      },
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right")
    map.on("click", () => handlersRef.current.onCollapse())
    mapRef.current = map

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current.clear()
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !center) return
    map.easeTo({ center: [center.lng, center.lat], zoom: Math.max(map.getZoom(), 13.5) })
  }, [center])

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

      const prev = existing.get(property.id)
      if (prev) {
        prev.remove()
      }
      const marker = new maplibregl.Marker({ element: el, anchor: isExpanded ? "bottom" : "center" })
        .setLngLat([property.lng, property.lat])
        .addTo(map)
      existing.set(property.id, marker)
    }
  }, [properties, selectedId, expandedId])

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-[1.5rem] border border-glass-border bg-bg-elevated">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}
