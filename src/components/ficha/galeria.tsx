"use client"

import { useEffect, useRef, useState } from "react"
import { FotoPropiedad } from "@/components/busqueda/foto-propiedad"
import { ArrowsOut, MapPin, MapTrifold, Path } from "@/components/iconos"
import { EtiquetaOperacion } from "@/components/ui/etiqueta-operacion"
import type { TipoPropiedad } from "@/lib/busqueda/taxonomia"
import { cn } from "@/lib/utils"
import { GaleriaCompleta } from "./galeria-completa"

export function Galeria({
  fotos,
  tipo,
  alt,
  etiqueta,
  lat,
  lng,
  mostrarDireccion,
}: {
  fotos: string[]
  tipo: TipoPropiedad
  alt: string
  etiqueta: string
  lat: number
  lng: number
  mostrarDireccion: boolean
}) {
  const tira = useRef<HTMLDivElement>(null)
  const [actual, setActual] = useState(0)
  const [abierta, setAbierta] = useState<number | null>(null)
  const total = fotos.length
  const varias = total > 1
  const deMas = total - 4

  function alDesplazar() {
    const el = tira.current
    if (!el || el.clientWidth === 0) return
    if (getComputedStyle(el).display === "grid") return
    setActual(Math.round(el.scrollLeft / el.clientWidth))
  }

  // Un scrollTo de afuera puede llegar antes del listener. Al montar se lee la posición real.
  useEffect(() => {
    alDesplazar()
  }, [])

  if (total === 0) {
    return (
      <div className="overflow-hidden rounded-tarjeta">
        <FotoPropiedad src={undefined} tipo={tipo} alt={alt} className="aspect-[4/3] w-full" />
      </div>
    )
  }

  return (
    <section aria-label="Fotos" className="relative">
      <div
        ref={tira}
        data-galeria
        onScroll={alDesplazar}
        className={cn(
          "flex min-w-0 snap-x snap-mandatory overflow-x-auto rounded-tarjeta",
          varias && "lg:grid lg:snap-none lg:gap-2 lg:overflow-visible lg:rounded-none",
          total === 2 && "lg:aspect-[2.2/1] lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:grid-rows-1",
          total >= 3 &&
            "lg:aspect-[2.4/1] lg:grid-cols-[minmax(0,2.4fr)_minmax(0,0.7fr)_minmax(0,1.1fr)] lg:grid-rows-2"
        )}
      >
        {fotos.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={cn(
              "group relative aspect-[4/3] w-full min-w-0 shrink-0 snap-center overflow-hidden bg-papel lg:aspect-auto lg:h-full lg:w-auto lg:shrink lg:rounded-lg",
              claseDeCelda(i, total)
            )}
          >
            <button
              type="button"
              onClick={() => setAbierta(i)}
              aria-label={
                i === 3 && deMas > 0
                  ? `Ver ${deMas} ${deMas === 1 ? "foto más" : "fotos más"}`
                  : `Ver foto ${i + 1} de ${total}`
              }
              className="absolute inset-0"
            >
              <FotoPropiedad
                src={src}
                tipo={tipo}
                alt=""
                className="size-full object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-105"
              />
              {i === 3 && deMas > 0 ? (
                <span className="absolute inset-0 hidden flex-col items-center justify-center bg-noche/55 text-sobre-noche lg:flex">
                  <span className="font-titulo text-2xl">
                    {deMas === 1 ? "1 foto más" : `${deMas} fotos más`}
                  </span>
                </span>
              ) : null}
            </button>
            {i === 0 ? (
              <div className="absolute bottom-3 left-3 z-10 hidden max-w-[calc(100%-1.5rem)] flex-wrap gap-2 lg:flex">
                {mostrarDireccion ? (
                  <>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={pastilla}
                    >
                      <MapPin className="size-4" />
                      Cómo llegar
                    </a>
                    <a
                      href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={pastilla}
                    >
                      <Path className="size-4" />
                      Vista de calle
                    </a>
                  </>
                ) : null}
                <a href="#ubicacion" className={pastilla}>
                  <MapTrifold className="size-4" />
                  Mapa
                </a>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <EtiquetaOperacion className="pointer-events-none absolute top-3 left-3">{etiqueta}</EtiquetaOperacion>
      <div className="absolute right-3 bottom-3 flex items-center gap-2 lg:hidden">
        <span className="rounded-full bg-blanco/90 px-2 py-1 text-sm tabular-nums">
          {actual + 1}/{total}
        </span>
        <button
          type="button"
          onClick={() => setAbierta(actual)}
          aria-label="Pantalla completa"
          className="inline-flex size-11 items-center justify-center rounded-full bg-blanco/90"
        >
          <ArrowsOut className="size-4" />
        </button>
      </div>
      <GaleriaCompleta
        abierta={abierta !== null}
        indice={abierta ?? 0}
        fotos={fotos}
        alt={alt}
        onCerrar={() => setAbierta(null)}
      />
    </section>
  )
}

const pastilla =
  "inline-flex h-9 items-center gap-1.5 rounded-full bg-blanco/95 px-3 text-sm font-semibold text-tinta shadow-sm"

/** Principal ancha, al lado un recorte vertical y dos horizontales. El resto se esconde detrás de “N fotos más”. */
function claseDeCelda(i: number, total: number) {
  if (total >= 4) {
    if (i === 0) return "lg:col-start-1 lg:row-span-2"
    if (i === 1) return "lg:col-start-2 lg:row-span-2"
    if (i === 2) return "lg:col-start-3 lg:row-start-1"
    if (i === 3) return "lg:col-start-3 lg:row-start-2"
    return "lg:hidden"
  }
  if (total === 3) {
    if (i === 0) return "lg:col-start-1 lg:row-span-2"
    if (i === 1) return "lg:col-start-2 lg:row-span-2"
    return "lg:col-start-3 lg:row-span-2"
  }
  return ""
}
