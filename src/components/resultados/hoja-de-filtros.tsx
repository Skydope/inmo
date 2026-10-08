"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { useRef, useState } from "react"
import { CampoAmbientes } from "@/components/busqueda/campos/campo-ambientes"
import { CampoCaracteristicas } from "@/components/busqueda/campos/campo-caracteristicas"
import { CampoPrecio } from "@/components/busqueda/campos/campo-precio"
import { CampoTipos } from "@/components/busqueda/campos/campo-tipos"
import { CampoZonas } from "@/components/busqueda/campos/campo-zonas"
import { datosDe, useBusquedaDelFormulario } from "@/components/busqueda/use-busqueda-del-formulario"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
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
  rangosDePrecio,
  type Busqueda,
  type Filtrable,
  type Operacion,
  type Orden,
  type Vista,
} from "@/lib/busqueda"

const ORDENES: { valor: Orden; etiqueta: string }[] = [
  { valor: "recientes", etiqueta: "Más recientes" },
  { valor: "precio-asc", etiqueta: "Menor precio" },
  { valor: "precio-desc", etiqueta: "Mayor precio" },
]

/**
 * Los filtros de resultados, en una hoja que sube desde abajo: los mismos campos que los pasos
 * del buscador, más la operación y el orden. Nada se aplica hasta tocar "Ver N propiedades"
 * (el número se recalcula en vivo contra el índice); cerrarla de cualquier forma descarta.
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
  const router = useRouter()
  return (
    <Drawer open={abierta} onOpenChange={onAbiertaChange} showSwipeHandle>
      <DrawerContent
        className="bg-blanco"
        style={{ "--drawer-content-height": "92dvh", "--drawer-content-max-height": "92dvh" } as React.CSSProperties}
      >
        {/* El contenido se monta al abrir: cada vez arranca de la URL. */}
        <Contenido
          busqueda={busqueda}
          indice={indice}
          onAplicar={(b) => {
            router.push(hrefDeBusqueda("/propiedades", { ...b, vista, sel: undefined }))
            onAbiertaChange(false)
          }}
        />
      </DrawerContent>
    </Drawer>
  )
}

function Contenido({
  busqueda,
  indice,
  onAplicar,
}: {
  busqueda: Busqueda
  indice: Filtrable[]
  onAplicar: (b: Busqueda) => void
}) {
  // "Limpiar" y cambiar la operación vuelven a armar el formulario desde otra búsqueda.
  const [base, setBase] = useState(busqueda)
  const [vuelta, setVuelta] = useState(0)
  const reiniciar = (b: Busqueda) => {
    setBase(b)
    setVuelta((v) => v + 1)
  }
  return <Formulario key={vuelta} base={base} indice={indice} onReiniciar={reiniciar} onAplicar={onAplicar} />
}

function Formulario({
  base,
  indice,
  onReiniciar,
  onAplicar,
}: {
  base: Busqueda
  indice: Filtrable[]
  onReiniciar: (b: Busqueda) => void
  onAplicar: (b: Busqueda) => void
}) {
  const ancla = useRef<HTMLDivElement>(null)
  const actual = useBusquedaDelFormulario(ancla, base)
  const conteo = contarResultados(indice, actual)
  const hayVivienda = actual.tipos.length === 0 || actual.tipos.some(esVivienda)

  // Otra operación: lo que no aplica se va (tipos, características) y el precio arranca de
  // cero en la moneda de esa operación.
  const cambiarOperacion = (form: HTMLFormElement, operacion: Operacion) =>
    onReiniciar({ ...leerBusqueda(datosDe(form)), operacion, moneda: undefined, desde: undefined, hasta: undefined })

  return (
    <form
      action="/propiedades"
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault()
        onAplicar(leerBusqueda(datosDe(e.currentTarget)))
      }}
    >
      <div ref={ancla} hidden />
      <div className="flex items-center gap-2 border-b border-linea px-4 pt-1 pb-3">
        <DrawerTitle className="flex-1 text-xl font-titulo">Filtros</DrawerTitle>
        <button
          type="button"
          onClick={() => onReiniciar({ ...BUSQUEDA_VACIA, operacion: actual.operacion })}
          className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-tinta-suave underline underline-offset-4 hover:text-tinta"
        >
          Limpiar
        </button>
        <DrawerClose
          aria-label="Cerrar sin aplicar"
          className="grid size-11 place-items-center rounded-full text-tinta-suave hover:bg-papel hover:text-tinta"
        >
          <X className="size-5" aria-hidden="true" />
        </DrawerClose>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto overscroll-contain px-4 pt-5 pb-8">
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
          rangos={{
            USD: rangosDePrecio(indice, actual, "USD"),
            ARS: rangosDePrecio(indice, actual, "ARS"),
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

      <div className="border-t border-linea bg-blanco px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-6px_16px_rgb(0_0_0/0.05)]">
        <Button type="submit" size="lg" className="w-full" disabled={conteo === 0} aria-live="polite">
          {conteo === 0
            ? "Con esto no hay propiedades"
            : `Ver ${conteo} ${conteo === 1 ? "propiedad" : "propiedades"}`}
        </Button>
      </div>
    </form>
  )
}
