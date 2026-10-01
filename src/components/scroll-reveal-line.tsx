"use client"

import { useEffect, useRef, useState } from "react"

type Part = { text: string; accent?: boolean }

const DIM = 0.22

export function ScrollRevealLine({
  parts,
  className,
}: {
  parts: Part[]
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(0)
  const words = parts.flatMap((part) =>
    part.text.split(/(\s+)/).filter(Boolean).map((token) => ({
      token,
      accent: Boolean(part.accent) && !/^\s+$/.test(token),
      space: /^\s+$/.test(token),
    })),
  )
  const count = words.filter((w) => !w.space).length

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1)
      return
    }
    let raf = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      const start = window.innerHeight * 0.88
      const end = window.innerHeight * 0.38
      const t = (start - rect.top) / (start - end)
      setProgress(Math.min(1, Math.max(0, t)))
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  let seen = 0
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        if (word.space) return <span key={i}>{word.token}</span>
        const lit = seen < progress * count
        seen += 1
        return (
          <span
            key={i}
            className={word.accent ? "font-accent text-[#c4a574]" : undefined}
            style={{ opacity: lit ? 1 : DIM, transition: "opacity 160ms linear" }}
          >
            {word.token}
          </span>
        )
      })}
    </p>
  )
}
