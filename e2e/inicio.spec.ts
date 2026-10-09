import { expect, test } from "@playwright/test"
import { PRIMER_PLANO } from "../src/lib/casa"

const numero = (texto: string | null) => Number(/(\d+) propiedades?/.exec(texto ?? "")?.[1] ?? NaN)
/** El conteo de resultados va adelante del título: "(22) Propiedades en venta". */
const conteoDelTitulo = (texto: string | null) => Number(/\((\d+)\)/.exec(texto ?? "")?.[1] ?? NaN)

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
    expect(conteoDelTitulo(await page.getByRole("heading", { level: 1 }).textContent())).toBe(enInicio)
  })

  test("el título es Viví Bolívar y la pregunta es el título del filtro", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Viví\s*Bolívar/i)
    await expect(page.getByRole("heading", { level: 2, name: "¿Qué estás buscando?" })).toBeVisible()
    await expect(page.getByText(/Gobierno de Bolívar/)).toHaveCount(0)
  })
})

test.describe("inicio: la casa de día", () => {
  const fotoDelHero = (page: import("@playwright/test").Page) =>
    page.locator(".casa-foto").first().evaluate((el) => {
      const imgs = [...el.querySelectorAll("img")] as HTMLImageElement[]
      const visible = imgs.find((img) => getComputedStyle(img).opacity !== "0") ?? imgs[0]
      return visible?.currentSrc ?? ""
    })

  test("de día, la casa de día y el título en tinta", async ({ page }) => {
    await page.goto("/")
    await expect.poll(() => fotoDelHero(page)).toContain("casa-dia")
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("color", "rgb(26, 26, 26)")
  })

  test("el hero pide solo la foto de día (la de noche ya no existe en el inicio)", async ({ page }) => {
    const pedidas = new Set<string>()
    page.on("response", (r) => {
      if (/casa-(dia|noche)/.test(r.url())) pedidas.add(r.url())
    })
    await page.goto("/")
    await expect(page.locator(".casa-foto img")).toHaveCount(2)
    await page.waitForLoadState("networkidle")
    const urls = [...pedidas]
    expect(urls.some((u) => u.includes("casa-dia"))).toBe(true)
    expect(urls.some((u) => u.includes("casa-noche"))).toBe(false)
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

for (const alto of [640, 780]) {
  test(`a 360×${alto} Viví Bolívar y la tarjeta entera entran sin scroll, y la tarjeta arranca arriba`, async ({ page }, info) => {
    test.skip(info.project.name !== "android-chico", "el pliegue se mide en el Android chico")
    await page.setViewportSize({ width: 360, height: alto })
    await page.goto("/")
    const tarjeta = page.getByRole("navigation", { name: "Qué querés hacer" })
    for (const elemento of [
      page.getByRole("heading", { level: 1 }),
      tarjeta,
      tarjeta.getByRole("heading", { name: "¿Qué estás buscando?" }),
      tarjeta.getByRole("link", { name: /^Comprar/ }),
      tarjeta.getByRole("link", { name: /^Alquilar/ }),
      tarjeta.getByRole("link", { name: /^Alquiler temporario/ }),
      tarjeta.getByRole("link", { name: /Ver todas en el mapa/ }),
    ]) {
      const caja = await elemento.boundingBox()
      expect(caja).not.toBeNull()
      expect(caja!.y + caja!.height).toBeLessThanOrEqual(alto)
    }
    // Antes del 45 % del alto (en la versión anterior arrancaba al 74 %).
    expect((await tarjeta.boundingBox())!.y).toBeLessThan(alto * 0.45)
  })
}

test("el hero se va con el scroll: nada es sticky ni se mueve con el scroll, salvo el plano del pie", async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => window.scrollTo(0, 600))
  await expect(page.getByRole("heading", { level: 1 })).not.toBeInViewport()
  const raros = await page.evaluate(() =>
    [...document.querySelectorAll("main *, header")]
      .map((el) => [el, getComputedStyle(el)] as const)
      .filter(([el, cs]) => {
        const timeline = cs.getPropertyValue("animation-timeline")
        return (cs.position === "sticky" && el.tagName !== "HEADER") || (timeline !== "" && timeline !== "auto" && timeline !== "none")
      })
      .map(([el]) => `${el.tagName.toLowerCase()}.${el.className}`)
  )
  expect(raros).toEqual([])
})

test.describe("inicio: lo que hay debajo de la foto", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("después del hero viene la frase, con los números de los datos, y las secciones en orden", async ({ page }) => {
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
    // La celda del bento dice "Casas en venta, 6 propiedades" en su nombre accesible.
    const texto = (await primera.getAttribute("aria-label"))!
    await expect(primera).toHaveAttribute("href", /^\/propiedades\?operacion=[a-z]+&tipo=[a-z-]+$/)
    await primera.click()
    await expect(page).toHaveURL(/\/propiedades\?operacion=/)
    expect(conteoDelTitulo(await page.getByRole("heading", { level: 1 }).textContent())).toBe(numero(texto))
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
    // El conteo va adelante del título: "(14) Propiedades en Centro".
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/^\(\d+\) Propiedades en Centro$/)
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

test("el navbar es uno solo y no cambia al scrollear", async ({ page }) => {
  await page.goto("/")
  const navbar = page.locator("header").first()
  const logo = navbar.getByRole("link", { name: "Bolívar Inmo, ir al inicio" })
  const ingresar = navbar.getByRole("link", { name: "Ingresar" })
  await expect(logo).toBeInViewport()
  await expect(ingresar).toBeInViewport()
  const antes = await navbar.boundingBox()
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2))
  await expect(logo).toBeInViewport()
  await expect(ingresar).toBeInViewport()
  const despues = await navbar.boundingBox()
  expect(despues).toEqual(antes)
  expect(antes!.y).toBe(0)
  expect(antes!.width).toBe(await page.evaluate(() => document.documentElement.clientWidth))
})
