import { expect, test, type Page } from "@playwright/test"

const VENTA = "/propiedades?operacion=venta"

// Los tiles no se piden (el e2e no depende de la red para dibujar calles); el índice de la
// fuente sí, porque de ahí sale el texto de la atribución. Los pines son HTML: se tocan igual.
test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name === "escritorio", "en escritorio mapa y lista van juntos (ver resultados.spec.ts)")
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

const activaEnLaTira = (page: Page) => page.locator("ul[aria-label='Propiedad elegida en el mapa'] [data-activo='true']")

test("de la lista al mapa: abre con la misma propiedad elegida", async ({ page }) => {
  await page.goto(VENTA)
  await page.getByRole("button", { name: "Propiedad siguiente" }).click()
  await page.getByRole("button", { name: "Propiedad siguiente" }).click()
  await expect(page.getByText(/^3 de 22$/)).toBeVisible()
  const id = await page.locator("[data-slide][data-activo='true']").getAttribute("data-id")
  await page.getByRole("link", { name: "Mapa", exact: true }).click()
  await expect(activaEnLaTira(page)).toHaveAttribute("data-id", id!)
  await expect(page.locator(`.map-pin[data-id="${id}"]`)).toHaveClass(/is-selected/)
})

test("tocar un pin abre su tarjeta flotante con Ver detalles", async ({ page }) => {
  await page.goto(`${VENTA}&vista=mapa`)
  const id = await pinALaVista(page)
  await page.locator(`.map-pin[data-id="${id}"]`).click()
  await expect(activaEnLaTira(page)).toHaveAttribute("data-id", id)
  await expect(activaEnLaTira(page).getByRole("link", { name: /Ver detalles/ })).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`sel=${id}`))
})

test("deslizar la tarjeta flotante elige la siguiente y el mapa la sigue", async ({ page }) => {
  await page.goto(`${VENTA}&vista=mapa`)
  await page.locator(`.map-pin[data-id="${await pinALaVista(page)}"]`).click()
  const tira = page.locator("ul[aria-label='Propiedad elegida en el mapa']")
  const actual = Number(await activaEnLaTira(page).getAttribute("data-slide"))
  const siguiente = actual + 1 < (await tira.locator("[data-slide]").count()) ? actual + 1 : actual - 1
  const idSiguiente = await tira.locator(`[data-slide="${siguiente}"]`).getAttribute("data-id")
  await tira.evaluate((ul, i) => {
    const slide = ul.querySelector<HTMLElement>(`[data-slide="${i}"]`)!
    ul.scrollTo({ left: slide.offsetLeft - (ul.clientWidth - slide.clientWidth) / 2, behavior: "instant" })
  }, siguiente)
  await expect(page.locator(`.map-pin[data-id="${idSiguiente}"]`)).toHaveClass(/is-selected/)
  await expect(page).toHaveURL(new RegExp(`sel=${idSiguiente}`))
})

test("tocar el mapa vacío cierra la tarjeta flotante", async ({ page }) => {
  await page.goto(`${VENTA}&vista=mapa`)
  await page.locator(`.map-pin[data-id="${await pinALaVista(page)}"]`).click()
  await expect(activaEnLaTira(page)).toBeVisible()
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
  await expect(activaEnLaTira(page)).toHaveCount(0)
})

test("la atribución se ve y no hay pedidos a Carto", async ({ page }) => {
  const pedidos: string[] = []
  page.on("request", (r) => pedidos.push(r.url()))
  await page.goto(`${VENTA}&vista=mapa`)
  await expect(page.locator(".maplibregl-ctrl-attrib")).toContainText("OpenStreetMap")
  expect(pedidos.filter((u) => u.includes("cartocdn"))).toEqual([])
})

test("en la lista el mapa no se crea (el worker de MapLibre no se pide)", async ({ page }) => {
  const pedidos: string[] = []
  page.on("request", (r) => pedidos.push(r.url()))
  await page.goto(VENTA)
  await expect(page.getByText(/^1 de 22$/)).toBeVisible()
  expect(pedidos.filter((u) => u.includes("maplibre-gl-worker"))).toEqual([])
})
