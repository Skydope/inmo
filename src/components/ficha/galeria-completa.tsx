"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { CoverImage } from "@/components/cover-image"
import { CaretLeft, CaretRight, X } from "@/components/iconos"
import { Dialog, DialogPortal, DialogTitle } from "@/components/ui/dialog"

/** La foto entra en el monitor: marco oscuro, fondo borroso, flechas y cerrar. */
export function GaleriaCompleta({
  abierta,
  indice,
  fotos,
  alt,
  onCerrar,
}: {
  abierta: boolean
  indice: number
  fotos: string[]
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
        <DialogPrimitive.Popup className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 text-sobre-noche backdrop-blur-md outline-none">
          <DialogTitle className="sr-only">Fotos de {alt}</DialogTitle>
          <span className="absolute top-4 left-4 text-sm tabular-nums">
            {actual + 1}/{fotos.length}
          </span>
          <DialogPrimitive.Close
            className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full bg-blanco text-tinta"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
          <div className="relative h-full w-full">
            <div
              ref={tira}
              onScroll={alDesplazar}
              className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {fotos.map((src, i) => (
                <div key={`${src}-${i}`} className="flex h-full w-full shrink-0 snap-center items-center justify-center p-6">
                  <CoverImage
                    src={src}
                    alt={`${alt}, foto ${i + 1} de ${fotos.length}`}
                    className="max-h-[min(80dvh,100%)] max-w-[min(80vw,100%)] border-[6px] border-black object-contain shadow-[0_16px_48px_rgb(0_0_0/0.45)] [touch-action:pan-x_pinch-zoom]"
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
