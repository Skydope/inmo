"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function CoverImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-papel text-tinta-suave",
          className,
        )}
        role="img"
        aria-label={alt || "Sin imagen"}
      >
        <svg viewBox="0 0 48 48" className="h-10 w-10 opacity-70" fill="none" aria-hidden>
          <rect x="6" y="12" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17" cy="21" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 30l10-8 8 6 6-4 12 10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
