import Link from "next/link"
import { HeroSearch } from "@/components/hero-search"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { brandName } from "@/lib/brand"
import { getProperties } from "@/lib/properties/adapter"

export default async function HomePage() {
  const properties = await getProperties()
  const featured = properties.slice(0, 3)
  const saleCount = properties.filter((p) => p.operation === "sale").length
  const rentCount = properties.filter((p) => p.operation === "rent").length
  const agencies = new Set(properties.map((p) => p.agency.name)).size

  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-16 pt-10 md:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(26,26,26,0.35) 0%, rgba(26,26,26,0.82) 55%, #1a1a1a 100%), url('/placeholders/hero.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="mx-auto max-w-6xl">
          <p className="animate-rise text-sm uppercase tracking-[0.22em] text-accent">
            Bolívar · Buenos Aires
          </p>
          <h1 className="animate-rise mt-4 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight text-fg md:text-7xl">
            {brandName}
            <span className="mt-3 block font-accent text-3xl font-normal tracking-normal text-fg-muted md:text-4xl">
              propiedades con carácter local
            </span>
          </h1>
          <p className="animate-rise-delay mt-5 max-w-xl text-base text-fg-muted md:text-lg">
            Explorá venta y alquiler en Bolívar con mapa oscuro, filtros vivos y aviso cerca tuyo.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/propiedades">
              <Button size="lg">Ver catálogo</Button>
            </Link>
            <Link href="/propiedades?sort=distance">
              <Button size="lg" variant="secondary">
                Cerca mío
              </Button>
            </Link>
          </div>

          <div className="mt-10">
            <HeroSearch />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid gap-6 border-y border-glass-border py-8 md:grid-cols-4">
          {[
            { n: String(properties.length), l: "Avisos activos" },
            { n: String(saleCount), l: "En venta" },
            { n: String(rentCount), l: "En alquiler" },
            { n: String(agencies), l: "Inmobiliarias" },
          ].map((s) => (
            <div key={s.l} className="text-center md:text-left">
              <p className="font-display text-4xl text-fg md:text-5xl">{s.n}</p>
              <p className="mt-1 text-sm text-fg-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-fg md:text-4xl">Destacadas</h2>
            <p className="mt-1 text-fg-muted">
              Una muestra del inventario cerca de{" "}
              <span className="font-accent text-accent">Bolívar centro</span>.
            </p>
          </div>
          <Link href="/propiedades" className="text-sm text-accent hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/propiedades">
            <Button variant="outline" size="lg">
              Cargar más
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
