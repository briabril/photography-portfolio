"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import type { SiteContentKey } from "@/lib/site-content"

// PHOTOS

export async function uploadPhoto(
  path: string,
  title: string,
  category: string
) {
  const supabase = await createClient()

  if (!path) {
    throw new Error("No se especificó la ruta de la imagen.")
  }

  const { error: dbError } = await supabase.from("photos").insert({
    storage_path: path,
    title: title || "",
    category: category || "general",
    published: false,
  })

  if (dbError) {
    // Si la BD falla, eliminamos la imagen que ya se subió
    // directamente a Supabase Storage.
    await supabase.storage.from("photos").remove([path])

    throw new Error(`Error guardando en la base: ${dbError.message}`)
  }

  revalidatePath("/panel/dashboard")
}

export async function updatePhoto(
  id: string,
  fields: {
    title?: string
    description?: string
    category?: string
    sort_order?: number
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("photos")
    .update(fields)
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

export async function togglePublished(
  id: string,
  published: boolean
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("photos")
    .update({ published })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

export async function deletePhoto(
  id: string,
  storagePath: string
) {
  const supabase = await createClient()

  await supabase.storage
    .from("photos")
    .remove([storagePath])

  const { error } = await supabase
    .from("photos")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

// SITE CONTENT

export async function updateSiteContent(
  key: SiteContentKey,
  value: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value })

  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

export async function uploadSiteImage(
  key: SiteContentKey,
  path: string
) {
  const supabase = await createClient()

  if (!path) {
    throw new Error("No se especificó la ruta de la imagen.")
  }

  const { error: dbError } = await supabase
    .from("site_content")
    .upsert({
      key,
      value: path,
    })

  if (dbError) {
    // Si la BD falla, eliminamos la imagen
    // que ya se había subido al Storage.
    await supabase.storage
      .from("photos")
      .remove([path])

    throw new Error(dbError.message)
  }

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

// JOURNAL

export async function createJournalEntry({
  title,
  excerpt,
  body,
  category,
  coverPath,
}: {
  title: string
  excerpt: string
  body: string
  category: string
  coverPath: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("journal").insert({
    title: title || "",
    excerpt: excerpt || "",
    body: body || "",
    category: category || "General",
    cover_path: coverPath || "",
    published: false,
  })

  if (error) {
    // Si la BD falla después de haber subido
    // la portada, eliminamos esa imagen.
    if (coverPath) {
      await supabase.storage
        .from("photos")
        .remove([coverPath])
    }

    throw new Error(error.message)
  }

  revalidatePath("/panel/dashboard")
}

export async function updateJournalEntry(
  id: string,
  fields: {
    title?: string
    excerpt?: string
    body?: string
    category?: string
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("journal")
    .update(fields)
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
  revalidatePath(`/diario/${id}`)
}

export async function toggleJournalPublished(
  id: string,
  published: boolean
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("journal")
    .update({ published })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

export async function deleteJournalEntry(
  id: string,
  coverPath: string
) {
  const supabase = await createClient()

  if (coverPath) {
    await supabase.storage
      .from("photos")
      .remove([coverPath])
  }

  const { error } = await supabase
    .from("journal")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

// AUTH

export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  redirect("/panel/login")
}