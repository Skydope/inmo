import { TarjetaPropiedad } from "@/components/resultados/tarjeta-propiedad"
import { aTarjeta } from "@/lib/properties/tarjeta"
import type { Property } from "@/lib/properties/types"

export function Parecidas({ propiedades }: { propiedades: Property[] }) {
  if (propiedades.length === 0) return null
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-titulo text-xl">Parecidas</h2>
      <ul className="flex gap-3 overflow-x-auto pb-1">
        {propiedades.map((propiedad) => (
          <li key={propiedad.id} className="w-60 shrink-0">
            <TarjetaPropiedad t={aTarjeta(propiedad)} variante="chica" />
          </li>
        ))}
      </ul>
    </section>
  )
}
