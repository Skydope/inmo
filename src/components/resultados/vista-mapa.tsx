"use client"

import Link from "next/link"
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { cn } from "@/lib/utils"
import { ALTO_DE_LA_TIRA, TiraFlotante } from "./tira-flotante"

/** El mapa con los resultados y, si hay una elegida, su tarjeta flotante abajo. */
export function VistaMapa({
  tarjetas,
  sel,
  resaltada,
  hrefLista,
  onSeleccionar,
  onDeseleccionar,
  className,
}: {
  tarjetas: Tarjeta[]
  sel: string | undefined
  /** Escritorio: la tarjeta con el mouse encima. */
  resaltada?: string
  hrefLista: string
  onSeleccionar: (id: string) => void
  onDeseleccionar: () => void
  className?: string
}) {
  const elegida = tarjetas.some((t) => t.id === sel) ? sel : undefined
  return (
    <div className={cn("relative isolate overflow-hidden bg-papel", className)}>
      <PropertyMapDynamic
        tarjetas={tarjetas}
        sel={elegida}
        resaltada={resaltada}
        margenInferior={elegida ? ALTO_DE_LA_TIRA : 0}
        onSeleccionar={onSeleccionar}
        onDeseleccionar={onDeseleccionar}
      />
      {elegida ? <TiraFlotante tarjetas={tarjetas} sel={elegida} onElegir={onSeleccionar} /> : null}
      <noscript>
        <div className="absolute inset-0 grid place-items-center bg-papel p-6 text-center">
          <p>
            El mapa necesita JavaScript.{" "}
            <Link href={hrefLista} className="font-semibold text-plano-700 underline">
              Ver la lista
            </Link>
          </p>
        </div>
      </noscript>
    </div>
  )
}
