/**
 * La foto del hero del inicio: la casa de campo de Matías Asin, de día y de noche (mismas
 * medidas y mismo encuadre), y su primer plano, el techo y el frente que van **delante** de
 * "VIVÍ BOLÍVAR". Coordenadas en píxeles de la foto original. Spec:
 * docs/hitos/hito-1/vivi-bolivar.md.
 */

export const FOTO_DE_LA_CASA = { ancho: 1672, alto: 941 } as const

type Punto = readonly [x: number, y: number]

/** El contorno del primer plano (de la versión de `main`, `hero-interactive.tsx`). */
export const PRIMER_PLANO: readonly Punto[] = [
  [0, 710],
  [489, 710],
  [489, 613],
  [670, 604],
  [670, 536],
  [598, 527],
  [598, 513],
  [1358, 436],
  [1456, 496],
  [1456, 510],
  [1435, 513],
  [1435, 540],
  [1500, 535],
  [1500, 526],
  [1552, 526],
  [1627, 569],
  [1627, 710],
  [1672, 710],
  [1672, 941],
  [0, 941],
]

const enPorcentaje = (valor: number, total: number) => `${Number(((valor / total) * 100).toFixed(2))}%`

/** El primer plano para `clip-path: polygon(…)`, en % de la foto (sirve a cualquier tamaño). */
export function poligonoEnPorcentaje(): string {
  const { ancho, alto } = FOTO_DE_LA_CASA
  return PRIMER_PLANO.map(([x, y]) => `${enPorcentaje(x, ancho)} ${enPorcentaje(y, alto)}`).join(", ")
}

/**
 * Dónde empieza el primer plano (lo más alto) en la columna `x` de la foto: ahí se apoya
 * "BOLÍVAR" para que el techo le tape la base de las letras.
 */
export function techoEn(x: number): number {
  const { alto } = FOTO_DE_LA_CASA
  let techo: number = alto
  PRIMER_PLANO.forEach(([x1, y1], i) => {
    const [x2, y2] = PRIMER_PLANO[(i + 1) % PRIMER_PLANO.length]
    if (x1 === x2 || x < Math.min(x1, x2) || x > Math.max(x1, x2)) return
    techo = Math.min(techo, y1 + ((x - x1) / (x2 - x1)) * (y2 - y1))
  })
  return techo
}
