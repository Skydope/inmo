import Link from "next/link"
import { Logo } from "@/components/marca/logo"
import { Menu } from "@/components/shell/menu"
import { buttonVariants } from "@/components/ui/button"
import { SECCIONES } from "@/lib/navegacion"
import { cn } from "@/lib/utils"

/**
 * El navbar: uno solo para todo el sitio (salvo los pasos del buscador, que llevan su barra).
 * Fijo arriba, de todo el ancho y siempre igual: en el inicio no cambia al scrollear, la foto
 * queda debajo y la hoja sube por detrás. Mide `--alto-navbar` (globals.css). "Ingresar" es
 * el único botón lleno de la barra: el azul de avanzar, para la inmobiliaria.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 h-(--alto-navbar) border-b border-linea bg-blanco">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-2 pr-2 pl-4 lg:px-6">
        <Link
          href="/"
          aria-label="Bolívar Inmo, ir al inicio"
          className="mr-auto inline-flex min-h-11 items-center rounded-control text-lg"
        >
          <Logo />
        </Link>
        <nav aria-label="Secciones" className="hidden items-center gap-0.5 lg:flex">
          {SECCIONES.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className={cn(buttonVariants({ variant: "ghost" }), "rounded-full px-3.5")}
            >
              {s.texto}
            </Link>
          ))}
        </nav>
        <Link href="/ingresar" className={cn(buttonVariants(), "rounded-full px-4")}>
          Ingresar
        </Link>
        <span className="lg:hidden">
          <Menu />
        </span>
      </div>
    </header>
  )
}
