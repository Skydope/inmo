import { expect, test } from "@playwright/test"

const URL_VENTA = "/propiedades?operacion=venta"

// Deslizar hasta el slide i: el carrusel es un scroll horizontal nativo con scroll-snap.
// (evaluate serializa la función: no puede usar nada de afuera, el índice va como argumento).
const deslizarA = (ul: HTMLElement | SVGElement, i: number) => {
  const slide = ul.querySelector<HTMLElement>(`[data-slide="${i}"]`)!
  ul.scrollTo({ left: slide.offsetLeft - (ul.clientWidth - slide.clientWidth) / 2, behavior: "instant" })
}

test.describe("resultados: lista deslizable", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name === "escritorio", "en escritorio la lista es una grilla (bloque 5)")
  })

  test("a 360×640 se ve una tarjeta entera y asoma la siguiente", async ({ page }, info) => {
    test.skip(info.project.name !== "android-chico", "el pliegue se mide en el Android chico")
    await page.goto(URL_VENTA)
    const primera = page.locator("[data-slide='0'] article")
    const caja = await primera.boundingBox()
    expect(caja!.y + caja!.height).toBeLessThanOrEqual(640)
    await expect(primera.getByRole("link", { name: /Ver detalles/ })).toBeInViewport()
    const segunda = await page.locator("[data-slide='1']").boundingBox()
    expect(segunda!.x).toBeLessThan(360)
  })

  test("las flechas y el deslizar pasan de a una propiedad", async ({ page }) => {
    await page.goto(URL_VENTA)
    const contador = page.getByText(/^\d+ de \d+$/)
    await expect(contador).toHaveText(/^1 de 22$/)
    await page.getByRole("button", { name: "Propiedad siguiente" }).click()
    await expect(contador).toHaveText(/^2 de 22$/)
    await page.locator("ul:has([data-slide])").evaluate(deslizarA, 2)
    await expect(contador).toHaveText(/^3 de 22$/)
  })

  test("las flechas de la foto cambian de foto sin cambiar de propiedad", async ({ page }) => {
    await page.goto(URL_VENTA)
    const tarjeta = page.locator("[data-slide='0']")
    await expect(tarjeta.getByText("1/2")).toBeVisible()
    await tarjeta.getByRole("button", { name: "Foto siguiente" }).click()
    await expect(tarjeta.getByText("2/2")).toBeVisible()
    await expect(page.getByText(/^1 de 22$/)).toBeVisible()
  })

  test("al final hay una tarjeta para ampliar o ver el mapa", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&zona=centro")
    const ultimo = await page.locator("[data-slide]").count()
    await page.locator("ul:has([data-slide])").evaluate(deslizarA, ultimo - 1)
    await expect(page.getByText(/^Viste las \d+ propiedades\.$/)).toBeVisible()
    await expect(page.getByRole("link", { name: /Verlas en el mapa/ })).toBeVisible()
  })

  test("ninguna página de resultados tiene scroll horizontal", async ({ page }) => {
    await page.goto(URL_VENTA)
    const { documento, ventana } = await page.evaluate(() => ({
      documento: document.documentElement.scrollWidth,
      ventana: window.innerWidth,
    }))
    expect(documento).toBeLessThanOrEqual(ventana)
  })
})
