import { expect, test } from "@playwright/test"

const URL_VENTA = "/propiedades?operacion=venta"

// Deslizar hasta el slide i: el carrusel es un scroll horizontal nativo con scroll-snap.
// (evaluate serializa la función: no puede usar nada de afuera, el índice va como argumento).
const deslizarA = (ul: HTMLElement | SVGElement, i: number) => {
  const slide = ul.querySelector<HTMLElement>(`[data-slide="${i}"]`)!
  ul.scrollTo({ left: slide.offsetLeft - (ul.clientWidth - slide.clientWidth) / 2, behavior: "instant" })
}

test.describe("resultados: lista deslizable", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name === "escritorio", "en escritorio la lista es una grilla, sin carrusel")
  })

  test("a 360×640 se ve una tarjeta entera y asoma la siguiente", async ({ page }, info) => {
    test.skip(info.project.name !== "android-chico", "el pliegue se mide en el Android chico")
    await page.goto(URL_VENTA)
    const primera = page.locator("[data-slide='0'] article")
    const caja = await primera.boundingBox()
    expect(caja!.y + caja!.height).toBeLessThanOrEqual(640)
    await expect(primera.getByRole("link", { name: /Ver detalles/ })).toBeInViewport()
    const segunda = await page.locator("[data-slide='1']").boundingBox()
    expect(segunda!.x).toBeLessThan(360)
  })

  test("las flechas y el deslizar pasan de a una propiedad", async ({ page }) => {
    await page.goto(URL_VENTA)
    const contador = page.getByText(/^\d+ de \d+$/)
    await expect(contador).toHaveText(/^1 de 22$/)
    await page.getByRole("button", { name: "Propiedad siguiente" }).click()
    await expect(contador).toHaveText(/^2 de 22$/)
    await page.locator("ul:has([data-slide])").evaluate(deslizarA, 2)
    await expect(contador).toHaveText(/^3 de 22$/)
  })

  test("las flechas de la foto cambian de foto sin cambiar de propiedad", async ({ page }) => {
    await page.goto(URL_VENTA)
    const tarjeta = page.locator("[data-slide='0']")
    await expect(tarjeta.getByText("1/2")).toBeVisible()
    await tarjeta.getByRole("button", { name: "Foto siguiente" }).click()
    await expect(tarjeta.getByText("2/2")).toBeVisible()
    await expect(page.getByText(/^1 de 22$/)).toBeVisible()
  })

  test("al final hay una tarjeta para ampliar o ver el mapa", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&zona=centro")
    const ultimo = await page.locator("[data-slide]").count()
    await page.locator("ul:has([data-slide])").evaluate(deslizarA, ultimo - 1)
    await expect(page.getByText(/^Viste las \d+ propiedades\.$/)).toBeVisible()
    await expect(page.getByRole("link", { name: /Verlas en el mapa/ })).toBeVisible()
  })

  test("las fotos de las tarjetas lejanas se piden al acercarse", async ({ page }) => {
    await page.goto(URL_VENTA)
    const foto = (i: number) => page.locator(`ul:has([data-slide]) [data-slide='${i}'] img`)
    await expect(foto(0)).toHaveCount(1)
    await expect(foto(6)).toHaveCount(0)
    await page.locator("ul:has([data-slide])").evaluate(deslizarA, 5)
    await expect(page.getByText(/^6 de 22$/)).toBeVisible()
    await expect(foto(6)).toHaveCount(1)
  })

  test("ninguna página de resultados tiene scroll horizontal", async ({ page }) => {
    await page.goto(URL_VENTA)
    const { documento, ventana } = await page.evaluate(() => ({
      documento: document.documentElement.scrollWidth,
      ventana: window.innerWidth,
    }))
    expect(documento).toBeLessThanOrEqual(ventana)
  })
})

test.describe("resultados: la propiedad elegida vive en la URL", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name === "escritorio", "en escritorio la lista es una grilla, sin carrusel")
  })

  test("ir a la ficha y volver deja la misma tarjeta", async ({ page }) => {
    await page.goto(URL_VENTA)
    await page.getByRole("button", { name: "Propiedad siguiente" }).click()
    await page.getByRole("button", { name: "Propiedad siguiente" }).click()
    await expect(page.getByText(/^3 de 22$/)).toBeVisible()
    await expect(page).toHaveURL(/sel=/)
    await page.locator("[data-activo='true']").getByRole("link", { name: /Ver detalles/ }).click()
    await expect(page).toHaveURL(/\/propiedades\/bol-/)
    await page.goBack()
    await expect(page.getByText(/^3 de 22$/)).toBeVisible()
  })

  test("una URL compartida con sel abre en esa propiedad", async ({ page }) => {
    await page.goto(URL_VENTA)
    const id = await page.locator("[data-slide='4']").getAttribute("data-id")
    await page.goto(`${URL_VENTA}&sel=${id}`)
    await expect(page.getByText(/^5 de 22$/)).toBeVisible()
  })

  test("Lista y Mapa cambian la vista sin perder la propiedad elegida", async ({ page }) => {
    await page.goto(URL_VENTA)
    await page.getByRole("button", { name: "Propiedad siguiente" }).click()
    await expect(page.getByText(/^2 de 22$/)).toBeVisible()
    await page.getByRole("link", { name: "Mapa", exact: true }).click()
    await expect(page).toHaveURL(/vista=mapa/)
    await page.getByRole("link", { name: "Lista", exact: true }).click()
    await expect(page.getByText(/^2 de 22$/)).toBeVisible()
    await expect(page).not.toHaveURL(/vista=mapa/)
  })
})


test.describe("resultados: hoja de filtros", () => {
  const abrir = async (page: import("@playwright/test").Page) => {
    await page.getByRole("link", { name: /^Filtros/ }).click()
    const hoja = page.getByRole("dialog", { name: "Filtros" })
    await expect(hoja).toBeVisible()
    return hoja
  }
  const opcion = (hoja: import("@playwright/test").Locator, texto: string) =>
    hoja.locator("label", { hasText: new RegExp(`^${texto}\\s*\\d*$`) }).locator("input")

  test("cambiar algo recuenta sin navegar y aplicar va a la URL canónica", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa")
    const hoja = await abrir(page)
    const aplicar = hoja.getByRole("button", { name: /^Ver \d+ propiedad/ })
    await expect(aplicar).toHaveText("Ver 6 propiedades")
    await opcion(hoja, "Departamento").check()
    await expect(aplicar).toHaveText("Ver 10 propiedades")
    await expect(page).toHaveURL(/\?operacion=venta&tipo=casa$/)

    await opcion(hoja, "Centro").check()
    const n = Number((await aplicar.textContent())!.match(/\d+/)![0])
    await aplicar.click()
    await expect(hoja).toBeHidden()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta&tipo=casa,departamento&zona=centro$/)
    await expect(page.getByText(new RegExp(`^${n} propiedad(es)?$`))).toBeVisible()
  })

  test("cerrar sin aplicar descarta lo tocado", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa")
    let hoja = await abrir(page)
    await opcion(hoja, "Departamento").check()
    await hoja.getByRole("button", { name: "Cerrar sin aplicar" }).click()
    await expect(hoja).toBeHidden()
    await expect(page).toHaveURL(/\?operacion=venta&tipo=casa$/)

    hoja = await abrir(page)
    await expect(opcion(hoja, "Departamento")).not.toBeChecked()
    await expect(hoja.getByRole("button", { name: /^Ver \d+ propiedad/ })).toHaveText("Ver 6 propiedades")
  })

  test("Todo Bolívar y Limpiar desmarcan sin cerrar la hoja", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&zona=centro")
    const hoja = await abrir(page)
    const aplicar = hoja.getByRole("button", { name: /^Ver \d+ propiedad/ })
    await expect(opcion(hoja, "Centro")).toBeChecked()
    await hoja.getByRole("button", { name: /^Todo Bolívar/ }).click()
    await expect(opcion(hoja, "Centro")).not.toBeChecked()
    await expect(aplicar).toHaveText("Ver 6 propiedades")

    await hoja.getByRole("button", { name: "Limpiar" }).click()
    await expect(opcion(hoja, "Casa")).not.toBeChecked()
    await expect(opcion(hoja, "Comprar")).toBeChecked()
    await expect(aplicar).toHaveText("Ver 22 propiedades")
  })

  test("cambiar la operación saca lo que no aplica", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&moneda=USD&hasta=100000")
    const hoja = await abrir(page)
    await opcion(hoja, "Alquilar").check()
    await expect(opcion(hoja, "Alquilar")).toBeChecked()
    await expect(hoja.getByLabel(/^Hasta/)).toHaveValue("")
    await expect(opcion(hoja, "Pesos")).toBeChecked()
    await hoja.getByRole("button", { name: /^Ver \d+ propiedad/ }).click()
    await expect(page).toHaveURL(/\/propiedades\?operacion=alquiler&tipo=casa$/)
  })
})

test.describe("resultados: sin resultados", () => {
  test("ofrece qué sacar y tocar una sugerencia lleva a resultados", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&zona=centro&dorm=4&con=pileta")
    await expect(page.getByText("No hay casas en venta en Centro con esos filtros.")).toBeVisible()
    await expect(page.getByRole("link", { name: "Mapa", exact: true })).toHaveCount(0)
    await page.getByRole("link", { name: /^Pileta/ }).click()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta&tipo=casa&zona=centro&dorm=4$/)
    await expect(page.getByText(/^1 propiedad$/)).toBeVisible()
  })

  test("Ver todas vuelve a todas las de la operación", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&zona=centro&dorm=4&con=pileta")
    await page.getByRole("link", { name: "Ver todas las propiedades en venta" }).click()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta$/)
    await expect(page.getByText(/^22 propiedades$/)).toBeVisible()
  })
})

test.describe("resultados: escritorio", () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(info.project.name !== "escritorio", "lista y mapa lado a lado solo en escritorio")
    await page.route(/tiles\.openfreemap\.org\/(planet|natural_earth)\/.+/, (ruta) => ruta.abort())
  })

  test("la lista es una grilla con el mapa fijo al lado, sin selector", async ({ page }) => {
    await page.goto(URL_VENTA)
    await expect(page.locator(".map-pin").first()).toBeAttached()
    await expect(page.getByRole("link", { name: "Mapa", exact: true })).toBeHidden()
    const [a, b] = await Promise.all([0, 1].map((i) => page.locator(`[data-slide='${i}']`).boundingBox()))
    expect(Math.abs(a!.y - b!.y)).toBeLessThan(2)
    // Bajar la lista no se lleva el mapa.
    await page.mouse.wheel(0, 1500)
    await expect(page.locator(".maplibregl-canvas")).toBeInViewport()
    await expect(page).not.toHaveURL(/sel=/)
  })

  test("el mouse sobre una tarjeta resalta su pin; tocar un pin marca su tarjeta", async ({ page }) => {
    await page.goto(URL_VENTA)
    await expect(page.locator(".map-pin").first()).toBeAttached()
    // (La tarjeta flotante del mapa también tiene slides: se busca en la lista.)
    const lista = page.getByRole("region", { name: "Propiedades" })
    const primera = lista.locator("[data-slide='0']")
    const id = await primera.getAttribute("data-id")
    await primera.hover()
    await expect(page.locator(`.map-pin[data-id="${id}"]`)).toHaveClass(/is-resaltado/)

    const lejana = lista.locator("[data-slide='9']")
    const idLejana = await lejana.getAttribute("data-id")
    await page.locator(`.map-pin[data-id="${idLejana}"]`).dispatchEvent("click")
    await expect(lejana).toHaveAttribute("data-elegida", "true")
    await expect(lejana).toBeInViewport()
    await expect(page).toHaveURL(new RegExp(`sel=${idLejana}`))
  })

  test("la hoja de filtros entra desde la derecha", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa")
    await page.getByRole("link", { name: /^Filtros/ }).click()
    const hoja = page.getByRole("dialog", { name: "Filtros" })
    await expect(hoja).toBeVisible()
    const caja = await hoja.boundingBox()
    const ancho = page.viewportSize()!.width
    expect(caja!.x + caja!.width).toBeGreaterThan(ancho - 2)
    expect(caja!.x).toBeGreaterThan(ancho / 2)
  })
})
