import { expect, test } from "@playwright/test"

const numero = (texto: string | null) => Number(/(\d+) propiedades?/.exec(texto ?? "")?.[1] ?? NaN)

test.describe("inicio: ¿Qué estás buscando?", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("las tres opciones llevan al paso 2 con la operación", async ({ page }) => {
    await expect(page.getByRole("link", { name: /^Comprar/ })).toHaveAttribute("href", "/buscar/tipo?operacion=venta")
    await expect(page.getByRole("link", { name: /^Alquilar/ })).toHaveAttribute("href", "/buscar/tipo?operacion=alquiler")
    await expect(page.getByRole("link", { name: /^Alquiler temporario/ })).toHaveAttribute("href", "/buscar/tipo?operacion=temporario")
    await expect(page.getByRole("link", { name: /Ver todas en el mapa/ })).toHaveAttribute("href", "/propiedades?vista=mapa")
  })

  test("el conteo de Comprar coincide con los resultados de venta", async ({ page }) => {
    const enInicio = numero(await page.getByRole("link", { name: /^Comprar/ }).textContent())
    expect(enInicio).toBeGreaterThan(0)
    await page.goto("/propiedades?operacion=venta")
    expect(numero(await page.locator("main p").first().textContent())).toBe(enInicio)
  })

  test("se ve la foto con su crédito", async ({ page }) => {
    await expect(page.getByText(/Foto: Gobierno de Bolívar/)).toBeVisible()
  })
})

test("a 360×640 la pregunta y las tres opciones entran sin scroll", async ({ page }, info) => {
  test.skip(info.project.name !== "android-chico", "el pliegue se mide en el Android chico")
  await page.goto("/")
  for (const elemento of [
    page.getByRole("heading", { name: "¿Qué estás buscando?" }),
    page.getByRole("link", { name: /^Comprar/ }),
    page.getByRole("link", { name: /^Alquilar/ }),
    page.getByRole("link", { name: /^Alquiler temporario/ }),
  ]) {
    const caja = await elemento.boundingBox()
    expect(caja).not.toBeNull()
    expect(caja!.y + caja!.height).toBeLessThanOrEqual(640)
  }
})
