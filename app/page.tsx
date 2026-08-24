import { createPublicClient } from "@/lib/supabase/public"
import { getSiteContent } from "@/lib/site-content"
import { publicUrl } from "@/lib/storage"
import { Navbar } from "@/components/site/Navbar"
import { Hero } from "@/components/site/Hero"
import { About } from "@/components/site/About"
import { Work, type WorkPhoto } from "@/components/site/Work"
import { Services } from "@/components/site/Services"
import { Journal, type JournalCard } from "@/components/site/Journal"
import { Contact } from "@/components/site/Contact"
import { Footer } from "@/components/site/Footer"

export const revalidate = 300

export default async function HomePage() {
  const supabase = createPublicClient()

  const [{ data: content }, { data: photos }, { data: journalRows }] = await Promise.all([
    supabase.from("site_content").select("*"),
    supabase.from("photos").select("*").eq("published", true).order("sort_order", { ascending: true }),
    supabase.from("journal").select("*").eq("published", true).order("sort_order", { ascending: true }),
  ])

  const text = getSiteContent(content)

  const workPhotos: WorkPhoto[] = (photos ?? [])
    .map((p) => ({ ...p, imageUrl: publicUrl(p.storage_path) }))
    .filter((p): p is WorkPhoto => Boolean(p.imageUrl))

  const journalEntries: JournalCard[] = (journalRows ?? []).map((j) => ({
    ...j,
    imageUrl: publicUrl(j.cover_path),
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar siteName={text.site_name} />
      <main>
        <Hero
          eyebrow={text.hero_eyebrow}
          title={text.hero_title}
          tagline={text.hero_tagline}
          imageUrl={publicUrl(text.hero_image_path)}
        />
        <About
          heading={text.about_heading}
          bio={text.about_text}
          imageUrl={publicUrl(text.about_image_path)}
          siteName={text.site_name}
        />
        <Work photos={workPhotos} />
        <Services />
        <Journal entries={journalEntries} />
        <Contact heading={text.contact_heading} text={text.contact_text} email={text.contact_email} />
      </main>
      <Footer siteName={text.site_name} eyebrow={text.hero_eyebrow} />
    </div>
  )
}