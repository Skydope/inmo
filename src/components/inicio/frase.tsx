/**
 * La frase de arriba de las secciones: qué es esto y los números del portal, en una oración.
 * Discreta: Encode Sans, gris, dos o tres líneas (inicio-v2). El texto sale de `fraseDelPortal`.
 */
export function Frase({ texto }: { texto: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 md:pt-12">
      <p className="frase max-w-2xl text-[1.0625rem] leading-snug text-tinta-suave text-pretty md:text-xl">{texto}</p>
    </div>
  )
}
