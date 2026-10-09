import type { Metadata, Viewport } from "next"
import { Archivo_Black, Encode_Sans } from "next/font/google"
import { MarcaDeHistorial } from "@/components/shell/marca-de-historial"
import { brandName } from "@/lib/brand"
import { siteUrl } from "@/lib/site"
import "./globals.css"

/*
 * La voz de Bolívar Inmo: Encode Sans (Impallari Type, Argentina), una sola familia
 * variable en peso y en ancho. Semi condensada y pesada para precios y preguntas (el
 * cartel de VENDE); ancho normal para el texto.
 */
const encode = Encode_Sans({
  variable: "--font-encode-sans",
  subsets: ["latin"],
  axes: ["wdth"],
})

/** VIVÍ BOLÍVAR (hero y pie): la B cerrada de cartel. No se usa en el resto de la interfaz. */
const archivo = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin"],
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brandName} · Propiedades en Bolívar`,
    template: `%s · ${brandName}`,
  },
  description:
    "Las propiedades en venta y alquiler de las inmobiliarias de San Carlos de Bolívar, en un solo lugar.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: brandName,
    title: `${brandName} · Propiedades en Bolívar`,
    description:
      "Las propiedades en venta y alquiler de las inmobiliarias de San Carlos de Bolívar, en un solo lugar.",
    images: [
      {
        url: "/images/inicio/casa-compartir.jpg",
        width: 1200,
        height: 630,
        alt: "Viví Bolívar: una casa de campo al atardecer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
}

export const viewport: Viewport = {
  themeColor: "#f4f6f8",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-AR"
      suppressHydrationWarning
      className={`${encode.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var f=/^\\/propiedades\\/[^/]+$/.test(location.pathname);if(f)sessionStorage.removeItem("inmo-volver");else sessionStorage.setItem("inmo-volver","1")}catch(e){}`,
          }}
        />
        <MarcaDeHistorial />
        {children}
      </body>
    </html>
  )
}
