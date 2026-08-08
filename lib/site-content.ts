import type { SiteContent } from "@/lib/types"

export type SiteContentKey =
  | "site_name"
  | "hero_eyebrow"
  | "hero_title"
  | "hero_tagline"
  | "hero_image_path"
  | "about_heading"
  | "about_text"
  | "about_image_path"
  | "contact_email"
  | "contact_heading"
  | "contact_text"

export type SiteContentMap = Record<SiteContentKey, string>

const DEFAULTS: SiteContentMap = {
  site_name: "Tu Nombre",
  hero_eyebrow: "Fotógrafo · Tu Ciudad",
  hero_title: "Tu Nombre",
  hero_tagline: "",
  hero_image_path: "",
  about_heading: "",
  about_text: "",
  about_image_path: "",
  contact_email: "",
  contact_heading: "Hablemos de tu próximo proyecto.",
  contact_text: "",
}

export function getSiteContent(rows: SiteContent[] | null): SiteContentMap {
  const map = { ...DEFAULTS }
  for (const row of rows ?? []) {
    if (row.key in map) {
      map[row.key as SiteContentKey] = row.value ?? ""
    }
  }
  return map
}

export type ContentFieldType = "text" | "textarea" | "image"

export const CONTENT_FIELDS: {
  key: SiteContentKey
  label: string
  type: ContentFieldType
  section: "Portada (Hero)" | "Sobre mí" | "Contacto"
}[] = [
  { key: "site_name", label: "Nombre del sitio", type: "text", section: "Portada (Hero)" },
  { key: "hero_image_path", label: "Foto de portada", type: "image", section: "Portada (Hero)" },
  { key: "hero_eyebrow", label: "Línea pequeña (rol · ciudad)", type: "text", section: "Portada (Hero)" },
  { key: "hero_title", label: "Título grande", type: "text", section: "Portada (Hero)" },
  { key: "hero_tagline", label: "Frase de bajada", type: "textarea", section: "Portada (Hero)" },
  { key: "about_image_path", label: "Foto de perfil", type: "image", section: "Sobre mí" },
  { key: "about_heading", label: "Título de la sección", type: "textarea", section: "Sobre mí" },
  { key: "about_text", label: "Biografía", type: "textarea", section: "Sobre mí" },
  { key: "contact_heading", label: "Título de contacto", type: "text", section: "Contacto" },
  { key: "contact_text", label: "Texto de contacto", type: "textarea", section: "Contacto" },
  { key: "contact_email", label: "Email de contacto", type: "text", section: "Contacto" },
]
