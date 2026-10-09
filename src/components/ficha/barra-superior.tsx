"use client"

import { useState } from "react"
import { CaretLeft, ShareNetwork } from "@/components/iconos"
import { CLAVE_VOLVER } from "@/components/shell/marca-de-historial"
export function BarraSuperior({
  volverHref,
  titulo,
  texto,
}: {
  volverHref: string
  titulo: string
  texto: string
}) {
  const [aviso, setAviso] = useState<string | null>(null)

  function volver(e: React.MouseEvent<HTMLAnchorElement>) {
    let desdeElSitio = false
    try {
      desdeElSitio = sessionStorage.getItem(CLAVE_VOLVER) === "1"
    } catch {
      desdeElSitio = false
    }
    if (desdeElSitio && window.history.length > 1) {
      e.preventDefault()
      window.history.back()
    }
  }

  async function compartir() {
    const url = window.location.href
    const data = { title: titulo, text: texto, url }
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(data)
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setAviso("Link copiado")
    } catch {
      setAviso(url)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <a
        href={volverHref}
        onClick={volver}
        className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-tinta-suave hover:text-tinta"
      >
        <CaretLeft className="size-4" aria-hidden="true" /> Volver
      </a>
      <button
        type="button"
        onClick={compartir}
        aria-live="polite"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-tinta-suave hover:text-tinta"
      >
        <ShareNetwork className="size-4" aria-hidden="true" />
        {aviso ?? "Compartir"}
      </button>
    </div>
  )
}
