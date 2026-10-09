import { describe, expect, it } from "vitest"
import { contactLinkFor, linksDeContacto, mensajeDeConsulta, normalizarWhatsApp } from "@/lib/contact"
import type { Agency } from "@/lib/agencies/types"
import type { Property } from "@/lib/properties/types"

const agencia = (a: Partial<Agency>): Agency => ({
  id: "agencia",
  name: "Agencia",
  logoUrl: "",
  address: "",
  ...a,
})

describe("contactLinkFor", () => {
  it("usa WhatsApp cuando la inmobiliaria lo tiene", () => {
    const link = contactLinkFor(agencia({ whatsapp: "5492314421101", phone: "02314 42-1101" }))
    expect(link.kind).toBe("whatsapp")
    expect(link.href).toBe("https://wa.me/5492314421101")
  })

  it("un fijo con característica no se toma por WhatsApp: llama", () => {
    const link = contactLinkFor(agencia({ phone: "02314 42-7654" }))
    expect(link.kind).toBe("tel")
    expect(link.href).toBe("tel:02314427654")
  })

  it("sin teléfono, manda un mail", () => {
    const link = contactLinkFor(agencia({ email: "hola@demo.local" }))
    expect(link.kind).toBe("mailto")
    expect(link.href).toContain("mailto:hola@demo.local")
  })
})

const propiedad = (p: Partial<Property>): Property => ({
  id: "bol-07",
  operation: "venta",
  type: "casa",
  zone: "centro",
  title: "Casa",
  description: "",
  price: 120_000,
  currency: "USD",
  address: "Belgrano 450",
  showAddress: true,
  lat: 0,
  lng: 0,
  features: [],
  photos: [],
  publishedAt: "2026-09-30",
  agency: agencia({}),
  ...p,
})

describe("normalizarWhatsApp", () => {
  it("pasa el celular argentino al formato de wa.me", () => {
    expect(normalizarWhatsApp("02314 15-123456")).toBe("5492314123456")
    expect(normalizarWhatsApp("+54 9 2314 123456")).toBe("5492314123456")
    expect(normalizarWhatsApp("2314123456")).toBe("5492314123456")
  })
})

describe("mensajeDeConsulta", () => {
  const url = "https://bolivarinmo.com.ar/propiedades/bol-07"

  it("nombra el tipo, la operación, la zona, el precio y el link", () => {
    const mensaje = mensajeDeConsulta(propiedad({ showAddress: false }), url)
    expect(mensaje).toBe(
      "Hola, vi en Bolívar Inmo esta casa en venta en Centro (US$ 120.000):\nhttps://bolivarinmo.com.ar/propiedades/bol-07 ¿Sigue disponible?"
    )
    expect(mensaje).not.toContain("Belgrano")
  })

  it("con la dirección visible, la incluye", () => {
    expect(mensajeDeConsulta(propiedad({}), url)).toContain("Belgrano 450, Centro")
  })

  it("sin precio dice Consultar precio", () => {
    expect(mensajeDeConsulta(propiedad({ price: null }), url)).toContain("(Consultar precio)")
  })
})

describe("linksDeContacto", () => {
  const mensaje = "Hola"

  it("prioriza WhatsApp y deja llamar aparte", () => {
    const links = linksDeContacto(
      agencia({ whatsapp: "02314 15-123456", phone: "02314 42-1101" }),
      mensaje
    )
    expect(links.principal.kind).toBe("whatsapp")
    expect(links.principal.href).toBe(`https://wa.me/5492314123456?text=${encodeURIComponent(mensaje)}`)
    expect(links.principal.label).toBe("Consultar por WhatsApp")
    expect(links.llamar?.href).toBe("tel:02314421101")
  })

  it("sin WhatsApp, el principal es llamar y no hay botón extra", () => {
    const links = linksDeContacto(agencia({ phone: "02314 42-7654" }), mensaje)
    expect(links.principal).toEqual({ href: "tel:02314427654", label: "Llamar", kind: "tel" })
    expect(links.llamar).toBeUndefined()
  })

  it("sin teléfono, escribe un mail con el mismo mensaje", () => {
    const links = linksDeContacto(agencia({ email: "hola@demo.local" }), mensaje)
    expect(links.principal.kind).toBe("mailto")
    expect(links.principal.label).toBe("Escribir un mail")
    const href = links.principal.href
    expect(href.startsWith("mailto:hola@demo.local")).toBe(true)
    expect(decodeURIComponent(href)).toContain(mensaje)
  })
})
