import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { esPasoDeAviso, pasoDeAviso } from "@/lib/publicar/pasos"
import { Wizard } from "../wizard"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ paso: string }>
}): Promise<Metadata> {
  const { paso } = await params
  const item = pasoDeAviso(paso)
  if (!item) return { title: "Crear aviso" }
  return { title: item.titulo, description: item.ayuda }
}

export default async function PasoPage({
  params,
  searchParams,
}: {
  params: Promise<{ paso: string }>
  searchParams: Promise<{ nuevo?: string }>
}) {
  const { paso } = await params
  if (!esPasoDeAviso(paso)) notFound()
  const { nuevo } = await searchParams
  return <Wizard paso={paso} nuevo={nuevo === "1"} />
}
