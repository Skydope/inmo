/** Saca el 54 (y un 0 de discado nacional) para mostrar el número detrás de +54. */
export function nacionalArgentino(valor: string) {
  let digitos = valor.replace(/\D/g, "")
  if (digitos.startsWith("00")) digitos = digitos.slice(2)
  if (digitos.startsWith("54")) digitos = digitos.slice(2)
  if (digitos.startsWith("0")) digitos = digitos.slice(1)
  return digitos
}
