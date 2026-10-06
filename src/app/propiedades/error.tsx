"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function PropiedadesError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-3xl text-fg">Algo salió mal</h1>
      <p className="max-w-md text-fg-muted">
        No pudimos cargar las propiedades. Intentá de nuevo en unos segundos.
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={reset} className={buttonVariants()}>
          Reintentar
        </button>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}
