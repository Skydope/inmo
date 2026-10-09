import {
  caracteristicasDe,
  etiquetaTipo,
  nombreZona,
  tiposDe,
  type Caracteristica,
  type Operacion,
  type TipoPropiedad,
  type Zona,
} from "@/lib/busqueda/taxonomia"

/** El orden de "Siguiente". Un slug fuera de esta lista no es un paso. */
export const PASOS_DE_AVISO = [
  {
    slug: "operacion",
    titulo: "Qué publicás",
    detalle: "Operación y tipo",
    ayuda: "Una operación y un tipo. Los de Bolívar, nada de un portal nacional.",
  },
  {
    slug: "ubicacion",
    titulo: "Dónde está",
    detalle: "Zona y dirección",
    ayuda: "La zona se publica siempre. La calle, solo si la dejás visible.",
  },
  {
    slug: "medidas",
    titulo: "Las medidas",
    detalle: "Según el tipo",
    ayuda: "Solo lo que corresponde a este tipo.",
  },
  {
    slug: "precio",
    titulo: "El precio",
    detalle: "Monto y expensas",
    ayuda: "Si preferís, se publica como consultar.",
  },
  {
    slug: "caracteristicas",
    titulo: "Qué tiene",
    detalle: "Lo que se filtra",
    ayuda: "Las que quien busca puede filtrar.",
  },
  {
    slug: "fotos",
    titulo: "Fotos y videos",
    detalle: "La portada es la primera",
    ayuda: "Quedan en este navegador. No se suben.",
  },
  {
    slug: "texto",
    titulo: "El texto",
    detalle: "Título y descripción",
    ayuda: "Texto plano. El título se puede editar.",
  },
] as const

export type PasoDeAviso = (typeof PASOS_DE_AVISO)[number]["slug"]

export function pasoDeAviso(slug: string) {
  return PASOS_DE_AVISO.find((paso) => paso.slug === slug) ?? null
}

export function esPasoDeAviso(slug: string): slug is PasoDeAviso {
  return pasoDeAviso(slug) !== null
}

export function indiceDePaso(paso: PasoDeAviso) {
  return PASOS_DE_AVISO.findIndex((item) => item.slug === paso)
}

export type CampoMedida =
  | "ambientes"
  | "dormitorios"
  | "banos"
  | "cocheras"
  | "m2total"
  | "m2cubiertos"
  | "anios"
  | "hectareas"

const VIVIENDA: CampoMedida[] = [
  "ambientes",
  "dormitorios",
  "banos",
  "cocheras",
  "m2total",
  "m2cubiertos",
  "anios",
]
const LOCAL: CampoMedida[] = ["m2total", "m2cubiertos", "banos", "cocheras"]

/** Sin tipo (el paso se abrió directo) se muestran las de una casa. */
export function camposDeMedida(tipo: TipoPropiedad | null): CampoMedida[] {
  if (tipo === "terreno" || tipo === "cochera") return ["m2total"]
  if (tipo === "campo") return ["hectareas"]
  if (tipo === "local" || tipo === "oficina" || tipo === "galpon") return [...LOCAL]
  return [...VIVIENDA]
}

export function esContador(campo: CampoMedida) {
  return (
    campo === "ambientes" ||
    campo === "dormitorios" ||
    campo === "banos" ||
    campo === "cocheras" ||
    campo === "anios"
  )
}

export function etiquetaMedida(campo: CampoMedida) {
  switch (campo) {
    case "ambientes":
      return "Ambientes"
    case "dormitorios":
      return "Dormitorios"
    case "banos":
      return "Baños"
    case "cocheras":
      return "Cocheras"
    case "m2total":
      return "m² total"
    case "m2cubiertos":
      return "m² cubiertos"
    case "anios":
      return "Años"
    case "hectareas":
      return "Hectáreas"
  }
}

export function llevaExpensas(tipo: TipoPropiedad | null) {
  return tipo === "departamento" || tipo === "ph"
}

/** Al cambiar la operación, un tipo que no aplica se suelta. */
export function tipoCompatible(operacion: Operacion, tipo: TipoPropiedad | null) {
  if (!tipo) return null
  return tiposDe(operacion).includes(tipo) ? tipo : null
}

export function caracteristicasCompatibles(operacion: Operacion, elegidas: readonly Caracteristica[]) {
  const aplican = new Set(caracteristicasDe(operacion))
  return elegidas.filter((item) => aplican.has(item))
}

/** "Casa de 3 dormitorios en Centro". Sin tipo, zona o dormitorios, no hay sugerido. */
export function tituloSugerido(input: {
  tipo: TipoPropiedad | null
  zona: Zona | null
  dormitorios: number
}) {
  if (!input.tipo || !input.zona || input.dormitorios <= 0) return null
  const dormitorios = input.dormitorios === 1 ? "dormitorio" : "dormitorios"
  return `${etiquetaTipo(input.tipo)} de ${input.dormitorios} ${dormitorios} en ${nombreZona(input.zona)}`
}

export function mover<T>(lista: readonly T[], indice: number, delta: -1 | 1): T[] {
  const destino = indice + delta
  if (destino < 0 || destino >= lista.length) return [...lista]
  const copia = [...lista]
  const [item] = copia.splice(indice, 1)
  copia.splice(destino, 0, item)
  return copia
}
