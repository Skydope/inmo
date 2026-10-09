import { cn } from "@/lib/utils"

/**
 * El "cartel": VENTA / ALQUILER / TEMPORARIO como el cartel que la inmobiliaria clava
 * en el frente. Fondo `noche`, letra `sobre-noche`: el par no se invierte de noche.
 * Condensada y en mayúsculas.
 */
export function EtiquetaOperacion({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] bg-noche px-2 py-1 font-encode text-xs leading-none font-bold tracking-[0.06em] text-sobre-noche uppercase [font-stretch:75%]",
        className
      )}
    >
      {children}
    </span>
  )
}
