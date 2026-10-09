"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { cn } from "@/lib/utils"

/** El mapa de resultados, con el panel flotando abajo. */
export function VistaMapa({
  tarjetas,
  sel,
  resaltada,
  onSeleccionar,
  onDeseleccionar,
  children,
  className,
}: {
  tarjetas: Tarjeta[]
  sel: string | undefined
  resaltada?: string
  onSeleccionar: (id: string) => void
  onDeseleccionar: () => void
  children: ReactNode
  className?: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  const [alto, setAlto] = useState(0)

  useEffect(() => {
    const el = panel.current
    if (!el) return
    const medir = () => setAlto(el.offsetHeight)
    medir()
    const o = new ResizeObserver(medir)
    o.observe(el)
    return () => o.disconnect()
  }, [])

  const elegida = tarjetas.some((t) => t.id === sel) ? sel : undefined

  return (
    <div className={cn("relative isolate min-h-0 flex-1 overflow-hidden bg-papel", className)}>
      <PropertyMapDynamic
        tarjetas={tarjetas}
        sel={elegida}
        resaltada={resaltada}
        margenInferior={alto}
        onSeleccionar={onSeleccionar}
        onDeseleccionar={onDeseleccionar}
      />
      <div ref={panel} className="absolute inset-x-0 bottom-0 z-10">
        {children}
      </div>
      <noscript>
        <p className="sr-only">El mapa necesita JavaScript.</p>
      </noscript>
    </div>
  )
}
