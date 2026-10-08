"use client"

import { useCallback, useState } from "react"
import { hrefDeBusqueda, type Busqueda, type Sugerencia } from "@/lib/busqueda"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { Carrusel } from "./carrusel"
import { FinDeResultados } from "./fin-de-resultados"

/** Resultados en el cliente: la propiedad que se está mirando y la vista. */
export function ResultadosCliente({
  tarjetas,
  busqueda,
  ampliar,
}: {
  tarjetas: Tarjeta[]
  busqueda: Busqueda
  ampliar: Sugerencia[]
}) {
  const [inicial] = useState(() => Math.max(0, tarjetas.findIndex((t) => t.id === busqueda.sel)))
  const [, setSel] = useState<string | undefined>(busqueda.sel)
  const onActivo = useCallback((i: number) => setSel(tarjetas[i]?.id), [tarjetas])

  return (
    <Carrusel
      tarjetas={tarjetas}
      inicial={inicial}
      onActivo={onActivo}
      className="pt-3"
      final={
        <FinDeResultados
          total={tarjetas.length}
          ampliar={ampliar}
          hrefMapa={hrefDeBusqueda("/propiedades", { ...busqueda, vista: "mapa", sel: undefined })}
        />
      }
    />
  )
}
