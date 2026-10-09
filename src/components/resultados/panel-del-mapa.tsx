"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Link from "next/link"
import { SlidersHorizontal } from "@/components/iconos"
import { useEsEscritorio } from "@/hooks/use-es-escritorio"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { cn } from "@/lib/utils"
import { Encabezado } from "./encabezado"
import { TarjetaPropiedad } from "./tarjeta-propiedad"

const pastilla =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-linea bg-blanco px-3.5 font-semibold text-tinta shadow-[0_4px_16px_rgb(0_0_0/0.18)]"

const marco =
  "shrink-0 cursor-pointer rounded-tarjeta bg-blanco shadow-[0_4px_16px_rgb(0_0_0/0.18),0_0_0_1px_var(--color-linea)]"
const anillo = "shadow-[0_4px_16px_rgb(0_0_0/0.18),0_0_0_2px_var(--color-plano-700)]"

function Marco({
  t,
  fija,
  elegida,
  marcada,
  onElegir,
  onResaltar,
  etiqueta: Etiqueta,
}: {
  t: Tarjeta
  /** En escritorio queda fuera del scroll, con la foto un poco más grande. */
  fija: boolean
  elegida: boolean
  marcada: boolean
  onElegir: (id: string) => void
  onResaltar: (id: string | undefined) => void
  etiqueta: "li" | "div"
}) {
  return (
    <Etiqueta
      data-id={t.id}
      data-elegida={elegida ? "true" : undefined}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onResaltar(t.id)
      }}
      onPointerLeave={() => onResaltar(undefined)}
      onClick={() => onElegir(t.id)}
      className={cn(marco, "w-[min(28rem,calc(100vw-4.5rem))]", fija && "my-1", marcada && anillo)}
    >
      <TarjetaPropiedad t={t} variante="flotante" elegida={fija} className="h-full rounded-[inherit] border-0" />
    </Etiqueta>
  )
}

/** El conteo y las tarjetas de siempre, flotando sobre el mapa. Filtros queda a la derecha. */
export function PanelDelMapa({
  titulo,
  total,
  tarjetas,
  sel,
  resaltada,
  onElegir,
  onResaltar,
  hrefFiltros,
  onFiltros,
  filtros,
  vacio,
}: {
  titulo: string
  total: number
  tarjetas: Tarjeta[]
  sel: string | undefined
  resaltada?: string
  onElegir: (id: string) => void
  onResaltar: (id: string | undefined) => void
  hrefFiltros: string
  onFiltros: () => void
  filtros: number
  vacio?: ReactNode
}) {
  const escritorio = useEsEscritorio()
  const franja = useRef<HTMLDivElement>(null)
  const pista = useRef<HTMLElement>(null)

  useEffect(() => {
    const caja = franja.current
    const ul = pista.current
    if (!caja || !ul) return
    const alGirar = (e: WheelEvent) => {
      if (ul.scrollWidth <= ul.clientWidth + 1) return
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const paso =
        e.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? e.deltaY * ul.clientWidth
          : e.deltaMode === WheelEvent.DOM_DELTA_LINE
            ? e.deltaY * 16
            : e.deltaY
      e.preventDefault()
      ul.scrollLeft += paso
    }
    caja.addEventListener("wheel", alGirar, { passive: false })
    return () => caja.removeEventListener("wheel", alGirar)
  }, [tarjetas.length, sel, escritorio])

  useEffect(() => {
    const ul = pista.current
    if (!sel || !ul) return
    if (escritorio) {
      ul.scrollTo({ left: 0 })
      return
    }
    const li = ul.querySelector<HTMLElement>(`[data-id="${CSS.escape(sel)}"]`)
    if (!li) return
    const left = li.getBoundingClientRect().left - ul.getBoundingClientRect().left + ul.scrollLeft
    ul.scrollTo({ left: Math.max(0, left - 4) })
  }, [sel, escritorio])

  const primera = escritorio ? tarjetas.find((t) => t.id === sel) : undefined
  const resto = primera ? tarjetas.filter((t) => t.id !== sel) : tarjetas

  return (
    <div className="flex flex-col gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2">
        <div className="min-w-0 max-w-xs rounded-full bg-blanco px-4 py-2 shadow-[0_4px_16px_rgb(0_0_0/0.18)]">
          <Encabezado titulo={titulo} total={total} />
        </div>
        <Link
          href={hrefFiltros}
          onClick={(e) => {
            e.preventDefault()
            onFiltros()
          }}
          className={cn(pastilla, "ml-auto shrink-0")}
        >
          <SlidersHorizontal className="size-5" aria-hidden="true" />
          Filtros
          {filtros > 0 ? (
            <span className="grid size-5 place-items-center rounded-full bg-plano-700 text-xs text-blanco tabular-nums">
              {filtros}
              <span className="sr-only"> activos</span>
            </span>
          ) : null}
        </Link>
      </div>

      {tarjetas.length > 0 ? (
        <div ref={franja} className="flex min-w-0 items-stretch gap-3">
          {primera ? (
            <ul aria-label="Propiedades" className="flex min-w-0 flex-1 items-stretch gap-3">
              <Marco
                t={primera}
                fija
                elegida
                marcada
                onElegir={onElegir}
                onResaltar={onResaltar}
                etiqueta="li"
              />
              <li className="min-w-0 flex-1">
                <div
                  ref={pista}
                  className="tira-scroll flex h-full items-stretch gap-3 overflow-x-auto py-1"
                >
                  {resto.map((t) => (
                    <Marco
                      key={t.id}
                      t={t}
                      fija={false}
                      elegida={false}
                      marcada={t.id === resaltada}
                      onElegir={onElegir}
                      onResaltar={onResaltar}
                      etiqueta="div"
                    />
                  ))}
                </div>
              </li>
            </ul>
          ) : (
            <ul
              ref={pista}
              aria-label="Propiedades"
              className="tira-scroll -mx-1 flex min-w-0 flex-1 items-stretch gap-3 overflow-x-auto px-1 py-1"
            >
              {tarjetas.map((t) => (
                <Marco
                  key={t.id}
                  t={t}
                  fija={false}
                  elegida={t.id === sel}
                  marcada={t.id === sel || t.id === resaltada}
                  onElegir={onElegir}
                  onResaltar={onResaltar}
                  etiqueta="li"
                />
              ))}
            </ul>
          )}
        </div>
      ) : vacio ? (
        <div className="max-h-[50svh] overflow-y-auto rounded-tarjeta bg-blanco shadow-[0_4px_16px_rgb(0_0_0/0.18)]">
          {vacio}
        </div>
      ) : null}
    </div>
  )
}
