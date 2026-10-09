"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { FotoPropiedad } from "@/components/busqueda/foto-propiedad"
import { CaretLeft, CaretRight, X } from "@/components/iconos"
import { Dialog, DialogPortal, DialogTitle } from "@/components/ui/dialog"
import type { TipoPropiedad } from "@/lib/busqueda/taxonomia"

/** Galería a pantalla completa: flechas, deslizar, pellizcar para ampliar, Esc o ✕ para cerrar. */
export function GaleriaCompleta({
  abierta,
  indice,
  fotos,
  tipo,
  alt,
  onCerrar,
}: {
  abierta: boolean
  indice: number
  fotos: string[]
  tipo: TipoPropiedad
  alt: string
  onCerrar: () => void
}) {
  const tira = useRef<HTMLDivElement>(null)
  const ignorar = useRef(false)
  const [actual, setActual] = useState(indice)
  const [pedido, setPedido] = useState(indice)
  const [ancla, setAncla] = useState(indice)
  if (ancla !== indice) {
    setAncla(indice)
    setActual(indice)
    setPedido(indice)
  }

  useLayoutEffect(() => {
    if (!abierta) return
    let vivo = true
    const colocar = () => {
      if (!vivo) return
      const el = tira.current
      if (!el?.clientWidth) {
        requestAnimationFrame(colocar)
        return
      }
      ignorar.current = true
      el.scrollTo({ left: pedido * el.clientWidth, behavior: "auto" })
      requestAnimationFrame(() => {
        if (vivo) ignorar.current = false
      })
    }
    colocar()
    return () => {
      vivo = false
    }
  }, [abierta, pedido])

  useEffect(() => {
    if (!abierta) return
    function tecla(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      e.preventDefault()
      const delta = e.key === "ArrowRight" ? 1 : -1
      setPedido((i) => {
        const siguiente = Math.min(fotos.length - 1, Math.max(0, i + delta))
        setActual(siguiente)
        return siguiente
      })
    }
    window.addEventListener("keydown", tecla, true)
    return () => window.removeEventListener("keydown", tecla, true)
  }, [abierta, fotos.length])

  function ir(delta: number) {
    setPedido((i) => {
      const siguiente = Math.min(fotos.length - 1, Math.max(0, i + delta))
      setActual(siguiente)
      return siguiente
    })
  }

  function alDesplazar() {
    if (ignorar.current) return
    const el = tira.current
    if (!el?.clientWidth) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    setActual((prev) => (prev === i ? prev : i))
    setPedido((prev) => (prev === i ? prev : i))
  }

  return (
    <Dialog open={abierta} onOpenChange={(abiertaAhora) => { if (!abiertaAhora) onCerrar() }}>
      <DialogPortal>
        <DialogPrimitive.Popup className="fixed inset-0 z-50 flex flex-col bg-tinta text-sobre-noche outline-none">
          <DialogTitle className="sr-only">Fotos de {alt}</DialogTitle>
          <div className="flex h-14 shrink-0 items-center justify-between px-4">
            <span className="text-sm tabular-nums">
              {actual + 1}/{fotos.length}
            </span>
            <DialogPrimitive.Close className="inline-flex size-11 items-center justify-center rounded-control hover:bg-white/10" aria-label="Cerrar">
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>
          <div className="relative min-h-0 flex-1">
            <div
              ref={tira}
              onScroll={alDesplazar}
              className="flex h-full snap-x snap-mandatory overflow-x-auto"
            >
              {fotos.map((src, i) => (
                <div key={`${src}-${i}`} className="flex h-full w-full shrink-0 snap-center items-center justify-center">
                  <FotoPropiedad
                    src={src}
                    tipo={tipo}
                    alt={`${alt}, foto ${i + 1} de ${fotos.length}`}
                    className="max-h-full w-full object-contain [touch-action:pan-x_pinch-zoom]"
                  />
                </div>
              ))}
            </div>
            {fotos.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  disabled={actual === 0}
                  onClick={() => ir(-1)}
                  className="absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-blanco text-tinta disabled:opacity-30"
                >
                  <CaretLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Foto siguiente"
                  disabled={actual === fotos.length - 1}
                  onClick={() => ir(1)}
                  className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-blanco text-tinta disabled:opacity-30"
                >
                  <CaretRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
