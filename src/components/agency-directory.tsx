"use client"

import { useState } from "react"
import { Envelope, MagnifyingGlass, Phone, WhatsappLogo } from "@phosphor-icons/react"
import { CoverImage } from "@/components/cover-image"

export type AgencyRow = {
  id: string
  name: string
  logoUrl: string
  address: string
  sale: number
  rent: number
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
        <ul className="mt-4 flex flex-col gap-3">
          {list.map((agency) => {
            const ContactIcon =
              agency.contactKind === "whatsapp"
                ? WhatsappLogo
                : agency.contactKind === "tel"
                  ? Phone
                  : Envelope
            return (
              <li
                key={agency.id}
                className="flex flex-col gap-5 rounded-card border border-glass-border bg-bg-elevated px-5 py-5 md:flex-row md:items-center md:gap-8"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <CoverImage
                    src={agency.logoUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-fg">{agency.name}</p>
                    <p className="truncate text-sm text-fg-muted">{agency.address}</p>
                  </div>
                </div>

                <div className="flex gap-8 md:w-52 md:shrink-0">
                  <Stat n={agency.sale} label="Avisos compra" />
                  <Stat n={agency.rent} label="Avisos alquiler" />
                </div>

                <div className="flex flex-col gap-2 md:w-52 md:shrink-0">
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
              </li>
            )
          })}
        </ul>
        </>
      )}
    </div>
  )
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl text-fg">{n}</p>
      <p className="text-xs text-fg-muted">{label}</p>
    </div>
  )
}
