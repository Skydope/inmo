"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef } from "react"
import { useSlideActivo } from "@/hooks/use-slide-activo"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { cn } from "@/lib/utils"
import { TarjetaPropiedad } from "./tarjeta-propiedad"

/**
 * Las propiedades de a una tarjeta grande, deslizando (scroll-snap nativo, sin librería).
 * Las flechas de abajo hacen lo mismo: teclado, escritorio, accesibilidad. Al final, una
 * tarjeta para ampliar la búsqueda.
 */
export function Carrusel({
  tarjetas,
  inicial,
  onActivo,
  final,
  className,
}: {
  tarjetas: Tarjeta[]
  /** El índice donde arrancar (la propiedad elegida al volver de la ficha). */
  inicial: number
  onActivo: (indice: number) => void
  final: React.ReactNode
  className?: string
}) {
  const contenedor = useRef<HTMLUListElement>(null)
  const total = tarjetas.length + 1
  // Arranca en `inicial` sin animación (al volver de la ficha, o con una URL compartida).
  const { activo, irA } = useSlideActivo(contenedor, total, inicial)

  useEffect(() => {
    if (activo < tarjetas.length) onActivo(activo)
  }, [activo, tarjetas.length, onActivo])

  const enFinal = activo >= tarjetas.length

  // Dos toques rápidos en la flecha: el segundo avanza desde el destino en curso, no desde la
  // activa (que no cambia hasta que termina la animación).
  const destino = useRef<number | null>(null)
  useEffect(() => {
    if (destino.current === activo) destino.current = null
  }, [activo])
  const mover = (paso: number) => {
    const base = destino.current ?? activo
    const i = Math.min(total - 1, Math.max(0, base + paso))
    destino.current = i
    irA(i)
    window.setTimeout(() => {
      if (destino.current === i) destino.current = null
    }, 900)
  }

  return (
    <section aria-roledescription="carrusel" aria-label="Propiedades" className={cn("flex flex-col gap-1", className)}>
      <ul
        ref={contenedor}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tarjetas.map((t, i) => (
          <li
            key={t.id}
            data-slide={i}
            data-id={t.id}
            aria-roledescription="propiedad"
            aria-label={`${i + 1} de ${tarjetas.length}`}
            data-activo={i === activo}
            // Las flechas de foto, solo en la tarjeta que se está mirando (no en la que asoma).
            className="flex w-[calc(100%-3rem)] max-w-md shrink-0 snap-center snap-always data-[activo=false]:[&_[data-flecha-foto]]:invisible"
          >
            <TarjetaPropiedad t={t} prioridad={i === 0} className="w-full" />
          </li>
        ))}
        <li data-slide={tarjetas.length} className="flex w-[calc(100%-3rem)] max-w-md shrink-0 snap-center snap-always">
          {final}
        </li>
      </ul>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => mover(-1)}
          disabled={activo === 0}
          aria-label="Propiedad anterior"
          className="grid size-11 place-items-center rounded-full text-tinta hover:bg-blanco disabled:opacity-30"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
        <p className="min-w-20 text-center text-sm text-tinta-suave tabular-nums" aria-live="polite">
          {enFinal ? "Fin" : `${activo + 1} de ${tarjetas.length}`}
        </p>
        <button
          type="button"
          onClick={() => mover(1)}
          disabled={enFinal}
          aria-label="Propiedad siguiente"
          className="grid size-11 place-items-center rounded-full text-tinta hover:bg-blanco disabled:opacity-30"
        >
          <ChevronRight className="size-6" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
