"use client"

import Link from "next/link"
import {
  Buildings,
  Calendar,
  CaretRight,
  House,
  Key,
  List as MenuIcono,
  MapTrifold,
  X,
} from "@/components/iconos"
import { Logo } from "@/components/marca/logo"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { SECCIONES, type Seccion } from "@/lib/navegacion"
import { cn } from "@/lib/utils"

const ICONOS: Record<Seccion["id"], React.ReactNode> = {
  comprar: <Key />,
  alquilar: <House />,
  temporario: <Calendar />,
  mapa: <MapTrifold />,
  inmobiliarias: <Buildings />,
}

function Fila({ seccion }: { seccion: Seccion }) {
  return (
    <DrawerClose
      nativeButton={false}
      render={
        <Link
          href={seccion.href}
          className="flex min-h-16 items-center gap-3.5 rounded-tarjeta px-3 text-tinta transition-colors hover:bg-blanco active:bg-blanco"
        />
      }
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-plano-50 text-plano-700 [&_svg]:size-6"
      >
        {ICONOS[seccion.id]}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[1.25rem] leading-tight font-titulo">{seccion.texto}</span>
        <span className="text-sm text-tinta-suave">{seccion.detalle}</span>
      </span>
      <CaretRight className="size-5 shrink-0 text-tinta-suave" aria-hidden="true" />
    </DrawerClose>
  )
}

/**
 * El menú del celu: a pantalla completa, entra desde la derecha. Arriba el logo y la cruz;
 * las secciones como filas grandes con ícono; abajo, lo de la inmobiliaria.
 */
export function Menu() {
  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger
        render={<Button variant="ghost" size="icon" aria-label="Abrir menú" className="rounded-full" />}
      >
        <MenuIcono className="size-7" aria-hidden="true" />
      </DrawerTrigger>
      <DrawerContent className="bg-papel data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:[--drawer-content-width:100%] data-[swipe-axis=x]:sm:[--drawer-content-width:100%] data-[swipe-direction=right]:rounded-none">
        <div className="flex h-(--alto-navbar) shrink-0 items-center justify-between border-b border-linea pr-2 pl-4">
          <DrawerTitle className="inline-flex items-center text-lg">
            <Logo />
            <span className="sr-only">: menú</span>
          </DrawerTitle>
          <DrawerClose
            render={<Button variant="ghost" size="icon" aria-label="Cerrar menú" className="rounded-full" />}
          >
            <X className="size-7" aria-hidden="true" />
          </DrawerClose>
        </div>

        <nav aria-label="Principal" className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
          {SECCIONES.map((s) => (
            <Fila key={s.id} seccion={s} />
          ))}
        </nav>

        <div className="shrink-0 border-t border-linea bg-blanco px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <p className="text-[1.0625rem] font-titulo">¿Sos inmobiliaria?</p>
          <p className="mt-0.5 text-sm text-tinta-suave">Publicá tus propiedades y recibí consultas por WhatsApp.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <DrawerClose
              nativeButton={false}
              render={<Link href="/publicar" className={cn(buttonVariants({ variant: "outline" }))} />}
            >
              Publicar
            </DrawerClose>
            <DrawerClose
              nativeButton={false}
              render={<Link href="/ingresar" className={cn(buttonVariants())} />}
            >
              Ingresar
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
