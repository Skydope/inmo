import { Suspense } from "react"
import { ExploreClient } from "@/components/explore-client"
import { getProperties } from "@/lib/properties/adapter"

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
