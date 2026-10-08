import { expect, test } from "@playwright/test"

const RUTAS = ["/"]

for (const ruta of RUTAS) {
  test(`${ruta} carga sin errores ni scroll horizontal`, async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (error) => errores.push(error.message))
    page.on("console", (mensaje) => {
      if (mensaje.type() === "error") errores.push(mensaje.text())
    })

    const respuesta = await page.goto(ruta)
    expect(respuesta?.status()).toBeLessThan(400)
    await page.waitForLoadState("networkidle")

    const { documento, ventana } = await page.evaluate(() => ({
      documento: document.documentElement.scrollWidth,
      ventana: window.innerWidth,
    }))
    expect(documento).toBeLessThanOrEqual(ventana)
    expect(errores).toEqual([])
  })
}
