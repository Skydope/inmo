import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** La invitación a las inmobiliarias. Cuando haya WhatsApp del portal, suma "Escribinos". */
export function SosInmobiliaria() {
  return (
    <section aria-labelledby="sos-inmobiliaria" className="border-t border-linea bg-plano-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-lg">
          <h2 id="sos-inmobiliaria" className="text-2xl leading-tight font-titulo">
            ¿Sos inmobiliaria de Bolívar?
          </h2>
          <p className="mt-2 text-tinta-suave">
            Publicá tus propiedades en Bolívar Inmo y llegá a quien está buscando en la ciudad.
          </p>
        </div>
        <Link href="/ingresar" className={cn(buttonVariants({ size: "lg" }), "w-full md:w-auto")}>
          Ingresar
        </Link>
      </div>
    </section>
  )
}
