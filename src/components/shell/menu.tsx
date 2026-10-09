"use client"

import Link from "next/link"
import { CaretRight, List as MenuIcono, X } from "@/components/iconos"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const ENLACES = [
  { href: "/", texto: "Buscar propiedades" },
  { href: "/propiedades?vista=mapa", texto: "Ver en el mapa" },
  { href: "/inmobiliarias", texto: "Inmobiliarias" },
] as const

function Fila({ href, texto }: { href: string; texto: string }) {
  return (
    <DrawerClose
      nativeButton={false}
      render={
        <Link
          href={href}
          className="flex min-h-12 items-center justify-between rounded-control px-3 text-[1.0625rem] font-semibold text-tinta hover:bg-papel"
        />
      }
    >
      {texto}
      <CaretRight className="size-5 text-tinta-suave" aria-hidden="true" />
    </DrawerClose>
  )
}

/** El menú entra desde el mismo lado que el botón que lo abre. */
export function Menu({ lado = "derecha" }: { lado?: "izquierda" | "derecha" }) {
  return (
    <Drawer swipeDirection={lado === "izquierda" ? "left" : "right"}>
      <DrawerTrigger
        render={<Button variant="ghost" size="icon" aria-label="Abrir menú" />}
      >
        <MenuIcono className="size-6" aria-hidden="true" />
      </DrawerTrigger>
      <DrawerContent className="bg-blanco">
        <div className="flex h-14 items-center justify-between border-b border-linea px-4">
          <DrawerTitle className="text-lg font-titulo">
            Menú
          </DrawerTitle>
          <DrawerClose render={<Button variant="ghost" size="icon" aria-label="Cerrar menú" />}>
            <X className="size-6" aria-hidden="true" />
          </DrawerClose>
        </div>
        <nav aria-label="Principal" className="flex flex-col gap-1 p-2">
          {ENLACES.map((enlace) => (
            <Fila key={enlace.href} {...enlace} />
          ))}
        </nav>
        <div className="mx-4 border-t border-linea pt-4">
          <p className="px-3 text-sm text-tinta-suave">¿Sos inmobiliaria?</p>
        </div>
        <div className="p-2">
          <Fila href="/ingresar" texto="Ingresar" />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
