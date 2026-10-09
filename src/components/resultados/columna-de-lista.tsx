"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { CaretUp, SlidersHorizontal } from "@/components/iconos"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { cn } from "@/lib/utils"
import { Encabezado } from "./encabezado"
import { TarjetaPropiedad } from "./tarjeta-propiedad"

const control =
  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-linea bg-blanco px-3.5 font-semibold text-tinta"

const marco = "cursor-pointer rounded-tarjeta bg-blanco shadow-[0_0_0_1px_var(--color-linea)]"
const anillo = "shadow-[0_0_0_2px_var(--color-plano-700)]"

const LOTE = 10

function scrollerDe(el: HTMLElement) {
  let n: HTMLElement | null = el
  while (n) {
    const o = getComputedStyle(n).overflowY
    if (o === "auto" || o === "scroll") return n
    n = n.parentElement
  }
  return el
}

/** La columna de tarjetas. En el celular se baja con la página; en escritorio, sola, al lado del mapa. */
export function ColumnaDeLista({
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
  preview = false,
  className,
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
  /** En escritorio el clic abre la pastilla del mapa; en el celular, la ficha. */
  preview?: boolean
  className?: string
}) {
  const caja = useRef<HTMLDivElement>(null)
  const fondo = useRef<HTMLLIElement>(null)
  const firma = `${tarjetas.length}:${tarjetas[0]?.id ?? ""}:${tarjetas.at(-1)?.id ?? ""}`
  const [firmaVista, setFirmaVista] = useState(firma)
  const [cuantas, setCuantas] = useState(LOTE)
  const [mostrarArriba, setMostrarArriba] = useState(false)
  if (firma !== firmaVista) {
    setFirmaVista(firma)
    setCuantas(LOTE)
  }
  const indiceSel = sel ? tarjetas.findIndex((t) => t.id === sel) : -1
  const visibles = tarjetas.slice(0, Math.max(cuantas, indiceSel + 1))

  useEffect(() => {
    const el = fondo.current
    if (!el || cuantas >= tarjetas.length) return
    const o = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setCuantas((n) => Math.min(tarjetas.length, n + LOTE))
        }
      },
      { rootMargin: "240px" }
    )
    o.observe(el)
    return () => o.disconnect()
  }, [cuantas, tarjetas.length])

  useEffect(() => {
    const raiz = caja.current
    if (!raiz) return
    const sc = scrollerDe(raiz)
    const alScroll = () => {
      const ver = sc.scrollTop > 480
      setMostrarArriba((v) => (v === ver ? v : ver))
    }
    alScroll()
    sc.addEventListener("scroll", alScroll, { passive: true })
    return () => sc.removeEventListener("scroll", alScroll)
  }, [tarjetas, cuantas])

  return (
    <section
      className={cn(
        "relative flex shrink-0 flex-col bg-papel lg:h-full lg:min-h-0 lg:shrink lg:overflow-hidden",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-linea px-3 py-2">
        <div className="min-w-0 flex-1 px-1">
          <Encabezado titulo={titulo} total={total} />
        </div>
        <Link
          href={hrefFiltros}
          onClick={(e) => {
            e.preventDefault()
            onFiltros()
          }}
          className={control}
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
      <div ref={caja} className="lista-scroll lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
        {tarjetas.length > 0 ? (
          <ul aria-label="Propiedades" className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-2">
            {visibles.map((t, i) => {
              const elegida = t.id === sel
              const marcada = elegida || t.id === resaltada
              return (
                <li
                  key={t.id}
                  data-id={t.id}
                  data-elegida={elegida ? "true" : undefined}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") onResaltar(t.id)
                  }}
                  onPointerLeave={() => onResaltar(undefined)}
                  onClickCapture={(e) => {
                    if (!preview) return
                    if (e.target instanceof Element && e.target.closest("button")) return
                    e.preventDefault()
                    e.stopPropagation()
                    onElegir(t.id)
                  }}
                  onClick={() => {
                    if (!preview) onElegir(t.id)
                  }}
                  className={cn(marco, marcada && anillo)}
                >
                  <TarjetaPropiedad
                    t={t}
                    variante="grilla"
                    prioridad={i < 2}
                    className="rounded-[inherit] border-0"
                  />
                </li>
              )
            })}
            {visibles.length < tarjetas.length ? <li ref={fondo} className="col-span-full h-px" /> : null}
          </ul>
        ) : (
          vacio
        )}
      </div>
      {mostrarArriba ? (
        <button
          type="button"
          aria-label="Ir arriba"
          onClick={() => {
            const raiz = caja.current
            if (raiz) scrollerDe(raiz).scrollTo({ top: 0 })
          }}
          className="fixed right-3 bottom-4 z-30 grid size-11 place-items-center rounded-full border border-linea bg-blanco text-tinta shadow-sm lg:absolute lg:bottom-3"
        >
          <CaretUp className="size-5" aria-hidden="true" />
        </button>
      ) : null}
    </section>
  )
}
