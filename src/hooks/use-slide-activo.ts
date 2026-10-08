"use client"

import { useEffect, useState, type RefObject } from "react"

const prefiereSinMovimiento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

function llevarA(raiz: HTMLElement | null, i: number, suave: boolean) {
  const slide = raiz?.querySelector<HTMLElement>(`[data-slide="${i}"]`)
  if (!raiz || !slide) return
  const izquierda = slide.offsetLeft - (raiz.clientWidth - slide.clientWidth) / 2
  raiz.scrollTo({ left: izquierda, behavior: suave && !prefiereSinMovimiento() ? "smooth" : "instant" })
}

/**
 * El slide que se está viendo en un carrusel con scroll-snap. Cada slide lleva
 * `data-slide="<índice>"`; uno cuenta como activo cuando se ve al menos el 60 %.
 * `inicial`: el slide donde arrancar, sin animación (al volver de la ficha).
 */
export function useSlideActivo(contenedor: RefObject<HTMLElement | null>, cantidad: number, inicial = 0) {
  const [activo, setActivo] = useState(inicial)

  useEffect(() => {
    if (inicial > 0) llevarA(contenedor.current, inicial, false)
  }, [contenedor, inicial])

  useEffect(() => {
    const raiz = contenedor.current
    if (!raiz) return
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.slide))
        }
      },
      { root: raiz, threshold: 0.6 }
    )
    raiz.querySelectorAll("[data-slide]").forEach((el) => observador.observe(el))
    return () => observador.disconnect()
  }, [contenedor, cantidad])

  /** Lleva el carrusel al slide `i`. `suave: false` para saltos hechos por código (sin pasar
   *  por los slides del medio, que se marcarían como activos). */
  const irA = (i: number, suave = true) => llevarA(contenedor.current, i, suave)

  return { activo, irA }
}
