import { expect, test } from "@playwright/test"

test.describe("/muestra", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/muestra")
    await page.evaluate(() => document.fonts.ready)
  })

  test("todo lo que se toca mide al menos 44 px", async ({ page }) => {
    const chicos = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("header a, header button, main a, main button, main label")]
        .map((el) => ({ el, caja: el.getBoundingClientRect() }))
        .filter(({ caja }) => caja.width > 0 && (caja.height < 44 || caja.width < 44))
        .map(({ el, caja }) => `${el.tagName} "${el.textContent?.trim().slice(0, 30)}" ${Math.round(caja.width)}×${Math.round(caja.height)}`)
    )
    expect(chicos).toEqual([])
  })

  test("los precios usan cifras tabulares", async ({ page }) => {
    // Sin cifras tabulares, "111.111" mide ~10 px menos que "100.000" a 24 px. Con
    // ellas miden lo mismo, salvo que Chromium en Linux redondea el avance de cada
    // letra a píxeles enteros (hinting): hasta 1 px por dígito. A 100 px los diez
    // dígitos de Encode Sans miden exactamente igual (medido el 2026-10-08).
    const unos = await page.getByTestId("cifras-unos").boundingBox()
    const ceros = await page.getByTestId("cifras-ceros").boundingBox()
    expect(Math.abs((unos?.width ?? 0) - (ceros?.width ?? 999))).toBeLessThanOrEqual(6)
  })

  test("sin scroll horizontal", async ({ page }) => {
    const { documento, ventana } = await page.evaluate(() => ({
      documento: document.documentElement.scrollWidth,
      ventana: window.innerWidth,
    }))
    expect(documento).toBeLessThanOrEqual(ventana)
  })
})
