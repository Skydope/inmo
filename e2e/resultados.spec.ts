import { expect, test } from "@playwright/test"

const URL_VENTA = "/propiedades?operacion=venta"

const tira = (page: import("@playwright/test").Page) => page.getByRole("list", { name: "Propiedades" })

test.describe("resultados: el mapa y la lista", () => {
  test("a 360×640 el mapa es una tarjeta y las propiedades van debajo", async ({ page }, info) => {
    test.skip(info.project.name !== "android-chico", "el pliegue se mide en el Android chico")
    await page.goto(URL_VENTA)
    const mapa = await page.locator(".maplibregl-canvas").boundingBox()
    expect(mapa!.y).toBeGreaterThan(40)
    expect(mapa!.height).toBeLessThan(400)
    const lista = tira(page)
    const primera = lista.locator("[data-id]").nth(0)
    const segunda = lista.locator("[data-id]").nth(1)
    await expect(primera.getByRole("link")).toBeVisible()
    const [a, b] = await Promise.all([primera.boundingBox(), segunda.boundingBox()])
    expect(a!.y).toBeGreaterThan(mapa!.y + mapa!.height - 2)
    expect(b!.y).toBeGreaterThan(a!.y + 8)
    expect(Math.abs(a!.x - b!.x)).toBeLessThan(2)
  })

  test("bajar la lista no elige una propiedad", async ({ page }) => {
    await page.goto(URL_VENTA)
    const lista = tira(page)
    await expect(lista.locator("[data-id]").nth(0).getByRole("link")).toBeVisible()
    await page.locator("[data-resultados]").evaluate((el) => {
      const caja = el.querySelector("[aria-label='Propiedades']")?.parentElement
      const sc = caja && getComputedStyle(caja).overflowY === "auto" ? caja : el
      sc.scrollTop = sc.scrollHeight
    })
    await expect(lista.locator("[data-elegida='true']")).toHaveCount(0)
    await expect(page).not.toHaveURL(/sel=/)
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
  test("ir a la ficha y volver deja la misma tarjeta", async ({ page }, info) => {
    await page.goto(URL_VENTA)
    const lista = tira(page)
    const tercera = lista.locator("[data-id]").nth(2)
    const id = await tercera.getAttribute("data-id")
    if (info.project.name === "escritorio") {
      await tercera.getByRole("link").click()
      await expect(page.locator("[data-tarjeta-mapa]")).toBeVisible()
      await page.locator("[data-tarjeta-mapa]").getByRole("link").click()
    } else {
      await tercera.getByRole("link").click()
    }
    await expect(page).toHaveURL(/\/propiedades\/bol-/)
    await page.goBack()
    await expect(lista.locator("[data-elegida='true']")).toHaveAttribute("data-id", id!)
  })

  test("una URL compartida con sel abre esa pastilla", async ({ page }) => {
    await page.goto(URL_VENTA)
    const id = await tira(page).locator("[data-id]").nth(4).getAttribute("data-id")
    await page.goto(`${URL_VENTA}&sel=${id}`)
    await expect(tira(page).locator("[data-elegida='true']")).toHaveAttribute("data-id", id!)
    await expect(page.locator(`.map-pin[data-id="${id}"]`)).toHaveClass(/is-selected/)
  })

  test("tocar el mapa lo agranda y bajar vuelve a la lista", async ({ page }, info) => {
    test.skip(info.project.name === "escritorio", "en escritorio el mapa ya está al lado de la lista")
    await page.goto(URL_VENTA)
    const canvas = page.locator(".maplibregl-canvas")
    const chico = await canvas.boundingBox()
    expect(chico!.height).toBeLessThan(400)
    await canvas.click({ position: { x: 30, y: chico!.height / 2 } })
    await expect.poll(async () => (await canvas.boundingBox())!.height).toBeGreaterThan(450)
    await page.locator("[data-resultados]").evaluate((el) => {
      el.scrollTop = 120
    })
    await expect.poll(async () => (await canvas.boundingBox())!.height).toBeLessThan(400)
    await expect(tira(page).locator("[data-id]").first()).toBeVisible()
  })

  test("en el celular el mapa y la lista están en la misma página", async ({ page }, info) => {
    test.skip(info.project.name === "escritorio", "en escritorio no hay que elegir vista")
    await page.goto(URL_VENTA)
    await expect(page.locator(".maplibregl-canvas")).toBeVisible()
    await expect(tira(page).locator("[data-id]").first()).toBeAttached()
    await expect(page.getByRole("link", { name: "Lista", exact: true })).toHaveCount(0)
    await expect(page.getByRole("link", { name: "Mapa", exact: true })).toHaveCount(0)
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

  test("cada ajuste se aplica solo y la hoja sigue abierta", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa")
    const hoja = await abrir(page)
    await opcion(hoja, "Departamento").check()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta&tipo=casa,departamento$/)
    await expect(hoja).toBeVisible()

    await opcion(hoja, "Centro").check()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta&tipo=casa,departamento&zona=centro$/)
    await expect(hoja).toBeVisible()
    await hoja.getByRole("button", { name: "Cerrar" }).click()
    await expect(page.getByRole("heading", { name: /^\(\d+\)/ })).toBeVisible()
  })

  test("cerrar deja aplicado lo que se tocó", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa")
    let hoja = await abrir(page)
    await opcion(hoja, "Departamento").check()
    await expect(page).toHaveURL(/tipo=casa,departamento/)
    await hoja.getByRole("button", { name: "Cerrar" }).click()
    await expect(hoja).toBeHidden()

    hoja = await abrir(page)
    await expect(opcion(hoja, "Departamento")).toBeChecked()
  })

  test("Todo Bolívar y Limpiar desmarcan sin cerrar la hoja", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&zona=centro")
    const hoja = await abrir(page)
    await expect(opcion(hoja, "Centro")).toBeChecked()
    await hoja.getByRole("button", { name: /^Todo Bolívar/ }).click()
    await expect(opcion(hoja, "Centro")).not.toBeChecked()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta&tipo=casa$/)

    await hoja.getByRole("button", { name: "Limpiar" }).click()
    await expect(opcion(hoja, "Casa")).not.toBeChecked()
    await expect(opcion(hoja, "Comprar")).toBeChecked()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta$/)
    await expect(hoja).toBeVisible()
  })

  test("cambiar la operación saca lo que no aplica", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&moneda=USD&hasta=100000")
    const hoja = await abrir(page)
    await opcion(hoja, "Alquilar").check()
    await expect(opcion(hoja, "Alquilar")).toBeChecked()
    await expect(hoja.getByLabel(/^Hasta/)).toHaveValue("")
    await expect(opcion(hoja, "Pesos")).toBeChecked()
    await expect(page).toHaveURL(/\/propiedades\?operacion=alquiler&tipo=casa$/)
  })
})

test.describe("resultados: sin resultados", () => {
  test("ofrece qué sacar y tocar una sugerencia lleva a resultados", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&zona=centro&dorm=4&con=pileta")
    await expect(page.getByText("No hay casas en venta en Centro con esos filtros.")).toBeVisible()
    await expect(page.getByRole("link", { name: "Mapa", exact: true })).toHaveCount(0)
    await expect(page.getByRole("button", { name: "Dibujar" })).toHaveCount(0)
    await page.getByRole("link", { name: /^Pileta/ }).click()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta&tipo=casa&zona=centro&dorm=4$/)
    await expect(page.getByRole("heading", { name: /^\(1\) / })).toBeVisible()
  })

  test("Ver todas vuelve a todas las de la operación", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa&zona=centro&dorm=4&con=pileta")
    await page.getByRole("link", { name: "Ver todas las propiedades en venta" }).click()
    await expect(page).toHaveURL(/\/propiedades\?operacion=venta$/)
    await expect(page.getByRole("heading", { name: /^\(22\) / })).toBeVisible()
  })
})

test.describe("resultados: escritorio", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== "escritorio", "el carrusel horizontal en ancho de escritorio")
  })

  test("la grilla queda a la izquierda y el mapa a la derecha", async ({ page }) => {
    await page.goto(URL_VENTA)
    await expect(page.locator(".maplibregl-canvas")).toBeVisible()
    await expect(page.getByRole("link", { name: "Lista", exact: true })).toHaveCount(0)
    await expect(page.getByRole("link", { name: "Mapa", exact: true })).toHaveCount(0)
    const lista = tira(page)
    const [a, b] = await Promise.all([0, 1].map((i) => lista.locator("[data-id]").nth(i).boundingBox()))
    expect(Math.abs(a!.y - b!.y)).toBeLessThan(8)
    expect(b!.x).toBeGreaterThan(a!.x + a!.width - 2)
    const mapa = await page.locator(".maplibregl-canvas").boundingBox()
    expect(mapa!.x).toBeGreaterThanOrEqual(b!.x + b!.width - 2)
  })

  test("ampliar el mapa tapa la lista y se puede volver", async ({ page }) => {
    await page.goto(URL_VENTA)
    await page.getByRole("button", { name: "Ampliar el mapa" }).click()
    await expect(tira(page)).toBeHidden()
    await page.getByRole("button", { name: "Ver la lista" }).click()
    await expect(tira(page)).toBeVisible()
  })

  test("un pin no corre la lista y una tarjeta abre la pastilla sin mover el mapa", async ({ page }) => {
    await page.goto(URL_VENTA)
    const lista = tira(page)
    const scroller = lista.locator("xpath=..")
    await scroller.evaluate((el) => {
      el.scrollTop = 240
    })
    const id = await page.evaluate(() => {
      for (const el of document.querySelectorAll<HTMLElement>(".map-pin")) {
        const r = el.getBoundingClientRect()
        const encima = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        if (encima && el.contains(encima)) return el.dataset.id
      }
    })
    const pin = page.locator(`.map-pin[data-id="${id}"]`)
    const antes = await pin.boundingBox()
    await pin.click()
    await expect(page.locator("[data-tarjeta-mapa]")).toBeVisible()
    await expect(lista.locator("[data-elegida='true']")).toHaveCount(0)
    expect(await scroller.evaluate((el) => el.scrollTop)).toBe(240)
    const despues = await pin.boundingBox()
    expect(Math.abs(despues!.x - antes!.x)).toBeLessThan(2)
    expect(Math.abs(despues!.y - antes!.y)).toBeLessThan(2)
    await page.locator("[data-tarjeta-mapa]").getByRole("button", { name: "Cerrar" }).click()
    const tarjeta = lista.locator("[data-id]").nth(0)
    const pinAntes = await page.locator(".map-pin").first().boundingBox()
    await tarjeta.getByRole("link").click()
    await expect(page.locator("[data-tarjeta-mapa]")).toBeVisible()
    await expect(page).toHaveURL(/\/propiedades\?/)
    const pinDespues = await page.locator(".map-pin").first().boundingBox()
    expect(Math.abs(pinDespues!.x - pinAntes!.x)).toBeLessThan(2)
    expect(Math.abs(pinDespues!.y - pinAntes!.y)).toBeLessThan(2)
  })

  test("la hoja de filtros entra desde la derecha", async ({ page }) => {
    await page.goto("/propiedades?operacion=venta&tipo=casa")
    await page.getByRole("link", { name: /^Filtros/ }).click()
    const hoja = page.getByRole("dialog", { name: "Filtros" })
    await expect(hoja).toBeVisible()
    const caja = await hoja.boundingBox()
    const vp = page.viewportSize()!
    expect(caja!.x).toBeGreaterThan(vp.width / 2)
    expect(caja!.width).toBeLessThan(vp.width / 2)
    expect(caja!.height).toBeGreaterThan(vp.height * 0.8)
  })
})
