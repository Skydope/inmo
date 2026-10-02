"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

export function Reveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        timer = window.setTimeout(() => setOn(true), delay)
        io.disconnect()
      },
      { threshold: 0.22 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [delay])

  return (
    <div ref={ref} className={`${on ? "reveal is-in" : "reveal"} ${className ?? ""}`}>
      {children}
    </div>
  )
}
