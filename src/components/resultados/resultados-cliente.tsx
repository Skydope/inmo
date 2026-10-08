"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  BUSQUEDA_VACIA,
  escribirBusqueda,
  filtrosActivos,
  hrefDeBusqueda,
  leerBusqueda,
  operacionEnFrase,
  rutaDePaso,
  type Busqueda,
  type Filtrable,
  type Sugerencia,
  type Vista,
} from "@/lib/busqueda"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { precargarMapa } from "@/components/map/property-map-dynamic"
import { esEscritorio, useEsEscritorio } from "@/hooks/use-es-escritorio"
import { Carrusel } from "./carrusel"
import { FinDeResultados } from "./fin-de-resultados"
import { HojaDeFiltros } from "./hoja-de-filtros"
import { SelectorDeVista } from "./selector-de-vista"
import { SinResultados } from "./sin-resultados"
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
 * historial): se comparten y sobreviven a ir a la ficha y volver. En escritorio, lista y mapa
 * van lado a lado y no hay selector.
 */
export function ResultadosCliente({
  encabezado,
  tarjetas,
  busqueda,
  titulo,
  ampliar,
  indice,
}: {
  /** El título y el conteo (del servidor): arriba de la lista, a la izquierda en escritorio. */
  encabezado: React.ReactNode
  tarjetas: Tarjeta[]
  busqueda: Busqueda
  titulo: string
  /** Qué filtro sacar para ver más (al final de la lista, o cuando no hay nada). */
  ampliar: Sugerencia[]
  /** Todas las propiedades, compactas: la hoja de filtros cuenta en vivo con esto. */
  indice: Filtrable[]
}) {
  const escritorio = useEsEscritorio()
  const indiceDe = useCallback(
    (id: string | undefined) => Math.max(0, tarjetas.findIndex((t) => t.id === id)),
    [tarjetas]
  )
  const [vista, setVista] = useState<Vista>(() => desdeLaUrl(busqueda).vista)
  const [sel, setSel] = useState<string | undefined>(() => {
    const id = desdeLaUrl(busqueda).sel
    return tarjetas.some((t) => t.id === id) ? id : undefined
  })
  const [inicial, setInicial] = useState(() => indiceDe(sel))
  const urlTieneSel = useRef(Boolean(sel))
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  // Escritorio: la tarjeta que tiene el mouse encima, para resaltar su pin.
  const [resaltada, setResaltada] = useState<string>()

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

  // En escritorio la lista es una grilla que se baja: la elegida la marcan los pines, no el
  // scroll. (Se consulta en el momento: al hidratar, `escritorio` todavía es false.)
  const onActivo = useCallback(
    (i: number) => {
      if (!esEscritorio()) setSel(tarjetas[i]?.id)
    },
    [tarjetas]
  )
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

  const hrefLista = hrefDeBusqueda("/propiedades", { ...busqueda, vista: "lista", sel })
  const mapa = (className?: string) => (
    <VistaMapa
      tarjetas={tarjetas}
      sel={sel}
      resaltada={resaltada}
      hrefLista={hrefLista}
      onSeleccionar={setSel}
      onDeseleccionar={deseleccionar}
      className={className}
    />
  )

  let contenido: React.ReactNode
  if (tarjetas.length === 0) {
    contenido = (
      <SinResultados
        titulo={titulo}
        sugerencias={ampliar}
        hrefDe={(s) => hrefDeBusqueda("/propiedades", { ...s.sin, vista, sel: undefined })}
        todas={
          filtrosActivos(busqueda) > 0
            ? {
                href: hrefDeBusqueda("/propiedades", { ...BUSQUEDA_VACIA, operacion: busqueda.operacion, vista }),
                texto: `Ver todas las propiedades${busqueda.operacion ? ` ${operacionEnFrase(busqueda.operacion)}` : ""}`,
              }
            : undefined
        }
      />
    )
  } else if (vista === "lista" || escritorio) {
    contenido = (
      <Carrusel
        key={inicial}
        tarjetas={tarjetas}
        inicial={inicial}
        onActivo={onActivo}
        seleccionada={escritorio ? sel : undefined}
        onResaltar={setResaltada}
        className="pt-3 lg:pt-4"
        final={
          <FinDeResultados
            total={tarjetas.length}
            ampliar={ampliar}
            hrefMapa={hrefDeBusqueda("/propiedades", { ...busqueda, vista: "mapa", sel: undefined })}
          />
        }
      />
    )
  } else {
    contenido = <div className="mt-3 flex flex-1 flex-col">{mapa("min-h-[62svh] flex-1")}</div>
  }

  return (
    <div
      onClickCapture={escribirYa}
      className="flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(26rem,40%)_1fr] lg:items-start xl:grid-cols-[minmax(40rem,48%)_1fr]"
    >
      <div className="flex flex-1 flex-col lg:px-2 lg:pb-10">
        {encabezado}
        <SelectorDeVista
          vista={vista}
          hrefLista={hrefLista}
          hrefMapa={hrefDeBusqueda("/propiedades", { ...busqueda, vista: "mapa", sel })}
          onCambiar={cambiarVista}
          hrefFiltros={rutaDePaso("tipo", busqueda)}
          onFiltros={() => setFiltrosAbiertos(true)}
          filtros={filtrosActivos(busqueda)}
          conVistas={tarjetas.length > 0}
        />
        <HojaDeFiltros
          abierta={filtrosAbiertos}
          onAbiertaChange={setFiltrosAbiertos}
          lado={escritorio ? "derecha" : "abajo"}
          busqueda={busqueda}
          indice={indice}
          vista={vista}
        />
        {contenido}
      </div>
      {/* Escritorio: el mapa fijo a la derecha mientras la lista se baja. */}
      <div className="hidden border-l border-linea lg:sticky lg:top-14 lg:block lg:h-[calc(100dvh-3.5rem)]">
        {escritorio ? mapa("h-full") : null}
      </div>
    </div>
  )
}
