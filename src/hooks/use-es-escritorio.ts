"use client"

import { useSyncExternalStore } from "react"

/** Desde acá, resultados es lista y mapa lado a lado (el `lg` de Tailwind). */
const CONSULTA = "(min-width: 1024px)"

/** Para leer en el momento (en un handler o un efecto), sin esperar al render. */
export const esEscritorio = () => typeof window !== "undefined" && window.matchMedia(CONSULTA).matches

function suscribir(avisar: () => void) {
  const consulta = window.matchMedia(CONSULTA)
  consulta.addEventListener("change", avisar)
  return () => consulta.removeEventListener("change", avisar)
}

/**
 * Si la pantalla es de escritorio. En el servidor y al hidratar es `false` (se arma la vista
 * del celular); lo que cambia de forma con el ancho va en clases `lg:`, esto es solo para lo
 * que no se puede resolver con CSS (montar el mapa, de qué lado entra la hoja).
 */
export function useEsEscritorio() {
  return useSyncExternalStore(suscribir, esEscritorio, () => false)
}
