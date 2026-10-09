import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/marca/logo"
import { brandName } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Aviso publicado",
  description: "En el prototipo el aviso no se guardó.",
}

export default function ListoPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-papel px-4 py-6">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label={`${brandName}, ir al inicio`} className="inline-flex min-h-11 items-center">
          <Logo />
        </Link>
        <Link href="/cuenta?como=vacio" className="inline-flex min-h-11 items-center text-base font-semibold">
          Salir
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
        <h1 className="text-4xl font-titulo">El aviso quedó publicado</h1>
        <p className="mt-3 text-base leading-relaxed text-tinta-suave">En el prototipo no se guardó.</p>
        <div className="mt-8 flex flex-col items-start">
          <Link href="/propiedades/bol-01" className="inline-flex min-h-11 items-center text-base font-semibold">
            Ver en el sitio
          </Link>
          <Link href="/publicar/operacion?nuevo=1" className="inline-flex min-h-11 items-center text-base font-semibold">
            Cargar otro
          </Link>
          <Link href="/cuenta?como=lista" className="inline-flex min-h-11 items-center text-base font-semibold">
            Ir a mis avisos
          </Link>
        </div>
      </main>
    </div>
  )
}
