"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AVISOS_DE_CUENTA, type EstadoDeAviso } from "./avisos"

const PESTANAS: { estado: EstadoDeAviso; etiqueta: string }[] = [
  { estado: "publicado", etiqueta: "Publicados" },
  { estado: "borrador", etiqueta: "Borradores" },
]

export function ListaDeAvisos() {
  const [estado, setEstado] = useState<EstadoDeAviso>("publicado")
  const avisos = AVISOS_DE_CUENTA.filter((aviso) => aviso.estado === estado)

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="Avisos" className="flex gap-2">
        {PESTANAS.map((pestaña) => {
          const cantidad = AVISOS_DE_CUENTA.filter((aviso) => aviso.estado === pestaña.estado).length
          const activa = estado === pestaña.estado
          return (
            <button
              key={pestaña.estado}
              type="button"
              role="tab"
              aria-selected={activa}
              onClick={() => setEstado(pestaña.estado)}
              className={cn(
                "inline-flex min-h-11 items-center rounded-control px-4 text-base font-semibold",
                activa ? "bg-blanco text-tinta lg:bg-papel" : "text-tinta-suave hover:bg-blanco hover:text-tinta lg:hover:bg-papel",
              )}
            >
              {pestaña.etiqueta} {cantidad}
            </button>
          )
        })}
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {avisos.map((aviso) => (
          <li key={aviso.id}>
            <article className="flex gap-4 rounded-tarjeta border border-linea bg-blanco p-3 lg:bg-papel">
              {aviso.foto ? (
                <Image
                  src={aviso.foto}
                  alt=""
                  width={96}
                  height={96}
                  className="size-24 shrink-0 rounded-control object-cover"
                />
              ) : (
                <div className="size-24 shrink-0 rounded-control bg-blanco" />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-lg leading-snug font-titulo">{aviso.titulo}</h2>
                <p className="mt-1 text-sm text-tinta-suave">
                  {aviso.precio} · {aviso.zona}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4">
                  <span className="text-sm text-tinta-suave">
                    {aviso.estado === "publicado" ? "Publicado" : "Borrador"}
                  </span>
                  <Link href="/publicar/operacion?nuevo=1" className="inline-flex min-h-11 items-center text-base font-semibold">
                    Editar
                  </Link>
                  {aviso.estado === "publicado" ? (
                    <a
                      href={`/propiedades/${aviso.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center text-base font-semibold"
                    >
                      Ver
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
