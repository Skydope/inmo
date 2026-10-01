import { Suspense } from "react"
import type { Metadata } from "next"
import { ExploreClient } from "@/components/explore-client"
import { getProperties } from "@/lib/properties/adapter"

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explorá casas, departamentos y lotes en venta y alquiler en San Carlos de Bolívar, con mapa interactivo y filtros vivos.",
}

export default async function PropiedadesPage() {
  const properties = await getProperties()

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-fg-muted">Cargando catálogo…</div>
      }
    >
      <ExploreClient properties={properties} />
    </Suspense>
  )
}
