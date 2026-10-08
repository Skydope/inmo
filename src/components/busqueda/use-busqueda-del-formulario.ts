"use client"

import { useEffect, useState, type RefObject } from "react"
import { leerBusqueda, type Busqueda } from "@/lib/busqueda"

/** Lo que el formulario mandaría por GET, como URLSearchParams. */
export function datosDe(form: HTMLFormElement): URLSearchParams {
  const datos = new URLSearchParams()
  for (const [clave, valor] of new FormData(form)) datos.append(clave, String(valor))
  return datos
}

/**
 * La búsqueda que arma el formulario en este momento, para contar en vivo (el buscador y la
 * hoja de filtros). Escucha eventos nativos, no el onChange de React: así también cuentan los
 * cambios hechos por código (tocar un rango de precio sugerido). `ancla` es cualquier elemento
 * dentro del formulario: `next/form` no pasa la ref al <form>.
 *
 * `antesDeEscuchar` corre una vez con el formulario ya montado, antes del primer cálculo.
 */
export function useBusquedaDelFormulario(
  ancla: RefObject<HTMLElement | null>,
  inicial: Busqueda,
  antesDeEscuchar?: (form: HTMLFormElement) => void
) {
  const [actual, setActual] = useState(inicial)
  useEffect(() => {
    const form = ancla.current?.closest("form")
    if (!form) return
    const recalcular = () => setActual(leerBusqueda(datosDe(form)))
    antesDeEscuchar?.(form)
    recalcular()
    form.addEventListener("input", recalcular)
    form.addEventListener("change", recalcular)
    return () => {
      form.removeEventListener("input", recalcular)
      form.removeEventListener("change", recalcular)
    }
    // Se engancha una vez por formulario montado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ancla])
  return actual
}
