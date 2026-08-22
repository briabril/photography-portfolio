"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { SiteContentKey } from "@/lib/site-content"

function fileName(file: File) {
  const ext = file.name.split(".").pop()
  return `${crypto.randomUUID()}.${ext}`
}

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get("file") as File

  if (!file || file.size === 0) {
    throw new Error("No se seleccionó ningún archivo.")
  }

  const path = fileName(file)
  const { error: uploadError } = await supabase.storage.from("photos").upload(path, file)
  if (uploadError) throw new Error(`Error subiendo la imagen: ${uploadError.message}`)

  const { error: dbError } = await supabase.from("photos").insert({
    storage_path: path,
    title: (formData.get("title") as string) || "",
    category: (formData.get("category") as string) || "general",
    published: false,
  })
  if (dbError) throw new Error(`Error guardando en la base: ${dbError.message}`)

  revalidatePath("/panel/dashboard")
}

export async function updatePhoto(
  id: string,
  fields: { title?: string ; description?: string ; category?: string ; sort_order?: number }
) {
  const supabase = await createClient()
  const { error } = await supabase.from("photos").update(fields).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from("photos").update({ published }).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

export async function deletePhoto(id: string, storagePath: string) {
  const supabase = await createClient()

  await supabase.storage.from("photos").remove([storagePath])
  const { error } = await supabase.from("photos").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

export async function updateSiteContent(key: SiteContentKey, value: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("site_content").upsert({ key, value })
  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

export async function uploadSiteImage(key: SiteContentKey, formData: FormData) {
  const supabase = await createClient()
  const file = formData.get("file") as File
  if (!file || file.size === 0) throw new Error("No se seleccionó ningún archivo.")

  const path = `site/${key}-${fileName(file)}`
  const { error: uploadError } = await supabase.storage.from("photos").upload(path, file)
  if (uploadError) throw new Error(`Error subiendo la imagen: ${uploadError.message}`)

  const { error: dbError } = await supabase.from("site_content").upsert({ key, value: path })
  if (dbError) throw new Error(dbError.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

// JOURNAL (diario / noticias)

export async function createJournalEntry(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get("cover") as File | null

  let coverPath = ""
  if (file && file.size > 0) {
    coverPath = `journal/${fileName(file)}`
    const { error: uploadError } = await supabase.storage.from("photos").upload(coverPath, file)
    if (uploadError) throw new Error(`Error subiendo la tapa: ${uploadError.message}`)
  }

  const { error } = await supabase.from("journal").insert({
    title: (formData.get("title") as string) || "",
    excerpt: (formData.get("excerpt") as string) || "",
    body: (formData.get("body") as string) || "",
    category: (formData.get("category") as string) || "General",
    cover_path: coverPath,
    published: false,
  })
  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
}

export async function updateJournalEntry(
  id: string,
  fields: { title?: string ; excerpt?: string ; body?: string ; category?: string }
) {
  const supabase = await createClient()
  const { error } = await supabase.from("journal").update(fields).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
  revalidatePath(`/diario/${id}`)
}

export async function toggleJournalPublished(id: string, published: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from("journal").update({ published }).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/panel/dashboard")
  revalidatePath("/")
}

export async function deleteJournalEntry(id: string, coverPath: string) {
  const supabase = await createClient()

  if (coverPath) await supabase.storage.from("photos").remove([coverPath])
  const { error } = await supabase.from("journal").delete().eq("id", id)
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
