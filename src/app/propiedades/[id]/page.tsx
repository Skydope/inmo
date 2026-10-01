import Link from "next/link"
import { notFound } from "next/navigation"
import { Bath, BedDouble, Expand, MessageCircle, Phone, Mail, ArrowLeft } from "lucide-react"
import { CoverImage } from "@/components/cover-image"
import { SiteNav } from "@/components/site-nav"
import { Button } from "@/components/ui/button"
import { contactLinkFor } from "@/lib/contact"
import { formatPrice, operationLabel, typeLabel } from "@/lib/format"
import { getProperties, getPropertyById } from "@/lib/properties/adapter"

export async function generateStaticParams() {
  const all = await getProperties()
  return all.map((p) => ({ id: p.id }))
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) notFound()

  const contact = contactLinkFor(property.agency)
  const ContactIcon =
    contact.kind === "whatsapp" ? MessageCircle : contact.kind === "tel" ? Phone : Mail

  return (
    <div className="pb-20">
      <SiteNav />
      <div className="mx-auto max-w-5xl px-4 pt-8">
      <Link
        href="/propiedades"
        className="mb-6 inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="overflow-hidden rounded-[1.75rem] border border-glass-border">
        <div className="relative aspect-[16/9] bg-bg-elevated">
          <CoverImage
            src={property.coverUrl}
            alt={property.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-sm backdrop-blur">
            {property.photoCount} fotos
          </span>
        </div>

        <div className="space-y-6 bg-bg-elevated/50 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-fg-muted">
                {operationLabel(property.operation)} · {typeLabel(property.type)}
              </p>
              <h1 className="mt-2 max-w-2xl font-display text-3xl leading-tight text-fg md:text-5xl">
                {property.title}
              </h1>
              <p className="mt-2 text-fg-muted">{property.address}</p>
            </div>
            <p className="font-display text-3xl text-accent md:text-4xl">
              {formatPrice(property.price, property.currency)}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-fg-muted">
            {property.beds > 0 ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-glass-border px-3 py-1.5">
                <BedDouble className="h-4 w-4" /> {property.beds} dorm.
              </span>
            ) : null}
            {property.baths > 0 ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-glass-border px-3 py-1.5">
                <Bath className="h-4 w-4" /> {property.baths} baños
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-full border border-glass-border px-3 py-1.5">
              <Expand className="h-4 w-4" /> {property.areaM2} m²
            </span>
          </div>

          <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <CoverImage
                src={property.agency.logoUrl}
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-fg">{property.agency.name}</p>
                <p className="text-sm text-fg-muted">
                  Inmobiliaria en Bolívar{property.agency.address ? ` · ${property.agency.address}` : ""}
                </p>
              </div>
            </div>
            <a
              href={contact.href}
              target={contact.kind === "whatsapp" ? "_blank" : undefined}
              rel={contact.kind === "whatsapp" ? "noreferrer" : undefined}
            >
              <Button size="lg">
                <ContactIcon className="h-4 w-4" />
                Contactar · {contact.label}
              </Button>
            </a>
          </div>

          {property.description ? (
            <div className="space-y-2 border-t border-glass-border pt-6">
              <h2 className="font-display text-xl text-fg">Descripción</h2>
              <p className="text-base leading-relaxed text-fg-muted whitespace-pre-line">
                {property.description}
              </p>
            </div>
          ) : null}

          {property.features && property.features.length > 0 ? (
            <div className="space-y-3 border-t border-glass-border pt-6">
              <h2 className="font-display text-xl text-fg">Características y comodidades</h2>
              <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                {property.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2 rounded-xl bg-bg/50 px-3.5 py-2 text-sm text-fg"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {property.photos && property.photos.length > 1 ? (
            <div className="space-y-3 border-t border-glass-border pt-6">
              <h2 className="font-display text-xl text-fg">Galería de fotos</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {property.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-glass-border bg-bg-elevated"
                  >
                    <CoverImage
                      src={photo}
                      alt={`${property.title} - Foto ${idx + 1}`}
                      className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      </div>
    </div>
  )
}
