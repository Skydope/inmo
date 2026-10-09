import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { SEED_AGENCIES } from "@/lib/agencies/seed"
import { cn } from "@/lib/utils"
import { ListaDeAvisos } from "./lista"
import { Panel } from "./panel"
import { Registro } from "./registro-cliente"

const norte = SEED_AGENCIES.norte

export function Bienvenida() {
  return <Registro modo="alta" />
}

export function CuentaVacia() {
  return (
    <Panel seccion="avisos" avisosHref="/cuenta?como=vacio" titulo="Avisos" detalle={norte.name} accion={<Cargar />}>
      <div className="mt-8 rounded-tarjeta border border-linea bg-blanco p-6 lg:bg-papel">
        <p className="max-w-[18ch] text-2xl font-titulo">Todavía no publicaste ningún aviso.</p>
      </div>
      <DatosEnElCelu />
    </Panel>
  )
}

export function CuentaLista() {
  return (
    <Panel seccion="avisos" avisosHref="/cuenta?como=lista" titulo="Avisos" detalle={norte.name} accion={<Cargar />}>
      <ListaDeAvisos />
      <DatosEnElCelu />
    </Panel>
  )
}

function Cargar() {
  return (
    <Link href="/publicar/operacion?nuevo=1" className={cn(buttonVariants(), "w-full sm:w-auto")}>
      Cargar aviso
    </Link>
  )
}

function DatosEnElCelu() {
  return (
    <Link
      href="/cuenta/datos"
      className="mt-2 inline-flex min-h-11 items-center text-base font-semibold lg:hidden"
    >
      Datos de la inmobiliaria
    </Link>
  )
}
