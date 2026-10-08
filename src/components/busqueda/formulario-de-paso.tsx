"use client"

import Form from "next/form"
import Link from "next/link"
import { X } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { datosDe, useBusquedaDelFormulario } from "./use-busqueda-del-formulario"
import {
  contarResultados,
  escribirBusqueda,
  hrefDeBusqueda,
  leerBusqueda,
  rutaDePaso,
  sugerenciasSinResultados,
  type Busqueda,
  type Filtrable,
  type PasoEnBuscar,
} from "@/lib/busqueda"

/** Marca las casillas y escribe los montos como dice la URL (multivalores con coma o repetidos). */
function sincronizarConUrl(form: HTMLFormElement, url: URLSearchParams) {
  const valores = (nombre: string) => url.getAll(nombre).flatMap((v) => v.split(","))
  for (const input of form.querySelectorAll<HTMLInputElement>("input[name]")) {
    if (input.type === "hidden") continue
    const elegidos = valores(input.name)
    if (input.type === "checkbox") {
      input.checked = elegidos.includes(input.value)
    } else if (input.type === "radio") {
      if (elegidos.length > 0) input.checked = elegidos.includes(input.value)
      // Sin valor en la URL: "Indistinto" (value ""). La moneda no tiene opción vacía y queda
      // como vino del servidor.
      else if (input.value === "") input.checked = true
    } else if (url.has(input.name)) {
      input.value = url.get(input.name) ?? ""
    }
  }
}


/**
 * El formulario de un paso. Sin JavaScript es un formulario GET común: "Continuar" va al
 * paso siguiente y "Ver las N ahora" a resultados, con todo lo elegido en la URL. Con
 * JavaScript, `next/form` navega sin recargar y el conteo del pie se recalcula al tocar cada
 * opción, leyendo los datos del propio formulario contra el índice compacto.
 */
export function FormularioDePaso({
  paso,
  busqueda,
  indice,
  accion,
  ocultos,
  idTitulo,
  ultimo = false,
  children,
}: {
  paso: PasoEnBuscar
  busqueda: Busqueda
  indice: Filtrable[]
  /** La ruta del paso siguiente (o `/propiedades` en el último), sin query. */
  accion: string
  /** Lo elegido en otros pasos, que viaja en `<input type="hidden">`. */
  ocultos: [string, string][]
  idTitulo: string
  ultimo?: boolean
  children: React.ReactNode
}) {
  // `next/form` no pasa la ref al <form>: se escucha desde un contenedor propio.
  const contenedor = useRef<HTMLDivElement>(null)
  // La búsqueda con la que se armó este paso (el componente se re-crea con cada URL de paso).
  const busquedaInicial = useRef(busqueda)
  const actual = useBusquedaDelFormulario(contenedor, busqueda, (form) => {
    // Al volver con "atrás", Next reconstruye el paso desde su caché (armado antes de marcar
    // nada) aunque la URL ya tenga lo elegido: la URL manda. Solo cuando no coinciden: si no,
    // un toque hecho antes de hidratar (celular lento) se perdería.
    const url = new URLSearchParams(window.location.search)
    if (escribirBusqueda(leerBusqueda(url)) !== escribirBusqueda(busquedaInicial.current)) {
      sincronizarConUrl(form, url)
    }
  })
  const conteo = contarResultados(indice, actual)

  const sugerencias = conteo === 0 ? sugerenciasSinResultados(indice, actual).slice(0, 4) : []

  return (
    <Form
      action={accion}
      className="flex flex-1 flex-col"
      onSubmit={(e) => {
        // Antes de avanzar, la URL de este paso guarda lo marcado: así "atrás" vuelve con
        // las opciones elegidas (con navegación del cliente no hay restauración del navegador).
        const elegido = leerBusqueda(datosDe(e.currentTarget))
        window.history.replaceState(window.history.state, "", hrefDeBusqueda(`/buscar/${paso}`, elegido))
      }}
    >
      <div ref={contenedor} hidden />
      {ocultos.map(([clave, valor]) => (
        <input key={`${clave}=${valor}`} type="hidden" name={clave} value={valor} />
      ))}

      <fieldset aria-labelledby={idTitulo} className="mx-auto w-full max-w-xl flex-1 px-4 pt-6 pb-8">
        {children}
      </fieldset>

      <div className="sticky bottom-0 z-20 border-t border-linea bg-blanco shadow-[0_-6px_16px_rgb(0_0_0/0.05)]">
        <div className="mx-auto flex max-w-xl flex-col gap-1 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {conteo === 0 ? (
            <div className="py-1" aria-live="polite">
              <p className="text-center text-sm font-semibold">Con esto no hay propiedades.</p>
              {sugerencias.length > 0 ? (
                <>
                  <p className="mt-1 text-center text-sm text-tinta-suave">Probá sacando:</p>
                  <ul className="mt-1 flex flex-wrap justify-center gap-2">
                    {sugerencias.map((s) => (
                      <li key={s.clave}>
                        <Link
                          href={rutaDePaso(paso, s.sin)}
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-linea px-3 text-sm font-semibold hover:border-tinta-suave"
                        >
                          {s.etiqueta}
                          <X className="size-4" aria-hidden="true" />
                          <span className="text-tinta-suave tabular-nums">· {s.conteo}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          ) : ultimo ? null : (
            <button
              type="submit"
              formAction="/propiedades"
              className="min-h-11 text-sm font-semibold text-plano-700 underline-offset-4 hover:underline"
            >
              Ver {conteo === 1 ? "la propiedad" : `las ${conteo} propiedades`} ahora
            </button>
          )}
          <Button type="submit" size="lg" className="w-full" aria-live="polite">
            {ultimo ? `Ver ${conteo} ${conteo === 1 ? "propiedad" : "propiedades"}` : "Continuar"}
          </Button>
        </div>
      </div>
    </Form>
  )
}
