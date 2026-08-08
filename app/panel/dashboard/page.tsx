import { createClient } from "@/lib/supabase/server"
import { getSiteContent } from "@/lib/site-content"
import PhotoManager from "@/components/PhotoManager"
import SiteContentEditor from "@/components/SiteContentEditor"
import JournalManager from "@/components/JournalManager"
import PanelNav from "@/components/PanelNav"
import { signOut } from "./actions"

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ data: photos }, { data: content }, { data: journal }] = await Promise.all([
    supabase.from("photos").select("*").order("sort_order", { ascending: true }),
    supabase.from("site_content").select("*"),
    supabase.from("journal").select("*").order("created_at", { ascending: false }),
  ])

  return (
    <>
      <PanelNav />

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 lg:pl-40 lg:pr-8">
        <header className="mb-12 flex items-start justify-between gap-4 border-b border-[#34302B] pb-6">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#5C564A]">Panel privado</p>
            <h1 className="font-(family-name:--font-display) text-3xl italic text-[#F3EFE6]">
              Administración
            </h1>
            <a
              href="/"
              target="_blank"
              className="mt-2 inline-block text-sm text-[#9C9384] underline decoration-[#34302B] underline-offset-4 transition-colors hover:text-[#E3A94D]"
            >
              Ver sitio publicado ↗
            </a>
          </div>
          <form action={signOut}>
            <button className="shrink-0 rounded-full border border-[#34302B] px-4 py-1.5 text-sm text-[#9C9384] transition-colors hover:border-[#C1502E]/40 hover:text-[#C1502E]">
              Cerrar sesión
            </button>
          </form>
        </header>

        <section id="sitio" className="mb-16 scroll-mt-8">
          <SectionHeader title="Textos e imágenes del sitio" />
          <SiteContentEditor content={getSiteContent(content)} />
        </section>

        <section id="trabajos" className="mb-16 scroll-mt-8">
          <SectionHeader title="Trabajos (fotos)" />
          <PhotoManager photos={photos ?? []} />
        </section>

        <section id="diario" className="scroll-mt-8">
          <SectionHeader title="Diario / noticias" />
          <JournalManager entries={journal ?? []} />
        </section>
      </main>
    </>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h2 className="font-(family-name:--font-display) text-xl italic text-[#F3EFE6]">{title}</h2>
      <div className="h-px flex-1 bg-[#34302B]" />
    </div>
  )
}