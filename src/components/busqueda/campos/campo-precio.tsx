"use client"

import { useRef, useState } from "react"
import { Opcion } from "@/components/ui/opcion"
import { escribirMonto, indicadorMasCercano, leerMonto, type Moneda } from "@/lib/busqueda"

function poner(input: HTMLInputElement | null, valor: string) {
  if (!input) return
  input.value = valor
}

// Avisarle al formulario recién cuando el rango se suelta: mientras se arrastra, solo se ve.
function escribir(input: HTMLInputElement | null, valor: string) {
  poner(input, valor)
  input?.dispatchEvent(new Event("input", { bubbles: true }))
}

/**
 * Precio en la moneda en que se publica (nunca se convierte). Desde y hasta se ven como
 * texto arriba de la barra; al tocarlos se escriben, con o sin punto de miles.
 */
export function CampoPrecio({
  moneda: monedaInicial,
  desde,
  hasta,
  limites,
}: {
  moneda: Moneda
  desde?: number
  hasta?: number
  limites: Record<Moneda, { min: number; max: number } | null>
}) {
  const [moneda, setMoneda] = useState(monedaInicial)
  const desdeRef = useRef<HTMLInputElement>(null)
  const hastaRef = useRef<HTMLInputElement>(null)
  const prefijo = moneda === "USD" ? "US$" : "$"
  const dominio = limites[moneda]
  const piso = dominio?.min ?? 0
  const techo = dominio?.max ?? 0
  const [minimo, setMinimo] = useState(desde ?? piso)
  const [maximo, setMaximo] = useState(hasta ?? techo)
  const [monedaVista, setMonedaVista] = useState(moneda)
  if (moneda !== monedaVista) {
    setMonedaVista(moneda)
    setMinimo(piso)
    setMaximo(techo)
  }

  const formatear = (e: React.FocusEvent<HTMLInputElement>) => {
    const n = leerMonto(e.currentTarget.value)
    if (n !== undefined) e.currentTarget.value = escribirMonto(n)
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold">Precio</h2>
      <div role="radiogroup" aria-label="Moneda" className="flex gap-2">
        {(["USD", "ARS"] as const).map((m) => (
          <Opcion
            key={m}
            tipo="radio"
            variante="chip"
            name="moneda"
            value={m}
            etiqueta={m === "USD" ? "Dólares" : "Pesos"}
            defaultChecked={moneda === m}
            onChange={() => setMoneda(m)}
          />
        ))}
      </div>

      <div className="flex items-baseline justify-between gap-4 font-titulo text-base text-tinta">
        <label className="flex min-w-0 flex-1 items-baseline gap-1">
          <span className="sr-only">Desde</span>
          <span aria-hidden="true">{prefijo}</span>
          <input
            ref={desdeRef}
            name="desde"
            inputMode="numeric"
            autoComplete="off"
            placeholder={dominio ? escribirMonto(piso) : "Sin mínimo"}
            defaultValue={escribirMonto(desde)}
            onBlur={formatear}
            className="w-full min-w-0 bg-transparent text-tinta outline-none placeholder:text-tinta"
          />
        </label>
        <label className="flex min-w-0 flex-1 items-baseline justify-end gap-1">
          <span className="sr-only">Hasta</span>
          <span aria-hidden="true">{prefijo}</span>
          <input
            ref={hastaRef}
            name="hasta"
            inputMode="numeric"
            autoComplete="off"
            placeholder={dominio ? escribirMonto(techo) : "Sin máximo"}
            defaultValue={escribirMonto(hasta)}
            onBlur={formatear}
            className="w-full min-w-0 bg-transparent text-right text-tinta outline-none placeholder:text-tinta"
          />
        </label>
      </div>

      {dominio ? (
        <Rango
          min={piso}
          max={techo}
          minimo={Math.min(minimo, maximo)}
          maximo={Math.max(minimo, maximo)}
          onChange={(bajo, alto) => {
            setMinimo(bajo)
            setMaximo(alto)
            poner(desdeRef.current, bajo <= piso ? "" : escribirMonto(bajo))
            poner(hastaRef.current, alto >= techo ? "" : escribirMonto(alto))
          }}
          onSoltar={(bajo, alto) => {
            escribir(desdeRef.current, bajo <= piso ? "" : escribirMonto(bajo))
            escribir(hastaRef.current, alto >= techo ? "" : escribirMonto(alto))
          }}
        />
      ) : null}
    </div>
  )
}

function Rango({
  min,
  max,
  minimo,
  maximo,
  onChange,
  onSoltar,
}: {
  min: number
  max: number
  minimo: number
  maximo: number
  onChange: (bajo: number, alto: number) => void
  onSoltar: (bajo: number, alto: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const cual = useRef<"min" | "max" | null>(null)
  const ultimo = useRef({ bajo: minimo, alto: maximo })
  const span = max - min || 1
  const izquierda = ((minimo - min) / span) * 100
  const ancho = ((maximo - minimo) / span) * 100
  const paso = Math.max(1, Math.round(span / 100))

  const alPuntero = (clientX: number, lado: "min" | "max") => {
    const caja = ref.current?.getBoundingClientRect()
    if (!caja || caja.width <= 0) return
    const p = Math.min(1, Math.max(0, (clientX - caja.left) / caja.width))
    const crudo = min + p * (max - min)
    const v =
      p === 0 || p === 1 ? (p === 0 ? min : max) : min + Math.round((crudo - min) / paso) * paso
    const clavado = Math.min(max, Math.max(min, v))
    const bajo = lado === "min" ? Math.min(clavado, maximo) : minimo
    const alto = lado === "max" ? Math.max(clavado, minimo) : maximo
    ultimo.current = { bajo, alto }
    onChange(bajo, alto)
  }

  return (
    <div
      ref={ref}
      className="rango-doble relative h-11"
      onPointerDown={(e) => {
        if (e.button !== 0) return
        const caja = e.currentTarget.getBoundingClientRect()
        const lado = indicadorMasCercano(
          e.clientX - caja.left,
          caja.width,
          min,
          max,
          minimo,
          maximo
        )
        cual.current = lado
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          /* Sin un puntero activo no hay captura; el arrastre real sí la pide. */
        }
        alPuntero(e.clientX, lado)
      }}
      onPointerMove={(e) => {
        if (!cual.current) return
        alPuntero(e.clientX, cual.current)
      }}
      onPointerUp={() => {
        if (!cual.current) return
        cual.current = null
        onSoltar(ultimo.current.bajo, ultimo.current.alto)
      }}
      onPointerCancel={() => {
        cual.current = null
      }}
    >
      <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 rounded-full bg-linea" />
      <div
        className="pointer-events-none absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-plano-700"
        style={{ left: `${izquierda}%`, width: `${ancho}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={minimo}
        aria-label="Precio mínimo"
        onChange={(e) => {
          const bajo = Math.min(Number(e.target.value), maximo)
          onChange(bajo, maximo)
          onSoltar(bajo, maximo)
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={maximo}
        aria-label="Precio máximo"
        onChange={(e) => {
          const alto = Math.max(Number(e.target.value), minimo)
          onChange(minimo, alto)
          onSoltar(minimo, alto)
        }}
      />
    </div>
  )
}
