import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LandingNav } from "@/components/landing-nav"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/app/ingresar/actions"

export const metadata: Metadata = {
  title: "Tu cuenta",
  description: "Estado de tu cuenta en Inmu.",
}

export default async function CuentaPage() {
  const supabase = await createClient()
  if (!supabase) redirect("/ingresar")

  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) redirect("/ingresar")

  const name =
    (typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name) ||
    (typeof user.user_metadata.name === "string" && user.user_metadata.name) ||
    "Tu cuenta"
  const email = user.email ?? ""

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-2 pt-2 md:px-3 md:pt-3">
        <div className="px-4 md:px-7">
          <LandingNav />
        </div>
      </div>
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
        <h1 className="font-display text-4xl tracking-tight text-fg">{name}</h1>
        {email ? <p className="mt-3 text-sm text-fg-muted">{email}</p> : null}
        <p className="mt-6 text-sm leading-relaxed text-fg">
          Tu cuenta está creada. Todavía no podés publicar: cuando te vinculemos a una inmobiliaria,
          vas a poder cargar avisos.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-full bg-fg px-5 text-sm font-medium text-bg transition hover:opacity-90"
            >
              Salir
            </button>
          </form>
          <Link href="/" className="text-sm text-fg-muted underline-offset-4 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  )
}
