import { cortarDescripcion, parrafos } from "@/lib/texto"

export function Descripcion({ texto }: { texto: string }) {
  if (!texto.trim()) return null
  const { inicio, resto } = cortarDescripcion(texto)
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-titulo text-xl">Descripción</h2>
      <div className="flex flex-col gap-3 leading-relaxed">
        {parrafos(inicio).map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}
        {resto ? (
          <details>
            <summary className="flex min-h-11 cursor-pointer list-none items-center font-semibold [&::-webkit-details-marker]:hidden">
              Leer más
            </summary>
            <div className="flex flex-col gap-3">
              {parrafos(resto).map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </section>
  )
}
