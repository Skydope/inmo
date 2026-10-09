import { BUSQUEDA_VACIA, rutaDePaso, type Operacion } from "@/lib/busqueda"

const buscar = (operacion: Operacion) => rutaDePaso("tipo", { ...BUSQUEDA_VACIA, operacion })

/** Las secciones del sitio, en el orden del navbar y del menú. El ícono lo pone quien dibuja. */
export const SECCIONES = [
  { id: "comprar", href: buscar("venta"), texto: "Comprar", detalle: "Casas, departamentos, lotes" },
  { id: "alquilar", href: buscar("alquiler"), texto: "Alquilar", detalle: "Para vivir, todo el año" },
  { id: "temporario", href: buscar("temporario"), texto: "Temporario", detalle: "Por días o semanas" },
  { id: "mapa", href: "/propiedades?vista=mapa", texto: "Mapa", detalle: "Todas las propiedades" },
  { id: "inmobiliarias", href: "/inmobiliarias", texto: "Inmobiliarias", detalle: "Las de Bolívar" },
] as const

export type Seccion = (typeof SECCIONES)[number]
