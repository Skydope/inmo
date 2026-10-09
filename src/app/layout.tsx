import type { Metadata, Viewport } from "next"
import { Archivo_Black, Encode_Sans, Instrument_Serif } from "next/font/google"
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

/*
 * La voz del inicio: Instrument Serif derecha, solo para la frase de la hoja y la línea del pie
 * (spec vivi-bolivar). Sin precarga: el navegador la baja recién cuando algo la usa, abajo del
 * pliegue, y no compite con la foto del hero.
 */
/** VIVÍ BOLÍVAR: la B cerrada de cartel. No se usa en el resto de la interfaz. */
const archivo = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin"],
  preload: false,
})

const voz = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
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
      className={`${encode.variable} ${archivo.variable} ${voz.variable} h-full antialiased`}
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
