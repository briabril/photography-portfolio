/** Cliente de Supabase para SERVIDOR! Server Components (page.tsx sin "use client"),
 * Server Actions y Route Handlers.
 * 
 * La diferencia clave con client.ts es que este lee/escribe la sesión del usuario
 * desde las cookies de la request, porque en el servidor no hay localStorage
 * del navegador donde guardar el login. Por eso next/headers y cookies()
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/types"

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch {
                        // Esto puede tirar error si se llama desde un Server Component
                        // (que no puede escribir cookies). Sin embargo el middleware.ts 
                        // es el que se encarga de refrescar la sesión en ese caso
                    }
                }
            }
        }
    )
}