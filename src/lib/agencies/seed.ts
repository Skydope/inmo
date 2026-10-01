import type { Agency } from "./types"

export const SEED_AGENCIES: Record<string, Agency> = {
  norte: {
    id: "agency-norte",
    name: "Norte Propiedades",
    slug: "norte-propiedades",
    logoUrl: "/images/agencies/norte.svg",
    phone: "5492281421101",
    email: "contacto@nortepropiedades.com.ar",
    address: "Av. San Martín 840",
    city: "San Carlos de Bolívar",
    description:
      "Referente en residencias de categoría, proyectos a estrenar y lotes estratégicos en Bolívar.",
  },
  centro: {
    id: "agency-centro",
    name: "Centro Inmobiliaria",
    slug: "centro-inmobiliaria",
    logoUrl: "/images/agencies/centro.svg",
    phone: "5492281456789",
    email: "centro@inmo.local",
    address: "Belgrano 250",
    city: "San Carlos de Bolívar",
    description:
      "Más de 20 años acompañando a familias e inversores con seriedad, alquileres y tasaciones en el casco urbano.",
  },
  campoCiudad: {
    id: "agency-campo-ciudad",
    name: "Campo & Ciudad",
    slug: "campo-y-ciudad",
    logoUrl: "/images/agencies/campo-ciudad.svg",
    phone: "5492281987654",
    email: "campo@inmo.local",
    address: "Av. Alsina 310",
    city: "San Carlos de Bolívar",
    description:
      "Especialistas en chacras, casas quinta suburbanas, fracciones de campo y loteos abiertos en el partido de Bolívar.",
  },
  bolivarHomes: {
    id: "agency-bolivar-homes",
    name: "Bolívar Homes",
    slug: "bolivar-homes",
    logoUrl: "/images/agencies/bolivar-homes.svg",
    phone: "5492281332211",
    email: "info@bolivarhomes.com.ar",
    address: "Av. Brown 510",
    city: "San Carlos de Bolívar",
    description:
      "Inmobiliaria boutique con foco en departamentos de diseño, monoambientes céntricos y locales comerciales.",
  },
}
