import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { brandName } from "@/lib/brand"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Catálogo" },
  { href: "/propiedades?op=sale", label: "Venta" },
  { href: "/propiedades?op=rent", label: "Alquiler" },
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
            <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
              <path
                d="M16 4c4 4 7 7 7 12a7 7 0 1 1-14 0c0-5 3-8 7-12Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M16 10c2.2 2.4 3.8 4.2 3.8 7a3.8 3.8 0 1 1-7.6 0c0-2.8 1.6-4.6 3.8-7Z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
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
            href="/propiedades"
            className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition hover:opacity-90"
          >
            Explorar
          </Link>
          <ThemeToggle className="h-9 w-9 bg-transparent shadow-none hover:bg-black/5 dark:bg-transparent dark:hover:bg-white/10" />
        </div>
      </div>
    </header>
  )
}
