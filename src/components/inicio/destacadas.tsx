import { TarjetaPropiedad } from "@/components/resultados/tarjeta-propiedad"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { CarruselHorizontal, ItemDeCarrusel } from "./carrusel-horizontal"
import { Seccion } from "./seccion"

/** Las que marcó la inmobiliaria (la sección no va con menos de 3: ver `destacadas`). */
export function Destacadas({ tarjetas }: { tarjetas: Tarjeta[] }) {
  if (tarjetas.length === 0) return null
  return (
    <Seccion id="destacadas" titulo="Destacadas" bajada="Elegidas por las inmobiliarias.">
      <CarruselHorizontal etiqueta="Destacadas">
        {tarjetas.map((t) => (
          <ItemDeCarrusel key={t.id}>
            <TarjetaPropiedad t={t} variante="destacada" />
          </ItemDeCarrusel>
        ))}
      </CarruselHorizontal>
    </Seccion>
  )
}
