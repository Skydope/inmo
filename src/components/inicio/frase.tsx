import { Fragment } from "react"

/**
 * La frase de arriba de la hoja, en la letra del cartel (Archivo Black, en oración).
 * Una `<span>` por palabra para encenderlas de a una al bajar (CSS, globals.css); los
 * espacios quedan como texto, así un lector de pantalla la lee como una oración.
 */
export function Frase({ texto }: { texto: string }) {
  const palabras = texto.split(" ")
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-2 md:pt-16 md:pb-6">
      <p
        className="frase max-w-3xl text-[1.5rem] leading-[1.15] text-tinta md:text-[2rem] lg:text-[2.25rem]"
        style={{ "--n": palabras.length } as React.CSSProperties}
      >
        {palabras.map((palabra, i) => (
          <Fragment key={i}>
            {i > 0 ? " " : null}
            <span style={{ "--i": i } as React.CSSProperties}>{palabra}</span>
          </Fragment>
        ))}
      </p>
    </div>
  )
}
