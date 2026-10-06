"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { siteUrl } from "@/lib/site"

export async function signInWithGoogle(): Promise<{ error: string } | void> {
  const supabase = await createClient()
  if (!supabase) {
    return {
      error: "El ingreso con Google todavía no está configurado en este servidor.",
    }
  }

  const headerList = await headers()
  const origin = headerList.get("origin") ?? siteUrl
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  })

  if (error || !data.url) {
    return { error: "Google no pudo iniciar el ingreso. Volvé a intentar." }
  }

  redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()
  if (supabase) await supabase.auth.signOut()
  redirect("/ingresar")
}
