"use client"

import { useEffect, useRef } from "react"
import { X } from "@/components/iconos"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { cn } from "@/lib/utils"
import { TarjetaPropiedad } from "./tarjeta-propiedad"

/** La pastilla que sale junto al pin. Se cierra con la X o tocando el mapa vacío. */
export function TarjetaEnElMapa({
  t,
  onCerrar,
  className,
}: {
  t: Tarjeta
  onCerrar: () => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = ref.current
    const raiz = card?.closest<HTMLElement>("[data-vista-mapa]")
    if (!card || !raiz) return
    let marco = 0
    let vivo = true
    const colocar = () => {
      if (!vivo) return
      const pin = raiz.querySelector<HTMLElement>(`.map-pin[data-id="${CSS.escape(t.id)}"]`)
      const capa = card.offsetParent
      if (!pin || !(capa instanceof HTMLElement) || card.offsetWidth === 0) {
        marco = requestAnimationFrame(colocar)
        return
      }
      const p = pin.getBoundingClientRect()
      const c = capa.getBoundingClientRect()
      const w = card.offsetWidth
      const h = card.offsetHeight
      let left = p.left - c.left + p.width / 2 - w / 2
      let top = p.top - c.top - h - 10
      if (top < 8) top = p.bottom - c.top + 12
      left = Math.max(8, Math.min(left, c.width - w - 8))
      top = Math.max(8, Math.min(top, c.height - h - 8))
      card.style.left = `${left}px`
      card.style.top = `${top}px`
      marco = requestAnimationFrame(colocar)
    }
    marco = requestAnimationFrame(colocar)
    return () => {
      vivo = false
      cancelAnimationFrame(marco)
    }
  }, [t.id])

  return (
    <div
      ref={ref}
      data-tarjeta-mapa
      className={cn("pointer-events-auto absolute z-20 w-64", className)}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onCerrar()
        }}
        className="absolute top-2 right-2 z-30 grid size-11 place-items-center"
      >
        <span className="grid size-8 place-items-center rounded-full bg-blanco/90 text-tinta shadow-sm">
          <X className="size-4" aria-hidden="true" />
        </span>
      </button>
      <TarjetaPropiedad t={t} variante="grilla" className="shadow-[0_8px_28px_rgb(0_0_0/0.18)]" />
    </div>
  )
}
