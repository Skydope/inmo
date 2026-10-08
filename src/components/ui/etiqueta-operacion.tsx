import { cn } from "@/lib/utils"

/**
 * El "cartel": VENTA / ALQUILER / TEMPORARIO como el cartel que la inmobiliaria clava
 * en el frente. Fondo tinta, letra blanca, condensada y en mayúsculas. Es el único
 * lugar de la interfaz con mayúsculas.
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
        "inline-flex items-center rounded-[4px] bg-tinta px-2 py-1 font-encode text-xs leading-none font-bold tracking-[0.06em] text-blanco uppercase [font-stretch:75%]",
        className
      )}
    >
      {children}
    </span>
  )
}
