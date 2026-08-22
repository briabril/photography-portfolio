import Link from "next/link"
import Image from "next/image"
import { Reveal } from "./Reveal"
import type { JournalEntry } from "@/lib/types"

export type JournalCard = JournalEntry & { imageUrl: string | null }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { month: "long", year: "numeric" })
}

export function Journal({ entries }: { entries: JournalCard[] }) {
  if (entries.length === 0) return null

  return (
    <section id="journal" className="mx-auto max-w-6xl px-6 py-24 md:py-32 lg:px-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-px w-8 bg-border" />
            Diario
          </p>
          <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] text-balance">
            Noticias y notas de campo
          </h2>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <Reveal key={entry.id} delay={i * 0.1} as="div">
            <Link href={`/diario/${entry.id}`} className="group block cursor-pointer">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                {entry.imageUrl && (
                  <Image
                    src={entry.imageUrl}
                    alt={entry.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                )}
              </div>
              <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-accent">{entry.category}</span>
                <span className="h-px w-4 bg-border" />
                <span>{formatDate(entry.created_at)}</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl font-light leading-snug transition-colors group-hover:text-accent">
                {entry.title}
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {entry.excerpt}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}