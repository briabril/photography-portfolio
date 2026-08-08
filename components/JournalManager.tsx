"use client";

import { useRef, useState, useTransition } from "react"
import { publicUrl } from "@/lib/storage";
import {
  createJournalEntry,
  updateJournalEntry,
  toggleJournalPublished,
  deleteJournalEntry,
} from "@/app/panel/dashboard/actions";
import { SaveButton, type SaveStatus } from "@/components/site/SaveButton";
import type { JournalEntry } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-[#34302B] bg-[#14130F] px-2.5 py-1.5 text-sm text-[#F3EFE6] placeholder:text-[#5C564A] transition-colors focus:border-[#E3A94D]/50 focus:outline-none focus:ring-1 focus:ring-[#E3A94D]/30";

export default function JournalManager({ entries }: { entries: JournalEntry[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createJournalEntry(formData);
      formRef.current?.reset();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    });
  }

  return (
    <div className="space-y-8">
      {/* Formulario de nueva entrada */}
      <form
        ref={formRef}
        action={handleCreate}
        className="space-y-3 rounded-xl border border-dashed border-[#34302B] bg-[#1C1A15]/50 p-5"
      >
        <p className="font-[family-name:var(--font-display)] text-base italic text-[#F3EFE6]">
          Nueva entrada de diario
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-[#9C9384]">Título</label>
            <input type="text" name="title" placeholder="Título" required className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-[#9C9384]">Categoría</label>
            <input type="text" name="category" placeholder="ej: Notas de campo" className={inputClass} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[#9C9384]">Resumen corto</label>
          <textarea
            name="excerpt"
            placeholder="Se muestra en la grilla"
            rows={2}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[#9C9384]">Texto completo</label>
          <textarea name="body" placeholder="Texto completo de la entrada" rows={5} className={inputClass} />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            {previewUrl && (
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-[#34302B]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Vista previa de tapa" className="h-full w-full object-cover" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              name="cover"
              accept="image/*"
              onChange={handleFileSelect}
              className="text-xs text-[#9C9384] file:mr-2 file:rounded-full file:border-0 file:bg-[#E3A94D]/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#E3A94D] hover:file:bg-[#E3A94D]/25"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="ml-auto rounded-full bg-[#E3A94D] px-4 py-2 text-sm font-medium text-[#14130F] transition-colors hover:bg-[#F0BB63] disabled:opacity-50"
          >
            {isPending ? "Guardando…" : "Crear entrada"}
          </button>
        </div>
      </form>

      {/* Entradas existentes */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <JournalCard key={entry.id} entry={entry} />
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-[#5C564A]">Todavía no hay entradas de diario.</p>
        )}
      </div>
    </div>
  );
}

function JournalCard({ entry }: { entry: JournalEntry }) {
  const [title, setTitle] = useState(entry.title);
  const [category, setCategory] = useState(entry.category);
  const [excerpt, setExcerpt] = useState(entry.excerpt);
  const [body, setBody] = useState(entry.body);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [isPending, startTransition] = useTransition();
  const imageUrl = publicUrl(entry.cover_path);

  const dirty =
    title !== entry.title || category !== entry.category || excerpt !== entry.excerpt || body !== entry.body;

  function handleSave() {
    setStatus("saving");
    startTransition(async () => {
      try {
        await updateJournalEntry(entry.id, { title, category, excerpt, body });
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1800);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    });
  }

  function handleDelete() {
    if (!window.confirm(`¿Borrar "${entry.title || "esta entrada"}"? Esta acción no se puede deshacer.`)) return;
    startTransition(() => deleteJournalEntry(entry.id, entry.cover_path));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#34302B] bg-[#1C1A15] transition-colors hover:border-[#4A443A]">
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-[#14130F] sm:w-44">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={entry.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#5C564A]">Sin tapa</div>
          )}
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${entry.published ? "bg-[#7C9A82]/85 text-[#0E1610]" : "bg-[#14130F]/75 text-[#9C9384]"
              }`}
          >
            {entry.published ? "Publicada" : "Borrador"}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className={inputClass}
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Categoría"
              className={inputClass}
            />
          </div>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Resumen corto"
            className={inputClass}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Texto completo"
            className={inputClass}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[#9C9384]">
                <input
                  type="checkbox"
                  checked={entry.published}
                  disabled={isPending}
                  onChange={(e) => startTransition(() => toggleJournalPublished(entry.id, e.target.checked))}
                  className="h-3.5 w-3.5 rounded border-[#34302B] accent-[#E3A94D]"
                />
                Publicar
              </label>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs text-[#9C9384] transition-colors hover:text-[#C1502E]"
              >
                Borrar
              </button>
            </div>

            <SaveButton status={status} dirty={dirty} onClick={handleSave} label="Guardar cambios" />
          </div>
        </div>
      </div>
    </div>
  );
}