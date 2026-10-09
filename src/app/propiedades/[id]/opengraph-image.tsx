import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { notFound } from "next/navigation"
import { ImageResponse } from "next/og"
import sharp from "sharp"
import { etiquetaTipo, nombreZona, operacionEnFrase } from "@/lib/busqueda"
import { formatPrice } from "@/lib/format"
import { getPropertyById } from "@/lib/properties/adapter"

export const alt = "Foto, precio y zona de la propiedad"
export const size = { width: 1200, height: 630 }
export const contentType = "image/jpeg"

export default async function ImagenDeFicha({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getPropertyById(id)
  if (!property) notFound()

  const font = await readFile(
    join(process.cwd(), "src/app/propiedades/[id]/EncodeSans-SemiCondensed-700.ttf")
  )
  let foto: string | null = null
  if (property.photos[0]) {
    const bytes = await readFile(join(process.cwd(), "public", property.photos[0].replace(/^\//, "")))
    // next/og no decodifica WebP. El JPEG entra en la franja de la vista previa.
    const jpeg = await sharp(bytes).resize(1200, 470, { fit: "cover" }).jpeg({ quality: 70 }).toBuffer()
    foto = `data:image/jpeg;base64,${jpeg.toString("base64")}`
  }

  const precio = formatPrice(property.price, property.currency)
  const linea = `${etiquetaTipo(property.type)} ${operacionEnFrase(property.operation)} · ${nombreZona(property.zone)}`

  const png = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#efe8dc",
          fontFamily: "Encode Sans",
        }}
      >
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {foto ? (
            <img src={foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f7f2ea",
            padding: "28px 40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 52, color: "#1a1a1a" }}>{precio}</div>
            <div style={{ fontSize: 28, color: "#6e675e", marginTop: 8 }}>{linea}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "#1a1a1a",
                color: "#f7f2ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                marginRight: 16,
              }}
            >
              b
            </div>
            <div style={{ fontSize: 28, color: "#1a1a1a" }}>bolívar inmo</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Encode Sans", data: font, style: "normal", weight: 700 }],
    }
  )
  // WhatsApp cachea la vista previa y deja de mostrarla si pesa de más. Apuntamos a < 300 KB.
  const jpeg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 60 }).toBuffer()
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } })
}
