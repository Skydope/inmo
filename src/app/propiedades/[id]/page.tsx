import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BarraDeContacto, TarjetaDeContacto } from "@/components/ficha/barra-de-contacto"
import { BarraSuperior } from "@/components/ficha/barra-superior"
import { Caracteristicas } from "@/components/ficha/caracteristicas"
import { DatosClave } from "@/components/ficha/datos-clave"
import { Descripcion } from "@/components/ficha/descripcion"
import { EncabezadoFicha } from "@/components/ficha/encabezado-ficha"
import { Galeria } from "@/components/ficha/galeria"
import { Inmobiliaria } from "@/components/ficha/inmobiliaria"
import { Parecidas } from "@/components/ficha/parecidas"
import { Ubicacion } from "@/components/ficha/ubicacion"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { BUSQUEDA_VACIA, etiquetaOperacion, etiquetaTipo, hrefDeBusqueda, nombreZona, operacionEnFrase } from "@/lib/busqueda"
import { linksDeContacto, mensajeDeConsulta } from "@/lib/contact"
import { formatFecha, formatPrice } from "@/lib/format"
import { getProperties, getPropertyById } from "@/lib/properties/adapter"
import { similares } from "@/lib/properties/similares"
import { siteUrl } from "@/lib/site"
import { cortarDescripcion } from "@/lib/texto"

export async function generateStaticParams() {
  const all = await getProperties()
  return all.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) return { title: "Propiedad no encontrada", robots: { index: false } }
  const titulo = `${etiquetaTipo(property.type)} ${operacionEnFrase(property.operation)} en ${nombreZona(property.zone)} · ${formatPrice(property.price, property.currency)}`
  const descripcion = cortarDescripcion(property.description).inicio.replace(/\s+/g, " ")
  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `${siteUrl}/propiedades/${property.id}`,
    },
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) notFound()

  const url = `${siteUrl}/propiedades/${property.id}`
  const mensaje = mensajeDeConsulta(property, url)
  const links = linksDeContacto(property.agency, mensaje)
  const parecidas = similares(property, await getProperties())
  const volverHref = hrefDeBusqueda("/propiedades", {
    ...BUSQUEDA_VACIA,
    operacion: property.operation,
    tipos: [property.type],
  })

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-4">
        <BarraSuperior
          volverHref={volverHref}
          titulo={property.title}
          texto={`${etiquetaTipo(property.type)} ${operacionEnFrase(property.operation)} en ${nombreZona(property.zone)} · ${formatPrice(property.price, property.currency)}`}
        />
        <div className="mt-3 min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6">
          <div className="flex min-w-0 flex-col gap-4">
            <Galeria
              fotos={property.photos}
              tipo={property.type}
              alt={property.title}
              etiqueta={etiquetaOperacion(property.operation)}
              lat={property.lat}
              lng={property.lng}
              mostrarDireccion={property.showAddress}
            />
            <EncabezadoFicha propiedad={property} />
            <DatosClave propiedad={property} />
            <Caracteristicas propiedad={property} />
            <Descripcion texto={property.description} />
            <Ubicacion
              id={property.id}
              lat={property.lat}
              lng={property.lng}
              mostrarDireccion={property.showAddress}
            />
            <Inmobiliaria agencia={property.agency} className="lg:hidden" />
            <Parecidas propiedades={parecidas} />
            <p className="text-[13px] text-tinta-suave">
              Publicada el {formatFecha(property.publishedAt)} · Código {property.id}
            </p>
          </div>
          <TarjetaDeContacto propiedad={property} links={links} />
        </div>
      </main>
      <Pie />
      <div className="h-24 lg:hidden" aria-hidden="true" />
      <BarraDeContacto links={links} />
    </>
  )
}
