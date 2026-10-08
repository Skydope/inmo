import { TarjetaPropiedad } from "@/components/resultados/tarjeta-propiedad"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { CarruselHorizontal, ItemDeCarrusel } from "./carrusel-horizontal"
import { Seccion } from "./seccion"

export function RecienPublicadas({ tarjetas }: { tarjetas: Tarjeta[] }) {
  if (tarjetas.length === 0) return null
  return (
    <Seccion id="recien-publicadas" titulo="Recién publicadas" ver={{ href: "/propiedades", texto: "Ver todas" }}>
      <CarruselHorizontal etiqueta="Recién publicadas">
        {tarjetas.map((t) => (
          <ItemDeCarrusel key={t.id}>
            <TarjetaPropiedad t={t} variante="chica" />
          </ItemDeCarrusel>
        ))}
      </CarruselHorizontal>
    </Seccion>
  )
}
