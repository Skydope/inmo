/** Qué se está viendo y cuántas son. */
export function Encabezado({ titulo, total }: { titulo: string; total: number }) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 pt-4 lg:max-w-none">
      <h1 className="line-clamp-2 text-xl leading-tight font-titulo">{titulo}</h1>
      <p className="text-sm text-tinta-suave">
        {total} {total === 1 ? "propiedad" : "propiedades"}
      </p>
    </div>
  )
}
