"use client"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

export function SaveButton({
  status,
  dirty,
  onClick,
  label = "Guardar cambios",
  className = "",
}: {
  status: SaveStatus
  dirty: boolean
  onClick: () => void
  label?: string
  className?: string
}) {
  const disabled = !dirty || status === "saving"

  const text =
    status === "saving"
      ? "Guardando…"
      : status === "saved"
        ? "Guardado"
        : status === "error"
          ? "No se pudo guardar"
          : label

  const tone =
    status === "saved"
      ? "border-panel-success/40 bg-panel-success/15 text-panel-success"
      : status === "error"
        ? "border-panel-danger/40 bg-panel-danger/15 text-panel-danger"
        : dirty
          ? "border-panel-accent/50 bg-panel-accent/10 text-panel-accent hover:bg-panel-accent/20"
          : "border-panel-border text-panel-subtle"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed ${tone} ${className}`}
    >
      {status === "saving" && (
        <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {status === "saved" && (
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 010 1.4l-7.4 7.4a1 1 0 01-1.4 0L3.3 9.5a1 1 0 111.4-1.4l3.9 3.9 6.7-6.7a1 1 0 011.4 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {text}
    </button>
  )
}