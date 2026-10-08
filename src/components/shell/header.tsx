import Link from "next/link"
import { Logo } from "@/components/marca/logo"
import { Menu } from "@/components/shell/menu"

/** El header de todas las pantallas salvo los pasos del buscador y la ficha. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-blanco">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between pr-2 pl-4">
        <Link
          href="/"
          aria-label="Bolívar Inmo, ir al inicio"
          className="inline-flex min-h-11 items-center rounded-control text-lg"
        >
          <Logo />
        </Link>
        <Menu />
      </div>
    </header>
  )
}
