"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { BedDouble, DollarSign, Home, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PropertyType } from "@/lib/properties/types"

type PriceBand = "" | "usd-80" | "usd-80-150" | "usd-150"

export function HeroSearch() {
  const router = useRouter()
  const [ubicacion, setUbicacion] = useState("bolivar")
  const [price, setPrice] = useState<PriceBand>("")
  const [beds, setBeds] = useState("")
  const [type, setType] = useState<PropertyType | "">("")

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
    // ubicacion is Bolívar-only for v1; kept for UX parity with ref-03
    void ubicacion
    const qs = p.toString()
    router.push(qs ? `/propiedades?${qs}` : "/propiedades")
  }

  return (
    <form
      onSubmit={submit}
      className="glass-strong animate-rise-delay grid gap-2 rounded-[1.75rem] p-2 md:grid-cols-[1.1fr_1fr_1fr_1fr_auto] md:items-stretch md:gap-0 md:divide-x md:divide-white/15"
    >
      <label className="flex items-center gap-3 rounded-2xl px-3 py-2.5 md:rounded-none">
        <MapPin className="h-4 w-4 shrink-0 text-white/70" aria-hidden />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/55">
            Ubicación
          </span>
          <select
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="w-full appearance-none bg-transparent text-sm text-white outline-none"
          >
            <option value="bolivar">Bolívar</option>
            <option value="centro">Centro</option>
            <option value="norte">Zona Norte</option>
          </select>
        </span>
      </label>

      <label className="flex items-center gap-3 rounded-2xl px-3 py-2.5 md:rounded-none">
        <DollarSign className="h-4 w-4 shrink-0 text-white/70" aria-hidden />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/55">
            Precio
          </span>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value as PriceBand)}
            className="w-full appearance-none bg-transparent text-sm text-white outline-none"
          >
            <option value="">Cualquiera</option>
            <option value="usd-80">Hasta US$ 80k</option>
            <option value="usd-80-150">US$ 80k – 150k</option>
            <option value="usd-150">US$ 150k+</option>
          </select>
        </span>
      </label>

      <label className="flex items-center gap-3 rounded-2xl px-3 py-2.5 md:rounded-none">
        <BedDouble className="h-4 w-4 shrink-0 text-white/70" aria-hidden />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/55">
            Ambientes
          </span>
          <select
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="w-full appearance-none bg-transparent text-sm text-white outline-none"
          >
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </span>
      </label>

      <label className="flex items-center gap-3 rounded-2xl px-3 py-2.5 md:rounded-none">
        <Home className="h-4 w-4 shrink-0 text-white/70" aria-hidden />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/55">
            Tipo
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PropertyType | "")}
            className="w-full appearance-none bg-transparent text-sm text-white outline-none"
          >
            <option value="">Todos</option>
            <option value="house">Casa</option>
            <option value="apartment">Depto</option>
            <option value="lot">Lote</option>
          </select>
        </span>
      </label>

      <div className="flex items-center p-1 md:pl-2">
        <Button
          type="submit"
          size="lg"
          className="w-full bg-fg text-bg hover:bg-fg/90 md:w-auto"
        >
          <Search className="h-4 w-4" aria-hidden />
          Buscar
        </Button>
      </div>
    </form>
  )
}
