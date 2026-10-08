import { describe, expect, it } from "vitest"
import {
  BUSQUEDA_VACIA,
  escribirBusqueda,
  hrefDeBusqueda,
  leerBusqueda,
  type Busqueda,
} from "./parametros"

const leer = (qs: string, opciones?: { conVista?: boolean }) =>
  leerBusqueda(new URLSearchParams(qs), opciones)

describe("leerBusqueda", () => {
  it("sin parámetros es la búsqueda vacía", () => {
    expect(leer("")).toEqual(BUSQUEDA_VACIA)
  })

  it("lee una búsqueda completa", () => {
    expect(
      leer("operacion=venta&tipo=casa,quinta&zona=centro&dorm=2&banos=1&moneda=USD&desde=50000&hasta=150000&con=pileta,cochera&orden=precio-asc")
    ).toEqual({
      ...BUSQUEDA_VACIA,
      operacion: "venta",
      tipos: ["casa", "quinta"],
      zonas: ["centro"],
      dorm: 2,
      banos: 1,
      moneda: "USD",
      desde: 50000,
      hasta: 150000,
      con: ["cochera", "pileta"],
      orden: "precio-asc",
    })
  })

  it("regla 1: un valor desconocido se ignora", () => {
    expect(leer("tipo=casa,castillo").tipos).toEqual(["casa"])
    expect(leer("operacion=permuta").operacion).toBeUndefined()
    expect(leer("zona=marte").zonas).toEqual([])
    expect(leer("orden=azar").orden).toBe("recientes")
  })

  it("regla 4: lo que no aplica a la operación se descarta", () => {
    expect(leer("operacion=alquiler&tipo=terreno,casa").tipos).toEqual(["casa"])
    expect(leer("operacion=venta&con=mascotas,pileta").con).toEqual(["pileta"])
    expect(leer("operacion=temporario&tipo=local").tipos).toEqual([])
  })

  it("acepta multivalores repetidos (formularios GET) y con comas", () => {
    expect(leer("tipo=casa&tipo=ph").tipos).toEqual(["casa", "ph"])
    expect(leer("tipo=ph,casa&tipo=casa").tipos).toEqual(["casa", "ph"])
    expect(leer("zona=casariego&zona=centro").zonas).toEqual(["centro", "casariego"])
  })

  it("acepta el objeto de searchParams de Next", () => {
    const b = leerBusqueda({ operacion: "venta", tipo: ["casa", "quinta"], zona: undefined })
    expect(b.operacion).toBe("venta")
    expect(b.tipos).toEqual(["casa", "quinta"])
  })

  it("no se rompe con basura en ningún parámetro", () => {
    const basura = ["", "abc", "-5", "1e9", "45.000", "%%%", "0", "999999999999999999999", "null"]
    for (const valor of basura) {
      for (const clave of ["operacion", "tipo", "zona", "dorm", "banos", "moneda", "desde", "hasta", "con", "orden", "vista", "sel"]) {
        const b = leerBusqueda(new URLSearchParams([[clave, valor]]), { conVista: true })
        expect(b.tipos).toBeInstanceOf(Array)
        expect(["recientes", "precio-asc", "precio-desc"]).toContain(b.orden)
      }
    }
  })

  it("los montos son enteros; aceptan el punto de miles (sin JS el formulario manda lo escrito)", () => {
    expect(leer("desde=45.000").desde).toBe(45000)
    expect(leer("desde=4.5").desde).toBeUndefined()
    expect(leer("desde=-5").desde).toBeUndefined()
    expect(leer("desde=1e9").desde).toBeUndefined()
    expect(leer("dorm=abc").dorm).toBeUndefined()
    expect(leer("dorm=9").dorm).toBeUndefined()
    expect(leer("banos=3").banos).toBe(3)
  })

  it("si desde es mayor que hasta, se invierten", () => {
    const b = leer("operacion=venta&desde=200000&hasta=100000")
    expect([b.desde, b.hasta]).toEqual([100000, 200000])
  })

  it("con precio, la moneda por defecto sale de la operación; sin precio no hay moneda", () => {
    expect(leer("operacion=alquiler&hasta=500000").moneda).toBe("ARS")
    expect(leer("operacion=venta&hasta=150000").moneda).toBe("USD")
    expect(leer("hasta=150000").moneda).toBe("USD")
    expect(leer("operacion=venta&moneda=ARS").moneda).toBeUndefined()
  })

  it("dormitorios y baños se ignoran si ningún tipo elegido es vivienda", () => {
    expect(leer("tipo=terreno&dorm=2").dorm).toBeUndefined()
    expect(leer("tipo=terreno,casa&dorm=2").dorm).toBe(2)
    expect(leer("dorm=2").dorm).toBe(2)
  })

  it("vista y propiedad elegida se leen solo si se piden, y sel se valida", () => {
    expect(leer("vista=mapa&sel=bol-07").vista).toBe("lista")
    expect(leer("vista=mapa&sel=bol-07").sel).toBeUndefined()
    expect(leer("vista=mapa&sel=bol-07", { conVista: true })).toMatchObject({ vista: "mapa", sel: "bol-07" })
    expect(leer("sel=<script>", { conVista: true }).sel).toBeUndefined()
  })
})

describe("escribirBusqueda", () => {
  it("regla 2: forma canónica, sin repetidos, en el orden de la taxonomía y sin valores por defecto", () => {
    const b = leer("tipo=quinta,casa,casa&orden=recientes&vista=lista&operacion=venta")
    expect(escribirBusqueda(b)).toBe("operacion=venta&tipo=casa,quinta")
    expect(escribirBusqueda(BUSQUEDA_VACIA)).toBe("")
  })

  it("las comas no se escapan", () => {
    expect(escribirBusqueda({ ...BUSQUEDA_VACIA, zonas: ["centro", "casariego"] })).toBe("zona=centro,casariego")
  })

  it("regla 3: ida y vuelta", () => {
    const busquedas: Busqueda[] = [
      BUSQUEDA_VACIA,
      { ...BUSQUEDA_VACIA, operacion: "venta", tipos: ["casa", "quinta"], zonas: ["centro"], dorm: 2 },
      { ...BUSQUEDA_VACIA, operacion: "alquiler", moneda: "ARS", hasta: 500000, con: ["mascotas"] },
      { ...BUSQUEDA_VACIA, operacion: "venta", moneda: "USD", desde: 50000, hasta: 120000, orden: "precio-desc", vista: "mapa", sel: "bol-03" },
    ]
    for (const b of busquedas) {
      expect(leerBusqueda(new URLSearchParams(escribirBusqueda(b)), { conVista: true })).toEqual(b)
    }
  })

  it("regla 3: escribir(leer(x)) es idempotente", () => {
    for (const x of ["tipo=ph,casa&tipo=casa&dorm=2", "operacion=alquiler&tipo=terreno&con=apto-credito", "hasta=1&desde=9&zona=x"]) {
      const una = escribirBusqueda(leer(x))
      expect(escribirBusqueda(leer(una))).toBe(una)
    }
  })

  it("arma el href con o sin query", () => {
    expect(hrefDeBusqueda("/propiedades", BUSQUEDA_VACIA)).toBe("/propiedades")
    expect(hrefDeBusqueda("/buscar/tipo", { ...BUSQUEDA_VACIA, operacion: "venta" })).toBe("/buscar/tipo?operacion=venta")
  })
})
