import { NextRequest, NextResponse } from "next/server"
import { direccionDesdeReverso, lugarDesdeNominatim } from "@/lib/streets"

const UA = "Inmo/bolivar (office address search)"

/** Un punto en Bolívar para el mapa de la oficina. Nominatim no se llama desde el navegador. */
export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get("lat"))
  const lng = Number(req.nextUrl.searchParams.get("lng"))
  if (Number.isFinite(lat) && Number.isFinite(lng) && req.nextUrl.searchParams.has("lat")) {
    const url = new URL("https://nominatim.openstreetmap.org/reverse")
    url.searchParams.set("format", "jsonv2")
    url.searchParams.set("lat", String(lat))
    url.searchParams.set("lon", String(lng))
    url.searchParams.set("zoom", "18")
    url.searchParams.set("addressdetails", "1")
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } })
      if (!res.ok) return NextResponse.json(null, { status: 502 })
      return NextResponse.json(direccionDesdeReverso(await res.json()))
    } catch {
      return NextResponse.json(null, { status: 502 })
    }
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (q.length < 3) return NextResponse.json(null)

  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("format", "jsonv2")
  url.searchParams.set("q", `${q}, San Carlos de Bolívar, Argentina`)
  url.searchParams.set("countrycodes", "ar")
  url.searchParams.set("limit", "5")

  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } })
    if (!res.ok) return NextResponse.json(null, { status: 502 })
    return NextResponse.json(lugarDesdeNominatim(await res.json()))
  } catch {
    return NextResponse.json(null, { status: 502 })
  }
}
