"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const MapaChico = dynamic(
  () => import("@/components/map/mapa-chico").then((m) => m.MapaChico),
  { ssr: false }
)

export function Ubicacion({
  id,
  lat,
  lng,
  mostrarDireccion,
}: {
  id: string
  lat: number
  lng: number
  mostrarDireccion: boolean
}) {
  const seccion = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = seccion.current
    if (!el) return
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada?.isIntersecting) setVisible(true)
    })
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  return (
    <section ref={seccion} id="ubicacion" aria-label="Ubicación" className="flex flex-col gap-2">
      <h2 className="font-titulo text-xl">Ubicación</h2>
      <div className="h-48 overflow-hidden rounded-tarjeta bg-papel">
        {visible ? <MapaChico lat={lat} lng={lng} pin={mostrarDireccion} /> : null}
      </div>
      <p className="text-xs text-tinta-suave">
        <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer" className="hover:text-tinta">
          Mapa © OpenFreeMap
        </a>
      </p>
      <div className="flex flex-wrap gap-x-4">
        {mostrarDireccion ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-semibold"
          >
            Cómo llegar
          </a>
        ) : (
          <p className="inline-flex min-h-11 items-center text-sm text-tinta-suave">Ubicación aproximada</p>
        )}
        {mostrarDireccion ? (
          <a
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-semibold"
          >
            Vista de calle
          </a>
        ) : null}
        <Link href={`/propiedades?vista=mapa&sel=${id}`} className="inline-flex min-h-11 items-center font-semibold">
          Ver en el mapa
        </Link>
      </div>
    </section>
  )
}
