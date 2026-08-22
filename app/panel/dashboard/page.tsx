import { createClient } from "@/lib/supabase/server"
import { getSiteContent } from "@/lib/site-content"
import PhotoManager from "@/components/panel/PhotoManager"
import SiteContentEditor from "@/components/panel/SiteContentEditor"
import JournalManager from "@/components/panel/JournalManager"
import PanelNav from "@/components/panel/PanelNav"
import { PanelSectionHeader } from "@/components/panel/PanelControls"
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
        <header className="mb-12 flex items-start justify-between gap-4 border-b border-panel-border pb-6">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-panel-subtle">Panel privado</p>
            <h1 className="font-(family-name:--font-display) text-3xl italic text-panel-foreground">
              Administración
            </h1>
            <a
              href="/"
              target="_blank"
              className="mt-2 inline-block text-sm text-panel-muted underline decoration-panel-border underline-offset-4 transition-colors hover:text-panel-accent"
            >
              Ver sitio publicado ↗
            </a>
          </div>
          <form action={signOut}>
            <button className="shrink-0 rounded-full border border-panel-border px-4 py-1.5 text-sm text-panel-muted transition-colors hover:border-panel-danger/40 hover:text-panel-danger">
              Cerrar sesión
            </button>
          </form>
        </header>

        <section id="sitio" className="mb-16 scroll-mt-8">
          <PanelSectionHeader title="Textos e imágenes del sitio" />
          <SiteContentEditor content={getSiteContent(content)} />
        </section>

        <section id="trabajos" className="mb-16 scroll-mt-8">
          <PanelSectionHeader title="Trabajos (fotos)" />
          <PhotoManager photos={photos ?? []} />
        </section>

        <section id="diario" className="scroll-mt-8">
          <PanelSectionHeader title="Diario / noticias" />
          <JournalManager entries={journal ?? []} />
        </section>
      </main>
    </>
  )
}