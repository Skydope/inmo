"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { filtrosActivos, hrefDeBusqueda, rutaDePaso, type Busqueda, type Sugerencia, type Vista } from "@/lib/busqueda"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { precargarMapa } from "@/components/map/property-map-dynamic"
import { Carrusel } from "./carrusel"
import { FinDeResultados } from "./fin-de-resultados"
import { SelectorDeVista } from "./selector-de-vista"
import { VistaMapa } from "./vista-mapa"

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
  const pendiente = useRef<(() => void) | null>(null)
  useEffect(() => {
    const escribir = () => {
      pendiente.current = null
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
    pendiente.current = escribir
    const espera = window.setTimeout(escribir, ESPERA_PARA_LA_URL)
    return () => window.clearTimeout(espera)
  }, [busqueda, vista, sel, tarjetas])

  // Si tocan un link (Ver detalles) antes de que pase la espera, la URL se escribe ya: si no,
  // el historial se queda con la propiedad anterior y "atrás" vuelve a esa.
  const escribirYa = () => pendiente.current?.()

  const onActivo = useCallback((i: number) => setSel(tarjetas[i]?.id), [tarjetas])
  const deseleccionar = useCallback(() => setSel(undefined), [])

  // Con la lista ya a la vista, pedir el código del mapa en un momento libre: así "Mapa"
  // abre rápido, sin que MapLibre entre en la carga inicial.
  useEffect(() => {
    if (vista !== "lista") return
    const pedir = () => void precargarMapa()
    // Safari no tiene requestIdleCallback.
    const enReposo = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
    if (enReposo) {
      const id = enReposo(pedir, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(pedir, 2500)
    return () => window.clearTimeout(id)
  }, [vista])

  return (
    <div onClickCapture={escribirYa} className="flex flex-1 flex-col">
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
        <div className="mt-3 flex flex-1 flex-col">
          <VistaMapa
            tarjetas={tarjetas}
            sel={sel}
            hrefLista={hrefDeBusqueda("/propiedades", { ...busqueda, vista: "lista", sel })}
            onSeleccionar={setSel}
            onDeseleccionar={deseleccionar}
          />
        </div>
      )}
    </div>
  )
}
