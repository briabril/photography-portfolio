"use client"

import { useId, useRef, useState } from "react"
import Image from "next/image"
import { CONTENT_FIELDS, type SiteContentKey, type SiteContentMap } from "@/lib/site-content"
import { publicUrl } from "@/lib/storage"
import { updateSiteContent, uploadSiteImage } from "@/app/panel/dashboard/actions"
import { SaveButton, type SaveStatus } from "@/components/panel/SaveButton"
import { PanelInput, PanelTextarea, PanelEyebrow } from "@/components/panel/PanelControls"
import { useFilePreview } from "@/hooks/useFilePreview"
import { useSavableField } from "@/hooks/useSavableField"

export default function SiteContentEditor({ content }: { content: SiteContentMap }) {
  const sections = Array.from(new Set(CONTENT_FIELDS.map((f) => f.section)))

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section}>
          <div className="mb-4">
            <PanelEyebrow>{section}</PanelEyebrow>
          </div>
          <div className="space-y-5">
            {CONTENT_FIELDS.filter((f) => f.section === section).map((field) =>
              field.type === "image" ? (
                <ImageField key={field.key} fieldKey={field.key} label={field.label} value={content[field.key]} />
              ) : (
                <TextField
                  key={field.key}
                  fieldKey={field.key}
                  label={field.label}
                  value={content[field.key]}
                  multiline={field.type === "textarea"}
                />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function TextField({
  fieldKey,
  label,
  value,
  multiline,
}: {
  fieldKey: SiteContentKey
  label: string
  value: string
  multiline: boolean
}) {
  const field = useSavableField(value)
  const fieldId = useId()

  function handleSave() {
    field.save((text) => updateSiteContent(fieldKey, text))
  }

  return (
    <div className="rounded-xl border border-panel-border bg-panel-surface/50 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={fieldId} className="text-sm text-panel-muted">
          {label}
        </label>
        <SaveButton status={field.status} dirty={field.dirty} onClick={handleSave} label="Guardar" />
      </div>
      {multiline ? (
        <PanelTextarea
          id={fieldId}
          value={field.value}
          onChange={(e) => field.setValue(e.target.value)}
          rows={4}
        />
      ) : (
        <PanelInput id={fieldId} value={field.value} onChange={(e) => field.setValue(e.target.value)} />
      )}
    </div>
  )
}

function ImageField({
  fieldKey,
  label,
  value,
}: {
  fieldKey: SiteContentKey
  label: string
  value: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<SaveStatus>("idle")
  const preview = useFilePreview()

  const imageUrl = preview.previewUrl ?? publicUrl(value)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    preview.selectFile(file)
    setStatus("saving")

    const formData = new FormData()
    formData.set("file", file)

    try {
      await uploadSiteImage(fieldKey, formData)
      setStatus("saved")
      setTimeout(() => setStatus("idle"), 1800)
    } catch (err) {
      console.error(err)
      setStatus("error")
    } finally {
      preview.clear()
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="rounded-xl border border-panel-border bg-panel-surface/50 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm text-panel-muted">{label}</span>
        {status === "saving" && <span className="text-xs text-panel-muted">Subiendo…</span>}
        {status === "saved" && <span className="text-xs text-panel-success">Guardado</span>}
        {status === "error" && <span className="text-xs text-panel-danger">No se pudo subir</span>}
      </div>

      <div className="relative h-40 w-full max-w-xs">
        <div
          aria-hidden
          className="absolute -bottom-2 -right-2 h-full w-full rounded-xl border border-panel-border bg-panel-accent/10"
        />
        <label className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-xl border border-panel-border bg-panel-bg">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={label}
              fill
              unoptimized={Boolean(preview.previewUrl)}
              sizes="320px"
              className="object-cover transition-opacity duration-200 group-hover:opacity-40"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-panel-subtle">Sin imagen</div>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:bg-panel-bg/40 group-hover:opacity-100">
            <CameraIcon />
            <span className="text-xs font-medium text-panel-foreground">Cambiar imagen</span>
          </div>

          {status === "saving" && (
            <div className="absolute inset-0 flex items-center justify-center bg-panel-bg/60">
              <Spinner />
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={status === "saving"}
            aria-label={label}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  )
}

function CameraIcon() {
  return (
    <svg className="h-5 w-5 text-panel-foreground" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8a2 2 0 012-2h1.5l1-1.5h7l1 1.5H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin text-panel-accent" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}