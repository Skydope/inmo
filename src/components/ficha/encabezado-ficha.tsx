import { nombreZona } from "@/lib/busqueda"
import { formatPrice } from "@/lib/format"
import type { Property } from "@/lib/properties/types"

export function EncabezadoFicha({ propiedad }: { propiedad: Property }) {
  const zona = nombreZona(propiedad.zone)
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[1.875rem] leading-none font-titulo tabular-nums">
        {formatPrice(propiedad.price, propiedad.currency)}
      </p>
      {propiedad.expenses ? (
        <p className="text-tinta-suave">+ {formatPrice(propiedad.expenses, "ARS")} de expensas</p>
      ) : null}
      <h1 className="mt-1 text-xl font-titulo">{propiedad.title}</h1>
      <p className="text-tinta-suave">
        {propiedad.showAddress
          ? `${propiedad.address} · ${zona}`
          : `${zona} · dirección a consultar`}
      </p>
    </div>
  )
}
