import type { Metadata } from "next"
import { LandingNav } from "@/components/landing-nav"

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Acceso a tu cuenta.",
}

export default function IngresarPage() {
  return (
    <div className="flex min-h-full flex-col">
      <div className="px-2 pt-2 md:px-3 md:pt-3">
        <div className="px-4 md:px-7">
          <LandingNav />
        </div>
      </div>
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
        <h1 className="font-display text-4xl tracking-tight text-fg">Ingresar</h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          El acceso con cuenta todavía no está abierto.
        </p>
      </main>
    </div>
  )
}
