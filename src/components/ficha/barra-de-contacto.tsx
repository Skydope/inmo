import { ChatCircle, Envelope, Phone } from "@/components/iconos"
import { Inmobiliaria } from "@/components/ficha/inmobiliaria"
import { buttonVariants } from "@/components/ui/button"
import type { LinksDeContacto } from "@/lib/contact"
import { formatPrice } from "@/lib/format"
import type { Property } from "@/lib/properties/types"

const ICONO = { whatsapp: ChatCircle, tel: Phone, mailto: Envelope } as const

function BotonPrincipal({ links, className }: { links: LinksDeContacto; className?: string }) {
  const Icono = ICONO[links.principal.kind]
  return (
    <a
      href={links.principal.href}
      target={links.principal.kind === "whatsapp" ? "_blank" : undefined}
      rel={links.principal.kind === "whatsapp" ? "noopener noreferrer" : undefined}
      className={buttonVariants({ size: "lg", className })}
    >
      <Icono aria-hidden="true" />
      {links.principal.label}
    </a>
  )
}

/** Barra fija del celular. En escritorio la reemplaza la tarjeta. */
export function BarraDeContacto({ links }: { links: LinksDeContacto }) {
  return (
    <div
      data-barra-contacto
      role="region"
      aria-label="Contacto"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-blanco px-4 pt-3 shadow-[0_-4px_16px_rgb(0_0_0/0.08)] pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="mx-auto flex max-w-xl gap-2">
        <BotonPrincipal links={links} className="min-w-0 flex-1" />
        {links.llamar ? (
          <a href={links.llamar.href} aria-label="Llamar" className={buttonVariants({ variant: "outline", size: "icon-lg" })}>
            <Phone aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </div>
  )
}

/** En escritorio queda fija al bajar: precio, inmobiliaria y contacto. */
export function TarjetaDeContacto({ propiedad, links }: { propiedad: Property; links: LinksDeContacto }) {
  return (
    <aside aria-label="Contacto" className="sticky top-20 hidden flex-col gap-4 rounded-tarjeta border border-linea bg-blanco p-4 lg:flex">
      <p className="text-2xl leading-none font-titulo tabular-nums">
        {formatPrice(propiedad.price, propiedad.currency)}
      </p>
      <Inmobiliaria agencia={propiedad.agency} className="[&_h2]:sr-only" />
      <div className="flex flex-col gap-2">
        <BotonPrincipal links={links} className="w-full" />
        {links.llamar ? (
          <a href={links.llamar.href} className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}>
            <Phone aria-hidden="true" />
            Llamar
          </a>
        ) : null}
      </div>
    </aside>
  )
}
