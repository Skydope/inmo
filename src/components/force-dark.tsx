"use client"

import { useEffect, type ReactNode } from "react"
import { useTheme } from "@/components/theme-provider"

/** Keep Explorar (/propiedades) on the dark charcoal map UI regardless of landing theme. */
export function ForceDark({ children }: { children: ReactNode }) {
  const { forceDark, releaseDark } = useTheme()

  useEffect(() => {
    forceDark()
    return () => releaseDark()
  }, [forceDark, releaseDark])

  return <>{children}</>
}
