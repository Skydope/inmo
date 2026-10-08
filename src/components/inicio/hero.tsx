import Link from "next/link"
import { getImageProps } from "next/image"
import { ChevronRight, Map as MapIcono } from "lucide-react"
import { FOTO_DE_LA_CASA, poligonoEnPorcentaje, techoEn } from "@/lib/casa"
import { Filtro } from "./filtro"
import { Pestanas } from "./pestanas"

// Las dos fotos tienen el mismo encuadre: el polígono del techo sirve de día y de noche.
const DIA = "/images/inicio/casa-dia.webp"
const NOCHE = "/images/inicio/casa-noche.webp"
// En el celu el escenario mide ~2,45 veces el alto de la pantalla (la casa grande, abajo).
const SIZES = "(max-width: 1023px) 245vh, 100vw"
// Columnas de la foto donde se apoya "BOLÍVAR": el centro (celu) y la R, cerca de la punta
// del techo (escritorio).
const CENTRO = 836
const ANCLA = 1330

function fotos() {
  const comun = { alt: "", width: FOTO_DE_LA_CASA.ancho, height: FOTO_DE_LA_CASA.alto, quality: 55, sizes: SIZES }
  const noche = getImageProps({ ...comun, src: NOCHE }).props.srcSet
  const { srcSet: dia, ...img } = getImageProps({
    ...comun,
    src: DIA,
    loading: "eager",
    fetchPriority: "high",
  }).props
  return { dia, noche, img }
}

/**
 * La casa de día o de noche, según el modo del celular: el navegador elige una fuente del
 * `<picture>` y baja solo esa foto. La copia recortada (el techo, encima del título) usa la
 * misma URL y los mismos `srcset`/`sizes`: es el mismo archivo, no una segunda descarga.
 */
function Casa({ recorte = false }: { recorte?: boolean }) {
  const { dia, noche, img } = fotos()
  return (
    <picture
      className="casa-foto"
      style={recorte ? { clipPath: `polygon(${poligonoEnPorcentaje()})` } : undefined}
    >
      <source media="(prefers-color-scheme: dark)" srcSet={noche} sizes={SIZES} />
      {/* <picture> de día y de noche armado con getImageProps (doc de next/image § Art direction). */}
      <img {...img} srcSet={dia} alt="" />
    </picture>
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
            <span className="vivi">Viví</span> <span>Bolívar</span>
          </h1>
          <Casa recorte />
        </div>

        <Pestanas />

        <div className="relative z-10 mt-auto flex flex-col items-center gap-2 px-2 pb-3 lg:items-start lg:px-8 lg:pb-8">
          <Filtro conteo={conteo} />
          <Link
            href="/propiedades?vista=mapa"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-blanco/95 px-4 font-semibold text-tinta shadow-[0_2px_8px_rgb(0_0_0/0.15)] transition-colors hover:bg-blanco lg:hidden"
          >
            <MapIcono className="size-5" aria-hidden="true" />
            Ver todas en el mapa
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
