import type { ReactNode } from "react"
import { ProveedorDeBorrador } from "./borrador"

export default function PublicarLayout({ children }: { children: ReactNode }) {
  return <ProveedorDeBorrador>{children}</ProveedorDeBorrador>
}
