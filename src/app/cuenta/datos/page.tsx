import type { Metadata } from "next"
import { Registro } from "../registro-cliente"

export const metadata: Metadata = {
  title: "Datos de la inmobiliaria",
}

export default function DatosPage() {
  return <Registro modo="datos" />
}
