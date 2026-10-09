/** Qué se está viendo, en una sola línea: el conteo va adelante del título. */
export function Encabezado({ titulo, total }: { titulo: string; total: number }) {
  return (
    <h1 className="truncate text-base leading-tight font-titulo tabular-nums">
      ({total}) {titulo}
    </h1>
  )
}
