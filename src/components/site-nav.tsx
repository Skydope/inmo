import Link from "next/link"
import { House } from "@phosphor-icons/react/dist/ssr"
import { ThemeToggle } from "@/components/theme-toggle"
import { brandName } from "@/lib/brand"
import { cn } from "@/lib/utils"

const links = [
  { href: "/propiedades?op=sale", label: "Comprar" },
  { href: "/propiedades?op=rent", label: "Alquilar" },
  { href: "/inmobiliarias", label: "Inmobiliarias" },
]

export function SiteNav({ className }: { className?: string }) {
  return (
    <header className={cn("sticky top-0 z-40 px-4 pt-4", className)}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full bg-chrome px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full border border-accent/50 text-accent"
          >
            <House weight="fill" className="h-4 w-4" />
          </span>
          <span className="font-display text-lg tracking-tight text-fg">{brandName}</span>
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-1 rounded-full bg-black/5 p-1 dark:bg-white/5 md:flex"
        >
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-fg-muted transition hover:bg-black/5 hover:text-fg dark:hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/ingresar"
            className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition hover:opacity-90"
          >
            Ingresar
          </Link>
          <ThemeToggle className="h-9 w-9 bg-transparent shadow-none hover:bg-black/5 dark:bg-transparent dark:hover:bg-white/10" />
        </div>
      </div>
    </header>
  )
}
