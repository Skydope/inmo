import Link from "next/link"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { buttonVariants } from "@/components/ui/button"

export default function PropiedadNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start gap-4 px-4 py-10">
        <h1 className="text-3xl font-titulo">Esta propiedad ya no está publicada.</h1>
        <p className="text-tinta-suave">Puede que se haya vendido o alquilado, o que el link esté mal.</p>
        <Link href="/propiedades" className={buttonVariants({ size: "lg" })}>
          Ver propiedades parecidas
        </Link>
      </main>
      <Pie />
    </>
  )
}
