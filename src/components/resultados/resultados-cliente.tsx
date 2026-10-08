"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { filtrosActivos, hrefDeBusqueda, rutaDePaso, type Busqueda, type Sugerencia, type Vista } from "@/lib/busqueda"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { Carrusel } from "./carrusel"
import { FinDeResultados } from "./fin-de-resultados"
import { SelectorDeVista } from "./selector-de-vista"

const ESPERA_PARA_LA_URL = 300

function desdeLaUrl(clave: "vista" | "sel", porDefecto: string | undefined) {
  if (typeof window === "undefined") return porDefecto
  return new URLSearchParams(window.location.search).get(clave) ?? porDefecto
}

/**
 * Resultados en el cliente: la vista (lista o mapa) y la propiedad que se está mirando, que
 * es la misma en las dos vistas. Las dos viven en la URL (replaceState, sin sumar entradas al
 * historial): se comparten y sobreviven a ir a la ficha y volver.
 */
export function ResultadosCliente({
  tarjetas,
  busqueda,
  ampliar,
}: {
  tarjetas: Tarjeta[]
  busqueda: Busqueda
  ampliar: Sugerencia[]
}) {
  const indiceDe = useCallback(
    (id: string | undefined) => Math.max(0, tarjetas.findIndex((t) => t.id === id)),
    [tarjetas]
  )
  // La URL actual manda: al volver de la ficha, Next reconstruye la página desde su caché con
  // las props de la primera visita, pero la URL ya tiene la vista y la propiedad elegida.
  // (En el servidor y al hidratar, la URL y las props coinciden.)
  const [vista, setVista] = useState<Vista>(() => desdeLaUrl("vista", busqueda.vista) === "mapa" ? "mapa" : "lista")
  const [sel, setSel] = useState<string | undefined>(() => desdeLaUrl("sel", busqueda.sel))
  const [inicial, setInicial] = useState(() => indiceDe(sel))
  const urlTieneSel = useRef(Boolean(sel))

  const cambiarVista = (v: Vista) => {
    if (v === "lista") setInicial(indiceDe(sel))
    setVista(v)
  }

  // Escribe vista y sel en la URL. sel, con una espera: mientras se desliza cambia seguido.
  useEffect(() => {
    const escribir = () => {
      const primera = sel === tarjetas[0]?.id && !urlTieneSel.current
      const href = hrefDeBusqueda(window.location.pathname, {
        ...busqueda,
        vista,
        sel: primera ? undefined : sel,
      })
      if (href !== window.location.pathname + window.location.search) {
        window.history.replaceState(window.history.state, "", href)
      }
      if (!primera && sel) urlTieneSel.current = true
    }
    const espera = window.setTimeout(escribir, ESPERA_PARA_LA_URL)
    return () => window.clearTimeout(espera)
  }, [busqueda, vista, sel, tarjetas])

  const onActivo = useCallback((i: number) => setSel(tarjetas[i]?.id), [tarjetas])

  return (
    <>
      <SelectorDeVista
        vista={vista}
        hrefLista={hrefDeBusqueda("/propiedades", { ...busqueda, vista: "lista", sel })}
        hrefMapa={hrefDeBusqueda("/propiedades", { ...busqueda, vista: "mapa", sel })}
        onCambiar={cambiarVista}
        hrefFiltros={rutaDePaso("tipo", busqueda)}
        filtros={filtrosActivos(busqueda)}
      />
      {vista === "lista" ? (
        <Carrusel
          key={inicial}
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
      ) : (
        <p className="mx-auto max-w-xl px-4 py-10 text-center text-tinta-suave">
          El mapa llega en el bloque siguiente. Propiedad elegida: {sel ?? "ninguna"} ({indiceDe(sel) + 1} de {tarjetas.length}).
        </p>
      )}
    </>
  )
}
