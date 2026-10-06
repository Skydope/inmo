"use client"

import Link from "next/link"
import { Envelope, Phone, WhatsappLogo } from "@phosphor-icons/react"
import { CoverImage } from "@/components/cover-image"
import { contactLinkFor } from "@/lib/contact"
import { formatPrice, typeLabel } from "@/lib/format"
import type { Property } from "@/lib/properties/types"
import { cn } from "@/lib/utils"

export function PropertyCard({
  property,
  selected,
  onHover,
  onSelect,
  id,
}: {
  property: Property
  selected?: boolean
  onHover?: (id: string | null) => void
  onSelect?: (id: string) => void
  id?: string
}) {
  const contact = contactLinkFor(property.agency)
  const ContactIcon =
    contact.kind === "whatsapp" ? WhatsappLogo : contact.kind === "tel" ? Phone : Envelope

  return (
    <article
      id={id}
      role="button"
      tabIndex={0}
      aria-selected={Boolean(selected)}
      aria-label={`${property.title}, ${formatPrice(property.price, property.currency)}`}
      className={cn(
        "w-[17.5rem] shrink-0 snap-start overflow-hidden rounded-card bg-bg-elevated shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent",
        selected && "ring-2 ring-fg",
      )}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onSelect?.(property.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect?.(property.id)
        }
      }}
    >
      <div className="relative aspect-[5/3] overflow-hidden">
        <CoverImage
          src={property.coverUrl}
          alt={property.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2 px-3 pb-3 pt-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-base font-semibold tracking-tight text-fg">
            {formatPrice(property.price, property.currency)}
          </p>
          <p className="truncate text-xs text-fg-muted">
            {property.areaM2} m² {typeLabel(property.type).toLowerCase()}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {property.beds > 0 ? (
            <span className="rounded-full bg-fg px-2 py-0.5 text-[11px] text-bg">
              {property.beds} dorm.
            </span>
          ) : null}
          {property.baths > 0 ? (
            <span className="rounded-full bg-fg px-2 py-0.5 text-[11px] text-bg">
              {property.baths} baño{property.baths === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <Link
            href={`/propiedades/${property.id}`}
            className="rounded-full bg-fg px-3 py-1.5 text-xs font-medium text-bg hover:opacity-90"
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalle
          </Link>
          <a
            href={contact.href}
            target={contact.kind === "whatsapp" ? "_blank" : undefined}
            rel={contact.kind === "whatsapp" ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-xs text-fg hover:bg-black/5 dark:hover:bg-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <ContactIcon weight="fill" className="h-3.5 w-3.5" aria-hidden />
            {contact.label}
          </a>
        </div>
      </div>
    </article>
  )
}
