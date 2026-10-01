import Link from "next/link"
import { CoverImage } from "@/components/cover-image"
import { formatPrice, typeLabel } from "@/lib/format"
import type { Property } from "@/lib/properties/types"

export function LandingPropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/propiedades/${property.id}`}
      className="group block overflow-hidden rounded-card bg-bg-elevated transition hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <CoverImage
          src={property.coverUrl}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-3 px-4 pb-4 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-lg font-semibold tracking-tight text-fg">
            {formatPrice(property.price, property.currency)}
          </p>
          <p className="text-sm text-fg-muted">
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
