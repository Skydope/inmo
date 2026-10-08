import Image from "next/image"
import Link from "next/link"
import { IconoTipo } from "@/components/busqueda/icono-tipo"
import type { Categoria } from "@/lib/inicio"
import { CarruselHorizontal, ItemDeCarrusel } from "./carrusel-horizontal"
import { Seccion } from "./seccion"

/** Accesos de un toque: "Casas en venta · 6", con la foto de la más reciente. */
export function PorTipo({ categorias }: { categorias: Categoria[] }) {
  if (categorias.length === 0) return null
  return (
    <Seccion id="por-tipo" titulo="Buscá por tipo">
      <CarruselHorizontal etiqueta="Tipos de propiedad">
        {categorias.map((c) => (
          <ItemDeCarrusel key={`${c.operacion}-${c.tipo}`} className="w-48 md:w-56">
            <Link
              href={c.href}
              className="group flex w-full flex-col overflow-hidden rounded-tarjeta border border-linea bg-blanco transition-colors hover:border-tinta-suave"
            >
              <div className="relative aspect-[4/3] bg-papel">
                {c.foto ? (
                  <Image src={c.foto} alt="" fill sizes="224px" className="object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-tinta-suave">
                    <IconoTipo tipo={c.tipo} className="size-10" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-0.5 p-3">
                <span className="leading-tight font-semibold">{c.titulo}</span>
                <span className="text-sm text-tinta-suave tabular-nums">
                  {c.cantidad} {c.cantidad === 1 ? "propiedad" : "propiedades"}
                </span>
              </div>
            </Link>
          </ItemDeCarrusel>
        ))}
      </CarruselHorizontal>
    </Seccion>
  )
}
