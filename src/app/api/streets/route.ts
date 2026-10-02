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
    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.set("format", "jsonv2")
    url.searchParams.set("street", name)
    url.searchParams.set("city", "San Carlos de Bolivar")
    url.searchParams.set("country", "Argentina")
    url.searchParams.set("polygon_geojson", "1")
    url.searchParams.set("dedupe", "0")
    url.searchParams.set("limit", "20")
    try {
      let res = await fetch(url, { headers: { "User-Agent": UA } })
      if (res.ok) {
        const parsed = linesFromNominatim(await res.json(), name)
        if (parsed.features.length > 0) {
          return NextResponse.json(parsed)
        }
      }
      // Fallback free-form query in case structured search missed it
      const fallbackUrl = new URL("https://nominatim.openstreetmap.org/search")
      fallbackUrl.searchParams.set("format", "jsonv2")
      fallbackUrl.searchParams.set("q", `${name}, San Carlos de Bolívar, Argentina`)
      fallbackUrl.searchParams.set("polygon_geojson", "1")
      fallbackUrl.searchParams.set("dedupe", "0")
      fallbackUrl.searchParams.set("limit", "20")
      res = await fetch(fallbackUrl, { headers: { "User-Agent": UA } })
      if (res.ok) {
        return NextResponse.json(linesFromNominatim(await res.json(), name))
      }
    } catch {
      return NextResponse.json({ type: "FeatureCollection", features: [] }, { status: 502 })
    }
    return NextResponse.json({ type: "FeatureCollection", features: [] })
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
