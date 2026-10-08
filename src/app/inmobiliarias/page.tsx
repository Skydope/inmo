import type { Metadata } from "next"
import { AgencyDirectory } from "@/components/agency-directory"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { SEED_AGENCIES } from "@/lib/agencies/seed"
import { contactLinkFor } from "@/lib/contact"
import { getProperties } from "@/lib/properties/adapter"

export const metadata: Metadata = {
  title: "Inmobiliarias",
  description: "Inmobiliarias de San Carlos de Bolívar que publican en el catálogo.",
}

export default async function AgenciesPage() {
  const properties = await getProperties()
  const agencies = Object.values(SEED_AGENCIES).map((agency) => {
    const listings = properties
      .filter((p) => p.agency.id === agency.id)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    const contact = contactLinkFor(agency)
    return {
      id: agency.id,
      name: agency.name,
      logoUrl: agency.logoUrl,
      address: agency.address,
      sale: listings.filter((p) => p.operation === "venta").length,
      rent: listings.filter((p) => p.operation !== "venta").length,
      listings: listings.filter((p) => p.photos.length > 0).map((p) => ({
        id: p.id,
        title: p.title,
        coverUrl: p.photos[0],
        price: p.price,
        currency: p.currency,
      })),
      contactHref: contact.href,
      contactKind: contact.kind,
      email: agency.email,
    }
  })

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-titulo md:text-4xl">Inmobiliarias de Bolívar</h1>
        <p className="mt-2 max-w-md text-tinta-suave">
          Te acompañan en la tasación, la compra o el alquiler de tu propiedad.
        </p>
        <div className="mt-6">
          <AgencyDirectory agencies={agencies} />
        </div>
      </main>
      <Pie />
    </>
  )
}
