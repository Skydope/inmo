import type { Metadata } from "next"
import { Encabezado } from "@/components/resultados/encabezado"
import { ResultadosCliente } from "@/components/resultados/resultados-cliente"
import { Header } from "@/components/shell/header"
import {
  chipsDeBusqueda,
  contarResultados,
  esIndexable,
  filtrarPropiedades,
  hrefDeBusqueda,
  indiceDeBusqueda,
  leerBusqueda,
  ordenarPropiedades,
  tituloDeBusqueda,
  type Busqueda,
} from "@/lib/busqueda"
import { getProperties } from "@/lib/properties/adapter"
import { aTarjeta } from "@/lib/properties/tarjeta"

/*
 * Resultados: las propiedades de la búsqueda, de a una tarjeta grande que se desliza, o en
 * el mapa. Spec: docs/hitos/hito-1/resultados.md.
 */

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const canonica = (b: Busqueda) => hrefDeBusqueda("/propiedades", { ...b, vista: "lista", sel: undefined })

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const busqueda = leerBusqueda(await searchParams)
  return {
    title: tituloDeBusqueda(busqueda),
    description: `${tituloDeBusqueda(busqueda)}: las propiedades de las inmobiliarias de Bolívar.`,
    alternates: { canonical: canonica(busqueda) },
    robots: esIndexable(busqueda) ? undefined : { index: false, follow: true },
  }
}

export default async function PropiedadesPage({ searchParams }: Props) {
  const busqueda = leerBusqueda(await searchParams, { conVista: true })
  const todas = await getProperties()
  const propiedades = ordenarPropiedades(filtrarPropiedades(todas, busqueda), busqueda.orden, busqueda.operacion)
  // Al final del carrusel: qué filtro sacar para ver más, y cuántas aparecerían.
  const ampliar = chipsDeBusqueda(busqueda)
    .map((chip) => ({ ...chip, conteo: contarResultados(todas, chip.sin) }))
    .filter((s) => s.conteo > propiedades.length)
    .sort((a, b) => b.conteo - a.conteo)
    .slice(0, 4)

  const titulo = tituloDeBusqueda(busqueda)

  return (
    <div className="flex min-h-dvh flex-col bg-papel">
      <Header />
      <main className="flex flex-1 flex-col">
        {/* Otra búsqueda (los filtros navegan acá mismo) arranca de cero: carrusel, selección. */}
        <ResultadosCliente
          key={canonica(busqueda)}
          encabezado={<Encabezado titulo={titulo} total={propiedades.length} />}
          titulo={titulo}
          tarjetas={propiedades.map(aTarjeta)}
          busqueda={busqueda}
          ampliar={ampliar}
          indice={indiceDeBusqueda(todas)}
        />
      </main>
    </div>
  )
}
