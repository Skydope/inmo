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

const elegida = (page: Page) => page.locator("[data-elegida='true']")

test("tocar un pin abre su pastilla con Ver detalles", async ({ page }) => {
  await page.goto(VENTA)
  const id = await pinALaVista(page)
  await page.locator(`.map-pin[data-id="${id}"]`).click()
  await expect(elegida(page)).toHaveAttribute("data-id", id)
  await expect(elegida(page).getByRole("link", { name: /Ver detalles/ })).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`sel=${id}`))
})

test("deslizar la tira no cambia la propiedad elegida", async ({ page }) => {
  await page.goto(VENTA)
  const id = await pinALaVista(page)
  await page.locator(`.map-pin[data-id="${id}"]`).click()
  const tira = page.getByRole("list", { name: "Propiedades" })
  await tira.evaluate((ul) => {
    ul.scrollLeft = ul.scrollWidth
  })
  await expect(elegida(page)).toHaveAttribute("data-id", id)
  await expect(page.locator(`.map-pin[data-id="${id}"]`)).toHaveClass(/is-selected/)
})

test("tocar el mapa vacío cierra la pastilla abierta", async ({ page }) => {
  await page.goto(VENTA)
  await page.locator(`.map-pin[data-id="${await pinALaVista(page)}"]`).click()
  await expect(elegida(page)).toBeVisible()
  // El mapa se mueve hasta el pin elegido (easeTo de 400 ms): se busca el lugar vacío cuando
  // quedó quieto, si no el lugar cambia entre que se elige y se toca.
  await page.waitForFunction(() => {
    const pin = document.querySelector(".map-pin.is-selected")
    if (!pin) return false
    const antes = pin.getBoundingClientRect().left
    return new Promise((ok) => setTimeout(() => ok(pin.getBoundingClientRect().left === antes), 150))
  })
  const lugar = await page.evaluate(() => {
    const mapa = document.querySelector(".maplibregl-canvas")!.getBoundingClientRect()
    for (let y = mapa.top + 150; y < mapa.bottom - 220; y += 20) {
      for (let x = mapa.left + 20; x < mapa.right - 20; x += 20) {
        if (document.elementFromPoint(x, y)?.classList.contains("maplibregl-canvas")) return { x, y }
      }
    }
  })
  await page.mouse.click(lugar!.x, lugar!.y)
  await expect(elegida(page)).toHaveCount(0)
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
