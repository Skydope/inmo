import Link from "next/link"
import { CoverImage } from "@/components/cover-image"
import { formatPrice, typeLabel } from "@/lib/format"
import type { Property } from "@/lib/properties/types"

export function LandingPropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/propiedades/${property.id}`}
      className="group flex overflow-hidden rounded-card bg-bg-elevated transition hover:-translate-y-0.5 sm:block"
    >
      <div className="relative aspect-square w-32 shrink-0 overflow-hidden sm:aspect-[4/3] sm:w-auto">
        <CoverImage
          src={property.coverUrl}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-3 py-3 sm:block sm:space-y-3 sm:px-4 sm:pb-4 sm:pt-3">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <p className="text-lg font-semibold tracking-tight text-fg">
            {formatPrice(property.price, property.currency)}
          </p>
          <p className="truncate text-sm text-fg-muted">
            {property.areaM2} m² {typeLabel(property.type).toLowerCase()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.beds > 0 ? (
            <span className="rounded-full bg-fg px-2.5 py-1 text-xs text-bg">
              {property.beds} dorm.
            </span>
          ) : null}
          {property.baths > 0 ? (
            <span className="rounded-full bg-fg px-2.5 py-1 text-xs text-bg">
              {property.baths} baño{property.baths === 1 ? "" : "s"}
            </span>
          ) : null}
          <span className="rounded-full bg-fg px-2.5 py-1 text-xs text-bg">
            {property.areaM2} m²
          </span>
        </div>
      </div>
    </Link>
  )
}
