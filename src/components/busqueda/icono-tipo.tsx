import {
  BriefcaseBusiness,
  Building,
  Building2,
  CarFront,
  House,
  LandPlot,
  Store,
  Tractor,
  Trees,
  Warehouse,
  type LucideProps,
} from "lucide-react"
import { iconoTipo, type IconoTipo, type TipoPropiedad } from "@/lib/busqueda/taxonomia"

// La taxonomía guarda el nombre del ícono (src/lib no importa React); acá se resuelve.
const ICONOS: Record<IconoTipo, React.ComponentType<LucideProps>> = {
  House,
  Building2,
  Building,
  Trees,
  LandPlot,
  Tractor,
  Store,
  BriefcaseBusiness,
  Warehouse,
  CarFront,
}

export function IconoTipo({ tipo, ...props }: { tipo: TipoPropiedad } & LucideProps) {
  const Icono = ICONOS[iconoTipo(tipo)]
  return <Icono aria-hidden="true" strokeWidth={1.75} {...props} />
}
