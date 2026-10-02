import { NextRequest, NextResponse } from "next/server"
import {
  filterBolivarStreets,
  linesFromNominatim,
  STREET_QUERY_MIN,
  streetNamesFromPhoton,
} from "@/lib/streets"

const UA = "Inmo/bolivar (property map street search)"

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name")?.trim() ?? ""
  if (name) {
    const candidates = [name]
    const lower = name.toLowerCase()
    if (!lower.startsWith("avenida ") && !lower.startsWith("av. ")) {
      candidates.push(`Avenida ${name}`)
    } else if (lower.startsWith("avenida ")) {
      candidates.push(name.slice(8).trim())
    }

    try {
      for (const cand of candidates) {
        const url = new URL("https://nominatim.openstreetmap.org/search")
        url.searchParams.set("format", "jsonv2")
        url.searchParams.set("street", cand)
        url.searchParams.set("city", "San Carlos de Bolivar")
        url.searchParams.set("country", "Argentina")
        url.searchParams.set("viewbox", "-61.20,-36.18,-61.02,-36.28")
        url.searchParams.set("bounded", "1")
        url.searchParams.set("polygon_geojson", "1")
        url.searchParams.set("dedupe", "0")
        url.searchParams.set("limit", "20")

        const res = await fetch(url, { headers: { "User-Agent": UA } })
        if (res.ok) {
          const parsed = linesFromNominatim(await res.json(), name)
          if (parsed.features.length > 0) {
            return NextResponse.json(parsed)
          }
        }
      }

      // Fallback free-form query bounded to Bolívar
      const fallbackUrl = new URL("https://nominatim.openstreetmap.org/search")
      fallbackUrl.searchParams.set("format", "jsonv2")
      fallbackUrl.searchParams.set("q", `${name}, San Carlos de Bolívar, Argentina`)
      fallbackUrl.searchParams.set("viewbox", "-61.20,-36.18,-61.02,-36.28")
      fallbackUrl.searchParams.set("bounded", "1")
      fallbackUrl.searchParams.set("polygon_geojson", "1")
      fallbackUrl.searchParams.set("dedupe", "0")
      fallbackUrl.searchParams.set("limit", "20")
      const fallbackRes = await fetch(fallbackUrl, { headers: { "User-Agent": UA } })
      if (fallbackRes.ok) {
        const parsed = linesFromNominatim(await fallbackRes.json(), name)
        if (parsed.features.length > 0) {
          return NextResponse.json(parsed)
        }
      }
    } catch {
      return NextResponse.json({ type: "FeatureCollection", name, features: [] }, { status: 502 })
    }
    return NextResponse.json({ type: "FeatureCollection", name, features: [] })
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (q.length < STREET_QUERY_MIN) return NextResponse.json({ names: [] })

  const local = filterBolivarStreets(q)

  try {
    const url = new URL("https://photon.komoot.io/api/")
    url.searchParams.set("q", q)
    url.searchParams.set("bbox", "-61.20,-36.28,-61.02,-36.18")
    url.searchParams.set("limit", "25")
    const res = await fetch(url, { headers: { "User-Agent": UA } })
    if (res.ok) {
      const data = await res.json()
      const remote = streetNamesFromPhoton(data.features ?? [])
      const merged = Array.from(new Set([...local, ...remote])).slice(0, 10)
      return NextResponse.json({ names: merged })
    }
  } catch {
    // If Photon fails or times out, return local matches safely
  }

  return NextResponse.json({ names: local.slice(0, 10) })
}
