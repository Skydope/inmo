import { NextRequest, NextResponse } from "next/server"
import { linesFromNominatim, STREET_QUERY_MIN, streetNamesFromPhoton } from "@/lib/streets"
import { BOLIVAR_CENTER } from "@/lib/brand"

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
    const res = await fetch(url, { headers: { "User-Agent": UA } })
    if (!res.ok) {
      return NextResponse.json({ type: "FeatureCollection", features: [] }, { status: 502 })
    }
    return NextResponse.json(linesFromNominatim(await res.json()))
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (q.length < STREET_QUERY_MIN) return NextResponse.json({ names: [] })

  const url = new URL("https://photon.komoot.io/api/")
  url.searchParams.set("q", q)
  url.searchParams.set("lat", String(BOLIVAR_CENTER.lat))
  url.searchParams.set("lon", String(BOLIVAR_CENTER.lng))
  url.searchParams.set("limit", "8")
  const res = await fetch(url, { headers: { "User-Agent": UA } })
  if (!res.ok) return NextResponse.json({ names: [] }, { status: 502 })
  const data = await res.json()
  return NextResponse.json({ names: streetNamesFromPhoton(data.features ?? []) })
}
