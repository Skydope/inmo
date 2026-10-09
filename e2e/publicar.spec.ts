import { expect, test, type Page } from "@playwright/test"

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
)

async function siguiente(page: Page, titulo: string) {
  await page.getByRole("button", { name: "Siguiente" }).click()
  await expect(page.getByRole("heading", { level: 1, name: titulo })).toBeVisible()
}

async function sinScrollHorizontal(page: Page) {
  const { documento, ventana } = await page.evaluate(() => ({
    documento: document.documentElement.scrollWidth,
    ventana: window.innerWidth,
  }))
  expect(documento).toBeLessThanOrEqual(ventana)
}

test.describe("carga de aviso", () => {
  test("venta ofrece terreno y el temporario no", async ({ page }) => {
    await page.goto("/publicar/operacion")
    await expect(page.getByRole("heading", { name: "Qué publicás" })).toBeVisible()
    await expect(page.getByText("Paso 1 de 7")).toBeVisible()
    await expect(page.getByRole("button", { name: "Anterior" })).toHaveCount(0)
    await page.getByRole("radio", { name: "Venta" }).click()
    await expect(page.getByRole("radio", { name: "Terreno" })).toBeVisible()
    await page.getByRole("radio", { name: "Alquiler temporario" }).click()
    await expect(page.getByRole("radio", { name: "Terreno" })).toHaveCount(0)
    await expect(page.getByRole("radio", { name: "Casa", exact: true })).toBeVisible()
    await sinScrollHorizontal(page)
  })

  test("las medidas siguen al tipo", async ({ page }) => {
    await page.goto("/publicar/medidas")
    await expect(page.getByText("Ejemplo para una casa. Elegí el tipo en el paso 1.")).toBeVisible()
    await expect(page.getByText("Dormitorios", { exact: true })).toBeVisible()

    await page.goto("/publicar/operacion")
    await page.getByRole("radio", { name: "Venta" }).click()
    await page.getByRole("radio", { name: "Campo" }).click()
    await siguiente(page, "Dónde está")
    await siguiente(page, "Las medidas")
    await expect(page.getByLabel("Hectáreas")).toBeVisible()
    await expect(page.getByText("Dormitorios", { exact: true })).toHaveCount(0)

    await page.goto("/publicar/operacion")
    await page.getByRole("radio", { name: "Venta" }).click()
    await page.getByRole("radio", { name: "Terreno" }).click()
    await siguiente(page, "Dónde está")
    await siguiente(page, "Las medidas")
    await expect(page.getByLabel("m² total")).toBeVisible()
    await expect(page.getByText("Dormitorios", { exact: true })).toHaveCount(0)
    await expect(page.getByLabel("Hectáreas")).toHaveCount(0)
  })

  test("las expensas son de departamento y PH", async ({ page }) => {
    await page.goto("/publicar/operacion")
    await page.getByRole("radio", { name: "Venta" }).click()
    await page.getByRole("radio", { name: "Departamento" }).click()
    await siguiente(page, "Dónde está")
    await siguiente(page, "Las medidas")
    await siguiente(page, "El precio")
    await expect(page.getByRole("textbox", { name: "Expensas", exact: true })).toBeVisible()

    await page.getByRole("button", { name: "Qué publicás" }).click()
    await expect(page.getByRole("heading", { name: "Qué publicás" })).toBeVisible()
    await page.getByRole("radio", { name: "Casa", exact: true }).click()
    await siguiente(page, "Dónde está")
    await siguiente(page, "Las medidas")
    await siguiente(page, "El precio")
    await expect(page.getByRole("textbox", { name: "Expensas", exact: true })).toHaveCount(0)
  })

  test("un alquiler ofrece mascotas y no apto crédito", async ({ page }) => {
    await page.goto("/publicar/operacion")
    await page.getByRole("radio", { name: "Alquiler", exact: true }).click()
    await page.getByRole("radio", { name: "Departamento" }).click()
    await siguiente(page, "Dónde está")
    await siguiente(page, "Las medidas")
    await siguiente(page, "El precio")
    await siguiente(page, "Qué tiene")
    await expect(page.getByRole("checkbox", { name: "Acepta mascotas" })).toBeVisible()
    await expect(page.getByRole("checkbox", { name: "Amoblado" })).toBeVisible()
    await expect(page.getByRole("checkbox", { name: "Apto crédito" })).toHaveCount(0)
  })

  test("la primera foto es la portada y se puede bajar", async ({ page }) => {
    await page.goto("/publicar/fotos")
    await page.getByLabel("Elegir fotos").setInputFiles([
      { name: "frente.png", mimeType: "image/png", buffer: PNG },
      { name: "fondo.png", mimeType: "image/png", buffer: PNG },
    ])
    await expect(page.getByRole("article", { name: "frente.png" }).getByText("Portada")).toBeVisible()
    await page.getByRole("article", { name: "frente.png" }).getByRole("button", { name: "Bajar" }).click()
    await expect(page.getByRole("article", { name: "fondo.png" }).getByText("Portada")).toBeVisible()
    await expect(page.getByLabel("Elegir videos")).toBeVisible()
  })

  test("publicar llega a la pantalla quieta", async ({ page }) => {
    await page.goto("/publicar/texto")
    await sinScrollHorizontal(page)
    await page.getByRole("button", { name: "Publicar" }).click()
    await expect(page.getByRole("heading", { name: "El aviso quedó publicado" })).toBeVisible()
    await expect(page.getByText("En el prototipo no se guardó.")).toBeVisible()
    await expect(page.locator(".animate-in")).toHaveCount(0)
    await expect(page.getByRole("link", { name: "Ver en el sitio" })).toHaveAttribute("href", "/propiedades/bol-01")
    await expect(page.getByRole("link", { name: "Cargar otro" })).toHaveAttribute("href", "/publicar/operacion?nuevo=1")
    await expect(page.getByRole("link", { name: "Ir a mis avisos" })).toHaveAttribute("href", "/cuenta?como=lista")
  })

  test("recargar ubicación la deja vacía y el mapa no se pide antes", async ({ page }) => {
    const urls: string[] = []
    page.on("request", (pedido) => urls.push(pedido.url()))
    await page.goto("/publicar/operacion")
    await expect(page.getByRole("heading", { name: "Qué publicás" })).toBeVisible()
    expect(urls.some((url) => url.includes("/mapa/estilo.json"))).toBe(false)

    await page.goto("/publicar/ubicacion")
    await page.getByLabel("Calle y altura").fill("San Martín 100")
    await expect.poll(() => urls.some((url) => url.includes("/mapa/estilo.json"))).toBe(true)
    await page.reload()
    await expect(page.getByLabel("Calle y altura")).toHaveValue("")
  })

  test("un paso que no existe responde 404", async ({ page }) => {
    const respuesta = await page.goto("/publicar/no-existe")
    expect(respuesta?.status()).toBe(404)
  })

  test("cargar aviso desde la cuenta empieza vacío", async ({ page }) => {
    await page.goto("/publicar/ubicacion")
    await page.getByLabel("Calle y altura").fill("Belgrano 10")
    await page.getByRole("link", { name: "Salir" }).click()
    await page.getByRole("link", { name: "Cargar aviso" }).click()
    await expect(page.getByRole("heading", { name: "Qué publicás" })).toBeVisible()
    await page.getByRole("radio", { name: "Venta" }).click()
    await page.getByRole("radio", { name: "Casa", exact: true }).click()
    await siguiente(page, "Dónde está")
    await expect(page.getByLabel("Calle y altura")).toHaveValue("")
  })
})
