import { cn } from "@/lib/utils"

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50"

const variants = {
  default: "bg-accent text-bg hover:bg-accent-muted",
  secondary: "glass text-fg hover:border-accent/50 hover:bg-white/10",
} as const

const sizes = {
  default: "h-11 px-5",
  lg: "h-12 px-7 text-base",
} as const

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  className?: string
} = {}) {
  return cn(base, variants[variant], sizes[size], className)
}
