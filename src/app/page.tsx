import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { buttonVariants } from "@/components/ui/button"

/*
 * ANDAMIO (hito 1, identidad-y-base): el inicio queda mínimo, con el shell nuevo,
 * hasta que `buscador-guiado` lo reemplace por el paso 1 ("¿Qué estás buscando?").
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-10">
        <h1 className="text-[2rem] leading-[1.1] font-titulo">¿Qué estás buscando?</h1>
        <p className="text-tinta-suave">
          Las propiedades de las inmobiliarias de Bolívar. Estamos armando el buscador nuevo.
        </p>
        <Link href="/propiedades" className={buttonVariants({ size: "lg", className: "w-full" })}>
          Ver todas las propiedades
          <ChevronRight aria-hidden="true" />
        </Link>
      </main>
      <Pie />
    </>
  )
}
