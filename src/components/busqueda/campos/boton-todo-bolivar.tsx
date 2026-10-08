"use client"

import { cn } from "@/lib/utils"

/** "Todo Bolívar" dentro de un formulario que no navega (la hoja de filtros): desmarca las zonas. */
export function BotonTodoBolivar({ activo, total }: { activo: boolean; total: number }) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={(e) => {
        const form = e.currentTarget.closest("form")
        if (!form) return
        for (const zona of form.querySelectorAll<HTMLInputElement>('input[name="zona"]')) zona.checked = false
        form.dispatchEvent(new Event("change", { bubbles: true }))
      }}
      className={cn(
        "inline-flex min-h-11 w-fit items-center gap-2 rounded-full border px-4 font-semibold",
        activo ? "border-plano-700 bg-plano-50 ring-1 ring-plano-700" : "border-linea bg-blanco hover:border-tinta-suave"
      )}
    >
      Todo Bolívar <span className="text-sm font-normal text-tinta-suave tabular-nums">{total}</span>
    </button>
  )
}
