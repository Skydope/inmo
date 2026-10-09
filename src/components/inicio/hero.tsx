import Image from "next/image"
import Link from "next/link"
import { CaretRight, MapTrifold as MapIcono } from "@/components/iconos"
import { FOTO_DE_LA_CASA, poligonoEnPorcentaje, techoEn } from "@/lib/casa"
import { Filtro } from "./filtro"
import { Pestanas } from "./pestanas"

// Las dos fotos tienen el mismo encuadre: el polígono del techo sirve de día y de noche.
// En el celu el escenario mide ~2,45 veces el alto de la pantalla (la casa grande, abajo).
const SIZES = "(max-width: 1023px) 245vh, 100vw"
// Columnas de la foto donde se apoya "BOLÍVAR": el centro (celu) y la R, cerca de la punta
// del techo (escritorio).
const CENTRO = 836
const ANCLA = 1330

/** Día y noche a la vez: el botón cambia la clase `dark` y la foto de noche aparece encima. */
function Casa({ recorte = false }: { recorte?: boolean }) {
  const medida = {
    alt: "",
    width: FOTO_DE_LA_CASA.ancho,
    height: FOTO_DE_LA_CASA.alto,
    sizes: SIZES,
    quality: 55,
  }
  return (
    <span
      className="casa-foto"
      style={recorte ? { clipPath: `polygon(${poligonoEnPorcentaje()})` } : undefined}
    >
      <Image {...medida} src="/images/inicio/casa-dia.webp" priority className="h-full w-full" />
      <Image {...medida} src="/images/inicio/casa-noche.webp" className="casa-noche h-full w-full" />
    </span>
  )
}

/**
 * El hero del inicio: VIVÍ BOLÍVAR detrás del techo de la casa, las pestañas arriba y el
 * filtro "¿Qué estás buscando?" abajo, todo en la primera pantalla. Sin JS (salvo el menú).
 * Spec: docs/hitos/hito-1/vivi-bolivar.md.
 */
export function Hero({ conteo }: { conteo: Record<string, number> }) {
  return (
    <section aria-labelledby="vivi-titulo" className="vivi-hero">
      <div className="vivi-marco">
        <div
          className="casa"
          style={
            {
              "--techo-centro": techoEn(CENTRO),
              "--techo-ancla": techoEn(ANCLA),
              "--ancla-x": ANCLA,
            } as React.CSSProperties
          }
        >
          <Casa />
          <h1 id="vivi-titulo" className="vivi-titulo font-display">
            <span className="vivi">Viví</span> <span className="bolivar">Bolívar</span>
          </h1>
          <Casa recorte />
        </div>

        <Pestanas />

        <div className="relative z-10 mt-auto flex flex-col items-center gap-2 px-2 pb-3 lg:items-start lg:px-8 lg:pb-8">
          <Link
            href="/propiedades?vista=mapa"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-blanco/95 px-4 font-semibold text-tinta shadow-[0_2px_8px_rgb(0_0_0/0.15)] transition-colors hover:bg-blanco"
          >
            <MapIcono className="size-5" aria-hidden="true" />
            Ver todas en el mapa
            <CaretRight className="size-4" aria-hidden="true" />
          </Link>
          <Filtro conteo={conteo} />
        </div>
      </div>
    </section>
  )
}
