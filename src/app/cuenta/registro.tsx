"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  CaretLeft,
  CaretRight,
  Certificate,
  ChatCircle,
  Envelope,
  Image as ImageIcon,
  MapPin,
  Phone,
  SealCheck,
  Storefront,
  type IconProps,
} from "@/components/iconos"
import { Logo } from "@/components/marca/logo"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SEED_AGENCIES } from "@/lib/agencies/seed"
import { brandName } from "@/lib/brand"
import { filterBolivarStreets, getStreetMidpoint, normalizeStreetName, type StreetLines } from "@/lib/streets"
import { nacionalArgentino } from "@/lib/telefono"
import { cn } from "@/lib/utils"
import { LogoLocal } from "./logo-local"
import { MapaOficina } from "./mapa-oficina"

const norte = SEED_AGENCIES.norte
const NOMBRE_MAX = 40
const CALLE_MIN = 3

function partirDireccion(direccion: string) {
  const match = /^(.*)\s+(\d+)\s*$/.exec(direccion.trim())
  if (!match) return { calle: direccion.trim(), altura: "" }
  return { calle: match[1].trim(), altura: match[2] }
}

const PASOS: {
  titulo: string
  detalle: string
  ayuda: string
  Icono: (props: IconProps) => ReactNode
}[] = [
  {
    titulo: "La inmobiliaria",
    detalle: "Nombre y logo",
    ayuda: "El nombre y el logo que ve quien busca.",
    Icono: Storefront,
  },
  {
    titulo: "La oficina",
    detalle: "La dirección que se publica",
    ayuda: "La dirección de la vidriera. Es la que figura en la ficha.",
    Icono: MapPin,
  },
  {
    titulo: "Contacto",
    detalle: "WhatsApp, teléfono y mail",
    ayuda: "El WhatsApp es el botón de la ficha. Teléfono y mail se usan si no hay WhatsApp.",
    Icono: ChatCircle,
  },
  {
    titulo: "Matrícula",
    detalle: "La que figura en la ficha",
    ayuda: "Figura debajo del nombre. Si no la tenés ahora, podés seguir.",
    Icono: Certificate,
  },
]

export function Registro({ modo }: { modo: "alta" | "datos" }) {
  const router = useRouter()
  const [paso, setPaso] = useState(0)
  const [aviso, setAviso] = useState("")
  const [invitacion, setInvitacion] = useState(modo === "alta")
  const [nombre, setNombre] = useState(norte.name)
  const oficina = partirDireccion(norte.address)
  const [calle, setCalle] = useState(oficina.calle)
  const [altura, setAltura] = useState(oficina.altura)
  const [callesAbiertas, setCallesAbiertas] = useState(false)
  const alturaRef = useRef<HTMLInputElement>(null)
  const [logo, setLogo] = useState(norte.logoUrl)
  const [punto, setPunto] = useState<{ lat: number; lng: number } | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [resolviendo, setResolviendo] = useState(false)
  const [marcado, setMarcado] = useState(false)
  const [sinLugar, setSinLugar] = useState(false)
  const pedido = useRef(0)
  const [whatsapp, setWhatsapp] = useState(() => nacionalArgentino(norte.whatsapp ?? ""))
  const [telefono, setTelefono] = useState(() => nacionalArgentino(norte.phone ?? ""))
  const [email, setEmail] = useState(norte.email ?? "")
  const [matricula, setMatricula] = useState(norte.license ?? "")

  const actual = PASOS[paso]
  const ultimo = paso === PASOS.length - 1
  const calleNorm = normalizeStreetName(calle)
  const coincidencias = filterBolivarStreets(calle)
  const sugerencias =
    calle.trim().length >= CALLE_MIN && !coincidencias.some((nombre) => normalizeStreetName(nombre) === calleNorm)
      ? coincidencias
      : []
  const puedeBuscar = (calle.trim() !== "" && altura.trim() !== "") || marcado

  function ir(siguiente: number) {
    setAviso("")
    setPaso(siguiente)
  }

  async function buscarOficina() {
    const nombre = calle.trim()
    const numero = altura.trim()
    if (!((nombre && numero) || marcado)) return
    const q = [numero, nombre].filter(Boolean).join(" ")
    if (q.length < CALLE_MIN) return
    setBuscando(true)
    setSinLugar(false)
    setCallesAbiertas(false)
    try {
      const res = await fetch(`/api/lugar?q=${encodeURIComponent(q)}`)
      const lugar = (await res.json()) as { lat: number; lng: number } | null
      if (lugar) {
        setPunto({ lat: lugar.lat, lng: lugar.lng })
        setMarcado(false)
        return
      }
      if (nombre.length >= CALLE_MIN) {
        const lineas = await fetch(`/api/streets?name=${encodeURIComponent(nombre)}`)
        const medio = getStreetMidpoint((await lineas.json()) as StreetLines)
        if (medio) {
          setPunto({ lat: medio.lat, lng: medio.lng })
          setMarcado(false)
          return
        }
      }
      setSinLugar(true)
    } catch {
      setSinLugar(true)
    } finally {
      setBuscando(false)
    }
  }

  function elegirCalle(nombre: string) {
    setCalle(nombre)
    setMarcado(false)
    setCallesAbiertas(false)
    alturaRef.current?.focus()
  }

  async function alMover(lugar: { lat: number; lng: number }) {
    const id = ++pedido.current
    setPunto(lugar)
    setMarcado(true)
    setSinLugar(false)
    setResolviendo(true)
    try {
      const res = await fetch(`/api/lugar?lat=${lugar.lat}&lng=${lugar.lng}`)
      const dir = (await res.json()) as { calle?: string; altura?: string } | null
      if (id !== pedido.current) return
      if (dir?.calle) {
        setCalle(dir.calle)
        setAltura(dir.altura ?? "")
      }
    } catch {
      if (id !== pedido.current) return
    } finally {
      if (id === pedido.current) setResolviendo(false)
    }
  }

  function seguir() {
    if (paso === 0 && nombre.trim() === "") {
      setAviso("El nombre no puede quedar vacío.")
      return
    }
    if (paso === 1 && calle.trim() === "") {
      setAviso("La calle es la que se publica.")
      return
    }
    if (paso === 2 && whatsapp.trim() === "") {
      setAviso("El WhatsApp es el botón de la ficha.")
      return
    }
    if (ultimo) {
      router.push("/cuenta?como=vacio")
      return
    }
    ir(paso + 1)
  }

  return (
    <div className="min-h-dvh bg-papel lg:p-4">
    <div className="min-h-dvh lg:grid lg:min-h-[calc(100dvh-2rem)] lg:grid-cols-[16rem_1fr] lg:overflow-hidden lg:rounded-hoja lg:border lg:border-linea lg:bg-blanco">
      <aside
        inert={invitacion || undefined}
        className="hidden border-r border-linea lg:flex lg:flex-col lg:px-5 lg:py-6"
      >
        <Link href="/" aria-label={`${brandName}, ir al inicio`} className="inline-flex min-h-11 items-center">
          <Logo />
        </Link>
        <Pasos modo={modo} paso={paso} onElegir={ir} className="mt-10" />
      </aside>

      <div inert={invitacion || undefined} className="flex min-h-dvh flex-col px-4 py-6 lg:min-h-full lg:px-10 lg:py-8">
        <header className="flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label={`${brandName}, ir al inicio`}
            className="inline-flex min-h-11 items-center lg:hidden"
          >
            <Logo />
          </Link>
          <p className="hidden text-sm text-tinta-suave lg:block">
            {modo === "alta" ? "Primer ingreso" : "Datos de la inmobiliaria"}
          </p>
          <Link href="/ingresar" className="inline-flex min-h-11 items-center text-base font-semibold">
            Salir
          </Link>
        </header>

        <Pasos modo={modo} paso={paso} onElegir={ir} className="mt-4 lg:hidden" compacto />

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-8">
          <p className="text-sm text-tinta-suave">
            Paso {paso + 1} de {PASOS.length}
          </p>
          <h1 className="mt-2 text-4xl font-titulo">{actual.titulo}</h1>
          <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-tinta-suave">{actual.ayuda}</p>

          <div className="mt-6 rounded-control border border-linea bg-blanco p-5">
            <div key={paso} className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200">
            {paso === 0 ? (
              <div className="flex flex-col gap-6">
                <Campo id="nombre" label="Nombre" icono={<Storefront className="size-4" />}>
                  <Input
                    id="nombre"
                    value={nombre}
                    maxLength={NOMBRE_MAX}
                    autoComplete="organization"
                    onChange={(event) => setNombre(event.target.value)}
                  />
                  <p className={cn("text-sm", nombre.length >= NOMBRE_MAX - 4 ? "text-alerta" : "text-tinta-suave")}>
                    {nombre.length}/{NOMBRE_MAX}. Así de largo entra en la ficha.
                  </p>
                </Campo>
                <Campo label="Logo" icono={<ImageIcon className="size-4" />}>
                  <LogoLocal onRecorte={setLogo} />
                </Campo>
              </div>
            ) : null}
            {paso === 1 ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-end gap-2">
                    <div className="relative min-w-0 flex-1">
                      <Label htmlFor="calle" className="mb-2 gap-2">
                        <span className="text-tinta-suave">
                          <MapPin className="size-4" />
                        </span>
                        Calle
                      </Label>
                      <Input
                        id="calle"
                        value={calle}
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={callesAbiertas}
                        aria-controls="calles-de-oficina"
                        aria-autocomplete="list"
                        onChange={(event) => {
                          setCalle(event.target.value)
                          setMarcado(false)
                          setCallesAbiertas(true)
                        }}
                        onFocus={() => setCallesAbiertas(true)}
                        onBlur={() => setCallesAbiertas(false)}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") setCallesAbiertas(false)
                          if (event.key !== "Enter") return
                          event.preventDefault()
                          const primera = sugerencias[0]
                          if (callesAbiertas && primera) elegirCalle(primera)
                          else if (puedeBuscar && !buscando && !resolviendo) void buscarOficina()
                        }}
                      />
                      {callesAbiertas && sugerencias.length > 0 ? (
                        <ul
                          id="calles-de-oficina"
                          role="listbox"
                          className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-control border border-linea bg-blanco py-1"
                        >
                          {sugerencias.map((nombre) => (
                            <li key={nombre} role="presentation">
                              <button
                                type="button"
                                role="option"
                                className="flex min-h-11 w-full items-center px-3 text-left text-base hover:bg-papel"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => elegirCalle(nombre)}
                              >
                                {nombre}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <div className="w-20 shrink-0">
                      <Label htmlFor="altura" className="mb-2">
                        Altura
                      </Label>
                      <Input
                        id="altura"
                        ref={alturaRef}
                        value={altura}
                        inputMode="numeric"
                        autoComplete="off"
                        className="px-2 text-center"
                        onChange={(event) => {
                          setAltura(event.target.value.replace(/\D/g, ""))
                          setMarcado(false)
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => void buscarOficina()}
                      disabled={buscando || resolviendo || !puedeBuscar}
                      aria-busy={buscando || resolviendo}
                      className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
                    >
                      Buscar
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-tinta-suave">
                    Con 3 letras aparecen las calles de Bolívar. Es la de la vidriera, no el domicilio fiscal.
                  </p>
                  {sinLugar ? (
                    <p role="alert" className="text-sm text-alerta">
                      No encontré esa dirección en Bolívar.
                    </p>
                  ) : null}
                </div>
                <MapaOficina
                  lat={punto?.lat ?? null}
                  lng={punto?.lng ?? null}
                  logo={logo}
                  onMover={(lugar) => void alMover(lugar)}
                />
                <p className="text-sm leading-relaxed text-tinta-suave">
                  Tocá el mapa y se completan la calle y la altura. El pin se puede arrastrar.
                </p>
              </div>
            ) : null}
            {paso === 2 ? (
              <div className="flex flex-col gap-6">
                <Campo id="whatsapp" label="WhatsApp" icono={<ChatCircle className="size-4" />}>
                  <NumeroAr id="whatsapp" value={whatsapp} onChange={setWhatsapp} />
                  <p className="text-sm text-tinta-suave">
                    El +54 ya está. Completá el resto, con el 9 si es un celular.
                  </p>
                </Campo>
                <Campo id="telefono" label="Teléfono" icono={<Phone className="size-4" />}>
                  <NumeroAr id="telefono" value={telefono} onChange={setTelefono} />
                  <p className="text-sm text-tinta-suave">Opcional. Aparece para llamar si hace falta.</p>
                </Campo>
                <Campo id="email" label="Mail" icono={<Envelope className="size-4" />}>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <p className="text-sm text-tinta-suave">Opcional. Solo si no hay WhatsApp ni teléfono.</p>
                </Campo>
              </div>
            ) : null}
            {paso === 3 ? (
              <Campo id="matricula" label="Matrícula" icono={<Certificate className="size-4" />}>
                <Input
                  id="matricula"
                  value={matricula}
                  onChange={(event) => setMatricula(event.target.value)}
                />
                <p className="text-sm leading-relaxed text-tinta-suave">
                  Se muestra debajo del nombre, por ejemplo CMCPSI 1234. Si no la tenés a mano, podés seguir.
                </p>
              </Campo>
            ) : null}
            </div>
            {aviso ? (
              <p role="alert" className="mt-4 text-sm leading-relaxed text-alerta">
                {aviso}
              </p>
            ) : null}
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-linea pt-4">
              {paso > 0 ? (
                <button
                  type="button"
                  onClick={() => ir(paso - 1)}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  <CaretLeft />
                  Anterior
                </button>
              ) : (
                <span />
              )}
              <button type="button" onClick={seguir} className={cn(buttonVariants({ size: "lg" }))}>
                {ultimo ? (modo === "alta" ? "Comenzar" : "Listo") : "Continuar"}
                {ultimo ? null : <CaretRight />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {invitacion ? <Invitacion onCerrar={() => setInvitacion(false)} /> : null}
    </div>
    </div>
  )
}

function Invitacion({ onCerrar }: { onCerrar: () => void }) {
  const boton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    boton.current?.focus()
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/30 p-4 backdrop-blur-md motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invitacion-titulo"
      onKeyDown={(event) => {
        if (event.key === "Escape") onCerrar()
      }}
    >
      <div className="w-full max-w-sm rounded-control border border-linea bg-blanco px-6 py-8 text-center shadow-[0_16px_40px_-24px_rgba(26,26,26,0.45)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-200">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-plano-700 text-blanco">
          <SealCheck className="size-7" />
        </span>
        <h2 id="invitacion-titulo" className="mt-5 text-3xl font-titulo">
          Te invitamos al piloto
        </h2>
        <p className="mt-3 text-base leading-relaxed text-tinta-suave">
          Fuiste invitado a participar de la versión piloto de {brandName}. A continuación cargá los datos de tu
          inmobiliaria. Son los que ve quien busca.
        </p>
        <button
          ref={boton}
          type="button"
          onClick={onCerrar}
          className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

function Pasos({
  modo,
  paso,
  onElegir,
  className,
  compacto = false,
}: {
  modo: "alta" | "datos"
  paso: number
  onElegir: (paso: number) => void
  className?: string
  compacto?: boolean
}) {
  return (
    <nav aria-label="Pasos del registro" className={className}>
      <ol className={cn(compacto ? "flex items-center" : "flex flex-col")}>
        {PASOS.map((item, indice) => {
          const hecho = modo === "datos" ? indice !== paso : indice < paso
          const bloqueado = modo === "alta" && indice > paso
          const linea = modo === "datos" || indice < paso
          return (
            <li key={item.titulo} className={cn("flex", compacto ? "items-center" : undefined)}>
              <button
                type="button"
                disabled={bloqueado}
                aria-current={indice === paso ? "step" : undefined}
                aria-label={item.titulo}
                onClick={() => onElegir(indice)}
                className={cn(
                  "flex text-left disabled:cursor-default",
                  compacto ? "size-11 items-center justify-center" : "w-full items-stretch gap-3 py-1",
                )}
              >
                <span className={cn("flex shrink-0 flex-col items-center", compacto ? undefined : "w-8")}>
                  <Marca hecho={hecho} actual={indice === paso}>
                    <item.Icono className="size-4" />
                  </Marca>
                  {compacto || indice === PASOS.length - 1 ? null : (
                    <span
                      aria-hidden
                      className={cn("mt-1 w-px flex-1", linea ? "bg-plano-700" : "bg-linea")}
                    />
                  )}
                </span>
                {compacto ? null : (
                  <span className="min-w-0 py-1 pr-2 pb-4">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        indice === paso || hecho ? "text-tinta" : "text-tinta-suave",
                      )}
                    >
                      {item.titulo}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-tinta-suave">{item.detalle}</span>
                  </span>
                )}
              </button>
              {compacto && indice < PASOS.length - 1 ? (
                <span aria-hidden className={cn("h-px w-3", linea ? "bg-plano-700" : "bg-linea")} />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Marca({
  hecho,
  actual,
  children,
}: {
  hecho: boolean
  actual: boolean
  children: ReactNode
}) {
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

function NumeroAr({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (valor: string) => void
}) {
  return (
    <div className="flex h-11 items-center rounded-control border border-input bg-blanco focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <span className="flex h-full shrink-0 items-center gap-1.5 border-r border-linea px-3 text-base">
        <span aria-hidden>🇦🇷</span>
        +54
      </span>
      <input
        id={id}
        inputMode="tel"
        autoComplete="tel-national"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 13))}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none"
      />
    </div>
  )
}

function Campo({
  id,
  label,
  icono,
  children,
}: {
  id?: string
  label: string
  icono?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="gap-2">
        {icono ? <span className="text-tinta-suave">{icono}</span> : null}
        {label}
      </Label>
      {children}
    </div>
  )
}
