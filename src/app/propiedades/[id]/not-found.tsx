import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function PropiedadNotFound() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-3xl text-fg">Propiedad no encontrada</h1>
      <p className="max-w-md text-fg-muted">
        La propiedad que buscás no existe o fue eliminada.
      </p>
      <Link href="/propiedades" className={buttonVariants()}>
        Ver catálogo
      </Link>
    </div>
  )
}
