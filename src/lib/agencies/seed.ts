import type { Agency } from "./types"

/**
 * Inmobiliarias de prueba (no son reales). Los teléfonos usan la característica de Bolívar,
 * 2314. Una no tiene WhatsApp y otra no tiene teléfono, para probar los caminos de contacto.
 */
export const SEED_AGENCIES = {
  norte: {
    id: "norte-propiedades",
    name: "Norte Propiedades",
    logoUrl: "/images/agencies/norte.svg",
    phone: "5492314421101",
    whatsapp: "5492314421101",
    email: "contacto@nortepropiedades.com.ar",
    address: "Av. San Martín 840",
    license: "CMCPSI 1234",
  },
  centro: {
    id: "centro-inmobiliaria",
    name: "Centro Inmobiliaria",
    logoUrl: "/images/agencies/centro.svg",
    phone: "5492314456789",
    whatsapp: "5492314456789",
    email: "centro@inmo.local",
    address: "Belgrano 250",
    license: "CMCPSI 2210",
  },
  campoCiudad: {
    id: "campo-y-ciudad",
    name: "Campo & Ciudad",
    logoUrl: "/images/agencies/campo-ciudad.svg",
    phone: "02314 42-7654",
    email: "campo@inmo.local",
    address: "Av. Alsina 310",
    license: "CMCPSI 1877",
  },
  bolivarHomes: {
    id: "bolivar-homes",
    name: "Bolívar Homes",
    logoUrl: "/images/agencies/bolivar-homes.svg",
    email: "info@bolivarhomes.com.ar",
    address: "Av. Almirante Brown 510",
  },
} satisfies Record<string, Agency>
