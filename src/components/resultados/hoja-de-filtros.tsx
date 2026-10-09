"use client"

import { useRouter } from "next/navigation"
import { ArrowCounterClockwise, X } from "@/components/iconos"
import { useEffect, useRef, useState } from "react"
import { CampoAmbientes } from "@/components/busqueda/campos/campo-ambientes"
import { CampoCaracteristicas } from "@/components/busqueda/campos/campo-caracteristicas"
import { CampoPrecio } from "@/components/busqueda/campos/campo-precio"
import { CampoTipos } from "@/components/busqueda/campos/campo-tipos"
import { CampoZonas } from "@/components/busqueda/campos/campo-zonas"
import { datosDe, useBusquedaDelFormulario } from "@/components/busqueda/use-busqueda-del-formulario"
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { useEsEscritorio } from "@/hooks/use-es-escritorio"
import { Opcion } from "@/components/ui/opcion"
import {
  BUSQUEDA_VACIA,
  OPERACIONES,
  contarPorOpcion,
  contarResultados,
  esVivienda,
  hrefDeBusqueda,
  leerBusqueda,
  monedaPorDefecto,
  limitesDePrecio,
  type Busqueda,
  type Filtrable,
  type Operacion,
  type Orden,
  type Vista,
} from "@/lib/busqueda"

const DESDE_ABAJO = { "--drawer-content-height": "92dvh", "--drawer-content-max-height": "92dvh" } as React.CSSProperties

const ORDENES: { valor: Orden; etiqueta: string }[] = [
  { valor: "recientes", etiqueta: "Más recientes" },
  { valor: "precio-asc", etiqueta: "Menor precio" },
  { valor: "precio-desc", etiqueta: "Mayor precio" },
]

/**
 * Los filtros de resultados: en el celular suben desde abajo; en escritorio entran desde la
 * derecha, como el menú, en un panel angosto. Cada ajuste se aplica solo.
 */
export function HojaDeFiltros({
  abierta,
  onAbiertaChange,
  busqueda,
  indice,
  vista,
}: {
  abierta: boolean
  onAbiertaChange: (abierta: boolean) => void
  busqueda: Busqueda
  indice: Filtrable[]
  vista: Vista
}) {
  const escritorio = useEsEscritorio()
  return (
    <Drawer
      open={abierta}
      onOpenChange={onAbiertaChange}
      swipeDirection={escritorio ? "right" : "down"}
      showSwipeHandle={!escritorio}
    >
      <DrawerContent className="bg-blanco" style={escritorio ? undefined : DESDE_ABAJO}>
        {/* El contenido se monta al abrir: cada vez arranca de la URL. */}
        <Contenido busqueda={busqueda} indice={indice} vista={vista} />
      </DrawerContent>
    </Drawer>
  )
}

function Contenido({
  busqueda,
  indice,
  vista,
}: {
  busqueda: Busqueda
  indice: Filtrable[]
  vista: Vista
}) {
  // "Limpiar" y cambiar la operación vuelven a armar el formulario desde otra búsqueda.
  const [base, setBase] = useState(busqueda)
  const [vuelta, setVuelta] = useState(0)
  const reiniciar = (b: Busqueda) => {
    setBase(b)
    setVuelta((v) => v + 1)
  }
  return <Formulario key={vuelta} base={base} indice={indice} vista={vista} onReiniciar={reiniciar} />
}

function Formulario({
  base,
  indice,
  vista,
  onReiniciar,
}: {
  base: Busqueda
  indice: Filtrable[]
  vista: Vista
  onReiniciar: (b: Busqueda) => void
}) {
  const router = useRouter()
  const ancla = useRef<HTMLDivElement>(null)
  const actual = useBusquedaDelFormulario(ancla, base)
  const hayVivienda = actual.tipos.length === 0 || actual.tipos.some(esVivienda)

  // Cada cambio entra en la URL. La espera junta el arrastre del precio en una sola ida.
  // Se compara sin la propiedad elegida: abrir la hoja no tiene que sacarla de la URL.
  useEffect(() => {
    const filtrosDe = (b: Busqueda) =>
      hrefDeBusqueda("/propiedades", { ...b, vista: "lista", sel: undefined })
    const ahora = filtrosDe(leerBusqueda(new URLSearchParams(window.location.search), { conVista: true }))
    if (filtrosDe(actual) === ahora) return
    const espera = window.setTimeout(() => {
      router.replace(hrefDeBusqueda("/propiedades", { ...actual, vista, sel: undefined }))
    }, 280)
    return () => window.clearTimeout(espera)
  }, [actual, vista, router])

  // Otra operación: lo que no aplica se va (tipos, características) y el precio arranca de
  // cero en la moneda de esa operación.
  const cambiarOperacion = (form: HTMLFormElement, operacion: Operacion) =>
    onReiniciar({ ...leerBusqueda(datosDe(form)), operacion, moneda: undefined, desde: undefined, hasta: undefined })

  return (
    <form
      action="/propiedades"
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => e.preventDefault()}
    >
      <div ref={ancla} hidden />
      <div className="flex items-center gap-2 border-b border-linea px-4 pt-1 pb-3 group-data-[swipe-axis=x]/drawer-popup:pt-3">
        <DrawerTitle className="flex-1 text-xl font-titulo">Filtros</DrawerTitle>
        <button
          type="button"
          onClick={() => onReiniciar({ ...BUSQUEDA_VACIA, operacion: actual.operacion })}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-tinta-suave hover:bg-papel hover:text-tinta"
        >
          <ArrowCounterClockwise className="size-4" aria-hidden="true" />
          Limpiar
        </button>
        <DrawerClose
          aria-label="Cerrar"
          className="grid size-11 place-items-center rounded-full text-tinta-suave hover:bg-papel hover:text-tinta"
        >
          <X className="size-5" aria-hidden="true" />
        </DrawerClose>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto overscroll-contain px-4 pt-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Quiero</h2>
          <div role="radiogroup" aria-label="Operación" className="flex flex-wrap gap-2">
            {OPERACIONES.map((o) => (
              <Opcion
                key={o.slug}
                tipo="radio"
                variante="chip"
                name="operacion"
                value={o.slug}
                etiqueta={o.verbo}
                defaultChecked={base.operacion === o.slug}
                onChange={(e) => {
                  const form = e.currentTarget.form
                  if (form) cambiarOperacion(form, o.slug)
                }}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Tipo</h2>
          <CampoTipos
            variante="chip"
            operacion={actual.operacion}
            elegidos={actual.tipos}
            conteo={contarPorOpcion(indice, actual, "tipo")}
          />
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Zona</h2>
          <CampoZonas
            modo="boton"
            elegidas={actual.zonas}
            conteo={contarPorOpcion(indice, actual, "zona")}
            total={contarResultados(indice, { ...actual, zonas: [] })}
          />
        </section>

        <CampoPrecio
          moneda={base.moneda ?? monedaPorDefecto(base.operacion)}
          desde={base.desde}
          hasta={base.hasta}
          limites={{
            USD: limitesDePrecio(indice, actual, "USD"),
            ARS: limitesDePrecio(indice, actual, "ARS"),
          }}
        />

        {hayVivienda ? <CampoAmbientes dorm={base.dorm} banos={base.banos} /> : null}

        <CampoCaracteristicas operacion={actual.operacion} elegidas={base.con} />

        <section className="flex flex-col gap-2">
          <h2 className="font-semibold">Ordenar por</h2>
          <div role="radiogroup" aria-label="Ordenar por" className="flex flex-wrap gap-2">
            {ORDENES.map((o) => (
              <Opcion
                key={o.valor}
                tipo="radio"
                variante="chip"
                name="orden"
                value={o.valor}
                etiqueta={o.etiqueta}
                defaultChecked={base.orden === o.valor}
              />
            ))}
          </div>
        </section>
      </div>
    </form>
  )
}
