import { expect, test, type Page } from "@playwright/test"

// La voz del inicio (Instrument Serif) tiene un rol acotado: la frase de la hoja y la línea del
// pie. Nunca menos de 24 px, nunca en itálica, y en ninguna otra pantalla (spec vivi-bolivar).
const conLaVoz = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()))
      .map((el) => getComputedStyle(el))
      .filter((cs) => /Instrument[ _]Serif/i.test(cs.fontFamily))
      .map((cs) => ({ tamano: parseFloat(cs.fontSize), estilo: cs.fontStyle }))
  )

test("en el inicio, la serif va grande y derecha", async ({ page }) => {
  await page.goto("/")
  const usos = await conLaVoz(page)
  expect(usos.length).toBeGreaterThan(0)
  for (const u of usos) {
    expect(u.tamano).toBeGreaterThanOrEqual(24)
    expect(u.estilo).toBe("normal")
  }
})

for (const ruta of ["/inmobiliarias", "/propiedades?operacion=venta", "/buscar/tipo?operacion=venta"]) {
  test(`en ${ruta} no hay serif: sigue nuestra letra`, async ({ page }) => {
    await page.goto(ruta)
    expect(await conLaVoz(page)).toEqual([])
  })
}
