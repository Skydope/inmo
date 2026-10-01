import type { Agency } from "./types"

export const SEED_AGENCIES: Record<string, Agency> = {
  norte: {
    name: "Norte Propiedades",
    logoUrl: "/images/agencies/norte.svg",
    phone: "5492281421101",
    email: "contacto@nortepropiedades.com.ar",
    address: "Av. San Martín 840",
  },
  centro: {
    name: "Centro Inmobiliaria",
    logoUrl: "/images/agencies/centro.svg",
    phone: "5492281456789",
    email: "centro@inmo.local",
    address: "Belgrano 250",
  },
  campoCiudad: {
    name: "Campo & Ciudad",
    logoUrl: "/images/agencies/campo-ciudad.svg",
    phone: "5492281987654",
    email: "campo@inmo.local",
    address: "Av. Alsina 310",
  },
  bolivarHomes: {
    name: "Bolívar Homes",
    logoUrl: "/images/agencies/bolivar-homes.svg",
    phone: "5492281332211",
    email: "info@bolivarhomes.com.ar",
    address: "Av. Brown 510",
  },
}
