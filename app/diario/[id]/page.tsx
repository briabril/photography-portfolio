import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getSiteContent } from "@/lib/site-content"
import { publicUrl } from "@/lib/storage"
import { Navbar } from "@/components/site/Navbar"
import { Footer } from "@/components/site/Footer"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
}

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: entry }, { data: content }] = await Promise.all([
    supabase.from("journal").select("*").eq("id", id).eq("published", true).maybeSingle(),
    supabase.from("site_content").select("*"),
  ])

  if (!entry) notFound()

  const text = getSiteContent(content)
  const imageUrl = publicUrl(entry.cover_path)

  return (
    <div className="min-h-screen bg-background">
      <Navbar siteName={text.site_name} />

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:pt-40 lg:px-10">
        <Link
          href="/#journal"
          className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Volver al diario
        </Link>

        <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="text-accent">{entry.category}</span>
          <span className="h-px w-4 bg-border" />
          <span>{formatDate(entry.created_at)}</span>
        </div>

        <h1 className="mt-4 font-serif text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] text-balance">
          {entry.title}
        </h1>

        {imageUrl && (
          <div className="relative mt-10 aspect-video w-full overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={entry.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-10 max-w-none whitespace-pre-line text-pretty text-lg leading-relaxed text-foreground/85">
          {entry.body}
        </div>
      </main>

      <Footer siteName={text.site_name} eyebrow={text.hero_eyebrow} />
    </div>
  )
}
