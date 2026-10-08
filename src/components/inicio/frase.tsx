import { Fragment } from "react"

/**
 * La frase de arriba de la hoja, en la voz del inicio (Instrument Serif). Una `<span>` por
 * palabra para encenderlas de a una al bajar (CSS, globals.css); los espacios quedan como
 * texto, así un lector de pantalla la lee como una oración.
 */
export function Frase({ texto }: { texto: string }) {
  const palabras = texto.split(" ")
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-2 md:pt-16 md:pb-6">
      <p
        className="frase max-w-4xl font-voz text-[1.75rem] leading-[1.2] text-tinta md:text-[2.5rem] lg:text-5xl"
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
