import { Destacadas } from "@/components/inicio/destacadas"
import { Hero } from "@/components/inicio/hero"
import { Inmobiliarias } from "@/components/inicio/inmobiliarias"
import { Numeros } from "@/components/inicio/numeros"
import { PorTipo } from "@/components/inicio/por-tipo"
import { PorZona } from "@/components/inicio/por-zona"
import { RecienPublicadas } from "@/components/inicio/recien-publicadas"
import { SosInmobiliaria } from "@/components/inicio/sos-inmobiliaria"
import { Pie } from "@/components/shell/pie"
import { BUSQUEDA_VACIA, contarPorOpcion } from "@/lib/busqueda"
import {
  categoriasDelInicio,
  destacadas,
  inmobiliariasDelInicio,
  numerosDelPortal,
  recientes,
  zonasConPropiedades,
} from "@/lib/inicio"
import { getProperties } from "@/lib/properties/adapter"
import { aTarjeta } from "@/lib/properties/tarjeta"

/**
 * El inicio. Arriba, el hero: la casa de día o de noche, VIVÍ BOLÍVAR detrás del techo y el
 * paso 1 del buscador guiado, "¿Qué estás buscando?", en la primera pantalla.
 * Spec: docs/hitos/hito-1/vivi-bolivar.md (y buscador-guiado.md § Paso 1).
 *
 * Debajo, la hoja que sube por encima de la foto con el contenido del portal, todo contado de
 * los datos, y el pie. Spec: docs/hitos/hito-1/inicio-y-pie.md.
 */
export default async function HomePage() {
  const propiedades = await getProperties()
  const conteo = contarPorOpcion(propiedades, BUSQUEDA_VACIA, "operacion")
  const numeros = numerosDelPortal(propiedades)

  return (
    <>
      {/* Bloque, no flex: tiene que contener al hero quieto (sticky) y a la hoja que sube. */}
      <main className="flex-1">
        <Hero conteo={conteo} />
        <div className="hoja">
          {numeros ? <Numeros numeros={numeros} /> : null}
          <RecienPublicadas tarjetas={recientes(propiedades, 8).map(aTarjeta)} />
          <PorTipo categorias={categoriasDelInicio(propiedades)} />
          <Destacadas tarjetas={destacadas(propiedades).map(aTarjeta)} />
          <PorZona zonas={zonasConPropiedades(propiedades)} />
          <Inmobiliarias inmobiliarias={inmobiliariasDelInicio(propiedades)} />
          <SosInmobiliaria />
        </div>
      </main>
      <Pie />
    </>
  )
}
