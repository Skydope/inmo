import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Mail, MessageCircle, Phone } from "lucide-react"
import { FotoPropiedad } from "@/components/busqueda/foto-propiedad"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { buttonVariants } from "@/components/ui/button"
import { EtiquetaOperacion } from "@/components/ui/etiqueta-operacion"
import { contactLinkFor } from "@/lib/contact"
import { etiquetaOperacion, etiquetaTipo, nombreZona } from "@/lib/busqueda"
import { formatArea, formatPrice } from "@/lib/format"
import { getProperties, getPropertyById } from "@/lib/properties/adapter"

/*
 * ANDAMIO (hito 1, identidad-y-base): la ficha mínima con el shell nuevo. La reemplaza
 * `ficha` (galería, datos clave, ubicación, contacto fijo).
 */

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
  return {
    title: property.title,
    description: `${etiquetaOperacion(property.operation)} · ${etiquetaTipo(property.type)} en ${nombreZona(property.zone)} — ${formatPrice(property.price, property.currency)}.`,
    openGraph: property.photos[0]
      ? { images: [{ url: property.photos[0], width: 1200, height: 670, alt: property.title }] }
      : undefined,
  }
}

const ICONO_CONTACTO = { whatsapp: MessageCircle, tel: Phone, mailto: Mail } as const

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) notFound()

  const contact = contactLinkFor(property.agency)
  const IconoContacto = ICONO_CONTACTO[contact.kind]
  const datos = [
    formatArea(property),
    property.beds ? `${property.beds} dorm.` : null,
    property.baths ? `${property.baths} baños` : null,
  ].filter(Boolean)

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 py-6">
        <Link
          href="/propiedades"
          className="inline-flex min-h-11 w-fit items-center gap-1 text-sm font-semibold text-tinta-suave hover:text-tinta"
        >
          <ChevronLeft className="size-4" aria-hidden="true" /> Volver
        </Link>
        <div className="relative overflow-hidden rounded-tarjeta bg-papel">
          <FotoPropiedad src={property.photos[0]} tipo={property.type} alt={property.title} className="aspect-[4/3] w-full" />
          <EtiquetaOperacion className="absolute top-3 left-3">{etiquetaOperacion(property.operation)}</EtiquetaOperacion>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[1.875rem] leading-none font-titulo tabular-nums">
            {formatPrice(property.price, property.currency)}
          </p>
          <h1 className="mt-1 text-xl font-titulo">{property.title}</h1>
          <p className="text-tinta-suave">
            {property.showAddress ? `${property.address} · ` : ""}
            {nombreZona(property.zone)}
          </p>
          {datos.length > 0 ? <p className="text-sm">{datos.join(" · ")}</p> : null}
        </div>
        {property.description ? (
          <p className="leading-relaxed whitespace-pre-line text-tinta">{property.description}</p>
        ) : null}
        <p className="text-sm text-tinta-suave">Publicada por {property.agency.name}</p>
        <a
          href={contact.href}
          target={contact.kind === "whatsapp" ? "_blank" : undefined}
          rel={contact.kind === "whatsapp" ? "noopener noreferrer" : undefined}
          className={buttonVariants({ size: "lg", className: "w-full" })}
        >
          <IconoContacto aria-hidden="true" />
          Consultar · {contact.label}
        </a>
      </main>
      <Pie />
    </>
  )
}
