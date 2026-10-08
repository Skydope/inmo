import { expect, test } from "@playwright/test"

const numero = (texto: string | null) => Number(/(\d+) propiedades?/.exec(texto ?? "")?.[1] ?? NaN)

test.describe("inicio: ¿Qué estás buscando?", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("las tres opciones llevan al paso 2 con la operación", async ({ page }) => {
    await expect(page.getByRole("navigation", { name: "Qué querés hacer" }).getByRole("link", { name: /^Comprar/ })).toHaveAttribute("href", "/buscar/tipo?operacion=venta")
    await expect(page.getByRole("navigation", { name: "Qué querés hacer" }).getByRole("link", { name: /^Alquilar/ })).toHaveAttribute("href", "/buscar/tipo?operacion=alquiler")
    await expect(page.getByRole("navigation", { name: "Qué querés hacer" }).getByRole("link", { name: /^Alquiler temporario/ })).toHaveAttribute("href", "/buscar/tipo?operacion=temporario")
    await expect(page.getByRole("link", { name: /Ver todas en el mapa/ })).toHaveAttribute("href", "/propiedades?vista=mapa")
  })

  test("el conteo de Comprar coincide con los resultados de venta", async ({ page }) => {
    const enInicio = numero(await page.getByRole("navigation", { name: "Qué querés hacer" }).getByRole("link", { name: /^Comprar/ }).textContent())
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
    page.getByRole("navigation", { name: "Qué querés hacer" }).getByRole("link", { name: /^Comprar/ }),
    page.getByRole("navigation", { name: "Qué querés hacer" }).getByRole("link", { name: /^Alquilar/ }),
    page.getByRole("navigation", { name: "Qué querés hacer" }).getByRole("link", { name: /^Alquiler temporario/ }),
  ]) {
    const caja = await elemento.boundingBox()
    expect(caja).not.toBeNull()
    expect(caja!.y + caja!.height).toBeLessThanOrEqual(640)
  }
})

test.describe("inicio: lo que hay debajo de la foto", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("las secciones van en orden, después de los números", async ({ page }) => {
    const numeros = page.getByRole("region", { name: "Bolívar Inmo en números" })
    await expect(numeros.getByText("propiedades", { exact: true })).toBeVisible()
    await expect(numeros.locator("dd").first()).toHaveText("36")
    const titulos = await page.locator("main h2").allTextContents()
    expect(titulos).toEqual([
      "Recién publicadas",
      "Buscá por tipo",
      "Destacadas",
      "Por zona",
      "Inmobiliarias de Bolívar",
      "¿Sos inmobiliaria de Bolívar?",
    ])
  })

  test("una categoría lleva a su búsqueda con el mismo conteo", async ({ page }) => {
    const tipos = page.getByRole("list", { name: "Tipos de propiedad" })
    const primera = tipos.getByRole("link").first()
    const texto = (await primera.textContent())!
    await expect(primera).toHaveAttribute("href", /^\/propiedades\?operacion=[a-z]+&tipo=[a-z-]+$/)
    await primera.click()
    await expect(page).toHaveURL(/\/propiedades\?operacion=/)
    expect(numero(await page.locator("main p").first().textContent())).toBe(numero(texto))
  })

  test("Ver todas y las inmobiliarias llevan a donde dicen", async ({ page }) => {
    await expect(
      page.getByRole("region", { name: "Recién publicadas" }).getByRole("link", { name: /^Ver todas/ })
    ).toHaveAttribute("href", "/propiedades")
    await expect(page.getByRole("link", { name: /Ver todas las inmobiliarias/ })).toHaveAttribute("href", "/inmobiliarias")

    const inmobiliaria = page.getByRole("list", { name: "Inmobiliarias" }).getByRole("link").first()
    const href = (await inmobiliaria.getAttribute("href"))!
    expect(href).toMatch(/^\/inmobiliarias#[a-z-]+$/)
    await inmobiliaria.click()
    await expect(page).toHaveURL(new RegExp(`${href}$`))
    await expect(page.locator(href.slice(href.indexOf("#")))).toBeInViewport()
  })

  test("una zona lleva a los resultados de esa zona", async ({ page }) => {
    await page.getByRole("region", { name: "Por zona" }).getByRole("link", { name: /^Centro/ }).click()
    await expect(page).toHaveURL(/\/propiedades\?zona=centro$/)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Propiedades en Centro")
  })

  test("sin scroll horizontal (los carruseles se desplazan adentro)", async ({ page }) => {
    const { documento, ventana } = await page.evaluate(() => ({
      documento: document.documentElement.scrollWidth,
      ventana: window.innerWidth,
    }))
    expect(documento).toBeLessThanOrEqual(ventana)
  })

  test("con mouse, las flechas pasan el carrusel", async ({ page }, info) => {
    test.skip(info.project.name !== "escritorio", "las flechas son de escritorio")
    const lista = page.getByRole("list", { name: "Recién publicadas" })
    await lista.scrollIntoViewIfNeeded()
    await page.getByRole("button", { name: "Recién publicadas: siguientes" }).click()
    await expect.poll(() => lista.evaluate((ul) => ul.scrollLeft)).toBeGreaterThan(100)
    await expect(page.getByRole("button", { name: "Recién publicadas: anteriores" })).toBeVisible()
  })
})
