import type { Agency } from "@/lib/agencies/types"
import { cn } from "@/lib/utils"

export function Inmobiliaria({ agencia, className }: { agencia: Agency; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-2", className)}>
      <h2 className="font-titulo text-xl">Publicada por</h2>
      <div className="flex items-center gap-3">
        {agencia.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={agencia.logoUrl} alt="" className="size-10 rounded-control bg-papel object-contain" />
        ) : null}
        <div className="min-w-0">
          <p className="font-semibold">{agencia.name}</p>
          {agencia.license ? <p className="text-sm text-tinta-suave">Matrícula {agencia.license}</p> : null}
          {agencia.address ? <p className="text-sm text-tinta-suave">{agencia.address}</p> : null}
        </div>
      </div>
    </section>
  )
}
