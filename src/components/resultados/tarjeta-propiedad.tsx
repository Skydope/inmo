import Image from "next/image"
import Link from "next/link"
import { Bathtub, Bed, CarFront, CaretRight, Ruler } from "@/components/iconos"
import { FotoPropiedad } from "@/components/busqueda/foto-propiedad"
import { EtiquetaOperacion } from "@/components/ui/etiqueta-operacion"
import { etiquetaOperacion, etiquetaTipo, nombreZona } from "@/lib/busqueda"
import { formatPrice } from "@/lib/format"
import type { Tarjeta } from "@/lib/properties/tarjeta"
import { cn } from "@/lib/utils"
import { FotosDeTarjeta } from "./fotos-de-tarjeta"

const queEsYDonde = (t: Tarjeta) => `${etiquetaTipo(t.type)} en ${nombreZona(t.zone)}`

function Precio({ t, className }: { t: Tarjeta; className?: string }) {
  return (
    <p className={cn("leading-none font-titulo tabular-nums", className)}>
      {formatPrice(t.price, t.currency)}
      {t.expenses ? (
        <span className="ml-1.5 align-middle font-sans text-sm font-normal text-tinta-suave [font-stretch:100%]">
          + {formatPrice(t.expenses, "ARS")} exp.
        </span>
      ) : null}
    </p>
  )
}

function Datos({ t, maximo = 4 }: { t: Tarjeta; maximo?: number }) {
  const datos = [
    t.superficie ? { Icono: Ruler, texto: t.superficie, nombre: "Superficie" } : null,
    t.beds ? { Icono: Bed, texto: `${t.beds} dorm.`, nombre: "Dormitorios" } : null,
    t.baths ? { Icono: Bathtub, texto: `${t.baths} ${t.baths === 1 ? "baño" : "baños"}`, nombre: "Baños" } : null,
    t.garages ? { Icono: CarFront, texto: `${t.garages} coch.`, nombre: "Cocheras" } : null,
  ]
    .filter((d) => d !== null)
    .slice(0, maximo)
  if (datos.length === 0) return null
  return (
    <ul className="flex items-center gap-x-3 overflow-hidden text-sm whitespace-nowrap">
      {datos.map(({ Icono, texto, nombre }) => (
        <li key={nombre} className="inline-flex items-center gap-1">
          <Icono className="size-4 text-tinta-suave" aria-hidden="true" />
          {texto}
        </li>
      ))}
    </ul>
  )
}

/** El link a la ficha. `cubre` lo estira sobre toda la tarjeta (las flechas de foto quedan encima). */
function VerDetalles({
  t,
  cubre = true,
  className,
  children,
}: {
  t: Tarjeta
  cubre?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={`/propiedades/${t.id}`}
      className={cn(cubre && "after:absolute after:inset-0 after:content-['']", className)}
    >
      {children}
      <span className="sr-only">
        {" "}
        de {queEsYDonde(t)}, {formatPrice(t.price, t.currency)}
      </span>
    </Link>
  )
}

/**
 * La tarjeta de una propiedad. `grilla`: resultados (foto, precio, nombre, dirección).
 * `chica`: filas de "Recién publicadas" y "Parecidas" (160 px: dos enteras a 360). `destacada`: la
 * fila de Destacadas del inicio (224 px, chip trigo, una línea de datos). `grande` y `flotante`
 * quedan del carrusel anterior.
 */
export function TarjetaPropiedad({
  t,
  variante = "grande",
  prioridad = false,
  diferirFotos = false,
  elegida = false,
  className,
}: {
  t: Tarjeta
  variante?: "grande" | "flotante" | "chica" | "grilla" | "destacada"
  prioridad?: boolean
  /** `grande` en el carrusel: lejos de la que se mira, las fotos se piden después. */
  diferirFotos?: boolean
  /** `flotante`: la foto única ocupa un poco más. */
  elegida?: boolean
  className?: string
}) {
  if (variante === "flotante") {
    return (
      <article
        className={cn(
          "relative flex min-h-40 overflow-hidden rounded-tarjeta border border-linea bg-blanco",
          className
        )}
      >
        <div className={cn("relative shrink-0 self-stretch bg-papel", elegida ? "w-[55%]" : "w-[40%]")}>
          <FotoPropiedad src={t.fotos[0]} tipo={t.type} alt="" className="absolute inset-0 size-full" />
          <EtiquetaOperacion className="pointer-events-none absolute top-2 left-2 z-10">
            {etiquetaOperacion(t.operation)}
          </EtiquetaOperacion>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 p-3">
          <Precio t={t} className="text-xl" />
          <p className="truncate font-semibold">{queEsYDonde(t)}</p>
          {t.direccion ? <p className="truncate text-sm text-tinta-suave">{t.direccion}</p> : null}
          <Datos t={t} maximo={2} />
          <VerDetalles
            t={t}
            cubre={false}
            className="relative z-10 mt-auto inline-flex min-h-11 items-center justify-center gap-1 rounded-control bg-plano-700 px-3 text-sm font-semibold text-blanco"
          >
            Ver detalles <CaretRight className="size-4" aria-hidden="true" />
          </VerDetalles>
        </div>
      </article>
    )
  }

  if (variante === "grilla") {
    return (
      <article className={cn("relative flex flex-col overflow-hidden rounded-tarjeta border border-linea bg-blanco", className)}>
        <FotosDeTarjeta
          fotos={t.fotos}
          alt={queEsYDonde(t)}
          tipo={t.type}
          sizes="(min-width: 1024px) 18rem, 100vw"
          prioridad={prioridad}
          className="aspect-[4/3] w-full"
        />
        <EtiquetaOperacion className="pointer-events-none absolute top-2 left-2 z-10">
          {etiquetaOperacion(t.operation)}
        </EtiquetaOperacion>
        <div className="flex flex-col gap-1 p-3">
          <Precio t={t} className="text-lg" />
          <VerDetalles t={t} className="line-clamp-2 font-semibold">
            {queEsYDonde(t)}
          </VerDetalles>
          {t.direccion ? <p className="truncate text-sm text-tinta-suave">{t.direccion}</p> : null}
          <Datos t={t} />
        </div>
      </article>
    )
  }

  if (variante === "chica") {
    return (
      <article className={cn("relative flex w-40 shrink-0 flex-col overflow-hidden rounded-control border border-linea bg-blanco", className)}>
        <div className="relative aspect-[4/3] w-full bg-papel">
          {t.fotos[0] ? (
            <Image src={t.fotos[0]} alt="" fill sizes="160px" className="object-cover" />
          ) : (
            <FotoPropiedad src={undefined} tipo={t.type} alt="" className="size-full" />
          )}
          <EtiquetaOperacion className="pointer-events-none absolute top-1.5 left-1.5 text-[0.6875rem]">
            {etiquetaOperacion(t.operation)}
          </EtiquetaOperacion>
        </div>
        <div className="flex flex-col gap-0.5 p-2.5">
          <Precio t={t} className="text-[1.0625rem]" />
          <VerDetalles t={t} className="truncate text-sm font-semibold">
            {queEsYDonde(t)}
          </VerDetalles>
        </div>
      </article>
    )
  }

  if (variante === "destacada") {
    return (
      <article className={cn("relative flex w-56 shrink-0 flex-col overflow-hidden rounded-control border border-linea bg-blanco", className)}>
        <div className="relative aspect-[4/3] w-full bg-papel">
          {t.fotos[0] ? (
            <Image src={t.fotos[0]} alt="" fill sizes="224px" className="object-cover" />
          ) : (
            <FotoPropiedad src={undefined} tipo={t.type} alt="" className="size-full" />
          )}
          <div className="pointer-events-none absolute top-2 left-2 flex gap-1.5">
            <span className="rounded-[4px] bg-trigo px-2 py-1 text-xs leading-none font-bold text-noche">Destacada</span>
            <EtiquetaOperacion>{etiquetaOperacion(t.operation)}</EtiquetaOperacion>
          </div>
        </div>
        <div className="flex flex-col gap-1 p-3">
          <Precio t={t} className="text-lg" />
          <VerDetalles t={t} className="truncate font-semibold">
            {queEsYDonde(t)}
          </VerDetalles>
          <Datos t={t} maximo={3} />
        </div>
      </article>
    )
  }

  return (
    <article className={cn("relative flex flex-col overflow-hidden rounded-tarjeta border border-linea bg-blanco", className)}>
      <div className="relative">
        <FotosDeTarjeta
          fotos={t.fotos}
          alt={queEsYDonde(t)}
          tipo={t.type}
          sizes="(min-width: 1280px) 360px, (min-width: 1024px) 420px, (min-width: 640px) 50vw, min(calc(100vw - 3rem), 448px)"
          prioridad={prioridad}
          diferida={diferirFotos}
          className="aspect-[4/3] w-full"
        />
        <div className="pointer-events-none absolute top-3 left-3 z-10 flex gap-1.5">
          <EtiquetaOperacion>{etiquetaOperacion(t.operation)}</EtiquetaOperacion>
          {t.featured ? (
            <span className="rounded-[4px] bg-trigo px-2 py-1 text-xs leading-none font-bold text-tinta">Destacada</span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Precio t={t} className="text-2xl" />
        <p className="font-semibold">{queEsYDonde(t)}</p>
        {t.direccion ? <p className="truncate text-sm text-tinta-suave">{t.direccion}</p> : null}
        <Datos t={t} />
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-linea pt-2">
          <span className="truncate text-sm text-tinta-suave">{t.agencia.nombre}</span>
          <VerDetalles t={t} className="inline-flex min-h-11 shrink-0 items-center gap-1 font-semibold text-plano-700">
            Ver detalles <CaretRight className="size-4" aria-hidden="true" />
          </VerDetalles>
        </div>
      </div>
    </article>
  )
}
