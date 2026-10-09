import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  Bathtub,
  Bed,
  Building2,
  CaretRight,
  House,
  Key,
  LandPlot,
  Ruler,
  Trees,
} from "@/components/iconos"
import { Header } from "@/components/shell/header"
import { Pie } from "@/components/shell/pie"
import { Button } from "@/components/ui/button"
import { EtiquetaOperacion } from "@/components/ui/etiqueta-operacion"
import { Opcion } from "@/components/ui/opcion"

/*
 * Muestra de identidad (hito 1, identidad-y-base, bloque 4). Manuel eligió acá la
 * paleta B, azul plano, sobre la A, verde palmera (2026-10-08). Solo existe en
 * desarrollo y se borra al cerrar el hito.
 */

export const metadata: Metadata = {
  title: "Muestra de identidad",
  robots: { index: false, follow: false },
}

/* Inicio v2 (2026-10-09): el crema se va. Dos fondos candidatos, medidos con
   `scripts/contraste.mjs`; Manuel elige viendo esto en el celu. */
const FONDOS = [
  {
    id: "C",
    nombre: "C · Gris azulado",
    nota: "Del mismo lado que el azul plano; la madera y el pasto resaltan por contraste.",
    papel: "#f4f6f8",
    linea: "#dde3e9",
    tintaSuave: "#5b6670",
    contrastes: "tinta 16,1 · gris 5,4 · azul 8,0",
  },
  {
    id: "A",
    nombre: "A · Gris neutro",
    nota: "El de Mercado Libre y Airbnb: neutro, sin tinte.",
    papel: "#f7f7f7",
    linea: "#e3e3e3",
    tintaSuave: "#5f6368",
    contrastes: "tinta 16,3 · gris 5,7 · azul 8,1",
  },
]

function Fondo({ f }: { f: (typeof FONDOS)[number] }) {
  return (
    <section
      className="flex flex-col gap-3 rounded-hoja border border-linea p-4 text-tinta"
      style={
        {
          "--color-papel": f.papel,
          "--color-blanco": "#ffffff",
          "--color-linea": f.linea,
          "--color-tinta-suave": f.tintaSuave,
          background: f.papel,
        } as React.CSSProperties
      }
    >
      <div>
        <h3 className="text-lg font-titulo">{f.nombre}</h3>
        <p className="text-sm text-tinta-suave">{f.nota}</p>
        <p className="mt-1 text-xs text-tinta-suave">
          fondo {f.papel} · tarjeta #ffffff · {f.contrastes}
        </p>
      </div>
      <article className="overflow-hidden rounded-tarjeta border border-linea bg-blanco">
        <div className="relative aspect-[4/3] bg-papel">
          <Image src="/images/properties/house-1.webp" alt="" fill sizes="360px" className="object-cover" />
          <EtiquetaOperacion className="absolute top-3 left-3">Venta</EtiquetaOperacion>
        </div>
        <div className="flex flex-col gap-1 p-4">
          <p className="font-encode text-2xl leading-none font-bold tabular-nums [font-stretch:87.5%]">US$ 120.000</p>
          <p className="font-semibold">Casa en Centro</p>
          <p className="text-sm text-tinta-suave">Belgrano 450 · 3 dorm. · 180 m²</p>
        </div>
      </article>
      <nav aria-label={`Qué querés hacer (${f.id})`} className="rounded-tarjeta border border-linea bg-blanco p-4">
        <p className="text-[1.375rem] leading-tight font-titulo">¿Qué estás buscando?</p>
        <ul className="mt-2 divide-y divide-linea">
          {[
            ["Comprar", "22 en venta"],
            ["Alquilar", "11 en alquiler"],
          ].map(([t, n]) => (
            <li key={t} className="flex min-h-14 items-center justify-between gap-3">
              <span className="flex items-center gap-3 text-[1.0625rem] font-semibold">
                <Key className="size-[22px] text-plano-700" aria-hidden="true" />
                {t}
              </span>
              <span className="flex items-center gap-1 text-sm text-tinta-suave tabular-nums">
                {n} <CaretRight className="size-4" aria-hidden="true" />
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <Button size="lg" className="w-full">
        Ver 22 propiedades
      </Button>
    </section>
  )
}

const COLORES = [
  { token: "papel", hex: "#f4f6f8", nota: "fondo" },
  { token: "blanco", hex: "#ffffff", nota: "superficies" },
  { token: "tinta", hex: "#1a1a1a", nota: "texto" },
  { token: "tinta-suave", hex: "#5b6670", nota: "texto secundario" },
  { token: "linea", hex: "#dde3e9", nota: "bordes" },
  { token: "trigo", hex: "#c4a574", nota: "oro" },
]

function Celular({
  titulo,
  bajada,
  acento,
}: {
  titulo: string
  bajada: string
  acento: { hex: string; nombre: string; contraste: string }
}) {
  return (
    <section className="flex w-full max-w-[360px] flex-col gap-3">
      <div>
        <h2 className="text-xl font-titulo">{titulo}</h2>
        <p className="text-sm text-tinta-suave">{bajada}</p>
        <p className="mt-1 flex items-center gap-2 text-sm">
          <span
            className="inline-block size-4 rounded-[4px]"
            style={{ background: acento.hex }}
            aria-hidden="true"
          />
          {acento.nombre} <span className="text-tinta-suave">{acento.hex} · blanco encima {acento.contraste}</span>
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-linea bg-papel shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_rgb(0_0_0/0.06)]">
        <div className="flex flex-col gap-5 px-4 pt-6 pb-5">
          <div>
            <p className="font-encode text-[2rem] leading-[1.1] font-bold tracking-[-0.015em] [font-stretch:87.5%]">
              ¿Qué estás buscando?
            </p>
            <p className="mt-2 text-tinta-suave">Propiedades de las inmobiliarias de Bolívar.</p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icono: Key, titulo: "Comprar", ayuda: "Casas, terrenos, campos…", n: 48 },
              { icono: House, titulo: "Alquilar", ayuda: "Para vivir o para tu negocio", n: 21 },
            ].map(({ icono: Icono, titulo: t, ayuda, n }) => (
              <a
                key={t}
                href="#"
                className="group flex min-h-26 flex-col justify-between gap-3 rounded-control border border-linea bg-blanco p-4 transition-colors hover:border-plano-700 active:border-plano-700 active:bg-plano-50"
              >
                <Icono className="size-7 stroke-[1.75] text-plano-700" aria-hidden="true" />
                <span className="flex items-end justify-between gap-3">
                  <span className="flex flex-col">
                    <span className="text-2xl leading-none font-titulo">{t}</span>
                    <span className="mt-1 text-sm text-tinta-suave">{ayuda}</span>
                  </span>
                  <span className="flex items-center gap-1 text-sm text-tinta-suave tabular-nums">
                    {n} <CaretRight className="size-4" aria-hidden="true" />
                  </span>
                </span>
              </a>
            ))}
            <a
              href="#"
              className="flex min-h-11 items-center justify-between rounded-control px-1 font-semibold"
            >
              Alquiler temporario
              <span className="flex items-center gap-1 text-sm font-normal text-tinta-suave">
                3 <CaretRight className="size-4" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>

        <div className="border-t border-linea bg-blanco px-4 pt-5 pb-5">
          <p className="text-[1.375rem] leading-tight font-titulo">
            ¿Qué tipo de propiedad?
          </p>
          <p className="mt-1 text-sm text-tinta-suave">Podés elegir más de uno.</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Opcion name={`tipo-${titulo}`} value="casa" etiqueta="Casa" icono={<House />} conteo={12} defaultChecked />
            <Opcion name={`tipo-${titulo}`} value="departamento" etiqueta="Departamento" icono={<Building2 />} conteo={8} />
            <Opcion name={`tipo-${titulo}`} value="quinta" etiqueta="Casa quinta" icono={<Trees />} conteo={4} defaultChecked />
            <Opcion name={`tipo-${titulo}`} value="terreno" etiqueta="Terreno" icono={<LandPlot />} ayuda="Sin avisos ahora" disabled />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Opcion variante="chip" name={`zona-${titulo}`} value="centro" etiqueta="Centro" conteo={7} defaultChecked />
            <Opcion variante="chip" name={`zona-${titulo}`} value="casariego" etiqueta="Casariego" conteo={4} />
            <Opcion variante="chip" name={`zona-${titulo}`} value="melitona" etiqueta="Villa Melitona" conteo={3} />
          </div>
        </div>

        <div className="border-t border-linea bg-blanco px-4 pt-3 pb-4 shadow-[0_-6px_16px_rgb(0_0_0/0.05)]">
          <a href="#" className="flex min-h-11 items-center justify-center text-sm font-semibold text-plano-700">
            Ver las 12 propiedades ahora
          </a>
          <Button size="lg" className="w-full">
            Continuar
          </Button>
        </div>
      </div>

      <article className="overflow-hidden rounded-tarjeta border border-linea bg-blanco">
        <div className="relative aspect-[4/3] bg-papel">
          <Image
            src="/images/properties/house-2.webp"
            alt="Casa de ejemplo"
            fill
            sizes="360px"
            className="object-cover"
          />
          <EtiquetaOperacion className="absolute top-3 left-3">Venta</EtiquetaOperacion>
          <span className="absolute right-3 bottom-3 rounded-full bg-noche/75 px-2 py-0.5 text-xs font-semibold text-sobre-noche tabular-nums">
            1/8
          </span>
        </div>
        <div className="flex flex-col gap-1.5 p-4">
          <p className="font-encode text-2xl leading-none font-bold tabular-nums [font-stretch:87.5%]">
            US$ 120.000
          </p>
          <p className="font-semibold">Casa en Centro</p>
          <p className="text-sm text-tinta-suave">Belgrano 450</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tinta">
            <span className="inline-flex items-center gap-1"><Ruler className="size-4 text-tinta-suave" aria-hidden="true" />180 m²</span>
            <span className="inline-flex items-center gap-1"><Bed className="size-4 text-tinta-suave" aria-hidden="true" />3 dorm.</span>
            <span className="inline-flex items-center gap-1"><Bathtub className="size-4 text-tinta-suave" aria-hidden="true" />2 baños</span>
          </p>
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-linea pt-3">
            <span className="truncate text-sm text-tinta-suave">Inmobiliaria Norte</span>
            <a href="#" className="inline-flex min-h-11 items-center gap-1 font-semibold text-plano-700">
              Ver detalles <CaretRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
    </section>
  )
}

export default function MuestraPage() {
  if (process.env.NODE_ENV === "production") notFound()

  return (
    <div className="flex min-h-dvh flex-col bg-papel font-encode text-tinta">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-tinta-suave">Muestra de identidad · solo desarrollo</p>
          <h1 className="mt-1 text-[2rem] leading-[1.1] font-titulo">
            El cartel y el plano
          </h1>
          <p className="mt-3 text-tinta-suave">
            Las piezas del rediseño con la paleta elegida. Tocá las opciones: se marcan de
            verdad.
          </p>
        </div>

        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-center">
          <Celular
            titulo="Azul plano"
            bajada="Papel, tinta y el azul de los planos como único color de acción. Un solo modo."
            acento={{ hex: "#1f4e79", nombre: "plano-700", contraste: "blanco" }}
          />
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-titulo">Fondo: C o A (inicio v2)</h2>
          <p className="max-w-xl text-tinta-suave">
            Dos fondos para reemplazar el crema. Mirá la foto, el gris del texto y el azul
            sobre cada uno.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {FONDOS.map((f) => (
              <Fondo key={f.id} f={f} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-titulo">Los demás colores</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {COLORES.map((c) => (
              <li key={c.token} className="flex flex-col gap-2">
                <span className="h-14 rounded-control border border-linea" style={{ background: c.hex }} />
                <span className="text-sm font-semibold">{c.token}</span>
                <span className="text-xs text-tinta-suave">{c.hex} · {c.nota}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-titulo">Tipografía: Encode Sans</h2>
          <div className="flex flex-col gap-4 rounded-tarjeta border border-linea bg-blanco p-5">
            <p className="text-[2rem] leading-[1.1] font-titulo">¿Qué estás buscando? · 32</p>
            <p className="font-encode text-[1.875rem] leading-none font-bold tabular-nums [font-stretch:87.5%]">US$ 120.000 · precio ficha 30</p>
            <p className="font-encode text-xl font-semibold [font-stretch:87.5%]">Título de sección · 20</p>
            <p>Texto de lectura a 16 px. Casa de tres dormitorios con patio, a dos cuadras de la plaza.</p>
            <p className="text-sm text-tinta-suave">Texto secundario a 14 px · Belgrano 450, Centro</p>
            <div className="flex items-center gap-3">
              <EtiquetaOperacion>Venta</EtiquetaOperacion>
              <EtiquetaOperacion>Alquiler</EtiquetaOperacion>
              <EtiquetaOperacion>Temporario</EtiquetaOperacion>
            </div>
            <div className="flex flex-col font-encode text-2xl font-bold tabular-nums [font-stretch:87.5%]">
              <span className="text-sm font-normal text-tinta-suave [font-stretch:100%]">Cifras tabulares: los precios no saltan</span>
              <span data-testid="cifras-unos" className="w-fit">US$ 111.111</span>
              <span data-testid="cifras-ceros" className="w-fit">US$ 100.000</span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-titulo">Botones</h2>
          <div className="flex flex-wrap items-center gap-3 rounded-tarjeta border border-linea bg-blanco p-5">
            <Button size="lg">Ver 12 propiedades</Button>
            <Button>Continuar</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="outline">Con borde</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="link">Enlace</Button>
            <Button disabled>Deshabilitado</Button>
          </div>
        </section>
      </main>
      <Pie />
    </div>
  )
}
