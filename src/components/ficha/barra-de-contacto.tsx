import { ChatCircle, Envelope, Phone } from "@/components/iconos"
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

/** En escritorio queda fija al bajar: precio, inmobiliaria, otras fotos y cada medio de contacto. */
export function TarjetaDeContacto({
  propiedad,
  links,
  otras,
}: {
  propiedad: Property
  links: LinksDeContacto
  otras: { id: string; foto: string; alt: string }[]
}) {
  const agencia = propiedad.agency
  return (
    <aside
      aria-label="Contacto"
      className="sticky top-20 hidden flex-col gap-4 rounded-tarjeta border border-linea bg-blanco p-4 shadow-[0_8px_28px_rgb(0_0_0/0.08)] lg:flex"
    >
      <p className="text-2xl leading-none font-titulo tabular-nums">
        {formatPrice(propiedad.price, propiedad.currency)}
      </p>
      <div className="flex items-center gap-3">
        {agencia.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={agencia.logoUrl} alt="" className="size-14 rounded-full bg-papel object-contain" />
        ) : null}
        <div className="min-w-0">
          <p className="font-titulo text-xl leading-tight">{agencia.name}</p>
          {agencia.license ? <p className="text-sm text-tinta-suave">Matrícula {agencia.license}</p> : null}
        </div>
      </div>
      {otras.length > 0 ? (
        <ul aria-label="Otras propiedades" className="grid grid-cols-4 gap-1.5">
          {otras.map((o) => (
            <li key={o.id}>
              <a href={`/propiedades/${o.id}`} aria-label={o.alt} className="block overflow-hidden rounded-control">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.foto} alt={o.alt} className="aspect-square w-full object-cover" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-col gap-2">
        {links.medios.map((medio, i) => {
          const Icono = ICONO[medio.kind]
          return (
            <a
              key={medio.kind}
              href={medio.href}
              target={medio.kind === "whatsapp" ? "_blank" : undefined}
              rel={medio.kind === "whatsapp" ? "noopener noreferrer" : undefined}
              className={buttonVariants({
                variant: i === 0 ? "default" : "outline",
                size: "lg",
                className: "w-full",
              })}
            >
              <Icono aria-hidden="true" />
              {medio.label}
            </a>
          )
        })}
      </div>
    </aside>
  )
}
