import type { Property } from "@/lib/properties/types"

export type ContactLink = {
  href: string
  label: string
  kind: "whatsapp" | "tel" | "mailto"
}

/** Prefer wa.me (intl/mobile) → tel → mailto; never a dead button. */
export function contactLinkFor(agency: Property["agency"]): ContactLink {
  const raw = agency.phone?.trim()
  const phone = raw?.replace(/\D/g, "")
  if (phone) {
    // AR mobile with country code (549…) or other intl (≥11 digits) → WhatsApp
    if (phone.startsWith("54") || phone.length >= 11) {
      return {
        href: `https://wa.me/${phone}`,
        label: "WhatsApp",
        kind: "whatsapp",
      }
    }
    return { href: `tel:${raw}`, label: "Llamar", kind: "tel" }
  }
  const email = agency.email ?? "hola@inmo.local"
  return {
    href: `mailto:${email}?subject=${encodeURIComponent("Consulta por propiedad")}`,
    label: "Email",
    kind: "mailto",
  }
}
