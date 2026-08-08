"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  uploadPhoto,
  updatePhoto,
  togglePublished,
  deletePhoto,
} from "@/app/panel/dashboard/actions";
import { SaveButton, type SaveStatus } from "@/components/site/SaveButton";
import type { Photo } from "@/lib/types";

const inputClassSm =
  "w-full rounded-lg border border-[#34302B] bg-[#14130F] px-2.5 py-1.5 text-xs text-[#F3EFE6] placeholder:text-[#5C564A] transition-colors focus:border-[#E3A94D]/50 focus:outline-none focus:ring-1 focus:ring-[#E3A94D]/30";

export default function PhotoManager({ photos }: { photos: Photo[] }) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function publicUrlFor(path: string) {
    return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  async function handleUpload(formData: FormData) {
    startTransition(async () => {
      await uploadPhoto(formData);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    });
  }

  return (
    <div className="space-y-6">
      {/* Formulario de subida */}
      <form
        action={handleUpload}
        className="space-y-3 rounded-xl border border-dashed border-[#34302B] bg-[#1C1A15]/50 p-5"
      >
        <p className="font-(family-name:--font-display) text-base italic text-[#F3EFE6]">
          Subir una foto nueva
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {previewUrl && (
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#34302B]">
              <img //cambiar por Image después 
              src={previewUrl} alt="Vista previa" className="h-full w-full object-cover" /> 
            </div>
          )}
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs text-[#9C9384]">Archivo</label>
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                accept="image/*"
                required
                onChange={handleFileSelect}
                className="block w-full text-xs text-[#9C9384] file:mr-2 file:rounded-full file:border-0 file:bg-[#E3A94D]/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#E3A94D] hover:file:bg-[#E3A94D]/25"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#9C9384]">Título</label>
              <input type="text" name="title" placeholder="Título" className={inputClassSm} />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#9C9384]">Categoría</label>
              <input type="text" name="category" placeholder="Categoría" className={inputClassSm} />
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 rounded-full bg-[#E3A94D] px-4 py-2 text-sm font-medium text-[#14130F] transition-colors hover:bg-[#F0BB63] disabled:opacity-50"
          >
            {isPending ? "Subiendo…" : "Subir foto"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} imageUrl={publicUrlFor(photo.storage_path)} />
        ))}
      </div>
      {photos.length === 0 && (
        <p className="text-sm text-[#5C564A]">Todavía no subiste ninguna foto.</p>
      )}
    </div>
  );
}

function PhotoCard({ photo, imageUrl }: { photo: Photo; imageUrl: string }) {
  const [title, setTitle] = useState(photo.title);
  const [category, setCategory] = useState(photo.category);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [isPending, startTransition] = useTransition();
  const dirty = title !== photo.title || category !== photo.category;

  function handleSave() {
    setStatus("saving");
    startTransition(async () => {
      try {
        await updatePhoto(photo.id, { title, category });
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1800);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    });
  }

  function handleDelete() {
    const name = photo.title || "esta foto";
    if (!window.confirm(`¿Borrar "${name}"? Esta acción no se puede deshacer.`)) return;
    startTransition(() => deletePhoto(photo.id, photo.storage_path));
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-[#34302B] bg-[#1C1A15] transition-colors hover:border-[#4A443A]">
      <div className="relative aspect-square overflow-hidden bg-[#14130F]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={photo.title || "Foto"} className="h-full w-full object-cover" />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${
            photo.published ? "bg-[#7C9A82]/85 text-[#0E1610]" : "bg-[#14130F]/75 text-[#9C9384]"
          }`}
        >
          {photo.published ? "Publicada" : "Borrador"}
        </span>
      </div>

      <div className="space-y-2 p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
          className={inputClassSm}
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Categoría"
          className={inputClassSm}
        />

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[#9C9384]">
            <input
              type="checkbox"
              checked={photo.published}
              disabled={isPending}
              onChange={(e) => startTransition(() => togglePublished(photo.id, e.target.checked))}
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

        <SaveButton status={status} dirty={dirty} onClick={handleSave} label="Guardar" className="w-full justify-center" />
      </div>
    </div>
  );
}