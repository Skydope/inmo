"use client"

import { useEffect, useRef, useState } from "react"

/** Ease-out cubic. t is 0..1. */
export function countAt(value: number, t: number) {
  const p = Math.min(1, Math.max(0, t))
  return Math.round(value * (1 - (1 - p) ** 3))
}

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value)
      return
    }
    let raf = 0
    let started = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return
        started = true
        const t0 = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / 900)
          setN(countAt(value, t))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        io.disconnect()
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return <span ref={ref}>{n}</span>
}
