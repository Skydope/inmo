import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { buttonVariants } from "@/components/ui/button"
import { brandName } from "@/lib/brand"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/app/ingresar/actions"

export const metadata: Metadata = {
  title: "Tu cuenta",
  description: `Estado de tu cuenta en ${brandName}.`,
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
    <>
      <Header />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
        <h1 className="text-4xl font-titulo">{name}</h1>
        {email ? <p className="mt-3 text-sm text-tinta-suave">{email}</p> : null}
        <p className="mt-6 text-sm leading-relaxed">
          Tu cuenta está creada. Todavía no podés publicar: cuando te vinculemos a una inmobiliaria,
          vas a poder cargar avisos.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <form action={signOut}>
            <button
              type="submit"
              className={buttonVariants()}
            >
              Salir
            </button>
          </form>
          <Link href="/" className="inline-flex min-h-11 items-center text-sm text-tinta-suave underline-offset-4 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </main>
      <Pie />
    </>
  )
}
