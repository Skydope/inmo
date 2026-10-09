import { describe, expect, it } from "vitest"
import { AVISOS_DE_CUENTA } from "./avisos"

describe("avisos de la cuenta", () => {
  it("son dos publicados y un borrador, con precio y zona del seed", () => {
    expect(AVISOS_DE_CUENTA.filter((aviso) => aviso.estado === "publicado")).toHaveLength(2)
    expect(AVISOS_DE_CUENTA.filter((aviso) => aviso.estado === "borrador")).toHaveLength(1)
    for (const aviso of AVISOS_DE_CUENTA) {
      expect(aviso.titulo.length).toBeGreaterThan(0)
      expect(aviso.precio.length).toBeGreaterThan(0)
      expect(aviso.zona.length).toBeGreaterThan(0)
      expect(aviso.foto).toMatch(/\.webp$/)
    }
  })
})
