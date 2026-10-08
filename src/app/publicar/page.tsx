import type { Metadata } from "next"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"

export const metadata: Metadata = {
  title: "Crear aviso",
  description: "Publicá una propiedad en Bolívar.",
}

export default function PublicarPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
        <h1 className="text-4xl font-titulo">Crear aviso</h1>
        <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
          La publicación de avisos todavía no está abierta.
        </p>
      </main>
      <Pie />
    </>
  )
}
