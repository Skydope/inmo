"use client"

import { useId } from "react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const DAY = "/images/hero/residence-day.webp"
const NIGHT = "/images/hero/residence-night.webp"

// Coordinates in the original 1672 × 941 photograph. Reusing the photograph
// inside the clip keeps its roof perfectly registered with the background.
const FOREGROUND = "0,710 489,710 489,613 670,604 670,536 598,527 598,513 1358,436 1456,496 1456,510 1435,513 1435,540 1500,535 1500,526 1552,526 1627,569 1627,710 1672,710 1672,941 0,941"

export function HeroInteractive({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const isNight = theme === "dark"
  const clipId = useId().replace(/:/g, "")

  return (
    <div className="relative isolate rounded-t-panel md:rounded-t-sheet">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        {/* The day layer stays opaque so the crossfade never exposes the page. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DAY} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={NIGHT} alt="" className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out", isNight ? "opacity-100" : "opacity-0")} />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]">
        <h1 className="hero-depth-title font-display text-center uppercase text-fg transition-colors duration-[1200ms]">
          <span className="relative -top-4 block text-[0.34em] leading-none tracking-[0.16em] md:-top-6">Viví</span>
          <span className="mt-[calc(0.04em+1rem)] block leading-[0.86] tracking-[-0.055em] md:mt-[calc(0.04em+1.25rem)]">Bolívar</span>
        </h1>
      </div>

      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-hidden rounded-[inherit]" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice">
        <defs><clipPath id={clipId}><polygon points={FOREGROUND} /></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <image href={DAY} width="1672" height="941" />
          <image href={NIGHT} width="1672" height="941" className={cn("transition-opacity duration-[1200ms] ease-in-out", isNight ? "opacity-100" : "opacity-0")} />
        </g>
      </svg>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      <div className="relative z-30 flex min-h-[max(760px,calc(100svh-1rem))] flex-col px-4 pb-12 pt-0 md:min-h-[max(780px,calc(100svh-1.5rem))] md:px-7 md:pb-16">
        {children}
      </div>
    </div>
  )
}
