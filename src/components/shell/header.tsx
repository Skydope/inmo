import Link from "next/link"
import { Logo } from "@/components/marca/logo"
import { Menu } from "@/components/shell/menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

/**
 * El header de las pantallas (salvo los pasos del buscador, que llevan su barra). `fija`: la
 * barra del inicio, que aparece con el scroll cuando la hoja tapa las pestañas (globals.css).
 */
export function Header({ fija = false }: { fija?: boolean }) {
  return (
    <header className={cn(fija ? "barra-del-inicio" : "sticky top-0", "z-40 border-b border-linea bg-blanco")}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between pr-2 pl-4">
        <Link
          href="/"
          aria-label="Bolívar Inmo, ir al inicio"
          className="inline-flex min-h-11 items-center rounded-control text-lg"
        >
          <Logo />
        </Link>
        <span className="flex items-center">
          <ThemeToggle />
          <Menu />
        </span>
      </div>
    </header>
  )
}
