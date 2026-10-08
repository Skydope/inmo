import type { NumerosDelPortal } from "@/lib/inicio"

const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios)

/** La franja de números del portal, contados de los datos. Sin contadores animados. */
export function Numeros({ numeros }: { numeros: NumerosDelPortal }) {
  const items = [
    { n: numeros.propiedades, etiqueta: plural(numeros.propiedades, "propiedad", "propiedades") },
    { n: numeros.inmobiliarias, etiqueta: plural(numeros.inmobiliarias, "inmobiliaria", "inmobiliarias") },
    { n: numeros.zonas, etiqueta: plural(numeros.zonas, "zona", "zonas") },
  ]
  return (
    <section aria-label="Bolívar Inmo en números" className="border-b border-linea bg-blanco">
      <dl className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-linea px-2 py-5">
        {items.map(({ n, etiqueta }) => (
          <div key={etiqueta} className="flex flex-col items-center px-2 text-center">
            <dt className="text-sm text-tinta-suave">{etiqueta}</dt>
            <dd className="order-first text-3xl leading-tight font-titulo tabular-nums md:text-4xl">{n}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
