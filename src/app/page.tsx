import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"
import { CoverImage } from "@/components/cover-image"
import { HeroSearch } from "@/components/hero-search"
import { LandingNav } from "@/components/landing-nav"
import { LandingPropertyCard } from "@/components/landing-property-card"
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
      <section className="px-2 pt-2 md:px-3 md:pt-3">
        <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem]">
          <div className="absolute inset-0">
            <CoverImage
              src="/images/hero/hero.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45"
            />
          </div>

          <div className="relative flex min-h-[calc(100dvh-1rem)] flex-col px-4 pb-4 pt-0 md:min-h-[calc(100dvh-1.5rem)] md:px-7 md:pb-6">
            <LandingNav />

            <div className="my-auto max-w-xl py-10 md:py-14">
              <h1 className="animate-rise text-5xl leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[5.25rem]">
                <span className="block font-display font-normal">Redefiniendo</span>
                <span className="mt-1 block font-accent text-[2.75rem] font-normal md:text-6xl lg:text-[4.5rem]">
                  el vivir moderno
                </span>
              </h1>
              <p className="animate-rise-delay mt-6 max-w-sm text-sm leading-relaxed text-white/90 md:max-w-md md:text-[15px]">
                {brandName} conecta venta y alquiler en Bolívar con mapa vivo,
                filtros claros y un catálogo con carácter de ciudad.
              </p>
            </div>

            <div className="mt-auto pt-4">
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
                <ArrowUpRight weight="fill" className="h-4 w-4" aria-hidden />
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
