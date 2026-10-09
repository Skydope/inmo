"use client"

import { useEffect, useRef, useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import {
  LADO_SALIDA,
  LADO_VISTA,
  centrar,
  encuadrar,
  recorteVisible,
  zoomSobreElCentro,
} from "@/lib/logo-recorte"
import { SEED_AGENCIES } from "@/lib/agencies/seed"
import { cn } from "@/lib/utils"

const logoInicial = SEED_AGENCIES.norte.logoUrl

/** El recorte queda en la página. No se sube: al recargar vuelve el logo de prueba. */
export function LogoLocal({ onRecorte }: { onRecorte?: (src: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [origen, setOrigen] = useState<string | null>(null)
  const [nota, setNota] = useState("")

  function soltarOrigen() {
    setOrigen((actual) => {
      if (actual) URL.revokeObjectURL(actual)
      return null
    })
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <img
          src={preview ?? logoInicial}
          alt=""
          className="size-16 rounded-full border border-linea bg-blanco object-cover"
        />
        <label className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
          Elegir imagen
          <input
            type="file"
            accept="image/png,image/svg+xml,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              if (!file) return
              if (file.size > 1_500_000) {
                setNota("Pesa más de 1,5 MB. Conviene una más liviana.")
                return
              }
              const url = URL.createObjectURL(file)
              if (file.type === "image/svg+xml") {
                soltarOrigen()
                setOrigen(url)
                setNota("")
                return
              }
              const imagen = new window.Image()
              imagen.onload = () => {
                if (imagen.naturalWidth < 256 || imagen.naturalHeight < 256) {
                  setNota("Queda chica: desde 256 px se ve nítida. Igual podés centrarla.")
                } else {
                  setNota("")
                }
                soltarOrigen()
                setOrigen(url)
              }
              imagen.src = url
            }}
          />
        </label>
      </div>
      {origen ? (
        <Recorte
          src={origen}
          onListo={(blob) => {
            const url = URL.createObjectURL(blob)
            setPreview((anterior) => {
              if (anterior) URL.revokeObjectURL(anterior)
              return url
            })
            onRecorte?.(url)
            soltarOrigen()
          }}
          onCancelar={soltarOrigen}
        />
      ) : null}
      <ul className="mt-3 space-y-1 text-sm leading-relaxed text-tinta-suave">
        <li>La centras vos en el recuadro. En la ficha se ve en círculo.</li>
        <li>PNG, SVG, JPG o WebP. Fondo transparente si el logo lo tiene.</li>
        <li>Desde 256 px de lado, y por debajo de 1,5 MB.</li>
      </ul>
      {nota ? <p className="mt-2 text-sm leading-relaxed text-alerta">{nota}</p> : null}
    </div>
  )
}

function Recorte({
  src,
  onListo,
  onCancelar,
}: {
  src: string
  onListo: (blob: Blob) => void
  onCancelar: () => void
}) {
  const foto = useRef<HTMLImageElement | null>(null)
  const arrastre = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const [medidas, setMedidas] = useState<{ ancho: number; alto: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const imagen = new window.Image()
    imagen.onload = () => {
      const ancho = imagen.naturalWidth || LADO_VISTA
      const alto = imagen.naturalHeight || LADO_VISTA
      foto.current = imagen
      setMedidas({ ancho, alto })
      const centro = centrar(ancho, alto)
      setPos({ x: centro.x, y: centro.y })
      setZoom(1)
    }
    imagen.src = src
  }, [src])

  const puesto = medidas ? encuadrar(pos.x, pos.y, medidas.ancho, medidas.alto, zoom) : null

  function mover(x: number, y: number) {
    if (!medidas) return
    const siguiente = encuadrar(x, y, medidas.ancho, medidas.alto, zoom)
    setPos({ x: siguiente.x, y: siguiente.y })
  }

  return (
    <div className="mt-4">
      <div
        className="relative mx-auto size-60 touch-none overflow-hidden rounded-control bg-papel"
        onPointerDown={(event) => {
          if (!puesto) return
          arrastre.current = { px: event.clientX, py: event.clientY, x: puesto.x, y: puesto.y }
          try {
            event.currentTarget.setPointerCapture(event.pointerId)
          } catch {
            // Sin captura el arrastre sigue mientras el puntero esté sobre el visor.
          }
        }}
        onPointerMove={(event) => {
          const desde = arrastre.current
          if (!desde) return
          mover(desde.x + event.clientX - desde.px, desde.y + event.clientY - desde.py)
        }}
        onPointerUp={() => {
          arrastre.current = null
        }}
      >
        {puesto ? (
          <img
            src={src}
            alt=""
            draggable={false}
            className="absolute max-w-none"
            style={{
              width: medidas!.ancho * puesto.escala,
              height: medidas!.alto * puesto.escala,
              transform: `translate(${puesto.x}px, ${puesto.y}px)`,
            }}
          />
        ) : null}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle closest-side, transparent 98%, color-mix(in oklab, var(--color-tinta) 45%, transparent) 100%)",
          }}
        />
      </div>
      <p className="mt-2 text-center text-sm text-tinta-suave">Arrastrá para centrar el logo.</p>
      <label className="mt-3 flex items-center gap-3 text-sm text-tinta-suave">
        Zoom
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          aria-valuetext={`${Math.round(zoom * 100)}%`}
          className="h-11 min-w-0 flex-1 accent-plano-700"
          onChange={(event) => {
            if (!medidas) return
            const zoomNuevo = Number(event.target.value)
            const siguiente = zoomSobreElCentro(pos.x, pos.y, zoom, zoomNuevo, medidas.ancho, medidas.alto)
            setZoom(zoomNuevo)
            setPos({ x: siguiente.x, y: siguiente.y })
          }}
        />
      </label>
      <div className="mt-3 flex gap-3">
        <button type="button" onClick={onCancelar} className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
          Cancelar
        </button>
        <button
          type="button"
          className={cn(buttonVariants(), "flex-1")}
          onClick={() => {
            const imagen = foto.current
            if (!imagen || !medidas) return
            const visible = recorteVisible(pos.x, pos.y, medidas.ancho, medidas.alto, zoom)
            const lienzo = document.createElement("canvas")
            lienzo.width = LADO_SALIDA
            lienzo.height = LADO_SALIDA
            const ctx = lienzo.getContext("2d")
            if (!ctx) return
            ctx.drawImage(imagen, visible.sx, visible.sy, visible.lado, visible.lado, 0, 0, LADO_SALIDA, LADO_SALIDA)
            // PNG en memoria. WebP al subir: ver el comentario de LADO_SALIDA.
            lienzo.toBlob((blob) => {
              if (blob) onListo(blob)
            }, "image/png")
          }}
        >
          Usar este recorte
        </button>
      </div>
    </div>
  )
}
