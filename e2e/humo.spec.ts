import { expect, test } from "@playwright/test"

const RUTAS = [
  "/",
  "/propiedades",
  "/propiedades/bol-01",
  "/inmobiliarias",
  "/ingresar",
  "/cuenta",
  "/publicar",
]

for (const ruta of RUTAS) {
  test(`${ruta} carga sin errores ni scroll horizontal`, async ({ page }) => {
    const errores: string[] = []
    page.on("pageerror", (error) => errores.push(error.message))
    page.on("console", (mensaje) => {
      // El websocket de recarga en caliente solo existe en `next dev` y WebKit
      // a veces no lo puede abrir: no es un error de la página.
      if (mensaje.type() === "error" && !mensaje.text().includes("/_next/hmr")) {
        errores.push(mensaje.text())
      }
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
