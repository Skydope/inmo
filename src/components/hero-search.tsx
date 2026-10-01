"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Building2, Home, LandPlot, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Currency, Operation, PropertyType } from "@/lib/properties/types"

export function HeroSearch() {
  const router = useRouter()
  const [op, setOp] = useState<Operation | "">("")
  const [type, setType] = useState<PropertyType | "">("")
  const [cur, setCur] = useState<Currency | "">("")
  const [beds, setBeds] = useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (op) p.set("op", op)
    if (type) p.set("type", type)
    if (cur) p.set("cur", cur)
    if (beds) p.set("beds", beds)
    const qs = p.toString()
    router.push(qs ? `/propiedades?${qs}` : "/propiedades")
  }

  return (
    <form
      onSubmit={submit}
      className="glass-strong animate-rise-delay grid gap-3 rounded-[1.75rem] p-3 md:grid-cols-[1.1fr_1fr_0.9fr_0.9fr_auto]"
    >
      <label className="flex flex-col gap-1 rounded-2xl px-3 py-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">Operación</span>
        <select
          value={op}
          onChange={(e) => setOp(e.target.value as Operation | "")}
          className="bg-transparent text-sm text-fg outline-none"
        >
          <option value="">Todas</option>
          <option value="sale">Venta</option>
          <option value="rent">Alquiler</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 rounded-2xl px-3 py-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">Tipo</span>
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PropertyType | "")}
            className="w-full appearance-none bg-transparent pr-6 text-sm text-fg outline-none"
          >
            <option value="">Todos</option>
            <option value="house">Casa</option>
            <option value="apartment">Depto</option>
            <option value="lot">Lote</option>
          </select>
          <span className="pointer-events-none absolute right-0 top-0.5 text-accent">
            {type === "apartment" ? (
              <Building2 className="h-4 w-4" />
            ) : type === "lot" ? (
              <LandPlot className="h-4 w-4" />
            ) : (
              <Home className="h-4 w-4" />
            )}
          </span>
        </div>
      </label>

      <label className="flex flex-col gap-1 rounded-2xl px-3 py-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">Moneda</span>
        <select
          value={cur}
          onChange={(e) => setCur(e.target.value as Currency | "")}
          className="bg-transparent text-sm text-fg outline-none"
        >
          <option value="">Todas</option>
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 rounded-2xl px-3 py-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-fg-muted">Ambientes</span>
        <select
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
          className="bg-transparent text-sm text-fg outline-none"
        >
          <option value="">Cualquiera</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </label>

      <div className="flex items-end">
        <Button type="submit" className="w-full md:w-auto" size="lg">
          <Search className="h-4 w-4" aria-hidden />
          Buscar
        </Button>
      </div>
    </form>
  )
}
