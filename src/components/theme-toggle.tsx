"use client"

import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm transition hover:bg-white/90 dark:bg-white/90 dark:hover:bg-white",
        className,
      )}
    >
      {isDark ? (
        <Sun weight="fill" className="h-4 w-4" aria-hidden />
      ) : (
        <Moon weight="fill" className="h-4 w-4" aria-hidden />
      )}
    </button>
  )
}
