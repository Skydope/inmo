"use client"

import { useId } from "react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const DAY = "/images/hero/residence-day.webp"
const NIGHT = "/images/hero/residence-night.webp"

// Coordinates in the original 1672 × 941 photograph. Reusing the photograph
// inside the clip keeps its roof perfectly registered with the background.
const FOREGROUND = "0,710 489,710 489,613 670,604 670,536 598,527 598,513 1358,436 1456,496 1456,510 1435,513 1435,540 1500,535 1500,526 1552,526 1627,569 1627,710 1672,710 1672,941 0,941"

// Same zoom on both layers so the roof clip stays registered with the photo.
const MOBILE_ZOOM = "origin-bottom scale-[1.18] md:origin-center md:scale-100"

export function HeroInteractive({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const isNight = theme === "dark"
  const clipId = useId().replace(/:/g, "")

  return (
    <div className="relative isolate rounded-t-panel md:rounded-t-sheet">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className={cn("absolute inset-0", MOBILE_ZOOM)}>
          {/* The day layer stays opaque so the crossfade never exposes the page. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DAY} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={NIGHT} alt="" className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out", isNight ? "opacity-100" : "opacity-0")} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]">
        <h1 className="hero-depth-title font-display uppercase text-fg transition-colors duration-[1200ms]">
          <span className="relative top-2 block text-left text-[0.42em] leading-none tracking-[0.14em] md:-top-6 md:text-center md:text-[0.34em] md:tracking-[0.16em]">Viví</span>
          <span className="mt-2 block text-left leading-[0.86] tracking-[-0.055em] md:mt-[calc(0.04em+1.25rem)] md:text-center">Bolívar</span>
        </h1>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
        <svg aria-hidden="true" className={cn("absolute inset-0 h-full w-full", MOBILE_ZOOM)} viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice">
          <defs><clipPath id={clipId}><polygon points={FOREGROUND} /></clipPath></defs>
          <g clipPath={`url(#${clipId})`}>
            <image href={DAY} width="1672" height="941" />
            <image href={NIGHT} width="1672" height="941" className={cn("transition-opacity duration-[1200ms] ease-in-out", isNight ? "opacity-100" : "opacity-0")} />
          </g>
        </svg>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      <div className="relative z-30 flex min-h-[26rem] flex-col px-4 pb-5 pt-0 md:min-h-[max(780px,calc(100svh-1.5rem))] md:px-7 md:pb-16">
        {children}
      </div>
    </div>
  )
}
