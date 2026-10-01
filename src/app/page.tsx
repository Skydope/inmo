import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { CoverImage } from "@/components/cover-image"
import { HeroSearch } from "@/components/hero-search"
import { LandingNav } from "@/components/landing-nav"
import { LandingPropertyCard } from "@/components/landing-property-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { brandName } from "@/lib/brand"
import { getProperties } from "@/lib/properties/adapter"

const CATEGORIES = [
  {
    label: "Casas",
    href: "/propiedades?type=house",
    image: "/images/properties/house-2.jpg",
  },
  {
    label: "Departamentos",
    href: "/propiedades?type=apartment",
    image: "/images/properties/apt-2.jpg",
  },
  {
    label: "Lotes",
    href: "/propiedades?type=lot",
    image: "/images/properties/lot-1.jpg",
  },
  {
    label: "En alquiler",
    href: "/propiedades?op=rent",
    image: "/images/properties/apt-1.jpg",
  },
] as const

export default async function HomePage() {
  const properties = await getProperties()
  const featured = properties.filter((p) => p.featured).slice(0, 6)
  const grid = featured.length >= 6 ? featured : properties.slice(0, 6)
  const saleCount = properties.filter((p) => p.operation === "sale").length
  const rentCount = properties.filter((p) => p.operation === "rent").length
  const agencies = new Set(properties.map((p) => p.agency.name)).size

  return (
    <div className="pb-16">
      <section className="px-3 pt-3 md:px-5 md:pt-5">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
          <div className="absolute inset-0">
            <CoverImage
              src="/images/hero/hero.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55"
            />
          </div>

          <div className="relative flex min-h-[78vh] flex-col px-5 pb-5 pt-5 md:min-h-[86vh] md:px-8 md:pb-6 md:pt-6">
            <LandingNav />

            <div className="mt-14 max-w-xl md:mt-20">
              <h1 className="animate-rise text-5xl leading-[0.95] tracking-tight text-white md:text-7xl">
                <span className="font-display">Redefiniendo</span>
                <span className="mt-2 block font-accent text-4xl font-normal md:text-6xl">
                  vivir en Bolívar
                </span>
              </h1>
              <p className="animate-rise-delay mt-5 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
                {brandName} conecta venta y alquiler local con mapa vivo, filtros
                claros y un catálogo con carácter de ciudad.
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-16">
              <div className="flex justify-end">
                <ThemeToggle />
              </div>
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" className="mx-auto max-w-6xl px-4 pb-6 pt-16 md:pt-20">
        <p className="max-w-4xl text-3xl leading-snug tracking-tight text-fg md:text-5xl md:leading-[1.15]">
          Nuestra red cubre{" "}
          <span className="font-accent">todos los tipos</span> de operación en
          Bolívar: una experiencia{" "}
          <span className="font-accent">ágil</span> y{" "}
          <span className="font-accent">personal</span> para cada búsqueda.
        </p>

        <div className="mt-12 grid gap-8 border-y border-glass-border py-10 sm:grid-cols-2 md:grid-cols-4">
          {[
            { n: "2012", l: "Año de arranque local" },
            { n: String(properties.length), l: "Avisos activos" },
            { n: String(saleCount + rentCount), l: "Venta y alquiler" },
            { n: String(agencies), l: "Inmobiliarias" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-4xl text-fg md:text-5xl">{s.n}</p>
              <p className="mt-2 text-sm text-fg-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-[1.75rem]"
            >
              <CoverImage
                src={c.image}
                alt={c.label}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-neutral-900 transition group-hover:bg-white">
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
              <p className="absolute bottom-4 left-4 text-lg font-medium text-white">
                {c.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="agentes" className="mx-auto max-w-6xl px-4 py-6">
        <div className="relative overflow-hidden rounded-[2rem]">
          <CoverImage
            src="/images/properties/house-3.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative flex min-h-[280px] flex-col justify-end gap-4 p-8 md:min-h-[320px] md:max-w-xl md:p-12">
            <h2 className="text-4xl tracking-tight text-white md:text-5xl">
              Gestión de{" "}
              <span className="font-accent">propiedades</span>
            </h2>
            <p className="text-sm leading-relaxed text-white/80 md:text-base">
              Coordinamos publicación, visitas y seguimiento con las
              inmobiliarias locales — vos elegís el aviso, ellas cierran el trato.
            </p>
            <div>
              <Link
                href="/propiedades"
                className="inline-flex rounded-full border border-white/50 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
              >
                Conocer más
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-14">
        <h2 className="mb-8 text-4xl tracking-tight text-fg md:text-5xl">
          Mejores <span className="font-accent">propiedades</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((p) => (
            <LandingPropertyCard key={p.id} property={p} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/propiedades" className="w-full max-w-md">
            <Button
              variant="secondary"
              size="lg"
              className="w-full border-0 bg-black/8 text-fg hover:bg-black/12 dark:bg-white/10 dark:hover:bg-white/15"
            >
              Cargar más
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
