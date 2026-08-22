import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react"

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

/** Franja "Publicada / Borrador" que se superpone a una miniatura. */
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

/** Checkbox de "Publicar" con la etiqueta incluida. */
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

/** Botón de borrado que pide confirmación antes de ejecutar la acción. */
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

/** Título de sección con línea divisoria, usado dentro de cada bloque del dashboard. */
export function PanelSectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h2 className="font-(family-name:--font-display) text-xl italic text-panel-foreground">{title}</h2>
      <div className="h-px flex-1 bg-panel-border" />
    </div>
  )
}
