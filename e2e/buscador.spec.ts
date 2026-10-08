import { expect, test, type Page } from "@playwright/test"

const numero = (texto: string | null) => Number(/(\d+) propiedad/.exec(texto ?? "")?.[1] ?? NaN)
const opcion = (page: Page, rol: "checkbox" | "radio", nombre: RegExp) => page.getByRole(rol, { name: nombre })

test.describe("buscador guiado", () => {
  test("recorrido completo: el conteo del botón es lo que muestran los resultados", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /^Comprar/ }).click()
    await expect(page).toHaveURL(/\/buscar\/tipo\?operacion=venta$/)

    await opcion(page, "checkbox", /^Casa \d+$/).check()
    await opcion(page, "checkbox", /^Casa quinta \d+$/).check()
    await page.getByRole("button", { name: "Continuar" }).click()
    await expect(page).toHaveURL(/\/buscar\/zona\?/)
    await expect(page.getByRole("heading", { name: "¿En qué zona?" })).toBeVisible()

    await opcion(page, "checkbox", /^Centro \d+$/).check()
    await page.getByRole("button", { name: "Continuar" }).click()
    await expect(page).toHaveURL(/\/buscar\/detalles\?/)

    await opcion(page, "radio", /^2\+$/).first().check()
    const boton = page.getByRole("button", { name: /^Ver \d+ propiedad/ })
    const enBoton = numero(await boton.textContent())
    await boton.click()

    await expect(page).toHaveURL(/\/propiedades\?/)
    const url = new URL(page.url())
    expect(url.searchParams.get("operacion")).toBe("venta")
    expect(url.searchParams.getAll("tipo").join(",")).toBe("casa,quinta")
    expect(url.searchParams.get("zona")).toBe("centro")
    expect(url.searchParams.get("dorm")).toBe("2")
    expect(numero(await page.locator("main p").first().textContent())).toBe(enBoton)
  })

  test("el conteo del pie cambia al tocar una opción, sin navegar", async ({ page }) => {
    await page.goto("/buscar/tipo?operacion=venta")
    const ahora = page.getByRole("button", { name: /propiedades? ahora/ })
    const todas = numero(await ahora.textContent())
    const casa = opcion(page, "checkbox", /^Casa \d+$/)
    const deCasa = Number(/(\d+)\s*$/.exec(await page.locator("label", { has: casa }).innerText())?.[1])
    await casa.check()
    await expect(ahora).toHaveText(new RegExp(`las ${deCasa} propiedades ahora`))
    expect(deCasa).toBeLessThan(todas)
    await expect(page).toHaveURL(/\/buscar\/tipo\?operacion=venta$/)
  })

  test("atrás vuelve al paso anterior con lo marcado", async ({ page }) => {
    await page.goto("/buscar/tipo?operacion=venta")
    await opcion(page, "checkbox", /^Casa \d+$/).check()
    await page.getByRole("button", { name: "Continuar" }).click()
    await expect(page).toHaveURL(/\/buscar\/zona\?/)
    await page.goBack()
    await expect(page).toHaveURL(/\/buscar\/tipo\?/)
    await expect(opcion(page, "checkbox", /^Casa \d+$/)).toBeChecked()
  })

  test("un tipo sin avisos va al final y no se puede elegir", async ({ page }) => {
    await page.goto("/buscar/tipo?operacion=venta")
    await expect(opcion(page, "checkbox", /^Cochera/)).toBeDisabled()
    await expect(page.getByText("Sin avisos ahora").first()).toBeVisible()
  })

  test("sin operación vuelve al inicio; un paso que no existe da 404", async ({ page }) => {
    await page.goto("/buscar/tipo")
    await expect(page).toHaveURL(/\/$/)
    const respuesta = await page.goto("/buscar/cualquiera?operacion=venta")
    expect(respuesta?.status()).toBe(404)
  })

  test("todo lo que se toca en un paso mide al menos 44 px", async ({ page }) => {
    for (const ruta of ["/buscar/tipo?operacion=venta", "/buscar/zona?operacion=venta", "/buscar/detalles?operacion=venta"]) {
      await page.goto(ruta)
      const chicos = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("header a, main a, main button, label, form button, form a")]
          .map((el) => ({ el, caja: el.getBoundingClientRect() }))
          .filter(({ caja }) => caja.width > 0 && (caja.height < 44 || caja.width < 44))
          .map(({ el, caja }) => `${el.tagName} "${el.textContent?.trim().slice(0, 25)}" ${Math.round(caja.width)}×${Math.round(caja.height)}`)
      )
      expect(chicos, ruta).toEqual([])
    }
  })
})
