"use client"

import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Opcion } from "@/components/ui/opcion"
import { escribirMonto, leerMonto, type Moneda, type RangoDePrecio } from "@/lib/busqueda"
import { formatPrice } from "@/lib/format"

// Cambiar el valor de un input por código y avisarle al formulario (y al conteo en vivo).
function escribir(input: HTMLInputElement | null, valor: string) {
  if (!input) return
  input.value = valor
  input.dispatchEvent(new Event("input", { bubbles: true }))
}

function etiquetaDeRango(r: RangoDePrecio, moneda: Moneda) {
  const corto = (n: number) => formatPrice(n, moneda)
  if (r.desde === undefined && r.hasta !== undefined) return `Hasta ${corto(r.hasta)}`
  if (r.hasta === undefined && r.desde !== undefined) return `Más de ${corto(r.desde)}`
  return `${corto(r.desde ?? 0)} a ${corto(r.hasta ?? 0)}`
}

/**
 * Precio en la moneda en que se publica (nunca se convierte). Los rangos sugeridos salen de
 * los datos y solo existen con JavaScript; desde/hasta se escriben con o sin punto de miles.
 */
export function CampoPrecio({
  moneda: monedaInicial,
  desde,
  hasta,
  rangos,
}: {
  moneda: Moneda
  desde?: number
  hasta?: number
  rangos: Record<Moneda, RangoDePrecio[]>
}) {
  const [moneda, setMoneda] = useState(monedaInicial)
  const desdeRef = useRef<HTMLInputElement>(null)
  const hastaRef = useRef<HTMLInputElement>(null)
  const prefijo = moneda === "USD" ? "US$" : "$"

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

      {rangos[moneda].length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {rangos[moneda].map((r) => (
            <button
              key={`${r.desde}-${r.hasta}`}
              type="button"
              onClick={() => {
                escribir(desdeRef.current, escribirMonto(r.desde))
                escribir(hastaRef.current, escribirMonto(r.hasta))
              }}
              className="inline-flex min-h-11 items-center rounded-full border border-linea bg-blanco px-4 text-sm font-semibold hover:border-tinta-suave"
            >
              {etiquetaDeRango(r, moneda)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-tinta-suave">
          Desde {prefijo}
          <Input
            ref={desdeRef}
            name="desde"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Sin mínimo"
            defaultValue={escribirMonto(desde)}
            onBlur={formatear}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-tinta-suave">
          Hasta {prefijo}
          <Input
            ref={hastaRef}
            name="hasta"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Sin máximo"
            defaultValue={escribirMonto(hasta)}
            onBlur={formatear}
          />
        </label>
      </div>
    </div>
  )
}
