"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Buildings,
  CurrencyDollar,
  MapPin,
  MagnifyingGlass,
  SquaresFour,
} from "@phosphor-icons/react"
import type { PropertyType } from "@/lib/properties/types"

type PriceBand = "" | "usd-80" | "usd-80-150" | "usd-150"

export function HeroSearch() {
  const router = useRouter()
  const [ubicacion, setUbicacion] = useState("bolivar")
  const [price, setPrice] = useState<PriceBand>("usd-80-150")
  const [beds, setBeds] = useState("3")
  const [type, setType] = useState<PropertyType | "">("house")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (type) p.set("type", type)
    if (beds) p.set("beds", beds)
    if (price === "usd-80") {
      p.set("cur", "USD")
      p.set("max", "80000")
    } else if (price === "usd-80-150") {
      p.set("cur", "USD")
      p.set("min", "80000")
      p.set("max", "150000")
    } else if (price === "usd-150") {
      p.set("cur", "USD")
      p.set("min", "150000")
    }
    // ubicacion is Bolívar-only for v1; kept for UX parity with ref
    void ubicacion
    const qs = p.toString()
    router.push(qs ? `/propiedades?${qs}` : "/propiedades")
  }

  return (
    <form
      onSubmit={submit}
      className="hero-search animate-rise-delay grid gap-1 rounded-[1.75rem] p-1.5 md:grid-cols-[1.1fr_1fr_1fr_1fr_auto] md:items-stretch md:gap-0 md:divide-x md:divide-black/8 md:rounded-full dark:md:divide-white/10"
    >
      <label className="flex items-center gap-3 rounded-full px-4 py-3 md:rounded-none">
        <MapPin weight="fill" className="h-5 w-5 shrink-0 text-fg" aria-hidden />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] text-fg-muted">Ubicación</span>
          <select
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="w-full appearance-none bg-transparent text-sm font-medium text-fg outline-none"
          >
            <option value="bolivar">Bolívar, BA</option>
            <option value="centro">Centro</option>
            <option value="norte">Zona Norte</option>
          </select>
        </span>
      </label>

      <label className="flex items-center gap-3 rounded-full px-4 py-3 md:rounded-none">
        <CurrencyDollar weight="fill" className="h-5 w-5 shrink-0 text-fg" aria-hidden />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] text-fg-muted">Precio</span>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value as PriceBand)}
            className="w-full appearance-none bg-transparent text-sm font-medium text-fg outline-none"
          >
            <option value="">Cualquiera</option>
            <option value="usd-80">Hasta US$ 80k</option>
            <option value="usd-80-150">US$ 80k–150k</option>
            <option value="usd-150">US$ 150k+</option>
          </select>
        </span>
      </label>

      <label className="flex items-center gap-3 rounded-full px-4 py-3 md:rounded-none">
        <SquaresFour weight="fill" className="h-5 w-5 shrink-0 text-fg" aria-hidden />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] text-fg-muted">Ambientes</span>
          <select
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="w-full appearance-none bg-transparent text-sm font-medium text-fg outline-none"
          >
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3–5</option>
            <option value="4">4+</option>
          </select>
        </span>
      </label>

      <label className="flex items-center gap-3 rounded-full px-4 py-3 md:rounded-none">
        <Buildings weight="fill" className="h-5 w-5 shrink-0 text-fg" aria-hidden />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] text-fg-muted">Tipo</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PropertyType | "")}
            className="w-full appearance-none bg-transparent text-sm font-medium text-fg outline-none"
          >
            <option value="">Todos</option>
            <option value="house">Casas</option>
            <option value="apartment">Departamentos</option>
            <option value="lot">Lotes</option>
          </select>
        </span>
      </label>

      <div className="flex items-center p-1 md:pl-2">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 md:w-auto dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          <MagnifyingGlass weight="fill" className="h-4 w-4" aria-hidden />
          Buscar
        </button>
      </div>
    </form>
  )
}
