import type { Metadata } from "next"
import Link from "next/link"
import { CoverImage } from "@/components/cover-image"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { EtiquetaOperacion } from "@/components/ui/etiqueta-operacion"
import { formatPrice, operationLabel } from "@/lib/format"
import { getProperties } from "@/lib/properties/adapter"

export const metadata: Metadata = {
  title: "Propiedades",
  description: "Casas, departamentos y terrenos en venta y alquiler en San Carlos de Bolívar.",
}

/*
 * ANDAMIO (hito 1, identidad-y-base): una lista simple con el shell nuevo. La reemplaza
 * `resultados` (lista deslizable ⇄ mapa); `modelo-de-busqueda` le suma los filtros por URL.
 */
export default async function PropiedadesPage() {
  const properties = await getProperties()

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 py-8">
        <div>
          <h1 className="text-2xl font-titulo">Propiedades en Bolívar</h1>
          <p className="text-sm text-tinta-suave">{properties.length} propiedades</p>
        </div>
        <ul className="flex flex-col gap-3">
          {properties.map((p) => (
            <li key={p.id}>
              <Link
                href={`/propiedades/${p.id}`}
                className="flex gap-3 rounded-tarjeta border border-linea bg-blanco p-2 hover:border-tinta-suave"
              >
                <CoverImage
                  src={p.coverUrl}
                  alt=""
                  className="aspect-[4/3] w-28 shrink-0 rounded-control object-cover"
                />
                <span className="flex min-w-0 flex-col gap-1 py-1">
                  <EtiquetaOperacion className="w-fit">{operationLabel(p.operation)}</EtiquetaOperacion>
                  <span className="text-lg leading-none font-titulo tabular-nums">
                    {formatPrice(p.price, p.currency)}
                  </span>
                  <span className="truncate text-sm font-semibold">{p.title}</span>
                  <span className="truncate text-sm text-tinta-suave">{p.address}</span>
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
