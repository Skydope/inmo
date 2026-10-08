import Image from "next/image"
import Link from "next/link"
import { ChevronRight, House, KeyRound, Map as MapIcono } from "lucide-react"
import { OpcionGrande } from "@/components/busqueda/opcion-grande"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { BUSQUEDA_VACIA, contarPorOpcion, rutaDePaso } from "@/lib/busqueda"
import { getProperties } from "@/lib/properties/adapter"

/**
 * Paso 1 del buscador guiado: "¿Qué estás buscando?". Foto real de Bolívar de fondo
 * (decisión de Manuel, 2026-10-08) y las opciones en una tarjeta blanca encima.
 * Spec: docs/hitos/hito-1/buscador-guiado.md § Paso 1.
 */

// Provisoria hasta la foto aérea de Manuel: reemplazar este archivo alcanza.
const FOTO_DE_FONDO = "/images/inicio/fondo.webp"
const CREDITO_DE_LA_FOTO = "Foto: Gobierno de Bolívar · dominio público"

export default async function HomePage() {
  const conteo = contarPorOpcion(await getProperties(), BUSQUEDA_VACIA, "operacion")
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
            sizes="(orientation: portrait) 150vh, 100vw"
            className="-z-20 object-cover object-[62%_center]"
          />
          {/* Velo para que el título blanco se lea sobre cualquier foto (≥ 4,5). */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-b from-tinta/80 via-tinta/45 to-tinta/15"
          />

          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 pt-8 pb-10 md:pt-16">
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
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-blanco/95 px-4 font-semibold text-tinta shadow-[0_2px_8px_rgb(0_0_0/0.15)] transition-colors hover:bg-blanco"
            >
              <MapIcono className="size-5" aria-hidden="true" />
              Ver todas en el mapa
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <p className="absolute right-2 bottom-2 rounded bg-tinta/85 px-1.5 py-0.5 text-xs text-blanco">
            {CREDITO_DE_LA_FOTO}
          </p>
        </section>

        <section className="mx-auto flex w-full max-w-xl flex-col gap-3 px-4 py-10">
          <h2 className="text-xl font-titulo">Las inmobiliarias de Bolívar</h2>
          <p className="text-tinta-suave">
            Todas las propiedades de este sitio las publican inmobiliarias de la ciudad. Consultás
            directo con ellas.
          </p>
          <Link
            href="/inmobiliarias"
            className="inline-flex min-h-11 w-fit items-center gap-1 font-semibold text-plano-700"
          >
            Ver inmobiliarias <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </main>
      <Pie />
    </>
  )
}
