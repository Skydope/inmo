import { expect, test } from "@playwright/test"
import { PRIMER_PLANO } from "../src/lib/casa"

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

  test("el título es Viví Bolívar y la pregunta es el título del filtro", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Viví\s*Bolívar/i)
    await expect(page.getByRole("heading", { level: 2, name: "¿Qué estás buscando?" })).toBeVisible()
    await expect(page.getByText(/Gobierno de Bolívar/)).toHaveCount(0)
  })
})

test.describe("inicio: la casa de día y de noche", () => {
  const fotoDelHero = (page: import("@playwright/test").Page) =>
    page.locator(".casa-foto img").first().evaluate((img: HTMLImageElement) => img.currentSrc)

  test("de día, la casa de día y el título en tinta", async ({ page }) => {
    await page.goto("/")
    await expect.poll(() => fotoDelHero(page)).toContain("casa-dia")
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("color", "rgb(23, 33, 28)")
  })

  test("con el celular en modo oscuro, la casa de noche y el título blanco", async ({ browser }) => {
    const contexto = await browser.newContext({ colorScheme: "dark" })
    const page = await contexto.newPage()
    await page.goto("/")
    await expect.poll(() => fotoDelHero(page)).toContain("casa-noche")
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("color", "rgb(255, 255, 255)")
    await contexto.close()
  })

  test("baja una sola foto del hero, aunque se use dos veces (el recorte del techo)", async ({ page }) => {
    const pedidas = new Set<string>()
    page.on("response", (r) => {
      if (/casa-(dia|noche)/.test(r.url())) pedidas.add(r.url())
    })
    await page.goto("/")
    await expect(page.locator(".casa-foto img")).toHaveCount(2)
    await page.waitForLoadState("networkidle")
    expect([...pedidas]).toHaveLength(1)
    expect([...pedidas][0]).toContain("casa-dia")
  })

  test("el techo tapa la base de la R y deja la B libre", async ({ page }) => {
    await page.goto("/")
    const tapado = await page.evaluate((puntos) => {
      const techoEn = (x: number) => {
        let techo = 941
        puntos.forEach(([x1, y1], i) => {
          const [x2, y2] = puntos[(i + 1) % puntos.length]
          if (x1 === x2 || x < Math.min(x1, x2) || x > Math.max(x1, x2)) return
          techo = Math.min(techo, y1 + ((x - x1) / (x2 - x1)) * (y2 - y1))
        })
        return techo
      }
      const foto = document.querySelector(".casa-foto")!.getBoundingClientRect()
      const s = foto.height / 941
      const palabra = document.querySelectorAll(".vivi-titulo > span")[1]
      const texto = palabra.firstChild as Text
      const cuerpo = palabra.getBoundingClientRect()
      const letra = (i: number) => {
        const rango = document.createRange()
        rango.setStart(texto, i)
        rango.setEnd(texto, i + 1)
        const caja = rango.getBoundingClientRect()
        const techo = foto.y + techoEn((caja.x + caja.width / 2 - foto.x) / s) * s
        return Math.max(0, (cuerpo.bottom - techo) / cuerpo.height)
      }
      return { b: letra(0), r: letra(texto.length - 1) }
    }, PRIMER_PLANO as [number, number][])
    expect(tapado.r).toBeGreaterThan(0.15)
    expect(tapado.r).toBeLessThan(0.5)
    expect(tapado.b).toBeLessThanOrEqual(0.1)
  })
})

test("a 360×640 Viví Bolívar, la pregunta y las tres opciones entran sin scroll", async ({ page }, info) => {
  test.skip(info.project.name !== "android-chico", "el pliegue se mide en el Android chico")
  await page.goto("/")
  for (const elemento of [
    page.getByRole("heading", { level: 1 }),
    page.getByRole("heading", { name: "¿Qué estás buscando?" }),
    page.getByRole("link", { name: /Ver todas en el mapa/ }),
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

  test("la hoja empieza con la frase, con los números de los datos, y sigue en orden", async ({ page }) => {
    await expect(page.locator(".frase")).toHaveText(
      "En Bolívar, todas las propiedades en un solo lugar. Las publican las inmobiliarias de la ciudad. Hoy hay 36, de 4 inmobiliarias, en 14 zonas."
    )
    const titulos = await page.locator("main h2").allTextContents()
    expect(titulos).toEqual([
      "¿Qué estás buscando?",
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

test("la frase se enciende al bajar sin que ninguna palabra baje de 4,5 de contraste", async ({ page }) => {
  await page.goto("/")
  const peor = async () =>
    page.locator(".frase > span").evaluateAll((spans) => {
      const lum = (rgb: string) => {
        const [r, g, b] = (rgb.match(/\d+/g) ?? []).slice(0, 3).map(Number).map((v) => v / 255)
        const c = [r, g, b].map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
      }
      const papel = lum("rgb(247, 248, 246)")
      return Math.min(...spans.map((s) => (papel + 0.05) / (lum(getComputedStyle(s).color) + 0.05)))
    })
  for (const y of [0, 200, 400, 800]) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(100)
    expect(await peor()).toBeGreaterThanOrEqual(4.5)
  }
})

test("la barra fija aparece cuando la hoja tapa las pestañas", async ({ page }, info) => {
  test.skip(info.project.name !== "android-chico", "se mide en el Android chico")
  await page.goto("/")
  const soporta = await page.evaluate(() => CSS.supports("animation-timeline: scroll()"))
  test.skip(!soporta, "sin animaciones de scroll no hay barra fija (los links están en el pie)")
  const barra = page.locator("header.barra-del-inicio")
  await expect(barra).toBeHidden()
  await page.evaluate(() => window.scrollTo(0, window.innerHeight))
  await expect(barra).toBeVisible()
  await expect(barra.getByRole("link", { name: "Bolívar Inmo, ir al inicio" })).toBeInViewport()
})
