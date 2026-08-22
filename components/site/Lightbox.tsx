"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export type LightboxItem = {
  id: string
  title: string
  category: string
  year: string
  imageUrl: string
}

type LightboxProps = {
  items: LightboxItem[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const isOpen = index !== null

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNavigate((index! + 1) % items.length)
      if (e.key === "ArrowLeft") onNavigate((index! - 1 + items.length) % items.length)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [isOpen, index, items.length, onClose, onNavigate])

  const item = isOpen ? items[index!] : null

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-ink/97 p-4 md:p-10"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center text-ink-foreground/80 transition-colors hover:text-glow md:right-8 md:top-8"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            aria-label="Foto anterior"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index! - 1 + items.length) % items.length)
            }}
            className="absolute left-2 inline-flex h-11 w-11 items-center justify-center text-ink-foreground/70 transition-colors hover:text-glow md:left-8"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index! + 1) % items.length)
            }}
            className="absolute right-2 inline-flex h-11 w-11 items-center justify-center text-ink-foreground/70 transition-colors hover:text-glow md:right-8"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <motion.figure
            key={item.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */ }
            <img
              src={item.imageUrl}
              alt={item.title}
              className="max-h-[78svh] w-auto max-w-full object-contain"
            />
            <figcaption className="mt-5 flex items-center gap-4 text-ink-foreground">
              <span className="font-mono text-xs text-glow">
                N.&#176; {String((isOpen ? index! : 0) + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-lg">{item.title}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-foreground/60">
                {item.category} · {item.year}
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}