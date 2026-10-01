"use client"

import { Moon, Sun } from "lucide-react"
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
        "inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/35 p-1 backdrop-blur-md transition hover:border-white/40",
        className,
      )}
    >
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-full transition",
          isDark ? "bg-white text-bg" : "text-white/70",
        )}
      >
        <Moon className="h-4 w-4" aria-hidden />
      </span>
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-full transition",
          !isDark ? "bg-white text-bg" : "text-white/70",
        )}
      >
        <Sun className="h-4 w-4" aria-hidden />
      </span>
    </button>
  )
}
