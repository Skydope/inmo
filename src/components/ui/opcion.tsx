import { Check } from "lucide-react"
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
 * `<input>` nativo dentro de un `<label>`: anda sin JavaScript dentro de un
 * formulario GET. Elegida = borde y fondo azul plano y un ✓ (no solo color).
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
        "has-checked:border-plano-700 has-checked:bg-plano-50 has-checked:ring-1 has-checked:ring-plano-700",
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
        className="sr-only"
      />
      {tarjeta && icono ? (
        <span className="text-tinta [&_svg]:size-6 [&_svg]:stroke-[1.75]">{icono}</span>
      ) : null}
      <span className={cn("flex items-end gap-2", tarjeta ? "justify-between" : "")}>
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
      <span
        aria-hidden="true"
        className={cn(
          "hidden items-center justify-center rounded-full bg-plano-700 text-blanco group-has-checked:flex",
          tarjeta ? "absolute top-2.5 right-2.5 size-5" : "size-4"
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </label>
  )
}
