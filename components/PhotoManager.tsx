"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  uploadPhoto,
  updatePhoto,
  togglePublished,
  deletePhoto,
} from "@/app/panel/dashboard/actions";
import type { Photo } from "@/lib/types";

// Componente de cliente: necesita estado local (inputs, "está guardando")
// e interacción directa del usuario. Recibe las fotos ya cargadas desde
// el Server Component (page.tsx) como prop inicial.
export default function PhotoManager({ photos }: { photos: Photo[] }) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function publicUrlFor(path: string) {
    return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
  }

  async function handleUpload(formData: FormData) {
    startTransition(async () => {
      await uploadPhoto(formData);
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  return (
    <div className="space-y-6">
      {/* Formulario de subida */}
      <form action={handleUpload} className="flex flex-wrap items-end gap-3">
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept="image/*"
          required
          className="text-sm"
        />
        <input
          type="text"
          name="title"
          placeholder="Título"
          className="rounded border border-neutral-300 px-2 py-1 text-sm"
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          className="rounded border border-neutral-300 px-2 py-1 text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isPending ? "Subiendo..." : "Subir foto"}
        </button>
      </form>

      {/* Lista de fotos existentes */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            imageUrl={publicUrlFor(photo.storage_path)}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoCard({ photo, imageUrl }: { photo: Photo; imageUrl: string }) {
  const [title, setTitle] = useState(photo.title);
  const [category, setCategory] = useState(photo.category);
  const [isPending, startTransition] = useTransition();

  function saveChanges() {
    startTransition(() => updatePhoto(photo.id, { title, category }));
  }

  return (
    <div className="space-y-2 rounded border border-neutral-200 p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={photo.title}
        className="aspect-square w-full rounded object-cover"
      />

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={saveChanges}
        placeholder="Título"
        className="w-full rounded border border-neutral-200 px-2 py-1 text-xs"
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        onBlur={saveChanges}
        placeholder="Categoría"
        className="w-full rounded border border-neutral-200 px-2 py-1 text-xs"
      />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={photo.published}
            disabled={isPending}
            onChange={(e) =>
              startTransition(() =>
                togglePublished(photo.id, e.target.checked)
              )
            }
          />
          Publicada
        </label>

        <button
          onClick={() =>
            startTransition(() => deletePhoto(photo.id, photo.storage_path))
          }
          disabled={isPending}
          className="text-red-600 underline"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}