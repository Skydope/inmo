/* Ambient declarations for Google Maps JavaScript API */

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions)
      setCenter(latLng: LatLng | LatLngLiteral): void
      getCenter(): LatLng | undefined
      setZoom(zoom: number): void
      getZoom(): number | undefined
      setHeading(heading: number): void
      setTilt(tilt: number): void
      setMapTypeId(mapTypeId: MapTypeId | string): void
      getMapTypeId(): string | undefined
      setOptions(options: MapOptions): void
      panTo(latLng: LatLng | LatLngLiteral): void
      fitBounds(
        bounds: LatLngBounds | LatLngBoundsLiteral,
        padding?: number | Padding,
      ): void
      addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener
      getDiv(): HTMLElement
      getProjection(): MapCanvasProjection | undefined
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral
      zoom?: number
      minZoom?: number
      maxZoom?: number
      heading?: number
      tilt?: number
      mapTypeId?: MapTypeId | string
      styles?: MapTypeStyle[]
      disableDefaultUI?: boolean
      zoomControl?: boolean
      zoomControlOptions?: { position?: ControlPosition }
      mapTypeControl?: boolean
      scaleControl?: boolean
      streetViewControl?: boolean
      rotateControl?: boolean
      fullscreenControl?: boolean
      gestureHandling?: "cooperative" | "greedy" | "none" | "auto"
      backgroundColor?: string
    }

    enum MapTypeId {
      HYBRID = "hybrid",
      ROADMAP = "roadmap",
      SATELLITE = "satellite",
      TERRAIN = "terrain",
    }

    enum ControlPosition {
      BOTTOM_CENTER = 11,
      BOTTOM_LEFT = 10,
      BOTTOM_RIGHT = 12,
      LEFT_BOTTOM = 6,
      LEFT_CENTER = 4,
      LEFT_TOP = 5,
      RIGHT_BOTTOM = 9,
      RIGHT_CENTER = 8,
      RIGHT_TOP = 7,
      TOP_CENTER = 2,
      TOP_LEFT = 1,
      TOP_RIGHT = 3,
    }

    interface LatLngLiteral {
      lat: number
      lng: number
    }

    interface Padding {
      top?: number
      bottom?: number
      left?: number
      right?: number
    }

    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
      toJSON(): LatLngLiteral
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral)
      extend(point: LatLng | LatLngLiteral): LatLngBounds
      isEmpty(): boolean
      getCenter(): LatLng
    }

    interface LatLngBoundsLiteral {
      east: number
      north: number
      south: number
      west: number
    }

    interface MapsEventListener {
      remove(): void
    }

    class OverlayView {
      setMap(map: Map | null): void
      getMap(): Map | null
      getPanes(): MapPanes | null
      getProjection(): MapCanvasProjection | null
      onAdd(): void
      draw(): void
      onRemove(): void
      static preventMapHitsAndGesturesFrom(element: HTMLElement): void
      static preventMapHitsFrom(element: HTMLElement): void
    }

    interface MapPanes {
      floatPane: HTMLElement
      mapPane: HTMLElement
      markerLayer: HTMLElement
      overlayLayer: HTMLElement
      overlayMouseTarget: HTMLElement
    }

    interface MapCanvasProjection {
      fromLatLngToDivPixel(latLng: LatLng | LatLngLiteral): Point | null
      fromLatLngToContainerPixel(latLng: LatLng | LatLngLiteral): Point | null
      fromContainerPixelToLatLng(pixel: Point): LatLng | null
      fromDivPixelToLatLng(pixel: Point): LatLng | null
      getWorldWidth(): number
    }

    class Point {
      constructor(x: number, y: number)
      x: number
      y: number
    }

    class Polyline {
      constructor(opts?: PolylineOptions)
      setMap(map: Map | null): void
      setPath(path: (LatLng | LatLngLiteral)[]): void
      setOptions(options: PolylineOptions): void
    }

    interface PolylineOptions {
      path?: (LatLng | LatLngLiteral)[]
      strokeColor?: string
      strokeOpacity?: number
      strokeWeight?: number
      map?: Map
      zIndex?: number
    }

    interface MapTypeStyle {
      elementType?: string
      featureType?: string
      stylers: Record<string, any>[]
    }

    namespace event {
      function addListener(
        instance: any,
        eventName: string,
        handler: (...args: any[]) => void,
      ): MapsEventListener
      function addListenerOnce(
        instance: any,
        eventName: string,
        handler: (...args: any[]) => void,
      ): MapsEventListener
      function removeListener(listener: MapsEventListener): void
      function clearListeners(instance: any, eventName: string): void
      function trigger(instance: any, eventName: string, ...args: any[]): void
    }
  }
}

interface Window {
  google?: typeof google
}
