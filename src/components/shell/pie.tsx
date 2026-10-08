import Link from "next/link"
import { Logo } from "@/components/marca/logo"
import { brandName } from "@/lib/brand"
import { cn } from "@/lib/utils"
import { PlanoDeBolivar } from "./plano-de-bolivar"
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
export function Pie({ inicio = false }: { inicio?: boolean }) {
  return (
    <footer className="mt-auto bg-tinta text-blanco">
      {/* Solo en el inicio: la invitación, en la voz del inicio. */}
      {inicio ? (
        <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-16">
          <p className="max-w-2xl font-voz text-[2rem] leading-[1.1] text-balance md:text-5xl">
            ¿Buscás casa en Bolívar? Empezá por acá.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={buscar("venta")}
              className="inline-flex min-h-11 items-center rounded-full bg-blanco px-5 font-semibold text-tinta transition-colors hover:bg-papel"
            >
              Quiero comprar
            </Link>
            <Link
              href={buscar("alquiler")}
              className="inline-flex min-h-11 items-center rounded-full border border-blanco/40 px-5 font-semibold text-blanco transition-colors hover:border-blanco"
            >
              Quiero alquilar
            </Link>
          </div>
        </div>
      ) : null}
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
                    className="inline-flex min-h-11 items-center text-niebla transition-colors hover:text-blanco"
                  >
                    {enlace.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      {/* El cierre: VIVÍ BOLÍVAR en todas las páginas; en el inicio, sobre el plano de la ciudad. */}
      <div className={cn("relative overflow-hidden", inicio ? "pt-40 md:pt-56" : "pt-4")}>
        {inicio ? <PlanoDeBolivar className="absolute inset-0" /> : null}
        <p
          aria-hidden="true"
          className="relative mx-auto max-w-6xl px-4 pb-6 font-display text-[clamp(3.25rem,calc((100vw-2rem)/5.1),7rem)] leading-[0.82] md:text-[clamp(4rem,calc((100vw-4rem)/8.6),9.5rem)]"
        >
          <span className="block md:inline">Viví </span>
          <span className="block md:inline">Bolívar</span>
        </p>
      </div>
      <div className="border-t border-blanco/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-sm text-niebla md:flex-row md:justify-between md:gap-8">
          <div className="flex flex-col">
            <p>© 2026 {brandName} · San Carlos de Bolívar, Buenos Aires</p>
            {inicio ? (
              <a
                href="https://www.openstreetmap.org/copyright"
                className="inline-flex min-h-11 w-fit items-center underline-offset-4 hover:text-blanco hover:underline"
              >
                Plano: © colaboradores de OpenStreetMap
              </a>
            ) : null}
          </div>
          <p className="max-w-md md:text-right">
            Las propiedades las publican las inmobiliarias: precios y datos son responsabilidad de
            cada una.
          </p>
        </div>
      </div>
    </footer>
  )
}
