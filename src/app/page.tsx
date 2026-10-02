import Link from "next/link"
import { ArrowUpRight, Compass } from "@phosphor-icons/react/dist/ssr"
import { CountUp } from "@/components/count-up"
import { CoverImage } from "@/components/cover-image"
import { HeroInteractive } from "@/components/hero-interactive"
import { HeroSearch } from "@/components/hero-search"
import { LandingNav } from "@/components/landing-nav"
import { LandingPropertyCard } from "@/components/landing-property-card"
import { Reveal } from "@/components/reveal"
import { ScrollRevealLine } from "@/components/scroll-reveal-line"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
  {
    label: "Hoteles",
    href: "/propiedades?op=temporary",
    image: "/images/properties/apt-2.jpg",
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
    <div>
      <section className="sticky top-0 z-0 px-2 pt-2 md:px-3 md:pt-3">
        <HeroInteractive>
          <LandingNav />

          <div className="mt-auto max-w-xl pb-5 pt-[28rem]">
            <div className="animate-rise inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs uppercase tracking-[0.2em] text-accent backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              San Carlos de Bolívar
            </div>
            <p className="animate-rise-delay mt-4 max-w-sm text-sm leading-relaxed text-white/90 md:max-w-md md:text-base">
              {brandName} conecta venta y alquiler en Bolívar con mapa interactivo,
              filtros vivos y un catálogo con verdadero carácter de ciudad.
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/propiedades"
              className="animate-rise-delay mx-auto mb-3 flex w-fit items-center gap-2.5 rounded-full bg-gold px-5 py-2 text-base font-medium text-gold-fg transition hover:bg-gold-muted"
            >
              <Compass weight="fill" className="h-5 w-5" aria-hidden />
              Explorar
            </Link>
            <HeroSearch />
          </div>
        </HeroInteractive>
      </section>

      <div className="relative z-10 -mt-8 px-2 md:-mt-12 md:px-3">
        <div className="sheet-over rounded-t-panel bg-bg pb-16 md:rounded-t-sheet">
      <section id="nosotros" className="mx-auto max-w-6xl px-4 pb-6 pt-14 md:pt-16">
        <ScrollRevealLine
          className="max-w-4xl text-3xl leading-snug tracking-tight text-fg md:text-5xl md:leading-[1.15]"
          parts={[
            { text: "Nuestra red cubre " },
            { text: "todos los tipos", accent: true },
            { text: " de operación en Bolívar: una experiencia " },
            { text: "ágil", accent: true },
            { text: " y " },
            { text: "personal", accent: true },
            { text: " para cada búsqueda." },
          ]}
        />

        <div className="mt-12 grid gap-8 border-y border-glass-border py-10 sm:grid-cols-2 md:grid-cols-4">
          {[
            { n: 2012, l: "Año de arranque local", plain: true },
            { n: properties.length, l: "Avisos activos" },
            { n: saleCount + rentCount, l: "Venta y alquiler" },
            { n: agencies, l: "Inmobiliarias" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-4xl text-fg md:text-5xl">
                {"plain" in s ? s.n : <CountUp value={s.n} />}
              </p>
              <p className="mt-2 text-sm text-fg-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.label} delay={i * 140}>
            <Link
              href={c.href}
              className="group relative block aspect-[3/4] overflow-hidden rounded-panel"
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
            </Reveal>
          ))}
        </div>
      </section>

      <section id="servicios" className="py-6">
        <div className="relative overflow-hidden rounded-panel">
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
                Ver catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8 pt-14">
        <h2 className="mb-8 text-4xl tracking-tight text-fg md:text-5xl">
          Mejores <span className="font-accent">propiedades</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((p) => (
            <LandingPropertyCard key={p.id} property={p} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/propiedades"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "w-full max-w-md border-0 bg-black/8 hover:bg-black/12 dark:bg-white/10 dark:hover:bg-white/15",
            )}
          >
            Ver todas las propiedades
          </Link>
        </div>
      </section>
      <SiteFooter />
        </div>
      </div>
    </div>
  )
}
