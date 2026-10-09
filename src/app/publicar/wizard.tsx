"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { IconoTipo } from "@/components/busqueda/icono-tipo"
import {
  CaretLeft,
  CaretRight,
  CurrencyCircleDollar,
  House,
  Image as ImageIcon,
  MapPin,
  Minus,
  Plus,
  Ruler,
  SlidersHorizontal,
  TextT,
  VideoCamera,
  type IconProps,
} from "@/components/iconos"
import { Logo } from "@/components/marca/logo"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Opcion } from "@/components/ui/opcion"
import { SEED_AGENCIES } from "@/lib/agencies/seed"
import { brandName } from "@/lib/brand"
import {
  GRUPOS_DE_ZONA,
  MONEDAS,
  OPERACIONES,
  caracteristicasDe,
  etiquetaCaracteristica,
  etiquetaOperacion,
  etiquetaTipo,
  monedaPorDefecto,
  nombreZona,
  tiposDe,
  zonasDelGrupo,
  type Caracteristica,
  type Operacion,
} from "@/lib/busqueda"
import {
  PASOS_DE_AVISO,
  camposDeMedida,
  caracteristicasCompatibles,
  esContador,
  etiquetaMedida,
  indiceDePaso,
  llevaExpensas,
  mover,
  tipoCompatible,
  tituloSugerido,
  type PasoDeAviso,
} from "@/lib/publicar/pasos"
import { cn } from "@/lib/utils"
import { esCampoContador, esCampoSuperficie, useBorrador, type Medio } from "./borrador"

const agencia = SEED_AGENCIES.norte.name

const MapaDelAviso = dynamic(() => import("./mapa-pin").then((m) => m.MapaPin), {
  ssr: false,
  loading: () => (
    <div className="grid h-56 place-items-center rounded-control border border-linea bg-papel">
      <p className="text-sm text-tinta-suave">Cargando mapa…</p>
    </div>
  ),
})

const ICONO: Record<PasoDeAviso, (props: IconProps) => ReactNode> = {
  operacion: House,
  ubicacion: MapPin,
  medidas: Ruler,
  precio: CurrencyCircleDollar,
  caracteristicas: SlidersHorizontal,
  fotos: ImageIcon,
  texto: TextT,
}

function nombreOperacion(operacion: Operacion) {
  return operacion === "temporario" ? "Alquiler temporario" : etiquetaOperacion(operacion)
}

export function Wizard({ paso, nuevo }: { paso: PasoDeAviso; nuevo: boolean }) {
  const router = useRouter()
  const { borrador: b, vaciar } = useBorrador()
  const [aviso, setAviso] = useState("")
  const scroller = useRef<HTMLDivElement>(null)
  const limpio = useRef(false)
  const actual = PASOS_DE_AVISO[indiceDePaso(paso)]
  const indice = indiceDePaso(paso)
  const ultimo = indice === PASOS_DE_AVISO.length - 1

  useEffect(() => {
    if (!nuevo || limpio.current) return
    limpio.current = true
    vaciar()
    router.replace("/publicar/operacion")
  }, [nuevo, vaciar, router])

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [paso])

  function ir(siguiente: PasoDeAviso) {
    setAviso("")
    router.push(`/publicar/${siguiente}`)
  }

  function seguir() {
    if (paso === "operacion" && (!b.operacion || !b.tipo)) {
      setAviso("Elegí la operación y el tipo.")
      return
    }
    if (ultimo) {
      router.push("/publicar/listo")
      return
    }
    ir(PASOS_DE_AVISO[indice + 1].slug)
  }

  return (
    <div className="bg-papel lg:h-dvh lg:p-4">
      <div className="flex h-dvh flex-col bg-blanco lg:h-full lg:grid lg:grid-cols-[16rem_1fr] lg:overflow-hidden lg:rounded-hoja lg:border lg:border-linea">
        <aside className="hidden border-r border-linea lg:flex lg:flex-col lg:px-5 lg:py-6">
          <Link href="/" aria-label={`${brandName}, ir al inicio`} className="inline-flex min-h-11 items-center">
            <Logo />
          </Link>
          <p className="mt-6 truncate text-sm text-tinta-suave">{agencia}</p>
          <Pasos paso={paso} onElegir={ir} className="mt-8" />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-2 lg:px-10 lg:pt-8">
            <Link
              href="/"
              aria-label={`${brandName}, ir al inicio`}
              className="inline-flex min-h-11 items-center lg:hidden"
            >
              <Logo />
            </Link>
            <p className="hidden text-sm text-tinta-suave lg:block">{agencia}</p>
            <Link href="/cuenta?como=vacio" className="inline-flex min-h-11 items-center text-base font-semibold">
              Salir
            </Link>
          </header>

          <Pasos
            paso={paso}
            onElegir={ir}
            compacto
            className="min-w-0 shrink-0 overflow-x-auto px-4 pb-1 lg:hidden"
          />

          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:px-10">
            <div className="mx-auto w-full max-w-xl">
              <p className="text-sm text-tinta-suave">
                Paso {indice + 1} de {PASOS_DE_AVISO.length}
              </p>
              <h1 className="mt-2 text-4xl font-titulo">{actual.titulo}</h1>
              <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-tinta-suave">{actual.ayuda}</p>
              <div className="mt-6 rounded-control border border-linea bg-blanco p-5">
                <div key={paso} className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200">
                  <Contenido paso={paso} />
                </div>
                {aviso ? (
                  <p role="alert" className="mt-4 text-sm leading-relaxed text-alerta">
                    {aviso}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <footer className="shrink-0 border-t border-linea px-4 py-3 lg:px-10">
            {ultimo ? (
              <Link
                href="/cuenta?como=lista"
                className="mb-1 inline-flex min-h-11 items-center text-base font-semibold"
              >
                Guardar borrador
              </Link>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              {indice > 0 ? (
                <button
                  type="button"
                  onClick={() => ir(PASOS_DE_AVISO[indice - 1].slug)}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  <CaretLeft />
                  Anterior
                </button>
              ) : (
                <span />
              )}
              <button type="button" onClick={seguir} className={cn(buttonVariants({ size: "lg" }))}>
                {ultimo ? "Publicar" : "Siguiente"}
                {ultimo ? null : <CaretRight />}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

function Contenido({ paso }: { paso: PasoDeAviso }) {
  if (paso === "operacion") return <PasoOperacion />
  if (paso === "ubicacion") return <PasoUbicacion />
  if (paso === "medidas") return <PasoMedidas />
  if (paso === "precio") return <PasoPrecio />
  if (paso === "caracteristicas") return <PasoCaracteristicas />
  if (paso === "fotos") return <PasoFotos />
  return <PasoTexto />
}

function PasoOperacion() {
  const { borrador: b, patch } = useBorrador()

  function elegirOperacion(operacion: Operacion) {
    patch({
      operacion,
      tipo: tipoCompatible(operacion, b.tipo),
      caracteristicas: caracteristicasCompatibles(operacion, b.caracteristicas),
      moneda: b.monedaTocada ? b.moneda : monedaPorDefecto(operacion),
    })
  }

  const tipos = b.operacion ? tiposDe(b.operacion) : []

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Operación</legend>
        {OPERACIONES.map((operacion) => (
          <Opcion
            key={operacion.slug}
            tipo="radio"
            name="operacion"
            value={operacion.slug}
            etiqueta={nombreOperacion(operacion.slug)}
            checked={b.operacion === operacion.slug}
            onChange={() => elegirOperacion(operacion.slug)}
          />
        ))}
      </fieldset>
      {b.operacion ? (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Tipo</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {tipos.map((tipo) => (
              <Opcion
                key={tipo}
                tipo="radio"
                name="tipo"
                value={tipo}
                etiqueta={etiquetaTipo(tipo)}
                icono={<IconoTipo tipo={tipo} />}
                checked={b.tipo === tipo}
                onChange={() => patch({ tipo })}
              />
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="text-sm text-tinta-suave">Primero elegí la operación.</p>
      )}
    </div>
  )
}

function PasoUbicacion() {
  const { borrador: b, patch } = useBorrador()
  return (
    <div className="flex flex-col gap-5">
      {GRUPOS_DE_ZONA.map((grupo) => (
        <section key={grupo.slug} aria-label={grupo.nombre} className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-tinta-suave">{grupo.nombre}</h2>
          <div className="flex flex-wrap gap-2">
            {zonasDelGrupo(grupo.slug).map((zona) => (
              <Opcion
                key={zona}
                tipo="radio"
                variante="chip"
                name="zona"
                value={zona}
                etiqueta={nombreZona(zona)}
                checked={b.zona === zona}
                onChange={() => patch({ zona })}
              />
            ))}
          </div>
        </section>
      ))}
      <Campo id="direccion" label="Calle y altura">
        <Input
          id="direccion"
          value={b.direccion}
          autoComplete="off"
          onChange={(event) => patch({ direccion: event.target.value })}
        />
      </Campo>
      <label className="flex min-h-11 items-center justify-between gap-3 text-base">
        Mostrar la dirección exacta
        <input
          type="checkbox"
          className="size-5 accent-plano-700"
          checked={b.mostrarDireccion}
          onChange={(event) => patch({ mostrarDireccion: event.target.checked })}
        />
      </label>
      <p className="text-sm leading-relaxed text-tinta-suave">
        {b.mostrarDireccion
          ? "En la ficha se ve la calle."
          : "En la ficha se va a ver la zona, no la calle."}
      </p>
      <MapaDelAviso lat={b.lat} lng={b.lng} onMover={(lugar) => patch(lugar)} />
      <p className="text-sm leading-relaxed text-tinta-suave">Tocá el mapa o arrastrá el pin.</p>
    </div>
  )
}

function PasoMedidas() {
  const { borrador: b, patch } = useBorrador()
  const campos = camposDeMedida(b.tipo)
  return (
    <div className="flex flex-col gap-4">
      {b.tipo ? null : (
        <p className="text-sm leading-relaxed text-tinta-suave">Ejemplo para una casa. Elegí el tipo en el paso 1.</p>
      )}
      {campos.map((campo) => {
        if (esContador(campo) && esCampoContador(campo)) {
          return (
            <Contador
              key={campo}
              id={campo}
              label={etiquetaMedida(campo)}
              value={b[campo]}
              onChange={(valor) => patch({ [campo]: valor })}
            />
          )
        }
        if (!esCampoSuperficie(campo)) return null
        return (
          <Campo key={campo} id={campo} label={etiquetaMedida(campo)}>
            <Input
              id={campo}
              inputMode={campo === "hectareas" ? "decimal" : "numeric"}
              value={b[campo]}
              onChange={(event) => patch({ [campo]: superficie(event.target.value, campo === "hectareas") })}
            />
          </Campo>
        )
      })}
      {campos.includes("anios") ? (
        <p className="text-sm text-tinta-suave">0 es a estrenar.</p>
      ) : null}
    </div>
  )
}

function PasoPrecio() {
  const { borrador: b, patch } = useBorrador()
  const expensas = llevaExpensas(b.tipo)
  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Moneda</legend>
        <div className="flex gap-2">
          {MONEDAS.map((moneda) => (
            <Opcion
              key={moneda}
              tipo="radio"
              variante="chip"
              name="moneda"
              value={moneda}
              etiqueta={moneda}
              checked={b.moneda === moneda}
              onChange={() => patch({ moneda, monedaTocada: true })}
            />
          ))}
        </div>
      </fieldset>
      <Campo id="monto" label="Monto">
        <Input
          id="monto"
          inputMode="numeric"
          value={b.monto}
          disabled={b.consultar}
          onChange={(event) => patch({ monto: event.target.value.replace(/\D/g, "") })}
        />
      </Campo>
      <Marca
        id="consultar"
        label="Consultar precio"
        checked={b.consultar}
        onChange={(consultar) => patch({ consultar, monto: consultar ? "" : b.monto })}
      />
      {expensas ? (
        <div className="flex flex-col gap-4 border-t border-linea pt-4">
          <Campo id="expensas" label="Expensas">
            <Input
              id="expensas"
              inputMode="numeric"
              value={b.expensas}
              disabled={b.sinExpensas}
              onChange={(event) => patch({ expensas: event.target.value.replace(/\D/g, "") })}
            />
            <p className="text-sm text-tinta-suave">ARS por mes.</p>
          </Campo>
          <Marca
            id="sin-expensas"
            label="No paga expensas"
            checked={b.sinExpensas}
            onChange={(sinExpensas) => patch({ sinExpensas, expensas: sinExpensas ? "" : b.expensas })}
          />
        </div>
      ) : null}
    </div>
  )
}

function PasoCaracteristicas() {
  const { borrador: b, patch } = useBorrador()
  if (!b.operacion) {
    return <p className="text-sm leading-relaxed text-tinta-suave">Elegí la operación en el paso 1.</p>
  }
  const opciones = caracteristicasDe(b.operacion)
  function alternar(item: Caracteristica) {
    patch({
      caracteristicas: b.caracteristicas.includes(item)
        ? b.caracteristicas.filter((elegida) => elegida !== item)
        : [...b.caracteristicas, item],
    })
  }
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((item) => (
        <Opcion
          key={item}
          variante="chip"
          name="caracteristica"
          value={item}
          etiqueta={etiquetaCaracteristica(item)}
          checked={b.caracteristicas.includes(item)}
          onChange={() => alternar(item)}
        />
      ))}
    </div>
  )
}

function PasoFotos() {
  const { borrador: b, patch } = useBorrador()

  function agregar(lista: "fotos" | "videos", files: FileList | null, prefijo: string) {
    const nuevas = [...(files ?? [])]
      .filter((file) => file.type.startsWith(prefijo))
      .map((file) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(file), nombre: file.name }))
    if (nuevas.length === 0) return
    patch({ [lista]: [...b[lista], ...nuevas] })
  }

  function sacar(lista: "fotos" | "videos", id: string) {
    const medio = b[lista].find((item) => item.id === id)
    if (medio) URL.revokeObjectURL(medio.url)
    patch({ [lista]: b[lista].filter((item) => item.id !== id) })
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Fotos</h2>
        <label className={cn(buttonVariants({ variant: "outline" }), "w-fit cursor-pointer")}>
          <ImageIcon />
          Elegir fotos
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              agregar("fotos", event.target.files, "image/")
              event.target.value = ""
            }}
          />
        </label>
        {b.fotos.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3">
            {b.fotos.map((foto, indice) => (
              <li key={foto.id}>
                <Foto
                  foto={foto}
                  portada={indice === 0}
                  onSubir={() => patch({ fotos: mover(b.fotos, indice, -1) })}
                  onBajar={() => patch({ fotos: mover(b.fotos, indice, 1) })}
                  puedeSubir={indice > 0}
                  puedeBajar={indice < b.fotos.length - 1}
                  onSacar={() => sacar("fotos", foto.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-tinta-suave">La primera que elijas queda de portada.</p>
        )}
      </section>
      <section className="flex flex-col gap-3 border-t border-linea pt-6">
        <h2 className="text-sm font-medium">Videos</h2>
        <label className={cn(buttonVariants({ variant: "outline" }), "w-fit cursor-pointer")}>
          <VideoCamera />
          Elegir videos
          <input
            type="file"
            accept="video/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              agregar("videos", event.target.files, "video/")
              event.target.value = ""
            }}
          />
        </label>
        {b.videos.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {b.videos.map((video) => (
              <li key={video.id}>
                <article aria-label={video.nombre} className="overflow-hidden rounded-control border border-linea">
                  <video src={video.url} controls preload="metadata" className="aspect-video w-full bg-tinta" />
                  <button
                    type="button"
                    onClick={() => sacar("videos", video.id)}
                    className="min-h-11 w-full text-sm font-semibold"
                  >
                    Sacar
                  </button>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-relaxed text-tinta-suave">
            Opcional. El video no es la portada y no se sube.
          </p>
        )}
      </section>
    </div>
  )
}

function Foto({
  foto,
  portada,
  onSubir,
  onBajar,
  puedeSubir,
  puedeBajar,
  onSacar,
}: {
  foto: Medio
  portada: boolean
  onSubir: () => void
  onBajar: () => void
  puedeSubir: boolean
  puedeBajar: boolean
  onSacar: () => void
}) {
  return (
    <article aria-label={foto.nombre} className="overflow-hidden rounded-control border border-linea">
      <div className="relative">
        <img src={foto.url} alt="" className="aspect-[4/3] w-full object-cover" />
        {portada ? (
          <span className="absolute top-2 left-2 rounded-full bg-plano-700 px-2 py-0.5 text-xs font-semibold text-blanco">
            Portada
          </span>
        ) : null}
      </div>
      <div className="grid grid-cols-3 border-t border-linea">
        <button type="button" onClick={onSubir} disabled={!puedeSubir} className="min-h-11 text-sm font-semibold disabled:opacity-40">
          Subir
        </button>
        <button type="button" onClick={onBajar} disabled={!puedeBajar} className="min-h-11 text-sm font-semibold disabled:opacity-40">
          Bajar
        </button>
        <button type="button" onClick={onSacar} className="min-h-11 text-sm font-semibold">
          Sacar
        </button>
      </div>
    </article>
  )
}

function PasoTexto() {
  const { borrador: b, patch } = useBorrador()
  const sugerido = tituloSugerido({ tipo: b.tipo, zona: b.zona, dormitorios: b.dormitorios })
  const titulo = b.tituloTocado ? b.titulo : (sugerido ?? "")
  return (
    <div className="flex flex-col gap-6">
      <Campo id="titulo" label="Título">
        <Input
          id="titulo"
          value={titulo}
          placeholder="Casa de 3 dormitorios en Centro"
          onChange={(event) => patch({ titulo: event.target.value, tituloTocado: true })}
        />
      </Campo>
      <Campo id="descripcion" label="Descripción">
        <textarea
          id="descripcion"
          value={b.descripcion}
          rows={6}
          onChange={(event) => patch({ descripcion: event.target.value })}
          className="w-full rounded-control border border-input bg-blanco px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </Campo>
    </div>
  )
}

function Pasos({
  paso,
  onElegir,
  className,
  compacto = false,
}: {
  paso: PasoDeAviso
  onElegir: (paso: PasoDeAviso) => void
  className?: string
  compacto?: boolean
}) {
  const actual = indiceDePaso(paso)
  return (
    <nav aria-label="Pasos del aviso" className={className}>
      <ol className={cn(compacto ? "flex w-max items-center" : "flex flex-col")}>
        {PASOS_DE_AVISO.map((item, indice) => {
          const hecho = indice < actual
          const bloqueado = indice > actual
          const linea = indice < actual
          const Icono = ICONO[item.slug]
          return (
            <li key={item.slug} className={cn("flex", compacto ? "items-center" : undefined)}>
              <button
                type="button"
                disabled={bloqueado}
                aria-current={indice === actual ? "step" : undefined}
                aria-label={item.titulo}
                onClick={() => onElegir(item.slug)}
                className={cn(
                  "flex text-left disabled:cursor-default",
                  compacto ? "size-11 items-center justify-center" : "w-full items-stretch gap-3 py-1",
                )}
              >
                <span className={cn("flex shrink-0 flex-col items-center", compacto ? undefined : "w-8")}>
                  <MarcaPaso hecho={hecho} actual={indice === actual}>
                    <Icono className="size-4" />
                  </MarcaPaso>
                  {compacto || indice === PASOS_DE_AVISO.length - 1 ? null : (
                    <span aria-hidden className={cn("mt-1 w-px flex-1", linea ? "bg-plano-700" : "bg-linea")} />
                  )}
                </span>
                {compacto ? null : (
                  <span className="min-w-0 py-1 pr-2 pb-4">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        indice === actual || hecho ? "text-tinta" : "text-tinta-suave",
                      )}
                    >
                      {item.titulo}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-tinta-suave">{item.detalle}</span>
                  </span>
                )}
              </button>
              {compacto && indice < PASOS_DE_AVISO.length - 1 ? (
                <span aria-hidden className={cn("h-px w-3", linea ? "bg-plano-700" : "bg-linea")} />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function MarcaPaso({ hecho, actual, children }: { hecho: boolean; actual: boolean; children: ReactNode }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-200 motion-reduce:transition-none",
        hecho && "border-plano-700 bg-plano-700 text-blanco",
        actual && !hecho && "border-plano-700 bg-blanco text-tinta",
        !hecho && !actual && "border-linea bg-blanco text-tinta-suave",
      )}
    >
      {children}
    </span>
  )
}

function Contador({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: number
  onChange: (valor: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Menos ${label}`}
          disabled={value === 0}
          onClick={() => onChange(Math.max(0, value - 1))}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <Minus />
        </button>
        <span id={id} className="w-8 text-center text-base tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Más ${label}`}
          onClick={() => onChange(value + 1)}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <Plus />
        </button>
      </div>
    </div>
  )
}

function Marca({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (valor: boolean) => void
}) {
  return (
    <label htmlFor={id} className="flex min-h-11 items-center justify-between gap-3 text-base">
      {label}
      <input
        id={id}
        type="checkbox"
        className="size-5 accent-plano-700"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  )
}

function Campo({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function superficie(valor: string, decimal: boolean) {
  if (!decimal) return valor.replace(/\D/g, "")
  const limpio = valor.replace(",", ".").replace(/[^\d.]/g, "")
  const corte = limpio.indexOf(".")
  if (corte === -1) return limpio
  return `${limpio.slice(0, corte + 1)}${limpio.slice(corte + 1).replace(/\./g, "")}`
}
