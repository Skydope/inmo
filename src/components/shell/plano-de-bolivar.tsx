import { cn } from "@/lib/utils"
import { PLANO_DE_BOLIVAR } from "./plano-de-bolivar.datos"

/**
 * Las calles del casco urbano de Bolívar en líneas finas (OpenStreetMap, ODbL: la atribución va
 * en el pie). Decorativo. Cada calle es un trazo con `pathLength=1`, para que el CSS lo dibuje
 * de punta a punta al llegar (globals.css, solo con soporte y sin movimiento reducido).
 */
export function PlanoDeBolivar({ className }: { className?: string }) {
  const { ancho, alto, calles, avenidas } = PLANO_DE_BOLIVAR
  return (
    <div className={cn("plano", className)} aria-hidden="true">
      <svg viewBox={`0 0 ${ancho} ${alto}`} preserveAspectRatio="xMidYMid slice" focusable="false" className="size-full">
        <g className="calles">
          {calles.map((d, i) => (
            <path key={i} d={d} pathLength={1} />
          ))}
        </g>
        <g className="avenidas">
          {avenidas.map((d, i) => (
            <path key={i} d={d} pathLength={1} />
          ))}
        </g>
      </svg>
    </div>
  )
}
