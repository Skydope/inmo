import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { brandName } from "@/lib/brand"
import { createClient } from "@/lib/supabase/server"
import { GoogleSignIn } from "./google-sign-in"

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Entrá a Inmu con Google.",
}

const ERRORS: Record<string, string> = {
  auth: "Google no completó el ingreso. Volvé a intentar.",
}

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  if (supabase) {
    const { data } = await supabase.auth.getUser()
    if (data.user) redirect("/cuenta")
  }

  const { error } = await searchParams

  return (
    <main className="ingresar-screen grid min-h-dvh lg:grid-cols-2">
      <section className="relative order-1 h-28 min-w-0 overflow-hidden lg:order-2 lg:h-auto lg:min-h-dvh">
        <Image
          src="/images/hero/hero-day.jpg"
          alt="San Carlos de Bolívar"
          fill
          priority
          quality={95}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="ingresar-photo object-cover"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-black/70 via-black/15 to-black/10 lg:block" />
        <div className="absolute inset-x-0 bottom-0 hidden px-10 pb-14 text-white lg:block">
          <p className="font-accent text-3xl">Elegís el aviso.</p>
          <p className="mt-2 max-w-[11ch] font-display text-5xl leading-[0.92] tracking-tight">
            La inmobiliaria cierra.
          </p>
        </div>
      </section>

      <section className="order-2 flex min-h-[calc(100dvh-7rem)] min-w-0 flex-col bg-bg px-6 py-8 sm:px-10 lg:order-1 lg:min-h-dvh lg:px-14">
        <Link href="/" className="font-display text-xl tracking-tight text-fg">
          {brandName}
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-5xl tracking-tight text-fg">Ingresá</h1>
          <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-fg-muted">
            Con tu cuenta de Google. Publicar se habilita cuando te vinculamos a una inmobiliaria.
          </p>
          <GoogleSignIn initialError={error ? ERRORS[error] : undefined} />
        </div>

        <p className="text-center text-xs leading-relaxed text-fg-muted">
          Solo Google. No hace falta crear una contraseña.
        </p>
      </section>
    </main>
  )
}
