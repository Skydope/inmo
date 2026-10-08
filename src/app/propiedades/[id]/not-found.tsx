import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function PropiedadNotFound() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-titulo">Esta propiedad ya no está publicada</h1>
      <p className="max-w-md text-tinta-suave">
        Puede que se haya vendido o alquilado, o que el link esté mal.
      </p>
      <Link href="/propiedades" className={buttonVariants()}>
        Ver propiedades
      </Link>
    </div>
  )
}
