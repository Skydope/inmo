import Link from "next/link"
import { Calendar, CaretRight, House, Key, MapTrifold } from "@/components/iconos"
import { buttonVariants } from "@/components/ui/button"
import { BUSQUEDA_VACIA, rutaDePaso, type Operacion } from "@/lib/busqueda"
import { cn } from "@/lib/utils"

const ruta = (operacion: Operacion) => rutaDePaso("tipo", { ...BUSQUEDA_VACIA, operacion })

function Opcion({
  operacion,
  titulo,
  detalle,
  icono,
  conteo,
}: {
  operacion: Operacion
  titulo: string
  /** Lo que va después del número: "en venta". Sin detalle, solo el número. */
  detalle?: string
  icono: React.ReactNode
  conteo: number
}) {
  // El número va con "propiedades" para quien usa lector de pantalla ("22 propiedades en
  // venta"); a la vista, "22 en venta".
  const contenido = (
    <>
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-plano-50 text-plano-700 [&_svg]:size-[22px]"
      >
        {icono}
      </span>
      <span className="min-w-0 flex-1 truncate text-[1.125rem] leading-tight font-titulo">{titulo}</span>
      <span className="flex shrink-0 items-center gap-1 text-sm whitespace-nowrap text-tinta-suave tabular-nums">
        <span className="font-semibold text-tinta">{conteo}</span>
        <span className="sr-only"> {conteo === 1 ? "propiedad" : "propiedades"}</span>
        {detalle ? ` ${detalle}` : null}
        <CaretRight className="size-4 text-plano-700" aria-hidden="true" />
      </span>
    </>
  )
  const clases = "flex min-h-15 items-center gap-3 rounded-control bg-blanco px-2 text-tinta lg:min-h-16 lg:px-3"
  // Sin propiedades no hay a dónde ir: se muestra igual, sin link.
  if (conteo === 0) return <div className={cn(clases, "text-tinta-suave [&_.rounded-full]:bg-papel [&_.rounded-full]:text-tinta-suave")}>{contenido}</div>
  return (
    <Link href={ruta(operacion)} className={cn(clases, "transition-colors hover:bg-plano-50 active:bg-plano-50")}>
      {contenido}
    </Link>
  )
}

/**
 * "¿Qué estás buscando?": el paso 1 del buscador guiado, en la primera pantalla del inicio,
 * como una lista: una fila por operación (link al paso 2 con su conteo) y, debajo de un
 * divisor, "Ver todas en el mapa" como el único botón azul lleno del primer pliegue (Manuel,
 * 2026-10-09: "que la tarjeta impacte, que sea donde va la vista"). Blanca, con borde y la
 * única sombra del inicio. Fondo azul plano con las filas blancas adentro (Manuel pidió color
 * de fondo en la tarjeta el 2026-10-09): el único bloque azul liso de la pantalla. Sin JS.
 */
export function Filtro({ conteo }: { conteo: Record<string, number> }) {
  return (
    <nav
      aria-label="Qué querés hacer"
      className="w-full rounded-tarjeta bg-plano-700 p-3 text-blanco shadow-flota lg:max-w-[52rem] lg:p-5"
    >
      <h2 className="px-1 pt-1 pb-3 text-[1.375rem] leading-tight font-titulo text-blanco lg:px-1 lg:text-2xl">
        ¿Qué estás buscando?
      </h2>
      <ul className="flex flex-col gap-2 lg:grid lg:grid-cols-[1fr_1fr_1.15fr]">
        <li>
          <Opcion operacion="venta" titulo="Comprar" detalle="en venta" icono={<Key />} conteo={conteo.venta ?? 0} />
        </li>
        <li>
          <Opcion
            operacion="alquiler"
            titulo="Alquilar"
            detalle="en alquiler"
            icono={<House />}
            conteo={conteo.alquiler ?? 0}
          />
        </li>
        <li>
          <Opcion
            operacion="temporario"
            titulo="Alquiler temporario"
            icono={<Calendar />}
            conteo={conteo.temporario ?? 0}
          />
        </li>
      </ul>
      <div className="mt-2 lg:mt-3">
        <Link
          href="/propiedades?vista=mapa"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-between px-3 text-blanco hover:bg-plano-800 active:bg-plano-800 lg:w-auto lg:min-w-72"
          )}
        >
          <span className="flex items-center gap-2.5">
            <MapTrifold className="size-5" aria-hidden="true" />
            Ver todas en el mapa
          </span>
          <CaretRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </nav>
  )
}
