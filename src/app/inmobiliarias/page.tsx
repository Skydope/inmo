import type { Metadata } from "next"
import { Envelope, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr"
import { CoverImage } from "@/components/cover-image"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { buttonVariants } from "@/components/ui/button"
import { SEED_AGENCIES } from "@/lib/agencies/seed"
import { contactLinkFor } from "@/lib/contact"
import { getProperties } from "@/lib/properties/adapter"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Inmobiliarias",
  description: "Inmobiliarias de San Carlos de Bolívar que publican en el catálogo.",
}

export default async function AgenciesPage() {
  const properties = await getProperties()
  const agencies = Object.entries(SEED_AGENCIES).map(([id, agency]) => ({
    id,
    agency,
    count: properties.filter((p) => p.agency.name === agency.name).length,
    contact: contactLinkFor(agency),
  }))

  return (
    <div className="flex min-h-full flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="font-display text-4xl tracking-tight text-fg md:text-5xl">Inmobiliarias</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">
          Las casas de Bolívar que publican en el catálogo. Elegís el aviso, ellas cierran el trato.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {agencies.map(({ id, agency, count, contact }) => {
            const ContactIcon =
              contact.kind === "whatsapp" ? WhatsappLogo : contact.kind === "tel" ? Phone : Envelope
            return (
              <li key={id} className="flex items-center justify-between gap-4 rounded-card bg-bg-elevated p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <CoverImage
                    src={agency.logoUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-fg">{agency.name}</p>
                    <p className="truncate text-sm text-fg-muted">{agency.address}</p>
                    <p className="mt-1 text-xs text-fg-muted">
                      {count} {count === 1 ? "aviso" : "avisos"}
                    </p>
                  </div>
                </div>
                <a
                  href={contact.href}
                  target={contact.kind === "whatsapp" ? "_blank" : undefined}
                  rel={contact.kind === "whatsapp" ? "noreferrer" : undefined}
                  className={cn(buttonVariants(), "shrink-0")}
                >
                  <ContactIcon className="h-4 w-4" aria-hidden />
                  {contact.label}
                </a>
              </li>
            )
          })}
        </ul>
      </main>
      <SiteFooter />
    </div>
  )
}
