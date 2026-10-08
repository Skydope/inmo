import Image from "next/image"
import Link from "next/link"
import { ChevronRight, House, KeyRound, Map as MapIcono } from "lucide-react"
import { OpcionGrande } from "@/components/busqueda/opcion-grande"
import { Destacadas } from "@/components/inicio/destacadas"
import { Inmobiliarias } from "@/components/inicio/inmobiliarias"
import { Numeros } from "@/components/inicio/numeros"
import { PorTipo } from "@/components/inicio/por-tipo"
import { PorZona } from "@/components/inicio/por-zona"
import { RecienPublicadas } from "@/components/inicio/recien-publicadas"
import { SosInmobiliaria } from "@/components/inicio/sos-inmobiliaria"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { BUSQUEDA_VACIA, contarPorOpcion, rutaDePaso } from "@/lib/busqueda"
import {
  categoriasDelInicio,
  destacadas,
  inmobiliariasDelInicio,
  numerosDelPortal,
  recientes,
  zonasConPropiedades,
} from "@/lib/inicio"
import { getProperties } from "@/lib/properties/adapter"
import { aTarjeta } from "@/lib/properties/tarjeta"

/**
 * Paso 1 del buscador guiado: "¿Qué estás buscando?". Foto real de Bolívar de fondo
 * (decisión de Manuel, 2026-10-08) y las opciones en una tarjeta blanca encima.
 * Spec: docs/hitos/hito-1/buscador-guiado.md § Paso 1.
 *
 * Debajo, el contenido del portal (todo contado de los datos) y el pie.
 * Spec: docs/hitos/hito-1/inicio-y-pie.md.
 */

// Provisoria hasta la foto aérea de Manuel: reemplazar este archivo alcanza.
const FOTO_DE_FONDO = "/images/inicio/fondo.webp"
const CREDITO_DE_LA_FOTO = "Foto: Gobierno de Bolívar · dominio público"

export default async function HomePage() {
  const propiedades = await getProperties()
  const conteo = contarPorOpcion(propiedades, BUSQUEDA_VACIA, "operacion")
  const numeros = numerosDelPortal(propiedades)
  const ruta = (operacion: "venta" | "alquiler" | "temporario") =>
    rutaDePaso("tipo", { ...BUSQUEDA_VACIA, operacion })

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden">
          <Image
            src={FOTO_DE_FONDO}
            alt=""
            fill
            priority
            quality={55}
            sizes="(orientation: portrait) 130vh, 100vw"
            className="-z-20 object-cover object-[62%_25%]"
          />
          {/* El bloque va abajo, sobre un velo parejo de tinta al 85 % con un fundido corto
              arriba: el texto blanco pasa 4,5 contra cualquier foto (aun contra un píxel
              blanco puro) y la parte de arriba de la foto queda limpia. */}
          <div className="relative mt-auto w-full bg-tinta/85">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-full h-28 bg-linear-to-t from-tinta/85 to-tinta/0"
            />
            <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 pt-4 pb-8 md:pb-14">
              <div className="text-blanco">
                <h1 className="text-[2rem] leading-[1.1] font-titulo md:text-5xl">¿Qué estás buscando?</h1>
                <p className="mt-2 text-base text-blanco/90">Propiedades de las inmobiliarias de Bolívar.</p>
              </div>

              <nav
                aria-label="Qué querés hacer"
                className="overflow-hidden rounded-tarjeta bg-blanco shadow-[0_2px_6px_rgb(0_0_0/0.08),0_16px_40px_rgb(0_0_0/0.18)]"
              >
                <OpcionGrande
                  href={ruta("venta")}
                  titulo="Comprar"
                  ayuda="Casas, terrenos, campos…"
                  icono={<KeyRound />}
                  conteo={conteo.venta}
                />
                <div className="mx-4 border-t border-linea" />
                <OpcionGrande
                  href={ruta("alquiler")}
                  titulo="Alquilar"
                  ayuda="Para vivir o para tu negocio"
                  icono={<House />}
                  conteo={conteo.alquiler}
                />
                <div className="border-t border-linea" />
                <OpcionGrande
                  href={ruta("temporario")}
                  titulo="Alquiler temporario"
                  conteo={conteo.temporario}
                  chica
                />
              </nav>

              <Link
                href="/propiedades?vista=mapa"
                className="inline-flex min-h-11 w-fit items-center gap-2 self-center rounded-full bg-blanco/95 px-4 font-semibold text-tinta shadow-[0_2px_8px_rgb(0_0_0/0.15)] transition-colors hover:bg-blanco"
              >
                <MapIcono className="size-5" aria-hidden="true" />
                Ver todas en el mapa
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <p className="absolute top-2 right-2 rounded bg-tinta/85 px-1.5 py-0.5 text-xs text-blanco">
            {CREDITO_DE_LA_FOTO}
          </p>
        </section>

        {numeros ? <Numeros numeros={numeros} /> : null}
        <RecienPublicadas tarjetas={recientes(propiedades, 8).map(aTarjeta)} />
        <PorTipo categorias={categoriasDelInicio(propiedades)} />
        <Destacadas tarjetas={destacadas(propiedades).map(aTarjeta)} />
        <PorZona zonas={zonasConPropiedades(propiedades)} />
        <Inmobiliarias inmobiliarias={inmobiliariasDelInicio(propiedades)} />
        <SosInmobiliaria />
      </main>
      <Pie />
    </>
  )
}
