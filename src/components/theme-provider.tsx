"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
  forceDark: () => void
  releaseDark: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "inmo-theme"

function applyDomTheme(theme: Theme, forced: boolean) {
  const root = document.documentElement
  const effective: Theme = forced ? "dark" : theme
  root.classList.toggle("dark", effective === "dark")
  root.style.colorScheme = effective
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [forcedCount, setForcedCount] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const initial: Theme = stored === "dark" || stored === "light" ? stored : "light"
    setThemeState(initial)
    applyDomTheme(initial, false)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    applyDomTheme(theme, forcedCount > 0)
  }, [theme, forcedCount, ready])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    window.localStorage.setItem(STORAGE_KEY, t)
  }, [])

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light"
      window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const forceDark = useCallback(() => {
    setForcedCount((n) => n + 1)
  }, [])

  const releaseDark = useCallback(() => {
    setForcedCount((n) => Math.max(0, n - 1))
  }, [])

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggle, forceDark, releaseDark }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
