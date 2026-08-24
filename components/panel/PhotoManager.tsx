"use client";

import { useId, useRef, useTransition } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  uploadPhoto,
  updatePhoto,
  togglePublished,
  deletePhoto,
} from "@/app/panel/dashboard/actions";
import { ArrowUpRight } from "lucide-react";
import { SaveButton } from "@/components/panel/SaveButton";
import {
  PanelInput,
  PanelFieldLabel,
  PublishedBadge,
  PublishToggle,
  DeleteButton,
  PanelEyebrow,
  PanelFrame,
} from "@/components/panel/PanelControls";
import { useFilePreview } from "@/hooks/useFilePreview";
import { useSavableField } from "@/hooks/useSavableField";
import type { Photo } from "@/lib/types";

export default function PhotoManager({ photos }: { photos: Photo[] }) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const preview = useFilePreview();
  const fileFieldId = useId();
  const titleFieldId = useId();
  const categoryFieldId = useId();

  function publicUrlFor(path: string) {
    return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
  }

  async function handleUpload(formData: FormData) {
    startTransition(async () => {
      await uploadPhoto(formData);
      if (fileInputRef.current) fileInputRef.current.value = "";
      preview.clear();
    });
  }

  return (
    <div className="space-y-6">
      {/* Formulario de subida */}
      <form
        action={handleUpload}
        className="space-y-3 rounded-xl border border-dashed border-panel-border bg-panel-surface/50 p-5"
      >
        <PanelEyebrow>Trabajos</PanelEyebrow>
        <p className="font-(family-name:--font-display) text-base italic text-panel-foreground">
          Subir una foto nueva
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {preview.previewUrl && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-panel-border">
              <Image src={preview.previewUrl} alt="Vista previa" fill sizes="80px" unoptimized className="object-cover" />
            </div>
          )}
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <PanelFieldLabel htmlFor={fileFieldId}>Archivo</PanelFieldLabel>
              <input
                id={fileFieldId}
                ref={fileInputRef}
                type="file"
                name="file"
                accept="image/*"
                required
                onChange={preview.onFileInputChange}
                className="block w-full text-xs text-panel-muted file:mr-2 file:rounded-full file:border-0 file:bg-panel-accent/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-panel-accent hover:file:bg-panel-accent/25"
              />
            </div>
            <div className="space-y-1">
              <PanelFieldLabel htmlFor={titleFieldId}>Título</PanelFieldLabel>
              <PanelInput id={titleFieldId} size="sm" type="text" name="title" placeholder="Título" />
            </div>
            <div className="space-y-1">
              <PanelFieldLabel htmlFor={categoryFieldId}>Categoría</PanelFieldLabel>
              <PanelInput id={categoryFieldId} size="sm" type="text" name="category" placeholder="Categoría" />
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-panel-accent px-4 py-2 text-sm font-medium text-panel-accent-foreground transition-colors hover:bg-panel-accent-hover disabled:opacity-50"
          >
            {isPending ? "Subiendo…" : "Subir foto"}
            {!isPending && (
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} imageUrl={publicUrlFor(photo.storage_path)} />
        ))}
      </div>
      {photos.length === 0 && (
        <p className="text-sm text-panel-subtle">Todavía no subiste ninguna foto.</p>
      )}
    </div>
  );
}

function PhotoCard({ photo, imageUrl }: { photo: Photo; imageUrl: string }) {
  const field = useSavableField({ title: photo.title, category: photo.category });
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    field.save((value) => updatePhoto(photo.id, value));
  }

  function handleDelete() {
    startTransition(() => deletePhoto(photo.id, photo.storage_path));
  }

  return (
    <div className="group rounded-xl bg-panel-surface p-3 transition-colors">
      <PanelFrame className="aspect-square">
        <Image
          src={imageUrl}
          alt={photo.title || "Foto"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        <PublishedBadge published={photo.published} />
      </PanelFrame>

      <div className="space-y-2 pt-4">
        <PanelInput
          aria-label="Título"
          size="sm"
          value={field.value.title}
          onChange={(e) => field.setValue({ ...field.value, title: e.target.value })}
          placeholder="Título"
        />
        <PanelInput
          aria-label="Categoría"
          size="sm"
          value={field.value.category}
          onChange={(e) => field.setValue({ ...field.value, category: e.target.value })}
          placeholder="Categoría"
        />

        <div className="flex items-center justify-between pt-0.5">
          <PublishToggle
            checked={photo.published}
            disabled={isPending}
            onChange={(published) => startTransition(() => togglePublished(photo.id, published))}
          />
          <DeleteButton itemLabel={photo.title || "esta foto"} disabled={isPending} onDelete={handleDelete} />
        </div>

        <SaveButton
          status={field.status}
          dirty={field.dirty}
          onClick={handleSave}
          label="Guardar"
          className="w-full justify-center"
        />
      </div>
    </div>
  );
}