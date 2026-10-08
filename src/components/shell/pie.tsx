import Link from "next/link"
import { Logo } from "@/components/marca/logo"
import { brandName } from "@/lib/brand"
import {
  BUSQUEDA_VACIA,
  etiquetaTipo,
  hrefDeBusqueda,
  rutaDePaso,
  type Operacion,
  type TipoPropiedad,
} from "@/lib/busqueda"

const buscar = (operacion: Operacion) => rutaDePaso("tipo", { ...BUSQUEDA_VACIA, operacion })
const porTipo = (tipo: TipoPropiedad) => ({
  href: hrefDeBusqueda("/propiedades", { ...BUSQUEDA_VACIA, tipos: [tipo] }),
  texto: etiquetaTipo(tipo, "plural"),
})

// Solo páginas que existen. Sin redes sociales hasta tenerlas.
const COLUMNAS = [
  {
    id: "pie-buscar",
    titulo: "Buscar",
    enlaces: [
      { href: buscar("venta"), texto: "Comprar" },
      { href: buscar("alquiler"), texto: "Alquilar" },
      { href: buscar("temporario"), texto: "Alquiler temporario" },
      { href: "/propiedades?vista=mapa", texto: "Ver en el mapa" },
    ],
  },
  {
    id: "pie-tipos",
    titulo: "Por tipo",
    enlaces: (["casa", "departamento", "terreno", "quinta", "campo"] as const).map(porTipo),
  },
  {
    id: "pie-inmobiliarias",
    titulo: "Inmobiliarias",
    enlaces: [
      { href: "/inmobiliarias", texto: "Ver todas" },
      { href: "/ingresar", texto: "¿Sos inmobiliaria? Ingresar" },
    ],
  },
]

/**
 * El pie de todo el sitio: oscuro (fondo tinta), cierra la página. Texto secundario en
 * `niebla` (7,49 sobre tinta, medido). Spec: docs/hitos/hito-1/inicio-y-pie.md.
 */
export function Pie() {
  return (
    <footer className="mt-auto bg-tinta text-blanco">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 pt-10 pb-8 md:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <Link
            href="/"
            aria-label={`${brandName}, ir al inicio`}
            className="inline-flex min-h-11 w-fit items-center rounded-control text-lg"
          >
            <Logo claro />
          </Link>
          <p className="max-w-xs text-sm text-niebla">
            Las propiedades de las inmobiliarias de Bolívar, en un solo lugar.
          </p>
        </div>
        {COLUMNAS.map((columna) => (
          <nav key={columna.id} aria-labelledby={columna.id} className="flex flex-col">
            <h2 id={columna.id} className="pb-1 text-sm font-semibold tracking-wide text-blanco">
              {columna.titulo}
            </h2>
            <ul>
              {columna.enlaces.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    className="inline-flex min-h-11 items-center text-[0.9375rem] text-niebla transition-colors hover:text-blanco"
                  >
                    {enlace.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-blanco/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-[0.8125rem] text-niebla md:flex-row md:justify-between md:gap-8">
          <p>© 2026 {brandName} · San Carlos de Bolívar, Buenos Aires</p>
          <p className="max-w-md md:text-right">
            Las propiedades las publican las inmobiliarias: precios y datos son responsabilidad de
            cada una.
          </p>
        </div>
      </div>
    </footer>
  )
}
