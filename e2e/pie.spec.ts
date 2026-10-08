import { expect, test } from "@playwright/test"

test.describe("pie", () => {
  for (const ruta of ["/", "/inmobiliarias"]) {
    test(`en ${ruta}: columnas con sus links, todos de al menos 44 px`, async ({ page }) => {
      await page.goto(ruta)
      const pie = page.getByRole("contentinfo")
      for (const columna of ["Buscar", "Por tipo", "Inmobiliarias"]) {
        await expect(pie.getByRole("navigation", { name: columna })).toBeVisible()
      }
      await expect(pie.getByRole("link", { name: "Comprar", exact: true })).toHaveAttribute("href", "/buscar/tipo?operacion=venta")
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

test.describe("pie: el plano de Bolívar", () => {
  test("en el inicio, la invitación, el plano con su atribución y VIVÍ BOLÍVAR", async ({ page }) => {
    await page.goto("/")
    const pie = page.getByRole("contentinfo")
    await expect(pie.getByText("¿Buscás casa en Bolívar? Empezá por acá.")).toBeVisible()
    await expect(pie.getByRole("link", { name: "Quiero comprar" })).toHaveAttribute("href", "/buscar/tipo?operacion=venta")
    expect(await pie.locator(".plano path").count()).toBeGreaterThan(50)
    await expect(pie.getByRole("link", { name: /OpenStreetMap/ })).toHaveAttribute("href", "https://www.openstreetmap.org/copyright")
    await expect(pie.getByText(/Viví\s*Bolívar/i)).toBeAttached()
  })

  test("al llegar al fondo, el plano queda dibujado entero", async ({ page }) => {
    await page.goto("/")
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await expect
      .poll(() => page.locator(".plano .calles path").first().evaluate((p) => parseFloat(getComputedStyle(p).strokeDashoffset) || 0))
      .toBeLessThan(0.01)
  })

  test("en las demás páginas no hay plano, pero sí el cierre", async ({ page }) => {
    await page.goto("/inmobiliarias")
    const pie = page.getByRole("contentinfo")
    await expect(pie.locator(".plano")).toHaveCount(0)
    await expect(pie.getByRole("link", { name: /OpenStreetMap/ })).toHaveCount(0)
    await expect(pie.getByText(/Viví\s*Bolívar/i)).toBeAttached()
  })
})
