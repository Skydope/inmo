import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { BarraDePaso, PasosDeBusqueda } from "@/components/busqueda/barra-de-paso"
import { Logo } from "@/components/marca/logo"
import { brandName } from "@/lib/brand"
import { CampoAmbientes } from "@/components/busqueda/campos/campo-ambientes"
import { CampoCaracteristicas } from "@/components/busqueda/campos/campo-caracteristicas"
import { CampoPrecio } from "@/components/busqueda/campos/campo-precio"
import { CampoTipos } from "@/components/busqueda/campos/campo-tipos"
import { CampoZonas } from "@/components/busqueda/campos/campo-zonas"
import { FormularioDePaso } from "@/components/busqueda/formulario-de-paso"
import {
  BUSQUEDA_VACIA,
  PASOS_EN_BUSCAR,
  contarPorOpcion,
  contarResultados,
  esPasoEnBuscar,
  escribirBusqueda,
  esVivienda,
  indiceDeBusqueda,
  leerBusqueda,
  monedaPorDefecto,
  pasoAccesible,
  pasoSiguiente,
  limitesDePrecio,
  rutaDePaso,
  type Busqueda,
  type PasoEnBuscar,
} from "@/lib/busqueda"
import { getProperties } from "@/lib/properties/adapter"

/*
 * Pasos 2 a 4 del buscador guiado: tipo, zona y detalles. Cada paso es una URL con lo elegido
 * hasta ahí. Spec: docs/hitos/hito-1/buscador-guiado.md.
 */

type Props = {
  params: Promise<{ paso: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const PREGUNTA: Record<PasoEnBuscar, { titulo: string; ayuda: string }> = {
  tipo: { titulo: "¿Qué tipo de propiedad?", ayuda: "Podés elegir más de uno." },
  zona: { titulo: "¿En qué zona?", ayuda: "Podés elegir varias." },
  detalles: { titulo: "¿Algo más?", ayuda: "Todo es opcional." },
}

/** Los parámetros que maneja cada paso; el resto viaja oculto. */
const CLAVES_DEL_PASO: Record<PasoEnBuscar, string[]> = {
  tipo: ["tipo"],
  zona: ["zona"],
  detalles: ["dorm", "banos", "moneda", "desde", "hasta", "con"],
}

function ocultos(busqueda: Busqueda, paso: PasoEnBuscar): [string, string][] {
  const propias = new Set(CLAVES_DEL_PASO[paso])
  return [...new URLSearchParams(escribirBusqueda(busqueda))].filter(([clave]) => !propias.has(clave))
}

// Solo existen estos tres pasos: cualquier otro da 404 en el ruteo, antes de renderizar.
export const dynamicParams = false
export function generateStaticParams() {
  return PASOS_EN_BUSCAR.map((paso) => ({ paso }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paso } = await params
  if (!esPasoEnBuscar(paso)) return {}
  return { title: PREGUNTA[paso].titulo, robots: { index: false, follow: true } }
}

export default async function PasoPage({ params, searchParams }: Props) {
  const { paso } = await params
  if (!esPasoEnBuscar(paso)) notFound()
  const busqueda = leerBusqueda(await searchParams)
  if (!pasoAccesible(paso, busqueda)) redirect("/")

  const propiedades = await getProperties()
  const indice = indiceDeBusqueda(propiedades)
  const siguiente = pasoSiguiente(paso)
  const accion = siguiente === "resultados" ? "/propiedades" : `/buscar/${siguiente}`
  const idTitulo = `titulo-${paso}`

  let campo: React.ReactNode
  if (paso === "tipo") {
    campo = (
      <CampoTipos
        operacion={busqueda.operacion}
        elegidos={busqueda.tipos}
        conteo={contarPorOpcion(indice, busqueda, "tipo")}
      />
    )
  } else if (paso === "zona") {
    campo = (
      <CampoZonas
        elegidas={busqueda.zonas}
        conteo={contarPorOpcion(indice, busqueda, "zona")}
        hrefTodo={rutaDePaso("zona", { ...busqueda, zonas: [] })}
        total={contarResultados(indice, { ...busqueda, zonas: [] })}
      />
    )
  } else {
    const hayVivienda = busqueda.tipos.length === 0 || busqueda.tipos.some(esVivienda)
    campo = (
      <div className="flex flex-col gap-7">
        <CampoPrecio
          moneda={busqueda.moneda ?? monedaPorDefecto(busqueda.operacion)}
          desde={busqueda.desde}
          hasta={busqueda.hasta}
          limites={{
            USD: limitesDePrecio(indice, busqueda, "USD"),
            ARS: limitesDePrecio(indice, busqueda, "ARS"),
          }}
        />
        {hayVivienda ? <CampoAmbientes dorm={busqueda.dorm} banos={busqueda.banos} /> : null}
        <CampoCaracteristicas operacion={busqueda.operacion} elegidas={busqueda.con} />
        <a
          href={rutaDePaso("detalles", {
            ...BUSQUEDA_VACIA,
            operacion: busqueda.operacion,
            tipos: busqueda.tipos,
            zonas: busqueda.zonas,
          })}
          className="inline-flex min-h-11 w-fit items-center text-sm font-semibold text-tinta-suave underline underline-offset-4"
        >
          Limpiar
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-papel lg:p-4">
      <div className="flex min-h-dvh flex-col lg:grid lg:min-h-[calc(100dvh-2rem)] lg:grid-cols-[16rem_1fr] lg:rounded-hoja lg:border lg:border-linea lg:bg-blanco">
        <aside className="hidden border-r border-linea px-5 py-6 lg:flex lg:flex-col">
          <Link href="/" aria-label={`${brandName}, ir al inicio`} className="inline-flex min-h-11 items-center">
            <Logo />
          </Link>
          <PasosDeBusqueda paso={paso} busqueda={busqueda} className="mt-10" />
        </aside>

        <div className="flex min-h-dvh flex-col lg:min-h-full">
          <BarraDePaso paso={paso} busqueda={busqueda} />
          <PasosDeBusqueda paso={paso} busqueda={busqueda} compacto className="lg:hidden" />
          <h1 id={idTitulo} className="mx-auto mt-3 w-full max-w-xl px-4 text-center text-[2rem] leading-[1.1] font-titulo lg:text-left">
            {PREGUNTA[paso].titulo}
          </h1>
          <p className="mx-auto mt-1 mb-6 w-full max-w-xl px-4 text-center text-tinta-suave lg:text-left">{PREGUNTA[paso].ayuda}</p>
          <FormularioDePaso
            key={`${paso}?${escribirBusqueda(busqueda)}`}
            paso={paso}
            busqueda={busqueda}
            indice={indice}
            accion={accion}
            ocultos={ocultos(busqueda, paso)}
            idTitulo={idTitulo}
            ultimo={siguiente === "resultados"}
          >
            {campo}
          </FormularioDePaso>
        </div>
      </div>
    </div>
  )
}
