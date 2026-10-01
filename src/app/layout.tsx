import type { Metadata, Viewport } from "next"
import { Archivo_Black, Instrument_Serif, Manrope } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { brandName } from "@/lib/brand"
import { siteUrl } from "@/lib/site"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

const archivo = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin"],
})

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brandName} · Propiedades en Bolívar`,
    template: `%s · ${brandName}`,
  },
  description:
    "Portal inmobiliario local de San Carlos de Bolívar, Buenos Aires. Venta y alquiler con mapa interactivo y filtros vivos.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: brandName,
    title: `${brandName} · Propiedades en Bolívar`,
    description:
      "Venta y alquiler en San Carlos de Bolívar con mapa interactivo y filtros vivos.",
    images: [
      {
        url: "/images/hero/hero-day.jpg",
        width: 1672,
        height: 941,
        alt: "San Carlos de Bolívar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efe8dc" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
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
      className={`${manrope.variable} ${archivo.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="page-atmosphere min-h-full flex flex-col text-fg">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
