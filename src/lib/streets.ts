import { BOLIVAR_CENTER } from "@/lib/brand"
import { haversineKm } from "@/lib/geo"

export const STREET_QUERY_MIN = 2
const MAX_KM = 15

export type StreetLines = {
  type: "FeatureCollection"
  name?: string
  features: {
    type: "Feature"
    properties: { name?: string }
    geometry: { type: "LineString"; coordinates: [number, number][] }
  }[]
}

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] }
  properties?: {
    name?: string
    osm_key?: string
    countrycode?: string
  }
}

type NominatimHit = {
  category?: string
  geojson?: {
    type?: string
    coordinates?: [number, number][] | [number, number]
  }
}

export function normalizeStreetName(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

export const BOLIVAR_KNOWN_STREETS: readonly string[] = [
  "21 de Septiembre",
  "A. Martínez",
  "Acceso a Bolívar",
  "Alberti",
  "Almafuerte",
  "Alvarado",
  "Alvear",
  "Amado",
  "Ameghino",
  "Arenales",
  "Artigas",
  "Aurelio del Cerro",
  "Avellaneda",
  "Avenida 25 de Mayo",
  "Avenida 3 de Febrero",
  "Avenida 9 de Julio",
  "Avenida Almirante Brown",
  "Avenida Alsina",
  "Avenida Belgrano",
  "Avenida Bellomo",
  "Avenida Calfucurá",
  "Avenida Cancio",
  "Avenida Centenario",
  "Avenida Fabres García",
  "Avenida General Paz",
  "Avenida Juan Domingo Perón",
  "Avenida Juan Manuel de Rosas",
  "Avenida Lavalle",
  "Avenida Leandro N. Alem",
  "Avenida Mariano Unzué",
  "Avenida Pedro Vignau",
  "Avenida San Martín",
  "Avenida Venezuela",
  "Avenida Vignau",
  "Azcuénaga",
  "Báez",
  "Balbín",
  "Balcarce",
  "Belgrano",
  "Bernardo de Irigoyen",
  "Bertón",
  "Boer",
  "Bolívar",
  "Bolivia",
  "Borges",
  "Brasil",
  "Buenos Aires",
  "Busquet",
  "Cacique Catriel",
  "Cacique Pincén",
  "Cacique Simón Coliqueo",
  "Carlos Gardel",
  "Carlos Iglesias",
  "Casariego",
  "Casartelli",
  "Castelli",
  "Castells",
  "Catamarca",
  "Cayetano Palazzolo",
  "Chacarita",
  "Chaco",
  "Chatruc Miguens",
  "Chiclana",
  "Chilavert",
  "Chubut",
  "Colombia",
  "Colombo",
  "Colón",
  "Colorados del Monte",
  "Comandante Piedrabuena",
  "Córdoba",
  "Coronel García",
  "Corrientes",
  "Cortázar",
  "Danessa",
  "Daroqui",
  "De Izarra",
  "De Lucía",
  "Dionel",
  "Doctor Antonio Díaz",
  "Doctor Capredoni",
  "Domingo Santos",
  "Dorrego",
  "Ecuador",
  "Eddy",
  "Edison",
  "El Tonelero",
  "Entre Ríos",
  "Erramuspe",
  "Esquel",
  "Estado Federal",
  "Falucho",
  "Fangio",
  "Felipe I",
  "Fernández López",
  "Florencio Camet",
  "Formosa",
  "Fortín San Carlos",
  "Franceauxa",
  "Funes",
  "General Lagos",
  "General Mansilla",
  "General Paz",
  "Güemes",
  "Heredia",
  "Humberto I",
  "Isla Soledad",
  "Jorge Newbery",
  "José Hernández",
  "Juan XXIII",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Laguna del Cura",
  "Lamadrid",
  "Laprida",
  "Larrea",
  "Larregle",
  "Las Glisinas",
  "Las Heras",
  "Las Malvinas",
  "Las Margaritas",
  "Las Palmeras",
  "Las Retamas",
  "Las Rosas",
  "Leiría",
  "Libertador",
  "Linch",
  "Los Ceibos",
  "Los Claveles",
  "Los Hornos",
  "Los Jazmines",
  "Los Sauces",
  "Lucio V. Mansilla",
  "Luis Martirani",
  "Magallanes",
  "Maineri",
  "Mallol",
  "Manuel Namuncurá",
  "Mapuches",
  "Marconi",
  "María Elena Walsh",
  "Marinos de Belgrano",
  "Matheu",
  "Méndez",
  "Mendoza",
  "Mercedes Sosa",
  "Misiones",
  "Mitre",
  "Moreno",
  "Natiello",
  "Necochea",
  "Neuquén",
  "Nueva Plata",
  "O'Higgins",
  "Obispo Prieto",
  "Obligado",
  "Ocampo",
  "Olascoaga",
  "Olavarría",
  "Ombú",
  "Orlando",
  "Pablo VI",
  "Palavecino",
  "Paraguay",
  "Parchape",
  "Paso",
  "Pasquali",
  "Pasteur",
  "Pay Lauquen",
  "Pellegrini",
  "Perú",
  "Pichi Carhué",
  "Pinaro",
  "Pío XII",
  "Pringles",
  "Profesor Castellá",
  "Puente Colgante",
  "Pueyrredón",
  "Quinta Caballería",
  "Quintana",
  "Quirno Costa",
  "Rafael Hernández",
  "Ramón Carrillo",
  "Ranqueles",
  "Rebución",
  "Reina Sofía",
  "Río Gallegos",
  "Río Negro",
  "Rivadavia",
  "Rivas",
  "Roca",
  "Rodríguez Peña",
  "Rogelio Solís",
  "Rolando Demarchi",
  "Rondeau",
  "Rueda",
  "Rufino Viera",
  "Ruta Nacional 226",
  "Ruta Provincial 65 Ministro Carlos Rodríguez Jáuregui",
  "Saavedra",
  "Sáenz Peña",
  "Salta",
  "San Juan",
  "San Lorenzo",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santa María",
  "Santiago del Estero",
  "Santos Plaza",
  "Sargento Cabral",
  "Sarmiento",
  "Sayhueque",
  "Sebastián Hueso",
  "Simón Ichazo",
  "Sor Ana María",
  "Stamponi",
  "Tehuelches",
  "Tierra del Fuego",
  "Tucumán",
  "Uriburu",
  "Urquiza",
  "Uruguay",
  "Ushuaia",
  "Viamonte",
  "Vicente López",
  "Zapiola",
] as const

export function filterBolivarStreets(query: string): string[] {
  const q = normalizeStreetName(query)
  if (!q) return []

  const startsWithName: string[] = []
  const startsWithWord: string[] = []
  const contains: string[] = []

  for (const name of BOLIVAR_KNOWN_STREETS) {
    const norm = normalizeStreetName(name)
    if (norm === q) {
      startsWithName.unshift(name)
      continue
    }
    if (norm.startsWith(q)) {
      startsWithName.push(name)
      continue
    }
    const words = norm.split(/\s+/)
    if (words.some((w) => w.startsWith(q))) {
      startsWithWord.push(name)
      continue
    }
    if (norm.includes(q)) {
      contains.push(name)
    }
  }

  return [...startsWithName, ...startsWithWord, ...contains].slice(0, 10)
}

export function streetNamesFromPhoton(features: PhotonFeature[]): string[] {
  const seen = new Set<string>()
  const names: string[] = []
  for (const feature of features) {
    const props = feature.properties
    const coords = feature.geometry?.coordinates
    if (!props?.name || props.osm_key !== "highway" || !coords) continue
    if (props.countrycode && props.countrycode !== "AR") continue
    const km = haversineKm(BOLIVAR_CENTER, { lng: coords[0], lat: coords[1] })
    if (km > MAX_KM) continue
    const key = props.name.toLocaleLowerCase("es-AR")
    if (seen.has(key)) continue
    seen.add(key)
    names.push(props.name)
  }
  return names
}

export function linesFromNominatim(hits: NominatimHit[], streetName?: string): StreetLines {
  return {
    type: "FeatureCollection",
    name: streetName,
    features: hits.flatMap((hit) => {
      const geo = hit.geojson
      if (
        hit.category !== "highway" ||
        geo?.type !== "LineString" ||
        !geo.coordinates ||
        geo.coordinates.length < 2 ||
        !Array.isArray(geo.coordinates[0])
      ) {
        return []
      }
      return [
        {
          type: "Feature" as const,
          properties: { name: streetName },
          geometry: {
            type: "LineString" as const,
            coordinates: geo.coordinates as [number, number][],
          },
        },
      ]
    }),
  }
}

export function getStreetMidpoint(data: StreetLines): { lng: number; lat: number } | null {
  const allCoords = data.features.flatMap((f) => f.geometry.coordinates)
  if (!allCoords.length) return null

  let sumLat = 0
  let sumLng = 0
  for (const [lng, lat] of allCoords) {
    sumLat += lat
    sumLng += lng
  }
  const avgLat = sumLat / allCoords.length
  const avgLng = sumLng / allCoords.length

  let closest = allCoords[0]
  let minDist = Infinity
  for (const coord of allCoords) {
    const d = (coord[0] - avgLng) ** 2 + (coord[1] - avgLat) ** 2
    if (d < minDist) {
      minDist = d
      closest = coord
    }
  }

  return { lng: closest[0], lat: closest[1] }
}
