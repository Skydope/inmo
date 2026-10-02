import type { Metadata } from "next"
import { AgencyDirectory } from "@/components/agency-directory"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { SEED_AGENCIES } from "@/lib/agencies/seed"
import { contactLinkFor } from "@/lib/contact"
import { getProperties } from "@/lib/properties/adapter"

export const metadata: Metadata = {
  title: "Inmobiliarias",
  description: "Inmobiliarias de San Carlos de Bolívar que publican en el catálogo.",
}

export default async function AgenciesPage() {
  const properties = await getProperties()
  const agencies = Object.entries(SEED_AGENCIES).map(([id, agency]) => {
    const listings = properties.filter((p) => p.agency.name === agency.name)
    const contact = contactLinkFor(agency)
    return {
      id,
      name: agency.name,
      logoUrl: agency.logoUrl,
      address: agency.address,
      sale: listings.filter((p) => p.operation === "sale").length,
      rent: listings.filter((p) => p.operation === "rent").length,
      contactHref: contact.href,
      contactKind: contact.kind,
      email: agency.email,
    }
  })

  return (
    <div className="flex min-h-full flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:py-16">
        <h1 className="max-w-3xl font-display text-4xl tracking-tight text-fg md:text-5xl">
          Inmobiliarias que trabajan con nosotros
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted md:text-base">
          Te acompañan en la tasación, la compra o el alquiler de tu propiedad en Bolívar.
        </p>
        <AgencyDirectory agencies={agencies} />
      </main>
      <SiteFooter />
    </div>
  )
}
