"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

/** La ficha lo lee para saber si Volver puede usar el historial. */
export const CLAVE_VOLVER = "inmo-volver"

const esFicha = (pathname: string) => /^\/propiedades\/[^/]+$/.test(pathname)

/**
 * En la primera carga de una ficha (link compartido) no hay a dónde volver dentro del sitio.
 * Si ya se navegó por el sitio, Volver usa el historial.
 */
export function MarcaDeHistorial() {
  const pathname = usePathname()
  const montado = useRef(false)

  useEffect(() => {
    try {
      if (!montado.current) {
        montado.current = true
        if (esFicha(pathname)) sessionStorage.removeItem(CLAVE_VOLVER)
        else sessionStorage.setItem(CLAVE_VOLVER, "1")
        return
      }
      if (!esFicha(pathname)) sessionStorage.setItem(CLAVE_VOLVER, "1")
    } catch {
      // Modo privado: Volver cae al link de resultados.
    }
  }, [pathname])

  return null
}
