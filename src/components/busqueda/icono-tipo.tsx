import {
  Briefcase,
  Building,
  Building2,
  CarFront,
  House,
  LandPlot,
  Storefront,
  Tractor,
  Trees,
  Warehouse,
  type IconProps,
} from "@/components/iconos"
import { iconoTipo, type IconoTipo, type TipoPropiedad } from "@/lib/busqueda/taxonomia"

// La taxonomía guarda el nombre del ícono (src/lib no importa React); acá se resuelve.
const ICONOS: Record<IconoTipo, React.ComponentType<IconProps>> = {
  House,
  Building2,
  Building,
  Trees,
  LandPlot,
  Tractor,
  Store: Storefront,
  BriefcaseBusiness: Briefcase,
  Warehouse,
  CarFront,
}

export function IconoTipo({ tipo, ...props }: { tipo: TipoPropiedad } & IconProps) {
  const Icono = ICONOS[iconoTipo(tipo)]
  return <Icono aria-hidden="true" weight="fill" {...props} />
}
