"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Reveal } from "./Reveal"
import { Lightbox, type LightboxItem } from "./Lightbox"
import type { Photo } from "@/lib/types"

export type WorkPhoto = Photo & { imageUrl: string }

function spanClasses(i: number) {
  const mod = i % 7
  if (mod === 0) return "sm:col-span-2 aspect-[16/10]"
  if (mod === 3) return "row-span-2 aspect-[3/4] sm:aspect-auto"
  return "aspect-[4/3]"
}

export function Work({ photos }: { photos: WorkPhoto[] }) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))
    return ["Todo", ...unique]
  }, [photos])

  const [active, setActive] = useState("Todo")
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = useMemo(
    () => (active === "Todo" ? photos : photos.filter((p) => p.category === active)),
    [active, photos],
  )

  const lightboxItems: LightboxItem[] = filtered.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    year: new Date(p.created_at).getFullYear().toString(),
    imageUrl: p.imageUrl,
  }))

  if (photos.length === 0) return null

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24 md:py-32 lg:px-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-px w-8 bg-border" />
            Trabajos seleccionados
          </p>
          <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] text-balance">
            Una galería de momentos
          </h2>
        </Reveal>

        {categories.length > 1 && (
          <Reveal delay={0.1}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => setActive(cat)}
                    className={`relative pb-1 text-sm font-medium transition-colors ${
                      active === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                    {active === cat && (
                      <motion.span
                        layoutId="work-filter-underline"
                        className="absolute inset-x-0 -bottom-px h-px bg-accent"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>

      <motion.div layout className="mt-14 grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.button
              layout
              key={item.id}
              type="button"
              onClick={() => setSelected(i)}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden bg-muted text-left ${spanClasses(i)}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img //cambiar por Image después
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div>
                  <p className="font-serif text-xl text-background">{item.title}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-background/75">
                    {item.category}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <Lightbox
        items={lightboxItems}
        index={selected}
        onClose={() => setSelected(null)}
        onNavigate={setSelected}
      />
    </section>
  )
}
