/**
 * Qué se puede buscar en Bolívar Inmo. Los slugs son los mismos que van en la URL y en los
 * datos (`operation: "venta"`, `type: "quinta"`). La fuente de la lista y sus reglas está en
 * docs/hitos/hito-1/modelo-de-busqueda.md § Taxonomía.
 *
 * Los íconos van como nombre de lucide (texto): esta carpeta no importa React.
 */

export const OPERACIONES = [
  { slug: "venta", verbo: "Comprar", etiqueta: "Venta", enFrase: "en venta", moneda: "USD" },
  { slug: "alquiler", verbo: "Alquilar", etiqueta: "Alquiler", enFrase: "en alquiler", moneda: "ARS" },
  {
    slug: "temporario",
    verbo: "Alquiler temporario",
    etiqueta: "Temporario",
    enFrase: "en alquiler temporario",
    moneda: "ARS",
  },
] as const

export type Operacion = (typeof OPERACIONES)[number]["slug"]

export const MONEDAS = ["USD", "ARS"] as const
export type Moneda = (typeof MONEDAS)[number]

const TODAS = ["venta", "alquiler", "temporario"] as const
const VENTA_Y_ALQUILER = ["venta", "alquiler"] as const

export const TIPOS = [
  { slug: "casa", singular: "Casa", plural: "Casas", icono: "House", operaciones: TODAS, vivienda: true },
  { slug: "departamento", singular: "Departamento", plural: "Departamentos", icono: "Building2", operaciones: TODAS, vivienda: true },
  { slug: "ph", singular: "PH", plural: "PH", icono: "Building", operaciones: VENTA_Y_ALQUILER, vivienda: true },
  { slug: "quinta", singular: "Casa quinta", plural: "Casas quinta", icono: "Trees", operaciones: TODAS, vivienda: true },
  { slug: "terreno", singular: "Terreno", plural: "Terrenos", icono: "LandPlot", operaciones: ["venta"], vivienda: false },
  { slug: "campo", singular: "Campo", plural: "Campos", icono: "Tractor", operaciones: VENTA_Y_ALQUILER, vivienda: false },
  { slug: "local", singular: "Local comercial", plural: "Locales", icono: "Store", operaciones: VENTA_Y_ALQUILER, vivienda: false },
  { slug: "oficina", singular: "Oficina", plural: "Oficinas", icono: "BriefcaseBusiness", operaciones: VENTA_Y_ALQUILER, vivienda: false },
  { slug: "galpon", singular: "Galpón", plural: "Galpones", icono: "Warehouse", operaciones: VENTA_Y_ALQUILER, vivienda: false },
  { slug: "cochera", singular: "Cochera", plural: "Cocheras", icono: "CarFront", operaciones: VENTA_Y_ALQUILER, vivienda: false },
] as const

export type TipoPropiedad = (typeof TIPOS)[number]["slug"]
export type IconoTipo = (typeof TIPOS)[number]["icono"]

/** Lo más buscado primero, según la operación. */
export const ORDEN_DE_TIPOS: Record<Operacion, readonly TipoPropiedad[]> = {
  venta: ["casa", "departamento", "terreno", "quinta", "campo", "local", "galpon", "ph", "oficina", "cochera"],
  alquiler: ["departamento", "casa", "local", "ph", "oficina", "galpon", "quinta", "campo", "cochera"],
  temporario: ["quinta", "casa", "departamento"],
}

export const GRUPOS_DE_ZONA = [
  { slug: "ciudad", nombre: "Ciudad" },
  { slug: "afueras", nombre: "Afueras" },
  { slug: "localidades", nombre: "Localidades del partido" },
] as const

export type GrupoDeZona = (typeof GRUPOS_DE_ZONA)[number]["slug"]

/** Lista provisional: confirmar con una inmobiliaria local (ver la spec). */
export const ZONAS = [
  { slug: "centro", nombre: "Centro", grupo: "ciudad" },
  { slug: "casariego", nombre: "Barrio Casariego", grupo: "ciudad" },
  { slug: "villa-melitona", nombre: "Villa Melitona", grupo: "ciudad" },
  { slug: "san-jose", nombre: "Barrio San José", grupo: "ciudad" },
  { slug: "colombo", nombre: "Barrio Colombo", grupo: "ciudad" },
  { slug: "las-flores", nombre: "Barrio Las Flores", grupo: "ciudad" },
  { slug: "villa-diamante", nombre: "Villa Diamante", grupo: "ciudad" },
  { slug: "la-ganadera", nombre: "Barrio La Ganadera", grupo: "ciudad" },
  { slug: "los-tilos", nombre: "Barrio Los Tilos", grupo: "ciudad" },
  { slug: "san-juan", nombre: "Barrio San Juan", grupo: "ciudad" },
  { slug: "solidaridad", nombre: "Barrio Solidaridad", grupo: "ciudad" },
  { slug: "quintas", nombre: "Zona de quintas", grupo: "afueras" },
  { slug: "rural", nombre: "Zona rural", grupo: "afueras" },
  { slug: "urdampilleta", nombre: "Urdampilleta", grupo: "localidades" },
  { slug: "pirovano", nombre: "Pirovano", grupo: "localidades" },
  { slug: "hale", nombre: "Hale", grupo: "localidades" },
  { slug: "ibarra", nombre: "Juan F. Ibarra", grupo: "localidades" },
  { slug: "paula", nombre: "Paula", grupo: "localidades" },
] as const

export type Zona = (typeof ZONAS)[number]["slug"]

export const CARACTERISTICAS = [
  { slug: "cochera", etiqueta: "Cochera", operaciones: TODAS },
  { slug: "pileta", etiqueta: "Pileta", operaciones: TODAS },
  { slug: "patio", etiqueta: "Patio o jardín", operaciones: TODAS },
  { slug: "parrilla", etiqueta: "Parrilla", operaciones: TODAS },
  { slug: "apto-credito", etiqueta: "Apto crédito", operaciones: ["venta"] },
  { slug: "a-estrenar", etiqueta: "A estrenar", operaciones: ["venta"] },
  { slug: "mascotas", etiqueta: "Acepta mascotas", operaciones: ["alquiler", "temporario"] },
  { slug: "amoblado", etiqueta: "Amoblado", operaciones: ["alquiler", "temporario"] },
] as const

export type Caracteristica = (typeof CARACTERISTICAS)[number]["slug"]

export const ORDENES = ["recientes", "precio-asc", "precio-desc"] as const
export type Orden = (typeof ORDENES)[number]

export const VISTAS = ["lista", "mapa"] as const
export type Vista = (typeof VISTAS)[number]

const porSlug = <T extends { slug: string }>(lista: readonly T[]) =>
  new Map(lista.map((x) => [x.slug, x] as const))

const OPERACION = porSlug(OPERACIONES)
const TIPO = porSlug(TIPOS)
const ZONA = porSlug(ZONAS)
const CARACTERISTICA = porSlug(CARACTERISTICAS)

export const esOperacion = (x: string): x is Operacion => OPERACION.has(x as Operacion)
export const esTipo = (x: string): x is TipoPropiedad => TIPO.has(x as TipoPropiedad)
export const esZona = (x: string): x is Zona => ZONA.has(x as Zona)
export const esCaracteristica = (x: string): x is Caracteristica =>
  CARACTERISTICA.has(x as Caracteristica)

/** Los tipos de una operación, en el orden de lo más buscado. Sin operación: todos. */
export function tiposDe(operacion: Operacion | undefined): TipoPropiedad[] {
  if (operacion) return [...ORDEN_DE_TIPOS[operacion]]
  return TIPOS.map((t) => t.slug)
}

/** Tiene dormitorios y baños: los filtros de ambientes solo tienen sentido para estos. */
export function esVivienda(tipo: TipoPropiedad): boolean {
  return TIPO.get(tipo)?.vivienda ?? false
}

export function caracteristicasDe(operacion: Operacion | undefined): Caracteristica[] {
  return CARACTERISTICAS.filter(
    (c) => !operacion || (c.operaciones as readonly Operacion[]).includes(operacion)
  ).map((c) => c.slug)
}

export function monedaPorDefecto(operacion: Operacion | undefined): Moneda {
  return operacion ? OPERACION.get(operacion)!.moneda : "USD"
}

export function etiquetaOperacion(operacion: Operacion): string {
  return OPERACION.get(operacion)!.etiqueta
}

export function verboOperacion(operacion: Operacion): string {
  return OPERACION.get(operacion)!.verbo
}

export function operacionEnFrase(operacion: Operacion): string {
  return OPERACION.get(operacion)!.enFrase
}

export function etiquetaTipo(tipo: TipoPropiedad, numero: "singular" | "plural" = "singular"): string {
  const t = TIPO.get(tipo)!
  return numero === "plural" ? t.plural : t.singular
}

export function iconoTipo(tipo: TipoPropiedad): IconoTipo {
  return TIPO.get(tipo)!.icono
}

export function nombreZona(zona: Zona): string {
  return ZONA.get(zona)!.nombre
}

export function zonasDelGrupo(grupo: GrupoDeZona): Zona[] {
  return ZONAS.filter((z) => z.grupo === grupo).map((z) => z.slug)
}

export function etiquetaCaracteristica(caracteristica: Caracteristica): string {
  return CARACTERISTICA.get(caracteristica)!.etiqueta
}
