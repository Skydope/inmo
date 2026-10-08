import { brandName } from "@/lib/brand"
import { cn } from "@/lib/utils"

/**
 * Isotipo: un cartel visto de frente (cuadrado azul plano) con una "b" dibujada
 * con trazos, no con una fuente, para que se vea igual como favicon. Plano, dos
 * colores, legible a 16 px. Mide en `em`: crece con la letra de quien lo usa.
 */
export function Isotipo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-[1.6em] shrink-0", className)}
    >
      <rect width="32" height="32" rx="7" className="fill-plano-700" />
      <path
        d="M11 7.5v17"
        fill="none"
        stroke="#fff"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <circle cx="17.2" cy="19" r="5.4" fill="none" stroke="#fff" strokeWidth="3.6" />
    </svg>
  )
}

/** Isotipo + "bolívar inmo" en minúscula, como el dominio. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-[0.45em] leading-none", className)}
    >
      <Isotipo />
      <span className="font-encode text-[1.1em] tracking-[-0.01em] text-tinta [font-stretch:87.5%]">
        <span className="font-bold">bolívar</span> <span className="font-normal">inmo</span>
      </span>
      <span className="sr-only">{brandName}</span>
    </span>
  )
}
