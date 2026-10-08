import { expect, test } from "@playwright/test"

test("sin JavaScript, el inicio se ve entero y el filtro anda", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Viví\s*Bolívar/i)
  const filtro = page.getByRole("navigation", { name: "Qué querés hacer" })
  await expect(filtro.getByRole("link", { name: /^Comprar/ })).toHaveAttribute("href", "/buscar/tipo?operacion=venta")
  await expect(filtro.getByRole("link", { name: /^Alquilar/ })).toHaveAttribute("href", "/buscar/tipo?operacion=alquiler")
  await expect(filtro.getByRole("link", { name: /^Alquiler temporario/ })).toHaveAttribute("href", "/buscar/tipo?operacion=temporario")
  // La foto la elige el <picture>, sin JS.
  await expect.poll(() => page.locator(".casa-foto img").first().evaluate((i: HTMLImageElement) => i.currentSrc)).toContain("casa-dia")
  await filtro.getByRole("link", { name: /^Comprar/ }).click()
  await expect(page).toHaveURL(/\/buscar\/tipo\?operacion=venta$/)
})
