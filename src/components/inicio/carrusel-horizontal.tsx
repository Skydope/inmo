"use client"

import { CaretLeft, CaretRight } from "@/components/iconos"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Una fila que se desliza (scroll-snap nativo, asoma la siguiente). Con mouse, flechas a los
 * costados; en el celu, el dedo. Sin autoplay. Los hijos son `<ItemDeCarrusel>`.
 */
export function CarruselHorizontal({
  etiqueta,
  children,
  className,
}: {
  etiqueta: string
  children: React.ReactNode
  className?: string
}) {
  const lista = useRef<HTMLUListElement>(null)
  const [bordes, setBordes] = useState({ inicio: true, fin: false })

  useEffect(() => {
    const ul = lista.current
    if (!ul) return
    const medir = () =>
      setBordes({
        inicio: ul.scrollLeft <= 4,
        fin: ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 4,
      })
    ul.addEventListener("scroll", medir, { passive: true })
    // El ResizeObserver avisa una vez al empezar: esa es la primera medida.
    const tamano = new ResizeObserver(medir)
    tamano.observe(ul)
    return () => {
      ul.removeEventListener("scroll", medir)
      tamano.disconnect()
    }
  }, [])

  const mover = (sentido: 1 | -1) => {
    const ul = lista.current
    if (!ul) return
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ul.scrollBy({ left: sentido * ul.clientWidth * 0.8, behavior: sinMovimiento ? "instant" : "smooth" })
  }

  const flecha = (sentido: 1 | -1) => {
    const oculta = sentido === -1 ? bordes.inicio : bordes.fin
    const Icono = sentido === -1 ? CaretLeft : CaretRight
    return (
      <button
        type="button"
        onClick={() => mover(sentido)}
        aria-label={sentido === -1 ? `${etiqueta}: anteriores` : `${etiqueta}: siguientes`}
        tabIndex={oculta ? -1 : undefined}
        aria-hidden={oculta || undefined}
        className={cn(
          "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-linea bg-blanco text-tinta shadow-[0_2px_8px_rgb(0_0_0/0.12)] transition-opacity hover:border-tinta-suave lg:grid",
          sentido === -1 ? "left-1" : "right-1",
          oculta && "pointer-events-none opacity-0"
        )}
      >
        <Icono className="size-5" aria-hidden="true" />
      </button>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={lista}
        aria-label={etiqueta}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      {flecha(-1)}
      {flecha(1)}
    </div>
  )
}

export function ItemDeCarrusel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <li className={cn("flex shrink-0 snap-start", className)}>{children}</li>
}
