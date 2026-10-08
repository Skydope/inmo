import { expect, test } from "@playwright/test"

// Corre solo en el proyecto "sin-js" (JavaScript apagado): el buscador es un formulario GET
// común y tiene que llegar a los resultados igual.
test("sin JavaScript, del inicio a los resultados", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: /^Comprar/ }).click()
  await expect(page).toHaveURL(/\/buscar\/tipo\?operacion=venta$/)

  await page.getByRole("checkbox", { name: /^Casa \d+$/ }).check()
  await page.getByRole("button", { name: "Continuar" }).click()
  await expect(page).toHaveURL(/\/buscar\/zona\?/)

  await page.getByRole("checkbox", { name: /^Centro \d+$/ }).check()
  await page.getByRole("button", { name: "Continuar" }).click()
  await expect(page).toHaveURL(/\/buscar\/detalles\?/)

  await page.getByLabel(/Hasta US\$/).fill("150.000")
  await page.getByRole("button", { name: /^Ver \d+ propiedad/ }).click()

  await expect(page).toHaveURL(/\/propiedades\?/)
  const url = new URL(page.url())
  expect(url.searchParams.get("operacion")).toBe("venta")
  expect(url.searchParams.get("tipo")).toBe("casa")
  expect(url.searchParams.get("zona")).toBe("centro")
  expect(url.searchParams.get("hasta")).toBe("150.000")
  await expect(page.getByRole("heading", { name: "Casas en venta en Centro" })).toBeVisible()
})
