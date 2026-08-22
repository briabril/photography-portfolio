"use client";

import { useId, useRef, useTransition } from "react";
import Image from "next/image";
import { publicUrl } from "@/lib/storage";
import {
  createJournalEntry,
  updateJournalEntry,
  toggleJournalPublished,
  deleteJournalEntry,
} from "@/app/panel/dashboard/actions";
import { SaveButton } from "@/components/panel/SaveButton";
import {
  PanelInput,
  PanelTextarea,
  PanelFieldLabel,
  PublishedBadge,
  PublishToggle,
  DeleteButton,
} from "@/components/panel/PanelControls";
import { useFilePreview } from "@/hooks/useFilePreview";
import { useSavableField } from "@/hooks/useSavableField";
import type { JournalEntry } from "@/lib/types";

export default function JournalManager({ entries }: { entries: JournalEntry[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const preview = useFilePreview();
  const titleFieldId = useId();
  const categoryFieldId = useId();
  const excerptFieldId = useId();
  const bodyFieldId = useId();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createJournalEntry(formData);
      formRef.current?.reset();
      preview.clear();
    });
  }

  return (
    <div className="space-y-8">
      {/* Formulario de nueva entrada */}
      <form
        ref={formRef}
        action={handleCreate}
        className="space-y-3 rounded-xl border border-dashed border-panel-border bg-panel-surface/50 p-5"
      >
        <p className="font-(family-name:--font-display) text-base italic text-panel-foreground">
          Nueva entrada de diario
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <PanelFieldLabel htmlFor={titleFieldId}>Título</PanelFieldLabel>
            <PanelInput id={titleFieldId} type="text" name="title" placeholder="Título" required />
          </div>
          <div className="space-y-1">
            <PanelFieldLabel htmlFor={categoryFieldId}>Categoría</PanelFieldLabel>
            <PanelInput id={categoryFieldId} type="text" name="category" placeholder="ej: Notas de campo" />
          </div>
        </div>
        <div className="space-y-1">
          <PanelFieldLabel htmlFor={excerptFieldId}>Resumen corto</PanelFieldLabel>
          <PanelTextarea id={excerptFieldId} name="excerpt" placeholder="Se muestra en la grilla" rows={2} />
        </div>
        <div className="space-y-1">
          <PanelFieldLabel htmlFor={bodyFieldId}>Texto completo</PanelFieldLabel>
          <PanelTextarea id={bodyFieldId} name="body" placeholder="Texto completo de la entrada" rows={5} />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            {preview.previewUrl && (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-panel-border">
                <Image src={preview.previewUrl} alt="Vista previa de tapa" fill sizes="80px" unoptimized className="object-cover" />
              </div>
            )}
            <input
              type="file"
              name="cover"
              accept="image/*"
              onChange={preview.onFileInputChange}
              aria-label="Imagen de tapa"
              className="text-xs text-panel-muted file:mr-2 file:rounded-full file:border-0 file:bg-panel-accent/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-panel-accent hover:file:bg-panel-accent/25"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="ml-auto rounded-full bg-panel-accent px-4 py-2 text-sm font-medium text-panel-accent-foreground transition-colors hover:bg-panel-accent-hover disabled:opacity-50"
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
          <p className="text-sm text-panel-subtle">Todavía no hay entradas de diario.</p>
        )}
      </div>
    </div>
  );
}

type JournalFields = Pick<JournalEntry, "title" | "category" | "excerpt" | "body">;

function JournalCard({ entry }: { entry: JournalEntry }) {
  const field = useSavableField<JournalFields>({
    title: entry.title,
    category: entry.category,
    excerpt: entry.excerpt,
    body: entry.body,
  });
  const [isPending, startTransition] = useTransition();
  const imageUrl = publicUrl(entry.cover_path);

  function set<K extends keyof JournalFields>(key: K, value: JournalFields[K]) {
    field.setValue({ ...field.value, [key]: value });
  }

  function handleSave() {
    field.save((value) => updateJournalEntry(entry.id, value));
  }

  function handleDelete() {
    startTransition(() => deleteJournalEntry(entry.id, entry.cover_path));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-panel-border bg-panel-surface transition-colors hover:border-panel-border-hover">
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-panel-bg sm:w-44">
          {imageUrl ? (
            <Image src={imageUrl} alt={entry.title} fill sizes="176px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-panel-subtle">Sin tapa</div>
          )}
          <PublishedBadge published={entry.published} />
        </div>

        <div className="flex-1 space-y-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <PanelInput
              aria-label="Título"
              value={field.value.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Título"
            />
            <PanelInput
              aria-label="Categoría"
              value={field.value.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Categoría"
            />
          </div>
          <PanelTextarea
            aria-label="Resumen corto"
            value={field.value.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            placeholder="Resumen corto"
          />
          <PanelTextarea
            aria-label="Texto completo"
            value={field.value.body}
            onChange={(e) => set("body", e.target.value)}
            rows={3}
            placeholder="Texto completo"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-4">
              <PublishToggle
                checked={entry.published}
                disabled={isPending}
                onChange={(published) => startTransition(() => toggleJournalPublished(entry.id, published))}
              />
              <DeleteButton
                itemLabel={entry.title || "esta entrada"}
                disabled={isPending}
                onDelete={handleDelete}
              />
            </div>

            <SaveButton status={field.status} dirty={field.dirty} onClick={handleSave} label="Guardar cambios" />
          </div>
        </div>
      </div>
    </div>
  );
}
