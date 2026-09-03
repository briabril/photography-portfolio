"use client";

import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50 MB

function getExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension) {
    throw new Error("La imagen no tiene una extensión válida.");
  }

  return extension;
}

export function createImagePath(prefix = "") {
  const extension = "jpg";
  const id = crypto.randomUUID();

  return prefix ? `${prefix}/${id}.${extension}` : `${id}.${extension}`;
}

export async function uploadImageDirect(file: File, path: string) {
  if (!file || file.size === 0) {
    throw new Error("No se seleccionó ningún archivo.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo seleccionado no es una imagen.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("La imagen no puede superar los 50 MB.");
  }

  // Conservamos la extensión real del archivo.
  const extension = getExtension(file);
  const finalPath = path.replace(/\.[^.]+$/, `.${extension}`);

  const supabase = createClient();

  const { error } = await supabase.storage
    .from("photos")
    .upload(finalPath, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Error subiendo la imagen: ${error.message}`);
  }

  return finalPath;
}