"use client"

import { useState, useTransition } from "react"
import { signInWithGoogle } from "./actions"

export function GoogleSignIn({ initialError }: { initialError?: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(initialError ?? null)

  return (
    <form
      className="mt-8"
      action={() => {
        setError(null)
        startTransition(async () => {
          const result = await signInWithGoogle()
          if (result?.error) setError(result.error)
        })
      }}
    >
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-control border border-linea bg-blanco px-4 text-base font-semibold text-tinta transition-colors hover:border-tinta-suave disabled:opacity-60"
      >
        <GoogleMark />
        {pending ? "Conectando con Google…" : "Continuar con Google"}
      </button>
      {error ? (
        <p role="alert" className="mt-3 text-sm leading-relaxed text-alerta">
          {error}
        </p>
      ) : null}
    </form>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.1l6.3 5.3C37.4 38.3 44 33 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  )
}
