"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { IconoTipo } from "@/components/busqueda/icono-tipo"
import type { TipoPropiedad } from "@/lib/busqueda"
import { cn } from "@/lib/utils"

/**
 * Las fotos de una tarjeta. Se pasan con las flechas, no deslizando: deslizar ya significa
 * "otra propiedad". La primera carga con la tarjeta; la siguiente se precarga al tocar.
 */
export function FotosDeTarjeta({
  fotos,
  alt,
  tipo,
  sizes,
  prioridad = false,
  diferida = false,
  className,
}: {
  fotos: string[]
  alt: string
  tipo: TipoPropiedad
  sizes: string
  prioridad?: boolean
  /** Lejos de la que se mira: todavía no se pide la foto (sin JS, se ve igual). */
  diferida?: boolean
  className?: string
}) {
  const [i, setI] = useState(0)
  const [toco, setToco] = useState(false)
  const n = fotos.length

  if (n === 0) {
    return (
      <div role="img" aria-label={`${alt} (sin foto)`} className={cn("grid place-items-center bg-papel text-tinta-suave", className)}>
        <IconoTipo tipo={tipo} className="size-10" />
      </div>
    )
  }

  if (diferida) {
    return (
      <div className={cn("relative overflow-hidden bg-papel", className)}>
        <noscript>
          <Image src={fotos[0]} alt={alt} fill sizes={sizes} className="object-cover" />
        </noscript>
      </div>
    )
  }

  const ir = (paso: number) => {
    setToco(true)
    setI((actual) => (actual + paso + n) % n)
  }
  const siguiente = fotos[(i + 1) % n]

  return (
    <div className={cn("relative overflow-hidden bg-papel", className)}>
      {/* La primera foto de la primera tarjeta es el LCP de resultados: pedida ya y con prioridad
          alta (en Next 16 `priority` está deprecado). */}
      <Image
        src={fotos[i]}
        alt={alt}
        fill
        sizes={sizes}
        loading={prioridad && i === 0 ? "eager" : undefined}
        fetchPriority={prioridad && i === 0 ? "high" : undefined}
        className="object-cover"
      />
      {toco && n > 1 ? (
        <Image src={siguiente} alt="" fill sizes={sizes} loading="eager" className="invisible" aria-hidden="true" />
      ) : null}
      {n > 1 ? (
        <>
          <button
            type="button"
            onClick={() => ir(-1)}
            aria-label="Foto anterior"
            data-flecha-foto
            className="absolute top-1/2 left-1 z-10 grid size-11 -translate-y-1/2 place-items-center"
          >
            <span className="grid size-8 place-items-center rounded-full bg-blanco/90 text-tinta shadow-sm">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => ir(1)}
            aria-label="Foto siguiente"
            data-flecha-foto
            className="absolute top-1/2 right-1 z-10 grid size-11 -translate-y-1/2 place-items-center"
          >
            <span className="grid size-8 place-items-center rounded-full bg-blanco/90 text-tinta shadow-sm">
              <ChevronRight className="size-5" aria-hidden="true" />
            </span>
          </button>
          <span className="absolute right-3 bottom-3 z-10 rounded-full bg-tinta/75 px-2 py-0.5 text-xs font-semibold text-blanco tabular-nums">
            {i + 1}/{n}
          </span>
        </>
      ) : null}
    </div>
  )
}
