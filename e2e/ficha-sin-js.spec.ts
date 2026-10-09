import { expect, test } from "@playwright/test"

test("sin JavaScript, Leer más abre el resto y WhatsApp sigue siendo un link", async ({ page }) => {
  await page.goto("/propiedades/bol-01")
  await expect(page.getByText("cerco de ligustros")).toBeHidden()
  await page.getByText("Leer más").click()
  await expect(page.getByText("cerco de ligustros")).toBeVisible()

  const href = await page.getByRole("link", { name: "Consultar por WhatsApp" }).getAttribute("href")
  expect(href).toContain("https://wa.me/")
  expect(decodeURIComponent(href!)).toContain("/propiedades/bol-01")
})
