"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, Envelope, MagnifyingGlass, Phone, WhatsappLogo } from "@phosphor-icons/react"
import { CoverImage } from "@/components/cover-image"
import { formatPrice } from "@/lib/format"
import type { Currency } from "@/lib/properties/types"
import { cn } from "@/lib/utils"

export type AgencyListing = {
  id: string
  title: string
  coverUrl: string
  price: number
  currency: Currency
}

export type AgencyRow = {
  id: string
  name: string
  logoUrl: string
  address: string
  sale: number
  rent: number
  listings: AgencyListing[]
  contactHref: string
  contactKind: "whatsapp" | "tel" | "mailto"
  email?: string
}

export function AgencyDirectory({ agencies }: { agencies: AgencyRow[] }) {
  const [q, setQ] = useState("")
  const query = q.trim().toLowerCase()
  const list = query
    ? agencies.filter(
        (a) =>
          a.name.toLowerCase().includes(query) || a.address.toLowerCase().includes(query),
      )
    : agencies

  return (
    <div>
      <label className="flex max-w-md items-center gap-2 rounded-full border border-glass-border bg-bg-elevated px-4 py-2.5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o dirección"
          aria-label="Buscar inmobiliaria"
          className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
        />
        <MagnifyingGlass className="h-4 w-4 shrink-0 text-fg-muted" aria-hidden />
      </label>

      {list.length === 0 ? (
        <p className="mt-8 text-sm text-fg-muted">Ninguna inmobiliaria coincide con esa búsqueda.</p>
      ) : (
        <>
          <p className="mt-8 font-display text-2xl tracking-tight text-fg md:text-3xl">
            {list.length} {list.length === 1 ? "inmobiliaria" : "inmobiliarias"} en Bolívar
          </p>
          <ul className="mt-4 flex flex-col gap-4">
            {list.map((agency) => (
              <AgencyBand key={agency.id} agency={agency} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function AgencyBand({ agency }: { agency: AgencyRow }) {
  const ContactIcon =
    agency.contactKind === "whatsapp"
      ? WhatsappLogo
      : agency.contactKind === "tel"
        ? Phone
        : Envelope
  const catalogHref = `/propiedades?agencia=${encodeURIComponent(agency.name)}`

  return (
    <li className="overflow-hidden rounded-card border border-glass-border bg-bg-elevated">
      <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <CoverImage
            src={agency.logoUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-fg">{agency.name}</p>
            <p className="truncate text-sm text-fg-muted">{agency.address}</p>
          </div>
          <p className="hidden shrink-0 text-sm text-fg-muted sm:block">
            <span className="font-display text-lg text-fg">{agency.sale}</span> compra
            <span className="mx-2">·</span>
            <span className="font-display text-lg text-fg">{agency.rent}</span> alquiler
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-auto text-sm text-fg-muted sm:hidden">
            <span className="font-display text-lg text-fg">{agency.sale}</span> compra
            <span className="mx-2">·</span>
            <span className="font-display text-lg text-fg">{agency.rent}</span> alquiler
          </p>
          {agency.listings.length > 0 ? (
            <Link
              href={catalogHref}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2.5 text-sm font-medium text-fg transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              Ver avisos
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
          <a
            href={agency.contactHref}
            target={agency.contactKind === "whatsapp" ? "_blank" : undefined}
            rel={agency.contactKind === "whatsapp" ? "noreferrer" : undefined}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-medium text-gold-fg transition hover:bg-gold-muted"
          >
            <ContactIcon className="h-4 w-4" aria-hidden />
            Contactar
          </a>
          {agency.email ? (
            <a
              href={`mailto:${agency.email}?subject=${encodeURIComponent("Solicitar tasación")}`}
              className="inline-flex items-center justify-center rounded-full border border-glass-border px-4 py-2.5 text-sm font-medium text-fg transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              Solicitar tasación
            </a>
          ) : null}
        </div>
      </div>

      <Gallery listings={agency.listings} catalogHref={catalogHref} name={agency.name} />
    </li>
  )
}

function Gallery({
  listings,
  catalogHref,
  name,
}: {
  listings: AgencyListing[]
  catalogHref: string
  name: string
}) {
  if (listings.length === 0) return null
  const [hero, ...rest] = listings
  const visible = rest.slice(0, 2)
  const extra = rest.length - visible.length

  return (
    <div
      className={cn(
        "grid gap-2 px-3 pb-3",
        visible.length > 0 && "md:grid-cols-[minmax(0,1.7fr)_minmax(11rem,0.8fr)]",
      )}
    >
      <ListingPhoto listing={hero} className="aspect-[16/10] md:aspect-auto md:min-h-[22rem]" />
      {visible.length > 0 ? (
        <div
          className={cn(
            "grid h-full gap-2",
            visible.length > 1 && "grid-cols-2 md:grid-cols-1 md:grid-rows-2",
          )}
        >
          {visible.map((listing, i) => {
            const overflow = extra > 0 && i === visible.length - 1
            if (overflow) {
              return (
                <Link
                  key={listing.id}
                  href={catalogHref}
                  className="relative block h-full min-h-36 overflow-hidden rounded-2xl"
                  aria-label={`Ver ${extra} ${extra === 1 ? "aviso" : "avisos"} más de ${name}`}
                >
                  <CoverImage
                    src={listing.coverUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/55 text-white">
                    <span className="text-center">
                      <span className="block font-display text-3xl">+{extra}</span>
                      <span className="text-sm">Ver más</span>
                    </span>
                  </span>
                </Link>
              )
            }
            return (
              <ListingPhoto
                key={listing.id}
                listing={listing}
                className="aspect-[16/10] md:aspect-auto md:h-full md:min-h-36"
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function ListingPhoto({ listing, className }: { listing: AgencyListing; className?: string }) {
  return (
    <Link
      href={`/propiedades/${listing.id}`}
      className={cn("group relative block overflow-hidden rounded-2xl", className)}
    >
      <CoverImage
        src={listing.coverUrl}
        alt={listing.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <span className="absolute bottom-3 left-3 rounded-full bg-fg/90 px-3 py-1 text-sm text-bg">
        {formatPrice(listing.price, listing.currency)}
      </span>
    </Link>
  )
}
