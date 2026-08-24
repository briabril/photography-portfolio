import { createClient } from "@/lib/supabase/server"
import { getSiteContent } from "@/lib/site-content"
import PhotoManager from "@/components/panel/PhotoManager"
import SiteContentEditor from "@/components/panel/SiteContentEditor"
import JournalManager from "@/components/panel/JournalManager"
import PanelNav from "@/components/panel/PanelNav"
import { PanelSectionHeader, PanelEyebrow, PanelLinkButton } from "@/components/panel/PanelControls"
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
        <header className="mb-12 flex flex-col gap-6 border-b border-panel-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <PanelEyebrow>Panel privado</PanelEyebrow>
            <h1 className="mt-3 font-(family-name:--font-display) text-3xl italic text-panel-foreground md:text-4xl">
              Administración
            </h1>
            <div className="mt-4">
              <PanelLinkButton href="/">Ver sitio publicado</PanelLinkButton>
            </div>
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