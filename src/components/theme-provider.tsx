"use client"

import { createContext, useContext, useSyncExternalStore } from "react"

export type Theme = "light" | "dark"

const CLAVE = "tema"

type Tema = { theme: Theme; toggle: () => void }

const TemaContext = createContext<Tema | null>(null)

function leer(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function suscribir(aviso: () => void) {
  const obs = new MutationObserver(aviso)
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => obs.disconnect()
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(suscribir, leer, () => "light" as Theme)
  const toggle = () => {
    const next: Theme = leer() === "dark" ? "light" : "dark"
    document.documentElement.classList.toggle("dark", next === "dark")
    document.documentElement.style.colorScheme = next
    localStorage.setItem(CLAVE, next)
  }
  return <TemaContext.Provider value={{ theme, toggle }}>{children}</TemaContext.Provider>
}

export function useTheme() {
  const tema = useContext(TemaContext)
  if (!tema) throw new Error("useTheme va dentro de ThemeProvider")
  return tema
}
