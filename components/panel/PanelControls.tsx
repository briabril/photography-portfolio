import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react"
import { ArrowUpRight } from "lucide-react"

const fieldBase =
  "w-full rounded-lg border border-panel-border bg-panel-bg text-panel-foreground placeholder:text-panel-subtle transition-colors focus:border-panel-accent/50 focus:outline-none focus:ring-1 focus:ring-panel-accent/30"

const sizeClass = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-2.5 py-1.5 text-sm",
} as const

type PanelInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: keyof typeof sizeClass
}

export function PanelInput({ size = "md", className = "", ...props }: PanelInputProps) {
  return <input {...props} className={`${fieldBase} ${sizeClass[size]} ${className}`} />
}

type PanelTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & {
  size?: keyof typeof sizeClass
}

export function PanelTextarea({ size = "md", className = "", ...props }: PanelTextareaProps) {
  return <textarea {...props} className={`${fieldBase} ${sizeClass[size]} ${className}`} />
}

export function PanelFieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs text-panel-muted">
      {children}
    </label>
  )
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${
        published
          ? "bg-panel-success/85 text-panel-success-foreground"
          : "bg-panel-bg/75 text-panel-muted"
      }`}
    >
      {published ? "Publicada" : "Borrador"}
    </span>
  )
}

export function PublishToggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-panel-muted">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-panel-border accent-panel-accent"
      />
      Publicar
    </label>
  )
}

export function DeleteButton({
  onDelete,
  itemLabel,
  disabled,
}: {
  onDelete: () => void
  itemLabel: string
  disabled?: boolean
}) {
  function handleClick() {
    if (window.confirm(`¿Borrar "${itemLabel}"? Esta acción no se puede deshacer.`)) {
      onDelete()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="text-xs text-panel-muted transition-colors hover:text-panel-danger disabled:cursor-not-allowed disabled:opacity-50"
    >
      Borrar
    </button>
  )
}

export function PanelSectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h2 className="font-(family-name:--font-display) text-xl italic text-panel-foreground">{title}</h2>
      <div className="h-px flex-1 bg-panel-border" />
    </div>
  )
}

export function PanelEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-panel-subtle">
      <span className="h-px w-8 bg-panel-border" />
      {children}
    </p>
  )
}

export function PanelLinkButton({
  href,
  onClick,
  type = "button",
  variant = "ghost",
  disabled,
  children,
}: {
  href?: string
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "ghost" | "solid"
  disabled?: boolean
  children: ReactNode
}) {
  const base =
    "group inline-flex shrink-0 items-center gap-2 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
  const tone =
    variant === "solid"
      ? "bg-panel-accent px-5 py-2.5 text-panel-accent-foreground hover:bg-panel-accent-hover"
      : "border border-panel-border px-5 py-2.5 text-panel-muted hover:border-panel-accent/40 hover:text-panel-accent"

  const content = (
    <>
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={`${base} ${tone}`}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${tone}`}>
      {content}
    </button>
  )
}

export function PanelFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div aria-hidden className="absolute -bottom-2 -right-2 h-full w-full border border-panel-border bg-panel-accent/10" />
      <div className="relative h-full w-full overflow-hidden rounded-lg border border-panel-border bg-panel-bg">
        {children}
      </div>
    </div>
  )
}