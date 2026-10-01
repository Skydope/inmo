"use client"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function HeroInteractive({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const isNight = theme === "dark"

  return (
    <div className="relative rounded-t-[1.75rem] md:rounded-t-[2.25rem]">
      {/* CAPA 1: Fondo de la fotografía (Twin Frame Crossfade Día / Noche) */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        {/* Cuadro de DÍA (luces apagadas, cielo diurno) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/hero-day.webp"
          alt="Residencia en Bolívar de día"
          className={cn(
            "h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            isNight ? "opacity-0" : "opacity-100",
          )}
        />

        {/* Cuadro de NOCHE (luces encendidas, cielo crepúsculo) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/hero-night.webp"
          alt="Residencia en Bolívar iluminada de noche"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            isNight ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Velo atmosférico calibrado para contraste */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 transition-colors duration-1000",
            isNight
              ? "bg-gradient-to-b from-black/35 via-transparent to-black/60"
              : "bg-gradient-to-b from-black/10 via-transparent to-black/30",
          )}
        />
      </div>

      {/* CAPA 2: Tipografía de gran escala DETRÁS de la casa */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
      >
        <div className="flex h-full w-full flex-col justify-start pl-6 pt-20 md:pl-16 md:pt-24 lg:pl-20 lg:pt-28">
          <div
            className={cn(
              "font-display uppercase tracking-[-0.03em] transition-colors duration-1000",
              "text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] leading-[0.88]",
              isNight
                ? "text-white/95 drop-shadow-[0_6px_35px_rgba(0,0,0,0.85)]"
                : "text-neutral-900/90 drop-shadow-[0_4px_25px_rgba(255,255,255,0.45)]",
            )}
          >
            <span className="block">VIVÍ</span>
            <span className="block mt-[-0.05em] text-accent tracking-[-0.04em]">
              BOLÍVAR
            </span>
          </div>
        </div>
      </div>

      {/* CAPA 3: Silueta frontal de la casa (el techo corta las letras) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]"
      >
        {/* Recorte de día */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/hero-day-fg.webp"
          alt=""
          className={cn(
            "h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            isNight ? "opacity-0" : "opacity-100",
          )}
        />
        {/* Recorte de noche */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/hero-night-fg.webp"
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
            isNight ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {/* CAPA 4: UI Interactiva (Nav, descripción, buscador segmentado) */}
      <div className="relative z-30 flex min-h-[calc(100dvh-1rem)] flex-col px-4 pb-12 pt-0 md:min-h-[calc(100dvh-1.5rem)] md:px-7 md:pb-16">
        {children}
      </div>
    </div>
  )
}
