import Link from "next/link"
import { Calendar, CaretRight, House, Key } from "@/components/iconos"
import { BUSQUEDA_VACIA, rutaDePaso, type Operacion } from "@/lib/busqueda"
import { cn } from "@/lib/utils"

const ruta = (operacion: Operacion) => rutaDePaso("tipo", { ...BUSQUEDA_VACIA, operacion })

function Opcion({
  operacion,
  titulo,
  detalle,
  icono,
  conteo,
  ancha = false,
}: {
  operacion: Operacion
  titulo: string
  /** Lo que va después del número: "en venta". */
  detalle?: string
  icono: React.ReactNode
  conteo: number
  /** Alquiler temporario: a lo ancho y más baja en el celu, con el número a la derecha. */
  ancha?: boolean
}) {
  // El número va con "propiedades" para quien usa lector de pantalla ("22 propiedades en
  // venta"); a la vista, "22 en venta".
  const numero = (
    <>
      {conteo}
      <span className="sr-only"> {conteo === 1 ? "propiedad" : "propiedades"}</span>
    </>
  )
  const contenido = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "grid shrink-0 place-items-center rounded-full bg-plano-50 text-plano-700",
          ancha ? "size-9 [&_svg]:size-5" : "size-9 [&_svg]:size-5 lg:size-11 lg:[&_svg]:size-6"
        )}
      >
        {icono}
      </span>
      {ancha ? (
        <>
          <span className="min-w-0 flex-1 truncate text-[1.0625rem] leading-tight font-semibold">{titulo}</span>
          <span className="flex shrink-0 items-center gap-0.5 text-sm text-tinta-suave tabular-nums">
            {numero}
            <CaretRight className="size-4" aria-hidden="true" />
          </span>
        </>
      ) : (
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[1.1875rem] leading-tight font-titulo">{titulo}</span>
          <span className="truncate text-sm text-tinta-suave tabular-nums">
            {numero} {detalle}
          </span>
        </span>
      )}
    </>
  )
  const clases = cn(
    "flex h-full items-center gap-2 rounded-tarjeta border border-linea bg-blanco py-2 pr-2 pl-2 text-tinta",
    ancha ? "min-h-13" : "min-h-[4.5rem]"
  )
  // Sin propiedades no hay a dónde ir: se muestra igual, sin link.
  if (conteo === 0) return <div className={cn(clases, "text-tinta-suave")}>{contenido}</div>
  return (
    <Link
      href={ruta(operacion)}
      className={cn(
        clases,
        "shadow-[0_1px_2px_rgb(0_0_0/0.06)] transition-colors hover:border-plano-700 active:border-plano-700 active:bg-plano-50"
      )}
    >
      {contenido}
    </Link>
  )
}

/**
 * "¿Qué estás buscando?": el paso 1 del buscador guiado, en la primera pantalla del inicio.
 * Cada opción es un link al paso 2 con su conteo; sin JS anda igual.
 */
export function Filtro({ conteo }: { conteo: Record<string, number> }) {
  return (
    <nav
      aria-label="Qué querés hacer"
      className="mx-auto w-full max-w-md rounded-hoja bg-papel p-2.5 shadow-[0_2px_6px_rgb(0_0_0/0.10),0_20px_48px_rgb(0_0_0/0.28)] lg:mx-0 lg:max-w-[46rem] lg:p-3"
    >
      <div className="px-2 pt-1 pb-2 text-center lg:text-left">
        <h2 className="text-[1.5rem] leading-tight font-titulo lg:text-[1.75rem]">¿Qué estás buscando?</h2>
      </div>
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-[1fr_1fr_1.3fr]">
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
        <li className="col-span-2 lg:col-span-1">
          <Opcion
            operacion="temporario"
            titulo="Alquiler temporario"
            icono={<Calendar />}
            conteo={conteo.temporario ?? 0}
            ancha
          />
        </li>
      </ul>
    </nav>
  )
}
