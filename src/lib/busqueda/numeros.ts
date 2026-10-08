/**
 * Montos como se escriben en Argentina: "45.000". Sin JavaScript, el formulario manda lo que
 * la persona escribió, así que la URL acepta el punto de miles bien puesto ("1.250.000") y
 * rechaza lo ambiguo ("4.5", "45,000", "1e9").
 */
const SOLO_DIGITOS = /^\d{1,15}$/
const CON_PUNTO_DE_MILES = /^\d{1,3}(\.\d{3}){1,4}$/

export function leerMonto(texto: string): number | undefined {
  const limpio = texto.trim()
  if (!SOLO_DIGITOS.test(limpio) && !CON_PUNTO_DE_MILES.test(limpio)) return undefined
  const n = Number(limpio.replaceAll(".", ""))
  return Number.isSafeInteger(n) ? n : undefined
}

const miles = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 })

export function escribirMonto(n: number | undefined): string {
  return n === undefined ? "" : miles.format(n)
}
