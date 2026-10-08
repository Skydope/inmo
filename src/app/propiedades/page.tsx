import type { Metadata } from "next"
import Link from "next/link"
import { FotoPropiedad } from "@/components/busqueda/foto-propiedad"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { EtiquetaOperacion } from "@/components/ui/etiqueta-operacion"
import {
  etiquetaOperacion,
  etiquetaTipo,
  filtrarPropiedades,
  leerBusqueda,
  nombreZona,
  ordenarPropiedades,
  tituloDeBusqueda,
} from "@/lib/busqueda"
import { formatPrice } from "@/lib/format"
import { getProperties } from "@/lib/properties/adapter"

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const busqueda = leerBusqueda(await searchParams)
  return {
    title: tituloDeBusqueda(busqueda),
    description: "Casas, departamentos y terrenos en venta y alquiler en San Carlos de Bolívar.",
  }
}

/*
 * ANDAMIO (hito 1): una lista simple que ya filtra por la URL con el contrato de
 * `modelo-de-busqueda`. La reemplaza `resultados` (lista deslizable ⇄ mapa).
 */
export default async function PropiedadesPage({ searchParams }: Props) {
  const busqueda = leerBusqueda(await searchParams, { conVista: true })
  const propiedades = ordenarPropiedades(
    filtrarPropiedades(await getProperties(), busqueda),
    busqueda.orden,
    busqueda.operacion
  )

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 py-8">
        <div>
          <h1 className="text-2xl font-titulo">{tituloDeBusqueda(busqueda)}</h1>
          <p className="text-sm text-tinta-suave">
            {propiedades.length} {propiedades.length === 1 ? "propiedad" : "propiedades"}
          </p>
        </div>
        <ul className="flex flex-col gap-3">
          {propiedades.map((p) => (
            <li key={p.id}>
              <Link
                href={`/propiedades/${p.id}`}
                className="flex gap-3 rounded-tarjeta border border-linea bg-blanco p-2 hover:border-tinta-suave"
              >
                <FotoPropiedad
                  src={p.photos[0]}
                  tipo={p.type}
                  alt=""
                  className="aspect-[4/3] w-28 shrink-0 rounded-control"
                />
                <span className="flex min-w-0 flex-col gap-1 py-1">
                  <EtiquetaOperacion className="w-fit">{etiquetaOperacion(p.operation)}</EtiquetaOperacion>
                  <span className="text-lg leading-none font-titulo tabular-nums">
                    {formatPrice(p.price, p.currency)}
                  </span>
                  <span className="truncate text-sm font-semibold">
                    {etiquetaTipo(p.type)} en {nombreZona(p.zone)}
                  </span>
                  <span className="truncate text-sm text-tinta-suave">{p.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Pie />
    </>
  )
}
