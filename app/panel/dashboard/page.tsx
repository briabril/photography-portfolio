import { createClient } from "@/lib/supabase/server";
import PhotoManager from "@/components/PhotoManager";
import SiteContentEditor from "@/components/SiteContentEditor";
import { signOut } from "./actions";

// Server Component: corre en el servidor en cada visita, trae los datos
// directo de la base (acá SÍ traemos TODAS las fotos, publicadas o no,
// porque el usuario ya está autenticado y la policy RLS "authenticated
// pueden leer todo" se lo permite). Después le pasa los datos a
// componentes de cliente para que el abuelo pueda interactuar con ellos.
export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: content } = await supabase.from("site_content").select("*");

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-medium">Panel de administración</h1>
        <form action={signOut}>
          <button className="text-sm text-neutral-500 underline">
            Cerrar sesión
          </button>
        </form>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-medium">Textos del sitio</h2>
        <SiteContentEditor content={content ?? []} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium">Fotos</h2>
        <PhotoManager photos={photos ?? []} />
      </section>
    </main>
  );
}