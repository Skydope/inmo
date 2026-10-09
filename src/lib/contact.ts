import type { Agency } from "@/lib/agencies/types"
import { brandName } from "@/lib/brand"
import { etiquetaTipo, nombreZona, operacionEnFrase } from "@/lib/busqueda"
import { formatPrice } from "@/lib/format"
import type { Property } from "@/lib/properties/types"

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

const FEMENINAS = new Set(["casa", "quinta", "oficina", "cochera"])

/**
 * Deja un celular argentino como lo espera wa.me: 549 + característica + número, sin el 0
 * ni el 15. La característica se toma de 2 a 4 dígitos (alcanza para Argentina).
 */
export function normalizarWhatsApp(numero: string): string {
  let digitos = numero.replace(/\D/g, "")
  if (digitos.startsWith("00")) digitos = digitos.slice(2)
  if (digitos.startsWith("54")) digitos = digitos.slice(2)
  if (digitos.startsWith("9") && digitos.length > 10) digitos = digitos.slice(1)
  if (digitos.startsWith("0")) digitos = digitos.slice(1)
  if (digitos.length > 10) {
    const celular = /^(\d{2,4})15(\d+)$/.exec(digitos)
    if (celular && celular[1].length + celular[2].length === 10) {
      digitos = celular[1] + celular[2]
    }
  }
  return `549${digitos}`
}

/** El texto que ya viaja en el WhatsApp o en el mail, para que la inmobiliaria sepa cuál es. */
export function mensajeDeConsulta(p: Property, url: string): string {
  const articulo = FEMENINAS.has(p.type) ? "esta" : "este"
  const tipo = p.type === "ph" ? "PH" : etiquetaTipo(p.type).toLowerCase()
  const donde = p.showAddress ? `${p.address}, ${nombreZona(p.zone)}` : nombreZona(p.zone)
  const precio = formatPrice(p.price, p.currency)
  return `Hola, vi en ${brandName} ${articulo} ${tipo} ${operacionEnFrase(p.operation)} en ${donde} (${precio}):\n${url} ¿Sigue disponible?`
}

export type LinksDeContacto = {
  principal: ContactLink
  /** Solo si el principal es WhatsApp y además hay un teléfono. */
  llamar?: ContactLink
  /** Cada medio que la inmobiliaria tiene de verdad. El mail del portal entra solo si no hay otro. */
  medios: ContactLink[]
}

/** WhatsApp con el mensaje armado, si no llamar, si no un mail. Nunca un botón muerto. */
export function linksDeContacto(agency: Agency, mensaje: string): LinksDeContacto {
  const whatsapp = agency.whatsapp ? normalizarWhatsApp(agency.whatsapp) : ""
  const phone = agency.phone?.replace(/[^\d+]/g, "")
  const llamar = phone ? { href: `tel:${phone}`, label: "Llamar", kind: "tel" as const } : undefined

  const mail = (direccion: string): ContactLink => ({
    href: `mailto:${direccion}?subject=${encodeURIComponent("Consulta por propiedad")}&body=${encodeURIComponent(mensaje)}`,
    label: "Escribir un mail",
    kind: "mailto",
  })
  const medios: ContactLink[] = []
  if (whatsapp) {
    medios.push({
      href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`,
      label: "Consultar por WhatsApp",
      kind: "whatsapp",
    })
  }
  if (llamar) medios.push(llamar)
  if (agency.email) medios.push(mail(agency.email))

  if (medios.length > 0) {
    return { principal: medios[0], llamar: whatsapp ? llamar : undefined, medios }
  }
  const respaldo = mail("hola@bolivarinmo.com.ar")
  return { principal: respaldo, medios: [respaldo] }
}
