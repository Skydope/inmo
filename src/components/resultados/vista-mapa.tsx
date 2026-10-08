"use client"

import Link from "next/link"
import { PropertyMapDynamic } from "@/components/map/property-map-dynamic"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { ALTO_DE_LA_TIRA, TiraFlotante } from "./tira-flotante"

/** El mapa con los resultados y, si hay una elegida, su tarjeta flotante abajo. */
export function VistaMapa({
  tarjetas,
  sel,
  hrefLista,
  onSeleccionar,
  onDeseleccionar,
}: {
  tarjetas: Tarjeta[]
  sel: string | undefined
  hrefLista: string
  onSeleccionar: (id: string) => void
  onDeseleccionar: () => void
}) {
  const elegida = tarjetas.some((t) => t.id === sel) ? sel : undefined
  return (
    <div className="relative isolate min-h-[62svh] flex-1 overflow-hidden bg-papel">
      <PropertyMapDynamic
        tarjetas={tarjetas}
        sel={elegida}
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
