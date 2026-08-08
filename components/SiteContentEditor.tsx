"use client"

import { useRef, useState } from "react"
import { CONTENT_FIELDS, type SiteContentKey, type SiteContentMap } from "@/lib/site-content"
import { publicUrl } from "@/lib/storage"
import { updateSiteContent, uploadSiteImage } from "@/app/panel/dashboard/actions"
import { SaveButton, type SaveStatus } from "@/components/site/SaveButton"

const inputClass =
  "w-full rounded-lg border border-[#34302B] bg-[#1C1A15] px-3 py-2 text-sm text-[#F3EFE6] placeholder:text-[#5C564A] transition-colors focus:border-[#E3A94D]/50 focus:outline-none focus:ring-1 focus:ring-[#E3A94D]/30"

export default function SiteContentEditor({ content }: { content: SiteContentMap }) {
  const sections = Array.from(new Set(CONTENT_FIELDS.map((f) => f.section)))

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section}>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#5C564A]">
            {section}
          </h3>
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
  const [text, setText] = useState(value)
  const [status, setStatus] = useState<SaveStatus>("idle")
  const dirty = text !== value

  async function handleSave() {
    setStatus("saving")
    try {
      await updateSiteContent(fieldKey, text)
      setStatus("saved")
      setTimeout(() => setStatus("idle"), 1800)
    } catch (err) {
      console.error(err)
      setStatus("error")
    }
  }

  return (
    <div className="rounded-xl border border-[#34302B] bg-[#1C1A15]/50 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm text-[#9C9384]">{label}</label>
        <SaveButton status={status} dirty={dirty} onClick={handleSave} label="Guardar" />
      </div>
      {multiline ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className={inputClass}
        />
      ) : (
        <input value={text} onChange={(e) => setText(e.target.value)} className={inputClass} />
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
  const [preview, setPreview] = useState<string | null>(null)

  const imageUrl = preview ?? publicUrl(value)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    setStatus("saving")

    const formData = new FormData()
    formData.set("file", file);

    (async () => {
      try {
        await uploadSiteImage(fieldKey, formData)
        setStatus("saved")
        setTimeout(() => setStatus("idle"), 1800)
      } catch (err) {
        console.error(err)
        setStatus("error")
      } finally {
        URL.revokeObjectURL(previewUrl)
        setPreview(null)
        if (inputRef.current) inputRef.current.value = ""
      }
    })()
  }

  return (
    <div className="rounded-xl border border-[#34302B] bg-[#1C1A15]/50 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm text-[#9C9384]">{label}</label>
        {status === "saving" && <span className="text-xs text-[#9C9384]">Subiendo…</span>}
        {status === "saved" && <span className="text-xs text-[#7C9A82]">Guardado</span>}
        {status === "error" && <span className="text-xs text-[#C1502E]">No se pudo subir</span>}
      </div>

      {/* Toda la miniatura es el disparador del selector de archivo: pasar
          el mouse revela el overlay de edición, como una hoja de contactos. */}
      <label className="group relative block h-40 w-full max-w-xs cursor-pointer overflow-hidden rounded-xl border border-[#34302B] bg-[#14130F]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={label}
            className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-40"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#5C564A]">Sin imagen</div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:bg-[#14130F]/40 group-hover:opacity-100">
          <CameraIcon />
          <span className="text-xs font-medium text-[#F3EFE6]">Cambiar imagen</span>
        </div>

        {status === "saving" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#14130F]/60">
            <Spinner />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={status === "saving"}
          className="sr-only"
        />
      </label>
    </div>
  )
}

function CameraIcon() {
  return (
    <svg className="h-5 w-5 text-[#F3EFE6]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg className="h-5 w-5 animate-spin text-[#E3A94D]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}