import Link from "next/link"
import { Logo } from "@/components/marca/logo"
import { Menu } from "@/components/shell/menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { BUSQUEDA_VACIA, rutaDePaso, type Operacion } from "@/lib/busqueda"

const buscar = (operacion: Operacion) => rutaDePaso("tipo", { ...BUSQUEDA_VACIA, operacion })

const ENLACES = [
  { href: buscar("venta"), texto: "Comprar" },
  { href: buscar("alquiler"), texto: "Alquilar" },
  { href: buscar("temporario"), texto: "Temporario" },
  { href: "/propiedades?vista=mapa", texto: "Mapa" },
  { href: "/inmobiliarias", texto: "Inmobiliarias" },
]

const ingresar =
  "inline-flex min-h-11 items-center rounded-full border border-linea bg-blanco px-4 font-semibold text-tinta transition-colors hover:border-tinta-suave"

/**
 * La navegación del inicio: pestañas color papel pegadas al borde de arriba de la foto, con
 * muescas cóncavas a los costados (como la versión de Matías). En el celu, una sola pestaña
 * con el menú, el logo e Ingresar; en escritorio, tres.
 */
export function Pestanas() {
  return (
    <div className="pestanas relative z-10">
      <div className="pestana mx-4 flex h-12 items-center justify-between px-1 lg:hidden">
        <Menu lado="izquierda" />
        <Link href="/" aria-label="Bolívar Inmo, ir al inicio" className="inline-flex min-h-11 items-center text-lg">
          <Logo />
        </Link>
        <span className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/ingresar" className={ingresar}>
            Ingresar
          </Link>
        </span>
      </div>

      <div className="hidden items-start justify-between px-8 lg:flex">
        <Link
          href="/"
          aria-label="Bolívar Inmo, ir al inicio"
          className="pestana inline-flex h-14 items-center px-5 text-lg"
        >
          <Logo />
        </Link>
        <nav
          aria-label="Principal"
          className="pestana absolute top-0 left-1/2 flex h-14 -translate-x-1/2 items-center gap-0.5 px-2"
        >
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="inline-flex min-h-11 items-center rounded-full px-4 font-semibold text-tinta transition-colors hover:bg-blanco"
            >
              {e.texto}
            </Link>
          ))}
        </nav>
        <div className="pestana flex h-14 items-center gap-1 px-2">
          <ThemeToggle />
          <Link href="/ingresar" className={ingresar}>
            Ingresar
          </Link>
        </div>
      </div>
    </div>
  )
}
