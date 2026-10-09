import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Logo } from "@/components/marca/logo"
import { buttonVariants } from "@/components/ui/button"
import { brandName } from "@/lib/brand"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Ingresar",
  description: `Entrá a ${brandName} con Google.`,
}

const ERRORS: Record<string, string> = {
  auth: "Google no completó el ingreso. Volvé a intentar.",
}

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; como?: string }>
}) {
  const { error, como } = await searchParams

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative order-1 h-28 min-w-0 overflow-hidden lg:order-2 lg:h-auto lg:min-h-dvh">
        <Image
          src="/images/hero/hero-day.jpg"
          alt="San Carlos de Bolívar"
          fill
          priority
          quality={95}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-black/70 via-black/15 to-black/10 lg:block" />
        <div className="absolute inset-x-0 bottom-0 hidden px-10 pb-14 text-white lg:block">
          <p className="text-2xl font-semibold">Elegís el aviso.</p>
          <p className="mt-2 max-w-[11ch] text-5xl leading-[0.95] font-titulo">
            La inmobiliaria cierra.
          </p>
        </div>
      </section>

      <section className="order-2 flex min-h-[calc(100dvh-7rem)] min-w-0 flex-col bg-blanco px-6 py-8 sm:px-10 lg:order-1 lg:min-h-dvh lg:px-14">
        <Link
          href="/"
          aria-label={`${brandName}, ir al inicio`}
          className="inline-flex min-h-11 w-fit items-center rounded-control text-lg"
        >
          <Logo />
        </Link>

        {como === "pendiente" ? (
          <Pendiente />
        ) : (
          <Ingreso error={error ? ERRORS[error] : undefined} />
        )}
      </section>
    </main>
  )
}

function Ingreso({ error }: { error?: string }) {
  return (
    <>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <h1 className="text-5xl font-titulo">Ingresá</h1>
        <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-tinta-suave">
          Con tu cuenta de Google. Publicar se habilita cuando tu inmobiliaria está adherida.
        </p>
        <Link
          href="/ingresar?como=pendiente"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8 w-full")}
        >
          <GoogleMark />
          Continuar con Google
        </Link>
        {error ? (
          <p role="alert" className="mt-3 text-sm leading-relaxed text-alerta">
            {error}
          </p>
        ) : null}
        <p className="mt-8 text-base leading-relaxed text-tinta-suave">
          ¿Tu inmobiliaria todavía no está?{" "}
          <Link href="/ingresar?como=pendiente" className="font-semibold text-tinta underline-offset-4 hover:underline">
            Escribinos
          </Link>
        </p>
      </div>
    </>
  )
}

function Pendiente() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
      <Candado />
      <h1 className="mt-4 text-4xl font-titulo">Acceso pendiente</h1>
      <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-tinta-suave">
        Este correo no está entre las inmobiliarias habilitadas. Si ya nos escribiste, estamos
        dando de alta. Si no, escribinos y la sumamos.
      </p>
      <Link
        href="/cuenta?como=primera"
        className={cn(buttonVariants({ size: "lg" }), "mt-8 w-full")}
      >
        Escribir por WhatsApp
      </Link>
      <Link
        href="/ingresar"
        className="mt-4 inline-flex min-h-11 items-center justify-center text-base font-semibold text-tinta-suave underline-offset-4 hover:underline"
      >
        Volver a ingresar
      </Link>
    </div>
  )
}

function Candado() {
  return (
    <svg viewBox="0 0 24 24" className="size-8 text-tinta-suave" aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
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
