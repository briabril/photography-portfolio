"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { navLinks } from "@/lib/config"

const SECTION_IDS = navLinks.map((link) => link.href.replace("#", ""))

export function Navbar({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-md" : "bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div
        className={`h-px w-full bg-linear-to-r from-transparent via-accent to-glow transition-opacity duration-500 ${
          scrolled ? "opacity-60" : "opacity-0"
        }`}
      />

      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[height] duration-500 ease-out lg:px-10 ${
          scrolled ? "h-14 md:h-16" : "h-16 md:h-20"
        }`}
      >
        <a href="#top" aria-label={`${siteName}, inicio`} className="group flex flex-col leading-none">
          <span className="font-serif text-lg tracking-tight md:text-xl">{siteName}</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => {
            const id = link.href.replace("#", "")
            const isActive = active === id
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className="group/link flex items-center gap-2 py-2 font-mono text-xs uppercase tracking-[0.15em]"
                >
                  <span
                    className={`h-1 w-1 rounded-full transition-all duration-300 ${
                      isActive
                        ? "scale-100 bg-glow opacity-100"
                        : "scale-0 bg-glow opacity-0 group-hover/link:scale-100 group-hover/link:opacity-100"
                    }`}
                  />
                  <span className={isActive ? "text-accent/60" : "text-foreground/35"}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-sans text-sm normal-case tracking-normal transition-colors ${
                      isActive ? "text-foreground" : "text-foreground/80 group-hover/link:text-foreground"
                    }`}
                  >
                    {link.label}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <a
          href="#contact"
          className="group hidden items-center gap-3 rounded-full border border-foreground/25 py-2.5 pl-5 pr-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background md:inline-flex"
        >
          Contactar
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-16 z-40 bg-ink text-ink-foreground md:hidden"
          >
            <ul className="flex h-full flex-col justify-center gap-2 px-8 pb-24">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-ink-foreground/10 last:border-none"
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-5"
                  >
                    <span className="font-mono text-xs tracking-[0.2em] text-glow">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-3xl italic tracking-tight">{link.label}</span>
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * navLinks.length, ease: [0.16, 1, 0.3, 1] }}
                className="pt-6"
              >
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-3 rounded-full border border-ink-foreground/25 py-3 pl-6 pr-5 text-xs font-semibold uppercase tracking-[0.25em] text-ink-foreground"
                >
                  Contactar
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}