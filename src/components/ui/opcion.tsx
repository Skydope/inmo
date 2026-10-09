import { Check } from "@/components/iconos"
import { cn } from "@/lib/utils"

type OpcionProps = {
  /** checkbox para elegir varias; radio para una sola. */
  tipo?: "checkbox" | "radio"
  name: string
  value: string
  etiqueta: string
  icono?: React.ReactNode
  ayuda?: string
  conteo?: number
  defaultChecked?: boolean
  checked?: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  /** tarjeta: las opciones grandes de los pasos; chip: zonas y características. */
  variante?: "tarjeta" | "chip"
  className?: string
}

/**
 * La opción que se toca en los pasos del buscador y en la hoja de filtros. Es un
 * `<input>` nativo dentro de un `<label>`, cubriéndola entera e invisible: anda sin
 * JavaScript dentro de un formulario GET y el toque cae en el input. La tarjeta grande
 * marca la elegida con un ✓. El chip deja el fondo y marca la elegida con un punto.
 */
export function Opcion({
  tipo = "checkbox",
  name,
  value,
  etiqueta,
  icono,
  ayuda,
  conteo,
  defaultChecked,
  checked,
  disabled,
  onChange,
  variante = "tarjeta",
  className,
}: OpcionProps) {
  const tarjeta = variante === "tarjeta"
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer border border-linea bg-blanco text-tinta transition-colors select-none",
        tarjeta
          ? "has-checked:border-plano-700 has-checked:bg-plano-50 has-checked:ring-1 has-checked:ring-plano-700"
          : "has-checked:border-plano-700",
        "has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
        "has-disabled:cursor-not-allowed has-disabled:opacity-45",
        tarjeta
          ? "min-h-20 flex-col justify-between gap-3 rounded-control p-3"
          : "min-h-11 items-center gap-2 rounded-full px-4",
        className
      )}
    >
      <input
        type={tipo}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        // Cubre toda la opción (invisible): el toque cae en el input real, no en el label.
        className="absolute inset-0 z-10 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
      />
      {tarjeta && icono ? (
        <span className="text-tinta [&_svg]:size-6 [&_svg]:stroke-[1.75]">{icono}</span>
      ) : null}
      {tarjeta ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2 size-2 -translate-y-1/2 rounded-full bg-plano-700 opacity-0 group-has-checked:opacity-100"
        />
      )}
      <span className={cn("flex items-end gap-2", tarjeta ? "justify-between" : "group-has-checked:pl-3")}>
        <span className="flex flex-col">
          <span className={cn("font-semibold", tarjeta ? "text-[1.0625rem] leading-tight" : "text-base")}>
            {etiqueta}
          </span>
          {ayuda ? <span className="text-sm text-tinta-suave">{ayuda}</span> : null}
        </span>
        {conteo !== undefined ? (
          <span className="text-sm text-tinta-suave tabular-nums">{conteo}</span>
        ) : null}
      </span>
      {tarjeta ? (
        <span
          aria-hidden="true"
          className="absolute top-2.5 right-2.5 hidden size-5 items-center justify-center rounded-full bg-plano-700 text-blanco group-has-checked:flex"
        >
          <Check className="size-3.5" />
        </span>
      ) : null}
    </label>
  )
}
