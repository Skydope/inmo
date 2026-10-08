import { describe, expect, it } from "vitest"
import { contactLinkFor } from "@/lib/contact"
import type { Agency } from "@/lib/agencies/types"

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
