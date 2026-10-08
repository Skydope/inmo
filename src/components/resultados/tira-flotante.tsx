"use client"

import { useEffect, useRef } from "react"
import { useSlideActivo } from "@/hooks/use-slide-activo"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { TarjetaPropiedad } from "./tarjeta-propiedad"

/** Lo que mide la tira (para que el mapa centre los pines por encima). */
export const ALTO_DE_LA_TIRA = 200

/**
 * La tarjeta flotante del mapa: aparece al tocar un pin y se desliza entre propiedades (en el
 * orden de la lista); el mapa la sigue. Es un carrusel propio, no un Drawer: un Drawer pelearía
 * con los gestos del mapa.
 */
export function TiraFlotante({
  tarjetas,
  sel,
  onElegir,
}: {
  tarjetas: Tarjeta[]
  sel: string
  onElegir: (id: string) => void
}) {
  const contenedor = useRef<HTMLUListElement>(null)
  const indice = Math.max(0, tarjetas.findIndex((t) => t.id === sel))
  const { activo, irA } = useSlideActivo(contenedor, tarjetas.length, indice)
  const ultimo = useRef(indice)

  // Tocaron otro pin: saltar a esa tarjeta sin animación (con animación, las del medio se
  // marcarían como activas y cambiarían la elegida).
  useEffect(() => {
    if (indice !== ultimo.current) {
      ultimo.current = indice
      irA(indice, false)
    }
  })

  // Deslizaron la tira: la elegida pasa a ser la que se ve.
  useEffect(() => {
    if (activo === ultimo.current) return
    ultimo.current = activo
    const id = tarjetas[activo]?.id
    if (id) onElegir(id)
  }, [activo, tarjetas, onElegir])

  return (
    <ul
      ref={contenedor}
      aria-label="Propiedad elegida en el mapa"
      className="absolute inset-x-0 bottom-3 z-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tarjetas.map((t, i) => (
        <li
          key={t.id}
          data-slide={i}
          data-id={t.id}
          data-activo={i === activo}
          className="w-[calc(100%-3rem)] max-w-md shrink-0 snap-center snap-always"
        >
          <TarjetaPropiedad t={t} variante="flotante" className="shadow-[0_4px_16px_rgb(0_0_0/0.18)]" />
        </li>
      ))}
    </ul>
  )
}
