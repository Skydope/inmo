"use client"

import { Moon, Sun } from "@/components/iconos"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const oscuro = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-tinta transition-colors hover:bg-papel",
        className,
      )}
    >
      {oscuro ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  )
}
