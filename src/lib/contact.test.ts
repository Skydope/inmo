import { describe, expect, it } from "vitest"
import { contactLinkFor } from "@/lib/contact"

describe("contactLinkFor", () => {
  it("prefers WhatsApp for full mobile numbers", () => {
    const link = contactLinkFor({
      name: "Agencia",
      logoUrl: "",
      address: "",
      phone: "5492281421101",
    })
    expect(link.kind).toBe("whatsapp")
    expect(link.href).toBe("https://wa.me/5492281421101")
  })

  it("falls back to tel for short local numbers", () => {
    const link = contactLinkFor({
      name: "Agencia",
      logoUrl: "",
      address: "",
      phone: "2281443322",
    })
    expect(link.kind).toBe("tel")
    expect(link.href).toBe("tel:2281443322")
  })

  it("falls back to mailto when no phone", () => {
    const link = contactLinkFor({
      name: "Agencia",
      logoUrl: "",
      address: "",
      email: "hola@demo.local",
    })
    expect(link.kind).toBe("mailto")
    expect(link.href).toContain("mailto:hola@demo.local")
  })
})
