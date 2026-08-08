// Cliente de Supabase para COMPONENTES DE CLIENTE ("use client")
// Se usa en el navegador! por ejemplo, en el formulario de login, 
// o en el botón de "subir foto" del panel

// Usa la anon key, que es pública a propósito: la seguridad real 
// no depende de esconder esta key, sino de las políticas RLS 
// que fueron definidas en schema.sql (un visitante anónimo solo puede LEER 
// fotos publicadas, escribir requiere estar autenticado)

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/types"

export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}