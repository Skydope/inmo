import { expect, test, type Page } from "@playwright/test"

const VENTA = "/propiedades?operacion=venta"

// Los tiles no se piden (el e2e no depende de la red para dibujar calles); el índice de la
// fuente sí, porque de ahí sale el texto de la atribución. Los pines son HTML: se tocan igual.
test.beforeEach(async ({ page }) => {
  await page.route(/tiles\.openfreemap\.org\/(planet|natural_earth)\/.+/, (ruta) => ruta.abort())
})

/** Un pin que se vea y no esté tapado por nada. */
async function pinALaVista(page: Page) {
  await expect(page.locator(".map-pin").first()).toBeAttached()
  const id = await page.evaluate(() => {
    for (const el of document.querySelectorAll<HTMLElement>(".map-pin")) {
      const r = el.getBoundingClientRect()
      const encima = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      if (encima && el.contains(encima)) return el.dataset.id
    }
  })
  expect(id).toBeTruthy()
  return id!
}

const pastilla = (page: Page) => page.locator("[data-tarjeta-mapa]")

test("tocar un pin abre su tarjeta en el mapa", async ({ page }) => {
  await page.goto(VENTA)
  const id = await pinALaVista(page)
  await page.locator(`.map-pin[data-id="${id}"]`).click()
  await expect(page.locator("[data-elegida='true']")).toHaveCount(0)
  const tarjeta = pastilla(page)
  await expect(tarjeta).toBeVisible()
  await expect(tarjeta.getByRole("link")).toBeVisible()
  await expect(page.locator(`.map-pin[data-id="${id}"]`)).toHaveClass(/is-selected/)
  await expect(page).toHaveURL(new RegExp(`sel=${id}`))
})

test("bajar la lista no cambia la propiedad elegida", async ({ page }, info) => {
  await page.goto(VENTA)
  const id = await pinALaVista(page)
  await page.locator(`.map-pin[data-id="${id}"]`).click()
  await page.locator("[data-resultados]").evaluate((el) => {
    const caja = el.querySelector("[aria-label='Propiedades']")?.parentElement
    const sc = caja && getComputedStyle(caja).overflowY === "auto" ? caja : el
    sc.scrollTop = sc.scrollHeight
  })
  await expect(page.locator(`.map-pin[data-id="${id}"]`)).toHaveClass(/is-selected/)
  await expect(page).toHaveURL(new RegExp(`sel=${id}`))
  if (info.project.name === "escritorio") await expect(pastilla(page)).toBeVisible()
})

test("tocar el mapa vacío cierra la pastilla abierta", async ({ page }) => {
  await page.goto(VENTA)
  await page.locator(`.map-pin[data-id="${await pinALaVista(page)}"]`).click()
  await expect(pastilla(page)).toBeVisible()
  const lugar = await page.evaluate(() => {
    const mapa = document.querySelector(".maplibregl-canvas")!.getBoundingClientRect()
    for (let y = mapa.top + 150; y < mapa.bottom - 220; y += 20) {
      for (let x = mapa.left + 20; x < mapa.right - 20; x += 20) {
        if (document.elementFromPoint(x, y)?.classList.contains("maplibregl-canvas")) return { x, y }
      }
    }
  })
  await page.mouse.click(lugar!.x, lugar!.y)
  await expect(pastilla(page)).toHaveCount(0)
  await expect(page.getByRole("list", { name: "Propiedades" })).toBeVisible()
})

test("la atribución se ve y no hay pedidos a Carto", async ({ page }) => {
  const pedidos: string[] = []
  page.on("request", (r) => pedidos.push(r.url()))
  await page.goto(VENTA)
  await expect(page.locator(".maplibregl-ctrl-attrib")).toContainText("OpenStreetMap")
  expect(pedidos.filter((u) => u.includes("cartocdn"))).toEqual([])
})

test("la página pide el worker de MapLibre", async ({ page }) => {
  const pedidos: string[] = []
  page.on("request", (r) => pedidos.push(r.url()))
  await page.goto(VENTA)
  await expect(page.locator(".maplibregl-canvas")).toBeVisible()
  expect(pedidos.some((u) => u.includes("maplibre-gl-worker"))).toBe(true)
})
