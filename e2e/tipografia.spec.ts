import { expect, test, type Page } from "@playwright/test"

// Dos letras en todo el sitio: Encode Sans (la interfaz) y Archivo Black (solo VIVÍ BOLÍVAR,
// en el hero y en el pie). Instrument Serif se retiró en inicio-v2 (2026-10-09).
const familias = (page: Page) =>
  page.evaluate(() =>
    [
      ...new Set(
        [...document.querySelectorAll("body *")]
          .filter((el) => [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()))
          .map((el) => getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim())
      ),
    ].sort()
  )

for (const ruta of ["/", "/inmobiliarias", "/propiedades?operacion=venta", "/buscar/tipo?operacion=venta"]) {
  test(`en ${ruta} solo hay Encode Sans y, como mucho, Archivo Black`, async ({ page }) => {
    await page.goto(ruta)
    const usadas = await familias(page)
    for (const f of usadas) expect(f).toMatch(/^(Encode Sans|Archivo Black)/)
  })
}

test("Archivo Black va solo en VIVÍ BOLÍVAR", async ({ page }) => {
  await page.goto("/")
  const conArchivo = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()))
      .filter((el) => /Archivo Black/i.test(getComputedStyle(el).fontFamily))
      .map((el) => el.textContent?.trim())
  )
  expect(conArchivo.length).toBeGreaterThan(0)
  for (const t of conArchivo) expect(t).toMatch(/^(Viví|Bolívar)$/)
})
