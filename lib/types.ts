// Estos tipos reflejan las columnas de supabase/schema.sql

export type Photo = {
  id: string
  storage_path: string
  title: string
  description: string
  category: string
  sort_order: number
  published: boolean
  created_at: string
}

export type JournalEntry = {
  id: string
  title: string
  excerpt: string
  body: string
  category: string
  cover_path: string
  sort_order: number
  published: boolean
  created_at: string
}

export type SiteContent = {
  key: string
  value: string
}

export type Database = {
  public: {
    Tables: {
      photos: {
        Row: Photo
        Insert: Partial<Photo> & { storage_path: string }
        Update: Partial<Photo>
        Relationships: []
      }
      journal: {
        Row: JournalEntry
        Insert: Partial<JournalEntry>
        Update: Partial<JournalEntry>
        Relationships: []
      }
      site_content: {
        Row: SiteContent
        Insert: SiteContent
        Update: Partial<SiteContent>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
