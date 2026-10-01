"use client"

import Link from "next/link"
import { Bath, BedDouble, Expand, MapPinned, MessageCircle, Phone, Mail } from "lucide-react"
import { contactLinkFor } from "@/lib/contact"
import { formatDistanceKm } from "@/lib/geo"
import { formatPrice, operationLabel, typeLabel } from "@/lib/format"
import type { PropertyWithDistance } from "@/lib/properties/types"
import { cn } from "@/lib/utils"
import { CoverImage } from "@/components/cover-image"

export function PropertyCard({
  property,
  selected,
  onHover,
  onSelect,
  id,
}: {
  property: PropertyWithDistance
  selected?: boolean
  onHover?: (id: string | null) => void
  onSelect?: (id: string) => void
  id?: string
}) {
  const contact = contactLinkFor(property.agency)
  const ContactIcon =
    contact.kind === "whatsapp" ? MessageCircle : contact.kind === "tel" ? Phone : Mail

  return (
    <article
      id={id}
      className={cn(
        "group overflow-hidden rounded-[1.35rem] border border-glass-border bg-bg-elevated/60 transition",
        selected && "border-accent ring-1 ring-accent/40",
      )}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onSelect?.(property.id)}
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <CoverImage
          src={property.coverUrl}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs text-fg backdrop-blur">
          {property.photoCount} fotos
        </span>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-full glass-strong px-2.5 py-1.5">
          <CoverImage
            src={property.agency.logoUrl}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-fg">{property.agency.name}</p>
            {property.agency.phone ? (
              <p className="truncate text-[11px] text-fg-muted">{property.agency.phone}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-xs text-fg-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {operationLabel(property.operation)}
          </span>
          <span>·</span>
          <span>{typeLabel(property.type)}</span>
        </div>

        <p className="font-display text-2xl tracking-tight text-fg">
          {formatPrice(property.price, property.currency)}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-fg-muted">
          {property.beds > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" aria-hidden />
              {property.beds}
            </span>
          ) : null}
          {property.baths > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4" aria-hidden />
              {property.baths}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Expand className="h-4 w-4" aria-hidden />
            {property.areaM2} m²
          </span>
        </div>

        <p className="text-sm text-fg-muted">{property.address}</p>
        {property.distanceKm !== undefined ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-accent">
            <MapPinned className="h-3.5 w-3.5" aria-hidden />
            {formatDistanceKm(property.distanceKm)}
          </p>
        ) : null}

        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/propiedades/${property.id}`}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-muted"
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalle
          </Link>
          <a
            href={contact.href}
            target={contact.kind === "whatsapp" ? "_blank" : undefined}
            rel={contact.kind === "whatsapp" ? "noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 rounded-full border border-glass-border px-3 py-2 text-sm text-fg hover:border-accent/50"
            onClick={(e) => e.stopPropagation()}
          >
            <ContactIcon className="h-4 w-4" aria-hidden />
            {contact.label}
          </a>
        </div>
      </div>
    </article>
  )
}
