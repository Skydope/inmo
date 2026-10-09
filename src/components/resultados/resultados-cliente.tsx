"use client"

import { useCallback, useRef, useState } from "react"
import { ArrowsOut, List } from "@/components/iconos"
import { useEsEscritorio } from "@/hooks/use-es-escritorio"
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
  type Vista,
} from "@/lib/busqueda"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { cn } from "@/lib/utils"
import { ColumnaDeLista } from "./columna-de-lista"
import { HojaDeFiltros } from "./hoja-de-filtros"
import { SinResultados } from "./sin-resultados"
import { TarjetaEnElMapa } from "./tarjeta-en-el-mapa"
import { VistaMapa } from "./vista-mapa"

const sinVista = (b: Busqueda) => hrefDeBusqueda("/propiedades", { ...b, vista: "mapa", sel: undefined })

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
 * Escritorio: grilla de dos columnas a la izquierda, mapa fijo a la derecha. El celular es una
 * sola página: el mapa es una tarjeta arriba y las propiedades aparecen al bajar.
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
  // Un pin no marca la lista: la pastilla es el preview. La lista sí se marca si se eligió ahí o vino en la URL.
  const [enLaLista, setEnLaLista] = useState(true)
  const [vista, setVista] = useState<Vista>(() => desdeLaUrl(busqueda).vista)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [resaltada, setResaltada] = useState<string | undefined>()
  const [cubre, setCubre] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const escritorio = useEsEscritorio()
  const sc = useRef<HTMLDivElement>(null)
  const abriendo = useRef(false)
  const selVisible = sel !== undefined && tarjetas.some((t) => t.id === sel) ? sel : undefined
  const clave = sinVista(busqueda)
  // Al cambiar los filtros, la vista sale de la búsqueda nueva. El modo (lista/mapa) no la cambia.
  const [claveVista, setClaveVista] = useState(clave)
  if (clave !== claveVista) {
    setClaveVista(clave)
    setVista(desdeLaUrl(busqueda).vista)
  }

  const publicar = useCallback(
    (id: string | undefined, modo: Vista) => {
      const href = hrefDeBusqueda(window.location.pathname, {
        ...busqueda,
        vista: modo,
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
      publicar(id, vista)
    },
    [publicar, vista]
  )
  const deseleccionar = useCallback(() => {
    setSel(undefined)
    publicar(undefined, vista)
  }, [publicar, vista])

  const abrir = useCallback(() => {
    abriendo.current = true
    setAbierto(true)
    sc.current?.scrollTo({ top: 0 })
    requestAnimationFrame(() => {
      abriendo.current = false
    })
  }, [])

  const alPin = (id: string) => {
    elegir(id)
    if (!escritorio) abrir()
  }
  const alVacio = () => {
    if (!escritorio && !abierto) abrir()
    else deseleccionar()
  }

  const hrefDe = (b: Busqueda) => hrefDeBusqueda("/propiedades", { ...b, vista, sel: undefined })
  const vacio =
    tarjetas.length === 0 ? (
      <SinResultados
        titulo={titulo}
        sugerencias={ampliar}
        hrefDe={(s) => hrefDe(s.sin)}
        todas={
          filtrosActivos(busqueda) > 0
            ? {
                href: hrefDe({ ...BUSQUEDA_VACIA, operacion: busqueda.operacion }),
                texto: `Ver todas las propiedades${busqueda.operacion ? ` ${operacionEnFrase(busqueda.operacion)}` : ""}`,
              }
            : undefined
        }
      />
    ) : undefined
  const elegida = tarjetas.find((t) => t.id === selVisible)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <HojaDeFiltros
        abierta={filtrosAbiertos}
        onAbiertaChange={setFiltrosAbiertos}
        busqueda={busqueda}
        indice={indice}
        vista={vista}
      />
      <div
        ref={sc}
        data-resultados
        onScroll={() => {
          const el = sc.current
          if (!el || abriendo.current || !abierto) return
          if (el.scrollTop > 48) {
            setAbierto(false)
            el.scrollTop = 0
          }
        }}
        className="lista-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain lg:flex-row lg:overflow-hidden"
      >
        <div
          className={cn(
            "flex shrink-0",
            abierto ? "h-[calc(100%-4.5rem)]" : "sticky top-0 z-0 h-[42dvh]",
            "lg:static lg:order-2 lg:z-auto lg:h-auto lg:min-h-0 lg:flex-1"
          )}
        >
          <VistaMapa
            className="min-h-0 flex-1"
            tarjetas={tarjetas}
            sel={selVisible}
            resaltada={resaltada}
            onSeleccionar={alPin}
            onDeseleccionar={alVacio}
            overlay={
              <>
                <button
                  type="button"
                  aria-label={cubre ? "Ver la lista" : "Ampliar el mapa"}
                  onClick={() => setCubre((v) => !v)}
                  className="pointer-events-auto absolute top-1/2 left-3 z-30 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-linea bg-blanco text-tinta lg:grid"
                >
                  {cubre ? <List className="size-5" aria-hidden="true" /> : <ArrowsOut className="size-5" aria-hidden="true" />}
                </button>
                {elegida && (escritorio || abierto) ? (
                  <TarjetaEnElMapa t={elegida} onCerrar={deseleccionar} />
                ) : null}
              </>
            }
          />
        </div>
        <ColumnaDeLista
          className={cn(
            "z-10 lg:order-1 lg:w-[clamp(34rem,54%,48rem)] lg:shrink-0 lg:border-r lg:border-linea",
            !abierto &&
              "max-lg:-mt-6 max-lg:rounded-t-[1.5rem] max-lg:shadow-[0_-28px_70px_rgb(23_33_28/0.16)]",
            cubre && "lg:hidden"
          )}
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
          vacio={vacio}
          seguir={!abierto}
        />
      </div>
      <div className="hidden">
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
    </div>
  )
}
