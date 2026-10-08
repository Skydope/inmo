"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  escribirBusqueda,
  filtrosActivos,
  hrefDeBusqueda,
  leerBusqueda,
  rutaDePaso,
  type Busqueda,
  type Filtrable,
  type Sugerencia,
  type Vista,
} from "@/lib/busqueda"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { precargarMapa } from "@/components/map/property-map-dynamic"
import { Carrusel } from "./carrusel"
import { FinDeResultados } from "./fin-de-resultados"
import { HojaDeFiltros } from "./hoja-de-filtros"
import { SelectorDeVista } from "./selector-de-vista"
import { VistaMapa } from "./vista-mapa"

const ESPERA_PARA_LA_URL = 300

const sinVista = (b: Busqueda) => escribirBusqueda({ ...b, vista: "lista", sel: undefined })

/**
 * Vista y sel de la URL actual: al volver de la ficha, Next reconstruye la página desde su
 * caché con las props de la primera visita, pero la URL ya tiene lo que se estaba mirando.
 * Si la URL es de otra búsqueda (se está navegando a una nueva y todavía no cambió), valen
 * las props. En el servidor y al hidratar coinciden.
 */
function desdeLaUrl(busqueda: Busqueda): Busqueda {
  if (typeof window === "undefined") return busqueda
  const url = leerBusqueda(new URLSearchParams(window.location.search), { conVista: true })
  return sinVista(url) === sinVista(busqueda) ? url : busqueda
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
  indice,
}: {
  tarjetas: Tarjeta[]
  busqueda: Busqueda
  ampliar: Sugerencia[]
  /** Todas las propiedades, compactas: la hoja de filtros cuenta en vivo con esto. */
  indice: Filtrable[]
}) {
  const indiceDe = useCallback(
    (id: string | undefined) => Math.max(0, tarjetas.findIndex((t) => t.id === id)),
    [tarjetas]
  )
  const [vista, setVista] = useState<Vista>(() => desdeLaUrl(busqueda).vista)
  const [sel, setSel] = useState<string | undefined>(() => {
    const id = desdeLaUrl(busqueda).sel
    return tarjetas.some((t) => t.id === id) ? id : undefined
  })
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
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
        onFiltros={() => setFiltrosAbiertos(true)}
        filtros={filtrosActivos(busqueda)}
      />
      <HojaDeFiltros
        abierta={filtrosAbiertos}
        onAbiertaChange={setFiltrosAbiertos}
        busqueda={busqueda}
        indice={indice}
        vista={vista}
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
