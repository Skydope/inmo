/** Visor cuadrado del recorte, en px de pantalla. */
export const LADO_VISTA = 240

/**
 * Lado del PNG que queda en memoria. Al conectar el alta, ese cuadrado se codifica
 * a WebP (calidad 0.8) y se sube. Este módulo no lo hace: ver
 * docs/hitos/hito-2/ingreso-y-cuenta.md.
 */
export const LADO_SALIDA = 512

export function escalaParaCubrir(ancho: number, alto: number, vista = LADO_VISTA) {
  return Math.max(vista / ancho, vista / alto)
}

function limitar(valor: number, minimo: number, maximo: number) {
  return Math.min(maximo, Math.max(minimo, valor))
}

/** La imagen siempre tapa el visor. `zoom` 1 es el mínimo (cover). */
export function encuadrar(
  x: number,
  y: number,
  ancho: number,
  alto: number,
  zoom: number,
  vista = LADO_VISTA,
) {
  const escala = escalaParaCubrir(ancho, alto, vista) * zoom
  const dw = ancho * escala
  const dh = alto * escala
  return {
    x: limitar(x, vista - dw, 0),
    y: limitar(y, vista - dh, 0),
    escala,
  }
}

export function centrar(ancho: number, alto: number, zoom = 1, vista = LADO_VISTA) {
  const escala = escalaParaCubrir(ancho, alto, vista) * zoom
  return encuadrar((vista - ancho * escala) / 2, (vista - alto * escala) / 2, ancho, alto, zoom, vista)
}

/** Al cambiar el zoom, el punto del medio del visor sigue siendo el mismo de la foto. */
export function zoomSobreElCentro(
  x: number,
  y: number,
  zoom: number,
  zoomNuevo: number,
  ancho: number,
  alto: number,
  vista = LADO_VISTA,
) {
  const antes = escalaParaCubrir(ancho, alto, vista) * zoom
  const despues = escalaParaCubrir(ancho, alto, vista) * zoomNuevo
  const ix = (vista / 2 - x) / antes
  const iy = (vista / 2 - y) / antes
  return encuadrar(vista / 2 - ix * despues, vista / 2 - iy * despues, ancho, alto, zoomNuevo, vista)
}

/** Rectángulo de la foto original que se ve en el visor. Es cuadrado. */
export function recorteVisible(
  x: number,
  y: number,
  ancho: number,
  alto: number,
  zoom: number,
  vista = LADO_VISTA,
) {
  const { x: ex, y: ey, escala } = encuadrar(x, y, ancho, alto, zoom, vista)
  return { sx: -ex / escala, sy: -ey / escala, lado: vista / escala }
}
