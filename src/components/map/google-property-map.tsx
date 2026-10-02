"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { BOLIVAR_CENTER } from "@/lib/brand"
import { formatPrice } from "@/lib/format"
import { loadGoogleMaps } from "@/lib/map/google-maps-loader"
import { GOOGLE_MAPS_DARK_STYLE, GOOGLE_MAPS_LIGHT_STYLE } from "@/lib/map/google-maps-styles"
import { Plus, Minus } from "@phosphor-icons/react"
import type { PropertyType, PropertyWithDistance } from "@/lib/properties/types"
import type { StreetLines } from "@/lib/streets"

const CITY_ZOOM = 14
const ACCENT = { light: "#1a1a1a", dark: "#c4a574" } as const

const TYPE_ICON: Record<PropertyType, string> = {
  house: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 3.1 2.8 11h2.2v9h5.2v-5.6h3.6V20h5.2v-9h2.2L12 3.1z"/></svg>`,
  apartment: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3 21V8.2L9.5 5l6.5 3.2V21H3zm2.2-2h2.2v-2.4H5.2V19zm4.2 0h2.2v-2.4H9.4V19zM5.2 14h2.2v-2.4H5.2V14zm4.2 0h2.2v-2.4H9.4V14zM5.2 9.4h2.2V7H5.2v2.4zm4.2 0h2.2V7H9.4v2.4zM17.2 21V10.4h3.6V21h-3.6zm.9-7.2h1.8V12h-1.8v1.8zm0 3.2h1.8v-1.8h-1.8V17z"/></svg>`,
  lot: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M3.5 8.2 12 4l8.5 4.2V16L12 20.2 3.5 16V8.2zm8.5 1.15L6.2 12v3.05L12 17.3l5.8-2.25V12L12 9.35z"/></svg>`,
}

function esc(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  )
}

function previewHtml(property: PropertyWithDistance) {
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

function chromePadding(container: HTMLElement | null) {
  const h = container?.clientHeight || 640
  return {
    top: Math.min(88, Math.round(h * 0.14)),
    bottom: Math.min(360, Math.round(h * 0.46)),
    left: 40,
    right: 40,
  }
}

class PropertyOverlay extends google.maps.OverlayView {
  public element: HTMLElement
  public position: google.maps.LatLng

  constructor(element: HTMLElement, position: google.maps.LatLng, map: google.maps.Map) {
    super()
    this.element = element
    this.position = position
    this.setMap(map)
  }

  onAdd() {
    this.element.style.position = "absolute"
    this.element.style.transform = "translate(-50%, -100%)"
    const panes = this.getPanes()
    panes?.overlayMouseTarget.appendChild(this.element)
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.element)
  }

  draw() {
    const projection = this.getProjection()
    if (!projection) return
    const point = projection.fromLatLngToDivPixel(this.position)
    if (point) {
      this.element.style.left = `${point.x}px`
      this.element.style.top = `${point.y}px`
    }
  }

  onRemove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
  }

  getContainerPixel(): { x: number; y: number } | null {
    const projection = this.getProjection()
    if (!projection) return null
    return projection.fromLatLngToContainerPixel(this.position)
  }
}

export function GooglePropertyMap({
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
  const mapRef = useRef<google.maps.Map | null>(null)
  const overlaysRef = useRef<Map<string, PropertyOverlay>>(new Map())
  const polylinesRef = useRef<google.maps.Polyline[]>([])
  const handlersRef = useRef({ onExpand, onCollapse, onSelect })
  handlersRef.current = { onExpand, onCollapse, onSelect }

  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme

  const [mapType, setMapType] = useState<"styled" | "hybrid">("styled")
  const mapTypeRef = useRef(mapType)
  mapTypeRef.current = mapType

  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId

  // Price label collision avoidance
  const layoutPrices = () => {
    const map = mapRef.current
    if (!map) return

    const items: { id: string; x: number; y: number; w: number; price: HTMLElement }[] = []
    overlaysRef.current.forEach((overlay, id) => {
      const price = overlay.element.querySelector(".map-pin-price") as HTMLElement | null
      if (!price) return
      price.style.visibility = "visible"
      const pt = overlay.getContainerPixel()
      if (pt) {
        items.push({ id, x: pt.x, y: pt.y, w: price.offsetWidth, price })
      }
    })

    items.sort((a, b) => Number(b.id === selectedIdRef.current) - Number(a.id === selectedIdRef.current))
    const shown: { x: number; y: number; w: number }[] = []
    for (const item of items) {
      const hit = shown.some((s) => {
        const gap = 4
        const horizontal = Math.abs(item.x - s.x) < (item.w + s.w) / 2 + gap
        const vertical = Math.abs(item.y - s.y) < 64
        return horizontal && vertical
      })
      item.price.style.visibility = hit ? "hidden" : "visible"
      if (!hit) shown.push(item)
    }
  }

  // Initialize Google Maps instance
  useEffect(() => {
    let active = true

    loadGoogleMaps()
      .then((gMaps) => {
        if (!active || !containerRef.current || mapRef.current) return

        const currentStyle = themeRef.current === "dark" ? GOOGLE_MAPS_DARK_STYLE : GOOGLE_MAPS_LIGHT_STYLE

        const map = new gMaps.Map(containerRef.current, {
          center: { lat: BOLIVAR_CENTER.lat, lng: BOLIVAR_CENTER.lng },
          zoom: CITY_ZOOM,
          styles: currentStyle,
          mapTypeId: mapTypeRef.current === "hybrid" ? gMaps.MapTypeId.HYBRID : gMaps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: false,
          gestureHandling: "greedy",
          backgroundColor: themeRef.current === "dark" ? "#191817" : "#f4f0e8",
        })

        map.addListener("click", () => {
          handlersRef.current.onCollapse()
        })

        map.addListener("idle", () => {
          layoutPrices()
        })

        map.addListener("bounds_changed", () => {
          layoutPrices()
        })

        mapRef.current = map
        setLoaded(true)
      })
      .catch((err) => {
        if (active) setLoadError(err.message || "Error al cargar Google Maps")
      })

    return () => {
      active = false
      overlaysRef.current.forEach((o) => o.setMap(null))
      overlaysRef.current.clear()
      polylinesRef.current.forEach((p) => p.setMap(null))
      polylinesRef.current = []
      mapRef.current = null
    }
  }, [])

  // Sync theme or MapType changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps) return

    if (mapType === "hybrid") {
      map.setMapTypeId(window.google.maps.MapTypeId.HYBRID)
    } else {
      map.setMapTypeId(window.google.maps.MapTypeId.ROADMAP)
      const styles = theme === "dark" ? GOOGLE_MAPS_DARK_STYLE : GOOGLE_MAPS_LIGHT_STYLE
      map.setOptions({
        styles,
        backgroundColor: theme === "dark" ? "#191817" : "#f4f0e8",
      })
    }
  }, [theme, mapType])

  // Center / camera pan
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return

    if (center) {
      map.panTo({ lat: center.lat, lng: center.lng })
      map.setZoom(Math.max(map.getZoom() ?? CITY_ZOOM, 15))
    }
  }, [center, loaded])

  // Street polylines
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded || !window.google?.maps) return

    polylinesRef.current.forEach((p) => p.setMap(null))
    polylinesRef.current = []

    if (!street || !street.features.length) return

    const accentColor = ACCENT[theme]
    const bounds = new window.google.maps.LatLngBounds()

    for (const feature of street.features) {
      const coords = feature.geometry.coordinates.map(([lng, lat]) => {
        const pt = { lat, lng }
        bounds.extend(pt)
        return pt
      })

      const poly = new window.google.maps.Polyline({
        path: coords,
        strokeColor: accentColor,
        strokeOpacity: 0.95,
        strokeWeight: 6,
        map,
        zIndex: 5,
      })
      polylinesRef.current.push(poly)
    }

    if (!bounds.isEmpty()) {
      const pad = chromePadding(containerRef.current)
      map.fitBounds(bounds, pad)
    }
  }, [street, loaded, theme])

  // Marker lifecycle
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded || !window.google?.maps) return

    const existing = overlaysRef.current
    const nextIds = new Set(properties.map((p) => p.id))

    // Remove deleted
    for (const [id, overlay] of existing) {
      if (!nextIds.has(id)) {
        overlay.setMap(null)
        existing.delete(id)
      }
    }

    // Upsert markers
    for (const property of properties) {
      const isExpanded = expandedId === property.id
      const isSelected = selectedId === property.id
      const el = document.createElement("div")

      el.className = `map-pin is-${property.type}${isSelected ? " is-selected" : ""}${isExpanded ? " is-open" : ""}`
      el.innerHTML = `${
        isExpanded
          ? previewHtml(property)
          : `<div class="map-pin-price">${esc(formatPrice(property.price, property.currency))}</div>`
      }<div class="map-pin-badge">${TYPE_ICON[property.type]}</div>`

      el.addEventListener("click", (e) => {
        e.stopPropagation()
        const target = e.target as HTMLElement
        if (target.closest(".map-pin-detail")) return
        if (isExpanded && target.closest(".map-pin-badge")) handlersRef.current.onCollapse()
        else if (!isExpanded) handlersRef.current.onExpand(property.id)
      })

      el.style.zIndex = isExpanded ? "30" : isSelected ? "20" : "10"

      const prev = existing.get(property.id)
      if (prev) {
        prev.setMap(null)
      }

      const position = new window.google.maps.LatLng(property.lat, property.lng)
      const overlay = new PropertyOverlay(el, position, map)
      existing.set(property.id, overlay)
    }

    // Trigger price re-layout
    setTimeout(() => layoutPrices(), 50)
  }, [properties, selectedId, expandedId, loaded])

  return (
    <div
      className={`map-stage relative h-full min-h-0 w-full ${
        theme === "dark" ? "bg-[#191817]" : "bg-[#f4f0e8]"
      }`}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {/* Map Mode Pill Switcher (Minimalist Glass Control) */}
      <div className="absolute left-3 top-14 z-20 flex items-center rounded-full bg-chrome/90 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md md:left-4 md:top-16">
        <button
          type="button"
          onClick={() => setMapType("styled")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            mapType === "styled"
              ? "bg-fg text-bg shadow-sm"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          Mapa
        </button>
        <button
          type="button"
          onClick={() => setMapType("hybrid")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            mapType === "hybrid"
              ? "bg-fg text-bg shadow-sm"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          Satélite
        </button>
      </div>

      {/* Bespoke Zoom Controls */}
      <div className="absolute left-3 top-26 z-20 flex flex-col overflow-hidden rounded-full border border-black/10 bg-chrome/90 shadow-[0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-md md:left-4 md:top-28 dark:border-white/10">
        <button
          type="button"
          aria-label="Acercar mapa"
          onClick={() => {
            const z = mapRef.current?.getZoom() ?? CITY_ZOOM
            mapRef.current?.setZoom(z + 1)
          }}
          className="flex h-8 w-8 items-center justify-center text-fg transition hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Plus className="h-3.5 w-3.5" weight="bold" />
        </button>
        <div className="h-px w-full bg-border" />
        <button
          type="button"
          aria-label="Alejar mapa"
          onClick={() => {
            const z = mapRef.current?.getZoom() ?? CITY_ZOOM
            mapRef.current?.setZoom(z - 1)
          }}
          className="flex h-8 w-8 items-center justify-center text-fg transition hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Minus className="h-3.5 w-3.5" weight="bold" />
        </button>
      </div>

      {loadError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm">
          <div className="max-w-md rounded-panel bg-bg-elevated p-6 text-center shadow-card">
            <p className="font-medium text-fg">No se pudo cargar Google Maps</p>
            <p className="mt-2 text-xs text-fg-muted">{loadError}</p>
            <p className="mt-4 text-xs text-fg-muted">
              Revisá la variable <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en tu <code>.env.local</code>.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
