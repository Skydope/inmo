/** Parte el texto en párrafos. Cualquier salto de línea abre uno nuevo. */
export function parrafos(texto: string): string[] {
  return texto
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

const FIN_DE_ORACION = /[.!?](?=\s|$)/g

/**
 * Los primeros ~`limite` caracteres, cortados en un final de oración.
 * Si el texto entra, `resto` es null y no hay "Leer más".
 */
export function cortarDescripcion(
  texto: string,
  limite = 300
): { inicio: string; resto: string | null } {
  const limpio = texto.trim()
  if (limpio.length <= limite) return { inicio: limpio, resto: null }

  let corte = -1
  for (const coincidencia of limpio.matchAll(FIN_DE_ORACION)) {
    const fin = coincidencia.index + coincidencia[0].length
    if (fin <= limite) corte = fin
    else break
  }
  if (corte === -1) {
    const despues = limpio.slice(limite).search(/[.!?](?=\s|$)/)
    if (despues !== -1) corte = limite + despues + 1
    else {
      const espacio = limpio.lastIndexOf(" ", limite)
      corte = espacio > 0 ? espacio : limite
    }
  }

  const inicio = limpio.slice(0, corte).trim()
  const resto = limpio.slice(corte).trim()
  return { inicio, resto: resto.length > 0 ? resto : null }
}
