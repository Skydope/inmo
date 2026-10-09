import Image from "next/image"
import { FOTO_DE_LA_CASA, poligonoEnPorcentaje, techoEn } from "@/lib/casa"
import { Filtro } from "./filtro"

// En el celu el escenario mide ~2,45 veces el alto de la pantalla (la casa grande, abajo).
const SIZES = "(max-width: 1023px) 245vh, 100vw"
// Columnas de la foto donde se apoya "BOLÍVAR": el centro (celu) y la R, cerca de la punta
// del techo (escritorio).
const CENTRO = 836
const ANCLA = 1330

/** La casa de día. La misma foto dos veces: entera y recortada al techo, delante del título. */
function Casa({ recorte = false }: { recorte?: boolean }) {
  const medida = {
    alt: "",
    width: FOTO_DE_LA_CASA.ancho,
    height: FOTO_DE_LA_CASA.alto,
    sizes: SIZES,
    quality: 80,
  }
  return (
    <span
      className="casa-foto"
      style={recorte ? { clipPath: `polygon(${poligonoEnPorcentaje()})` } : undefined}
    >
      <Image {...medida} src="/images/inicio/casa-dia.webp" priority className="h-full w-full" />
    </span>
  )
}

/**
 * El hero del inicio: VIVÍ BOLÍVAR detrás del techo de la casa y, solapada al borde de abajo
 * de la foto, la tarjeta "¿Qué estás buscando?", entera en la primera pantalla. Sin JS.
 * Specs: docs/hitos/hito-1/vivi-bolivar.md (la casa y el título) e inicio-v2.md (la tarjeta).
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

      </div>
      <div className="relative z-10 mx-4 -mt-10 lg:mx-auto lg:-mt-18 lg:max-w-6xl lg:px-6">
        <Filtro conteo={conteo} />
      </div>
    </section>
  )
}
