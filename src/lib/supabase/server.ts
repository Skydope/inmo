import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function publicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return { url, key }
}

export async function createClient() {
  const env = publicEnv()
  if (!env) return null

  const cookieStore = await cookies()

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // A Server Component cannot write cookies. The proxy refreshes the session.
        }
      },
    },
  })
}
