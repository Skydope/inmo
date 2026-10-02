import type { Metadata } from "next"
import { AgencyDirectory } from "@/components/agency-directory"
import { LandingNav } from "@/components/landing-nav"
import { SiteFooter } from "@/components/site-footer"
import { SEED_AGENCIES } from "@/lib/agencies/seed"
import { contactLinkFor } from "@/lib/contact"
import { getProperties } from "@/lib/properties/adapter"

const DAY = "/images/hero/residence-day.webp"
const NIGHT = "/images/hero/residence-night.webp"

export const metadata: Metadata = {
  title: "Inmobiliarias",
  description: "Inmobiliarias de San Carlos de Bolívar que publican en el catálogo.",
}

export default async function AgenciesPage() {
  const properties = await getProperties()
  const agencies = Object.entries(SEED_AGENCIES).map(([id, agency]) => {
    const listings = properties
      .filter((p) => p.agency.name === agency.name)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    const contact = contactLinkFor(agency)
    return {
      id,
      name: agency.name,
      logoUrl: agency.logoUrl,
      address: agency.address,
      sale: listings.filter((p) => p.operation === "sale").length,
      rent: listings.filter((p) => p.operation === "rent").length,
      listings: listings.map((p) => ({
        id: p.id,
        title: p.title,
        coverUrl: p.coverUrl,
        price: p.price,
        currency: p.currency,
      })),
      contactHref: contact.href,
      contactKind: contact.kind,
      email: agency.email,
    }
  })

  return (
    <div>
      <section data-cover-hero className="sticky top-0 z-0 px-2 pt-2 md:px-3 md:pt-3">
        <div className="relative overflow-hidden rounded-t-panel md:rounded-t-sheet">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DAY} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={NIGHT}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1200ms] dark:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
          <div className="relative z-10 flex min-h-80 flex-col px-4 md:min-h-[26rem] md:px-7">
            <LandingNav />
            <div className="mt-auto max-w-xl pb-16 pt-8">
              <h1 className="font-display text-4xl tracking-tight text-white md:text-5xl">
                Inmobiliarias que trabajan con nosotros
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
                Te acompañan en la tasación, la compra o el alquiler de tu propiedad en Bolívar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 -mt-8 px-2 md:-mt-12 md:px-3">
        <div className="sheet-over rounded-t-panel bg-bg pb-16 md:rounded-t-sheet">
          <div className="px-4 pb-8 pt-10 md:px-6 md:pt-14">
            <AgencyDirectory agencies={agencies} />
          </div>
          <SiteFooter />
        </div>
      </div>
    </div>
  )
}
