import { describe, expect, it } from "vitest"
import { datosClave } from "./datos-clave"

describe("datosClave", () => {
  it("omite ceros y vacíos, y respeta el orden", () => {
    expect(
      datosClave({
        areaTotalM2: 180,
        areaCoveredM2: 120,
        beds: 3,
        baths: 2,
        rooms: 4,
        garages: 1,
        ageYears: 15,
      }).map((d) => [d.valor, d.etiqueta])
    ).toEqual([
      ["180 m²", "total"],
      ["120 m²", "cubierta"],
      ["3", "dorm."],
      ["2", "baños"],
      ["4", "amb."],
      ["1", "coch."],
      ["15", "años"],
    ])
  })

  it("un campo se muestra en hectáreas", () => {
    const datos = datosClave({ areaHa: 120, areaTotalM2: 0, beds: 0 })
    expect(datos).toEqual([{ valor: "120 ha", etiqueta: "hectáreas", icono: "superficie" }])
  })

  it("antigüedad 0 es a estrenar", () => {
    expect(datosClave({ ageYears: 0, beds: 0 }).map((d) => d.valor)).toEqual(["A estrenar"])
  })
})
