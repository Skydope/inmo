"use client"

import { useCallback, useState } from "react"
import {
  BUSQUEDA_VACIA,
  filtrosActivos,
  hrefDeBusqueda,
  leerBusqueda,
  operacionEnFrase,
  rutaDePaso,
  type Busqueda,
  type Filtrable,
  type Sugerencia,
} from "@/lib/busqueda"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { HojaDeFiltros } from "./hoja-de-filtros"
import { PanelDelMapa } from "./panel-del-mapa"
import { SinResultados } from "./sin-resultados"
import { VistaMapa } from "./vista-mapa"

const sinVista = (b: Busqueda) => hrefDeBusqueda("/propiedades", { ...b, vista: "lista", sel: undefined })

/**
 * Vista y sel de la URL actual: al volver de la ficha, Next reconstruye la página desde su
 * caché con las props de la primera visita, pero la URL ya tiene lo que se estaba mirando.
 */
function desdeLaUrl(busqueda: Busqueda): Busqueda {
  if (typeof window === "undefined") return busqueda
  const url = leerBusqueda(new URLSearchParams(window.location.search), { conVista: true })
  return sinVista(url) === sinVista(busqueda) ? url : busqueda
}

/**
 * Los resultados son el mapa. La tira de abajo muestra las tarjetas de siempre; deslizarla
 * no cambia la elegida. El mouse sobre una tarjeta resalta su pin.
 */
export function ResultadosCliente({
  tarjetas,
  busqueda,
  titulo,
  ampliar,
  indice,
}: {
  tarjetas: Tarjeta[]
  busqueda: Busqueda
  titulo: string
  /** Qué filtro sacar para ver más, cuando la búsqueda no trae nada. */
  ampliar: Sugerencia[]
  /** Todas las propiedades, compactas: la hoja de filtros cuenta en vivo con esto. */
  indice: Filtrable[]
}) {
  const [sel, setSel] = useState<string | undefined>(() => {
    const id = desdeLaUrl(busqueda).sel
    return tarjetas.some((t) => t.id === id) ? id : undefined
  })
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [resaltada, setResaltada] = useState<string | undefined>()
  const selVisible = sel !== undefined && tarjetas.some((t) => t.id === sel) ? sel : undefined

  const publicar = useCallback(
    (id: string | undefined) => {
      const href = hrefDeBusqueda(window.location.pathname, {
        ...busqueda,
        vista: busqueda.vista,
        sel: id,
      })
      if (href !== window.location.pathname + window.location.search) {
        window.history.replaceState(window.history.state, "", href)
      }
    },
    [busqueda]
  )
  const elegir = useCallback(
    (id: string) => {
      setSel(id)
      publicar(id)
    },
    [publicar]
  )
  const deseleccionar = useCallback(() => {
    setSel(undefined)
    publicar(undefined)
  }, [publicar])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HojaDeFiltros
        abierta={filtrosAbiertos}
        onAbiertaChange={setFiltrosAbiertos}
        busqueda={busqueda}
        indice={indice}
        vista={busqueda.vista}
      />
      <VistaMapa
        tarjetas={tarjetas}
        sel={selVisible}
        resaltada={resaltada}
        onSeleccionar={elegir}
        onDeseleccionar={deseleccionar}
      >
        <PanelDelMapa
          titulo={titulo}
          total={tarjetas.length}
          tarjetas={tarjetas}
          sel={selVisible}
          resaltada={resaltada}
          onElegir={elegir}
          onResaltar={setResaltada}
          hrefFiltros={rutaDePaso("tipo", busqueda)}
          onFiltros={() => setFiltrosAbiertos(true)}
          filtros={filtrosActivos(busqueda)}
          vacio={
            tarjetas.length === 0 ? (
              <SinResultados
                titulo={titulo}
                sugerencias={ampliar}
                hrefDe={(s) => hrefDeBusqueda("/propiedades", { ...s.sin, vista: busqueda.vista, sel: undefined })}
                todas={
                  filtrosActivos(busqueda) > 0
                    ? {
                        href: hrefDeBusqueda("/propiedades", {
                          ...BUSQUEDA_VACIA,
                          operacion: busqueda.operacion,
                          vista: busqueda.vista,
                        }),
                        texto: `Ver todas las propiedades${busqueda.operacion ? ` ${operacionEnFrase(busqueda.operacion)}` : ""}`,
                      }
                    : undefined
                }
              />
            ) : undefined
          }
        />
      </VistaMapa>
      <noscript>
        <ul>
          {tarjetas.map((t, i) => (
            <li key={t.id} data-slide={i}>
              {t.fotos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.fotos[0]} alt="" />
              ) : null}
              <a href={`/propiedades/${t.id}`}>Ver detalles</a>
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  )
}
