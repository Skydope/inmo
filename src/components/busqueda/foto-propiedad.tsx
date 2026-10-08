import { CoverImage } from "@/components/cover-image"
import { IconoTipo } from "@/components/busqueda/icono-tipo"
import type { TipoPropiedad } from "@/lib/busqueda/taxonomia"
import { cn } from "@/lib/utils"

/** La portada de una propiedad; sin foto, el plano `papel` con el ícono del tipo. */
export function FotoPropiedad({
  src,
  tipo,
  alt,
  className,
}: {
  src: string | undefined
  tipo: TipoPropiedad
  alt: string
  className?: string
}) {
  if (src) return <CoverImage src={src} alt={alt} className={cn("object-cover", className)} />
  return (
    <div
      role="img"
      aria-label={alt ? `${alt} (sin foto)` : "Sin foto"}
      className={cn("grid place-items-center bg-papel text-tinta-suave", className)}
    >
      <IconoTipo tipo={tipo} className="size-8" />
    </div>
  )
}
