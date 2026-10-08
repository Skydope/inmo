import type { Agency } from "@/lib/agencies/types"

export type ContactLink = {
  href: string
  label: string
  kind: "whatsapp" | "tel" | "mailto"
}

/**
 * WhatsApp si la inmobiliaria lo tiene → llamar → mail; nunca un botón muerto.
 * El WhatsApp sale del campo `whatsapp`, no se deduce del teléfono: un fijo escrito con la
 * característica (02314 …) tiene tantos dígitos como un celular.
 */
export function contactLinkFor(agency: Agency): ContactLink {
  const whatsapp = agency.whatsapp?.replace(/\D/g, "")
  if (whatsapp) {
    return { href: `https://wa.me/${whatsapp}`, label: "WhatsApp", kind: "whatsapp" }
  }
  const phone = agency.phone?.replace(/[^\d+]/g, "")
  if (phone) {
    return { href: `tel:${phone}`, label: "Llamar", kind: "tel" }
  }
  const email = agency.email ?? "hola@bolivarinmo.com.ar"
  return {
    href: `mailto:${email}?subject=${encodeURIComponent("Consulta por propiedad")}`,
    label: "Email",
    kind: "mailto",
  }
}
