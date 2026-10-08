import { expect, test } from "@playwright/test"

test.describe("pie", () => {
  for (const ruta of ["/", "/inmobiliarias"]) {
    test(`en ${ruta}: columnas con sus links, todos de al menos 44 px`, async ({ page }) => {
      await page.goto(ruta)
      const pie = page.getByRole("contentinfo")
      for (const columna of ["Buscar", "Por tipo", "Inmobiliarias"]) {
        await expect(pie.getByRole("navigation", { name: columna })).toBeVisible()
      }
      await expect(pie.getByRole("link", { name: "Comprar" })).toHaveAttribute("href", "/buscar/tipo?operacion=venta")
      await expect(pie.getByRole("link", { name: "Casas", exact: true })).toHaveAttribute("href", "/propiedades?tipo=casa")
      await expect(pie.getByRole("link", { name: "Ver todas" })).toHaveAttribute("href", "/inmobiliarias")
      await expect(pie.getByText(/precios y datos son responsabilidad de cada una/)).toBeVisible()

      for (const link of await pie.getByRole("link").all()) {
        const caja = await link.boundingBox()
        expect(caja!.height, (await link.textContent()) ?? "").toBeGreaterThanOrEqual(44)
      }
    })
  }

  test("en escritorio, las cuatro columnas van en una fila", async ({ page }, info) => {
    test.skip(info.project.name !== "escritorio", "a 360 px son dos columnas")
    await page.goto("/")
    const pie = page.getByRole("contentinfo")
    const ys = await Promise.all(
      ["Buscar", "Por tipo", "Inmobiliarias"].map(async (n) => (await pie.getByRole("navigation", { name: n }).boundingBox())!.y)
    )
    expect(Math.max(...ys) - Math.min(...ys)).toBeLessThan(2)
  })
})
