"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { BOLIVAR_CENTER } from "@/lib/brand"
import type { Caracteristica, Moneda, Operacion, TipoPropiedad, Zona } from "@/lib/busqueda/taxonomia"
import type { CampoMedida } from "@/lib/publicar/pasos"

export type Medio = { id: string; url: string; nombre: string }

export type Borrador = {
  operacion: Operacion | null
  tipo: TipoPropiedad | null
  zona: Zona | null
  direccion: string
  mostrarDireccion: boolean
  lat: number
  lng: number
  ambientes: number
  dormitorios: number
  banos: number
  cocheras: number
  anios: number
  m2total: string
  m2cubiertos: string
  hectareas: string
  moneda: Moneda
  monedaTocada: boolean
  monto: string
  consultar: boolean
  expensas: string
  sinExpensas: boolean
  caracteristicas: Caracteristica[]
  fotos: Medio[]
  videos: Medio[]
  titulo: string
  tituloTocado: boolean
  descripcion: string
}

export function estadoInicial(): Borrador {
  return {
    operacion: null,
    tipo: null,
    zona: null,
    direccion: "",
    mostrarDireccion: true,
    lat: BOLIVAR_CENTER.lat,
    lng: BOLIVAR_CENTER.lng,
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    cocheras: 0,
    anios: 0,
    m2total: "",
    m2cubiertos: "",
    hectareas: "",
    moneda: "USD",
    monedaTocada: false,
    monto: "",
    consultar: false,
    expensas: "",
    sinExpensas: false,
    caracteristicas: [],
    fotos: [],
    videos: [],
    titulo: "",
    tituloTocado: false,
    descripcion: "",
  }
}

type Contador = "ambientes" | "dormitorios" | "banos" | "cocheras" | "anios"
type Superficie = "m2total" | "m2cubiertos" | "hectareas"

export function esCampoContador(campo: CampoMedida): campo is Contador {
  return campo === "ambientes" || campo === "dormitorios" || campo === "banos" || campo === "cocheras" || campo === "anios"
}

export function esCampoSuperficie(campo: CampoMedida): campo is Superficie {
  return campo === "m2total" || campo === "m2cubiertos" || campo === "hectareas"
}

type Api = {
  borrador: Borrador
  patch: (parcial: Partial<Borrador>) => void
  vaciar: () => void
}

const Contexto = createContext<Api | null>(null)

function soltar(borrador: Borrador) {
  for (const medio of [...borrador.fotos, ...borrador.videos]) URL.revokeObjectURL(medio.url)
}

/**
 * ponytail: el borrador vive en este estado, colgado del layout de /publicar.
 * Sobrevive ir y volver entre pasos y se pierde al recargar. Al guardar de verdad, pasa a Supabase.
 */
export function ProveedorDeBorrador({ children }: { children: ReactNode }) {
  const [borrador, setBorrador] = useState(estadoInicial)
  const patch = useCallback((parcial: Partial<Borrador>) => {
    setBorrador((actual) => ({ ...actual, ...parcial }))
  }, [])
  const vaciar = useCallback(() => {
    setBorrador((actual) => {
      soltar(actual)
      return estadoInicial()
    })
  }, [])
  const valor = useMemo(() => ({ borrador, patch, vaciar }), [borrador, patch, vaciar])
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useBorrador() {
  const valor = useContext(Contexto)
  if (!valor) throw new Error("useBorrador fuera de /publicar")
  return valor
}
