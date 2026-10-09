import { expect, test } from "@playwright/test"

const FICHA = "/propiedades/bol-01"

test.describe("ficha", () => {
  test("a 360×640 se ven la foto, el precio, el título y la barra de contacto", async ({ page }, info) => {
    test.skip(info.project.name !== "android-chico", "el pliegue se mide en el Android chico")
    await page.goto(FICHA)
    const foto = page.getByRole("region", { name: "Fotos" })
    const precio = page.getByText("US$ 185.000", { exact: true }).first()
    const titulo = page.getByRole("heading", { level: 1 })
    const barra = page.getByRole("region", { name: "Contacto" })
    await expect(foto).toBeVisible()
    await expect(precio).toBeVisible()
    await expect(titulo).toBeVisible()
    await expect(barra).toBeVisible()
    for (const pieza of [foto, precio, titulo, barra]) {
      const caja = await pieza.boundingBox()
      expect(caja).not.toBeNull()
      expect(caja!.y).toBeGreaterThanOrEqual(0)
      expect(caja!.y + caja!.height).toBeLessThanOrEqual(640)
    }
  })

  test("la barra de contacto no tapa el final del contenido", async ({ page }, info) => {
    test.skip(info.project.name === "escritorio", "en escritorio no hay barra fija")
    await page.goto(FICHA)
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    const pie = await page.locator("footer").boundingBox()
    const barra = await page.getByRole("region", { name: "Contacto" }).boundingBox()
    expect(pie!.y + pie!.height).toBeLessThanOrEqual(barra!.y + 1)
  })

  test("consultar por WhatsApp arma el mensaje", async ({ page }) => {
    await page.goto(FICHA)
    const href = await page.getByRole("link", { name: "Consultar por WhatsApp" }).getAttribute("href")
    const url = new URL(href!)
    expect(url.hostname).toBe("wa.me")
    const texto = decodeURIComponent(url.searchParams.get("text")!)
    expect(texto).toContain("casa")
    expect(texto).toContain("en venta")
    expect(texto).toContain("Centro")
    expect(texto).toContain("US$ 185.000")
    expect(texto).toContain("/propiedades/bol-01")
  })

  test("sin WhatsApp el principal es llamar", async ({ page }) => {
    await page.goto("/propiedades/bol-04")
    await expect(page.getByRole("link", { name: "Llamar" })).toHaveAttribute("href", /^tel:/)
    await expect(page.getByRole("link", { name: "Consultar por WhatsApp" })).toHaveCount(0)
  })

  test("sin teléfono el principal es un mail", async ({ page }) => {
    await page.goto("/propiedades/bol-05")
    await expect(page.getByRole("link", { name: "Escribir un mail" })).toHaveAttribute("href", /^mailto:/)
  })

  test("deslizar la galería cambia de foto y la pantalla completa se cierra con Esc", async ({ page }, info) => {
    test.skip(info.project.name !== "android-chico", "el desliz se mide en el celular")
    await page.goto(FICHA)
    const tira = page.locator("[data-galeria]")
    await tira.evaluate((el) => {
      el.scrollTo({ left: el.clientWidth, behavior: "instant" })
    })
    await expect(page.getByText("2/5")).toBeVisible()
    await page.getByRole("button", { name: "Pantalla completa" }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toHaveCount(0)
  })

  test("el mapa chico no se pide hasta llegar a la ubicación", async ({ page }, info) => {
    test.skip(info.project.name !== "android-chico", "el pliegue corto es el que esconde el mapa")
    let mapas = 0
    page.on("request", (pedido) => {
      if (pedido.url().includes("openfreemap.org")) mapas += 1
    })
    await page.goto(FICHA)
    await expect(page.getByRole("heading", { name: "Descripción" })).toBeVisible()
    await page.waitForTimeout(800)
    expect(mapas).toBe(0)
    await page.getByRole("region", { name: "Ubicación" }).scrollIntoViewIfNeeded()
    await expect.poll(() => mapas, { timeout: 15_000 }).toBeGreaterThan(0)
  })

  test("con la dirección oculta no hay cómo llegar", async ({ page }) => {
    await page.goto("/propiedades/bol-16")
    await expect(page.getByText("Ubicación aproximada")).toBeVisible()
    await expect(page.getByText("dirección a consultar")).toBeVisible()
    await expect(page.getByRole("link", { name: "Cómo llegar" })).toHaveCount(0)
  })

  test("una propiedad que no existe ofrece parecidas", async ({ page }) => {
    const respuesta = await page.goto("/propiedades/no-existe")
    expect(respuesta?.status()).toBe(404)
    await expect(page.getByRole("heading", { name: "Esta propiedad ya no está publicada." })).toBeVisible()
    await expect(page.getByRole("link", { name: "Ver propiedades parecidas" })).toHaveAttribute("href", "/propiedades")
  })

  test("volver desde resultados deja la misma tarjeta", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta")
    const lista = page.getByRole("list", { name: "Propiedades" })
    const tercera = lista.locator("[data-id]").nth(2)
    const id = await tercera.getAttribute("data-id")
    await tercera.getByRole("link", { name: /Ver detalles/ }).click()
    await page.getByRole("link", { name: "Volver" }).click()
    await expect(lista.locator("[data-elegida='true']")).toHaveAttribute("data-id", id!)
  })

  test("entrar directo vuelve a resultados de la misma operación y tipo", async ({ page }) => {
    await page.goto(FICHA)
    await page.getByRole("link", { name: "Volver" }).click()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta&tipo=casa$/)
  })

  test("en escritorio hay mosaico y tarjeta de contacto, sin barra abajo", async ({ page }, info) => {
    test.skip(info.project.name !== "escritorio", "el mosaico es de escritorio")
    await page.goto(FICHA)
    await expect(page.locator("[data-galeria]")).toHaveCSS("display", "grid")
    await expect(page.getByRole("complementary", { name: "Contacto" })).toBeVisible()
    await expect(page.getByRole("region", { name: "Contacto" })).toHaveCount(0)
  })

  test("en escritorio, compartir copia el link", async ({ page }, info) => {
    test.skip(info.project.name !== "escritorio", "el portapapeles se prueba en Chrome de escritorio")
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"])
    await page.goto(FICHA)
    await page.getByRole("button", { name: "Compartir" }).click()
    await expect(page.getByRole("button", { name: "Link copiado" })).toBeVisible()
    const copiado = await page.evaluate(() => navigator.clipboard.readText())
    expect(copiado).toContain("/propiedades/bol-01")
  })

  test("la imagen para compartir mide 1200 × 630", async ({ page }) => {
    const respuesta = await page.request.get("/propiedades/bol-01/opengraph-image")
    expect(respuesta.status()).toBe(200)
    expect(respuesta.headers()["content-type"]).toContain("image/jpeg")
    const cuerpo = Buffer.from(await respuesta.body())
    expect(cuerpo.length).toBeLessThan(300_000)
    expect(cuerpo[0]).toBe(0xff)
    expect(cuerpo[1]).toBe(0xd8)
    let i = 2
    let ancho = 0
    let alto = 0
    while (i < cuerpo.length - 8) {
      if (cuerpo[i] !== 0xff) break
      const marca = cuerpo[i + 1]
      const largo = cuerpo.readUInt16BE(i + 2)
      if (marca >= 0xc0 && marca <= 0xc2) {
        alto = cuerpo.readUInt16BE(i + 5)
        ancho = cuerpo.readUInt16BE(i + 7)
        break
      }
      i += 2 + largo
    }
    expect(ancho).toBe(1200)
    expect(alto).toBe(630)
  })
})
