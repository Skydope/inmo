"use client"

import { useEffect, useState, type RefObject } from "react"

const UMBRAL = 0.6

const prefiereSinMovimiento = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

function llevarA(raiz: HTMLElement | null, i: number, suave: boolean) {
  const slide = raiz?.querySelector<HTMLElement>(`[data-slide="${i}"]`)
  if (!raiz || !slide) return
  // Centrado (celular, uno por pantalla) o al inicio (tablet, dos por pantalla): lo que diga
  // el scroll-snap del slide.
  const alInicio = getComputedStyle(slide).scrollSnapAlign.includes("start")
  const margen = alInicio
    ? parseFloat(getComputedStyle(raiz).scrollPaddingLeft) || 0
    : (raiz.clientWidth - slide.clientWidth) / 2
  const desplazamiento = slide.getBoundingClientRect().left - raiz.getBoundingClientRect().left
  raiz.scrollTo({
    left: raiz.scrollLeft + desplazamiento - margen,
    behavior: suave && !prefiereSinMovimiento() ? "smooth" : "instant",
  })
}

/**
 * El slide que se está viendo en un carrusel con scroll-snap. Cada slide lleva
 * `data-slide="<índice>"`; uno cuenta como visto cuando se ve al menos el 60 %, y si hay más
 * de uno a la vista (tablet), el activo es el primero.
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
    const vistos = new Set<number>()
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const i = Number((e.target as HTMLElement).dataset.slide)
          if (e.intersectionRatio >= UMBRAL) vistos.add(i)
          else vistos.delete(i)
        }
        if (vistos.size > 0) setActivo(Math.min(...vistos))
      },
      { root: raiz, threshold: UMBRAL }
    )
    raiz.querySelectorAll("[data-slide]").forEach((el) => observador.observe(el))
    return () => observador.disconnect()
  }, [contenedor, cantidad])

  /** Lleva el carrusel al slide `i`. `suave: false` para saltos hechos por código (sin pasar
   *  por los slides del medio, que se marcarían como activos). */
  const irA = (i: number, suave = true) => llevarA(contenedor.current, i, suave)

  return { activo, irA }
}
