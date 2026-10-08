import { expect, test } from "@playwright/test"

test("sin JavaScript, Filtros lleva al buscador con la búsqueda actual", async ({ page }) => {
  await page.goto("/propiedades?operacion=venta&tipo=casa&zona=centro")
  await page.getByRole("link", { name: /^Filtros/ }).click()
  await expect(page).toHaveURL(/\/buscar\/tipo\?operacion=venta&tipo=casa&zona=centro$/)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("¿Qué tipo de propiedad?")
})
