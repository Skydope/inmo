"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { esEscritorio, useEsEscritorio } from "@/hooks/use-es-escritorio"
import { useSlideActivo } from "@/hooks/use-slide-activo"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { cn } from "@/lib/utils"
import { TarjetaPropiedad } from "./tarjeta-propiedad"

/**
 * Las propiedades de a una tarjeta grande, deslizando (scroll-snap nativo, sin librería).
 * Las flechas de abajo hacen lo mismo: teclado, accesibilidad. Al final, una tarjeta para
 * ampliar la búsqueda. En tablet se ven dos por pantalla; en escritorio, la misma lista es
 * una grilla que se baja (solo clases `lg:`) al lado del mapa.
 */
export function Carrusel({
  tarjetas,
  inicial,
  onActivo,
  seleccionada,
  onResaltar,
  final,
  className,
}: {
  tarjetas: Tarjeta[]
  /** El índice donde arrancar (la propiedad elegida al volver de la ficha). */
  inicial: number
  onActivo: (indice: number) => void
  /** Escritorio: la elegida en el mapa, que se marca y se trae a la vista. */
  seleccionada?: string
  /** Escritorio: el mouse sobre una tarjeta resalta su pin. */
  onResaltar?: (id: string | undefined) => void
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

  // Fotos: las de las tarjetas cerca de la que se mira y las que ya pasaron. Las demás se
  // piden al acercarse (si no, el navegador baja cinco o seis fotos que nadie ve todavía y le
  // quitan ancho de banda a la primera). En escritorio la grilla se ve entera.
  const escritorio = useEsEscritorio()
  const [conFotos, setConFotos] = useState({ desde: inicial - 1, hasta: inicial + 2 })
  if (activo - 1 < conFotos.desde || activo + 2 > conFotos.hasta) {
    setConFotos({ desde: Math.min(conFotos.desde, activo - 1), hasta: Math.max(conFotos.hasta, activo + 2) })
  }
  const diferir = (i: number) => !escritorio && (i < conFotos.desde || i > conFotos.hasta)

  // Escritorio: tocar un pin (o deslizar la tarjeta del mapa) trae su tarjeta a la vista.
  const primeraVez = useRef(true)
  useEffect(() => {
    const deUna = primeraVez.current
    primeraVez.current = false
    if (!seleccionada || !esEscritorio()) return
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    contenedor.current
      ?.querySelector(`[data-id="${seleccionada}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: deUna || sinMovimiento ? "instant" : "smooth" })
  }, [seleccionada])

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
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] lg:grid lg:snap-none lg:gap-4 lg:overflow-visible xl:grid-cols-2 [&::-webkit-scrollbar]:hidden"
      >
        {tarjetas.map((t, i) => (
          <li
            key={t.id}
            data-slide={i}
            data-id={t.id}
            aria-roledescription="propiedad"
            aria-label={`${i + 1} de ${tarjetas.length}`}
            data-activo={i === activo}
            data-elegida={t.id === seleccionada}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") onResaltar?.(t.id)
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") onResaltar?.(undefined)
            }}
            className={cn(
              "flex w-[calc(100%-3rem)] max-w-md shrink-0 snap-center snap-always",
              "sm:w-[calc(50%-1.5rem)] sm:max-w-none sm:snap-start lg:w-auto lg:scroll-mt-20 lg:scroll-mb-6",
              // En el celu, las flechas de foto solo en la tarjeta que se está mirando (no en la que asoma).
              "max-sm:data-[activo=false]:[&_[data-flecha-foto]]:invisible"
            )}
          >
            <TarjetaPropiedad
              t={t}
              prioridad={i === inicial}
              diferirFotos={diferir(i)}
              className="w-full lg:transition-shadow lg:in-data-[elegida=true]:ring-2 lg:in-data-[elegida=true]:ring-plano-700"
            />
          </li>
        ))}
        <li
          data-slide={tarjetas.length}
          className="flex w-[calc(100%-3rem)] max-w-md shrink-0 snap-center snap-always sm:w-[calc(50%-1.5rem)] sm:max-w-none sm:snap-start lg:w-auto xl:col-span-2"
        >
          {final}
        </li>
      </ul>

      <div className="flex items-center justify-center gap-2 lg:hidden">
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
