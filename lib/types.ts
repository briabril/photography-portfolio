// Estos tipos reflejan las columnas de supabase/schema.sql
// Si el día de mañana agrego una tablam la agrego acá también

export type Photo = {
    id: string;
    storage_path: string;
    title: string;
    description: string;
    category: string;
    sort_order: number;
    published: boolean;
    created_at: string;
}

export type SiteContent = {
    key: string;
    value: string;
}

// Tipo genérico que le describe a los clientes de Supabase la forma
// completa de la base (tablas, columnas). Usarlo con createClient<Database>()
// te da autocompletado y chequeo de tipos en cada query (.from('photos')...).
export type Database = {
  public: {
    Tables: {
      photos: {
        Row: Photo;
        Insert: Partial<Photo> & { storage_path: string };
        Update: Partial<Photo>;
        Relationships: [];
      };
      site_content: {
        Row: SiteContent;
        Insert: SiteContent;
        Update: Partial<SiteContent>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};