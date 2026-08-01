"use server";

// Las Server Actions son funciones que declarás con "use server" y que
// podés llamar directamente desde un formulario o un botón en el cliente,
// como si fueran una función normal de JS, pero en realidad Next.js las
// ejecuta en el servidor (nunca se manda el código al navegador).
//
// Son el reemplazo moderno de armar una API route + fetch a mano.
// Acá viven todas las acciones que puede hacer tu abuelo desde /panel.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Sube un archivo a Storage y crea la fila correspondiente en `photos`.
export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    throw new Error("No se seleccionó ningún archivo.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(fileName, file);

  if (uploadError) {
    throw new Error(`Error subiendo la imagen: ${uploadError.message}`);
  }

  const { error: dbError } = await supabase.from("photos").insert({
    storage_path: fileName,
    title: (formData.get("title") as string) || "",
    category: (formData.get("category") as string) || "general",
    published: false, // se sube como borrador; se publica después a mano
  });

  if (dbError) {
    throw new Error(`Error guardando en la base: ${dbError.message}`);
  }

  revalidatePath("/panel/dashboard");
}

// Actualiza título, descripción, categoría u orden de una foto existente.
export async function updatePhoto(
  id: string,
  fields: { title?: string; description?: string; category?: string; sort_order?: number }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("photos").update(fields).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/panel/dashboard");
  revalidatePath("/"); // el sitio público también puede haber cambiado
}

// Prende/apaga la visibilidad pública de una foto.
export async function togglePublished(id: string, published: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("photos")
    .update({ published })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/panel/dashboard");
  revalidatePath("/");
}

// Borra una foto: primero el archivo de Storage, después la fila.
export async function deletePhoto(id: string, storagePath: string) {
  const supabase = await createClient();

  await supabase.storage.from("photos").remove([storagePath]);
  const { error } = await supabase.from("photos").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/panel/dashboard");
  revalidatePath("/");
}

// Actualiza un texto general del sitio (hero, bio, contacto, etc).
export async function updateSiteContent(key: string, value: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value });

  if (error) throw new Error(error.message);

  revalidatePath("/panel/dashboard");
  revalidatePath("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/panel/login");
}