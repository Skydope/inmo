import { Opcion } from "@/components/ui/opcion"

function Grupo({
  nombre,
  titulo,
  maximo,
  elegido,
}: {
  nombre: "dorm" | "banos"
  titulo: string
  maximo: number
  elegido: number | undefined
}) {
  const opciones = Array.from({ length: maximo }, (_, i) => i + 1)
  return (
    <div role="radiogroup" aria-label={titulo} className="flex flex-col gap-2">
      <h2 className="font-semibold">{titulo}</h2>
      <div className="flex flex-wrap gap-2">
        <Opcion tipo="radio" variante="chip" name={nombre} value="" etiqueta="Indistinto" defaultChecked={!elegido} />
        {opciones.map((n) => (
          <Opcion
            key={n}
            tipo="radio"
            variante="chip"
            name={nombre}
            value={String(n)}
            etiqueta={`${n}+`}
            defaultChecked={elegido === n}
          />
        ))}
      </div>
    </div>
  )
}

/** Dormitorios y baños como "al menos n". Solo se muestra si hay tipos de vivienda. */
export function CampoAmbientes({ dorm, banos }: { dorm?: number; banos?: number }) {
  return (
    <div className="flex flex-col gap-5">
      <Grupo nombre="dorm" titulo="Dormitorios" maximo={4} elegido={dorm} />
      <Grupo nombre="banos" titulo="Baños" maximo={3} elegido={banos} />
    </div>
  )
}
