import { describe, expect, it } from "vitest"
import { centrar, encuadrar, recorteVisible, zoomSobreElCentro } from "@/lib/logo-recorte"

describe("recorte del logo", () => {
  it("una foto apaisada arranca centrada y el recorte es un cuadrado de la altura entera", () => {
    const { x, y } = centrar(400, 200)
    expect(y).toBe(0)
    expect(x).toBeCloseTo(-120)
    const visible = recorteVisible(x, y, 400, 200, 1)
    expect(visible.sy).toBeCloseTo(0)
    expect(visible.lado).toBeCloseTo(200)
    expect(visible.sx).toBeCloseTo(100)
  })

  it("no deja ver el borde vacío", () => {
    const corrido = encuadrar(40, 40, 400, 200, 1)
    expect(corrido.x).toBeLessThanOrEqual(0)
    expect(corrido.y).toBe(0)
  })

  it("al acercar, el centro de la foto no se corre", () => {
    const inicio = centrar(400, 200)
    const cerca = zoomSobreElCentro(inicio.x, inicio.y, 1, 2, 400, 200)
    const antes = recorteVisible(inicio.x, inicio.y, 400, 200, 1)
    const despues = recorteVisible(cerca.x, cerca.y, 400, 200, 2)
    const medioAntes = antes.sx + antes.lado / 2
    const medioDespues = despues.sx + despues.lado / 2
    expect(medioDespues).toBeCloseTo(medioAntes)
    expect(despues.lado).toBeCloseTo(antes.lado / 2)
  })
})
