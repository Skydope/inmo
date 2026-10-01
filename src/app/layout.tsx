import type { Metadata } from "next"
import { Archivo_Black, Instrument_Serif, Manrope } from "next/font/google"
import { SiteNav } from "@/components/site-nav"
import { brandName } from "@/lib/brand"
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
  title: `${brandName} · Bolívar`,
  description: "Portal inmobiliario local de Bolívar, Buenos Aires.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-AR"
      className={`${manrope.variable} ${archivo.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="page-atmosphere min-h-full flex flex-col text-fg">
        <SiteNav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
