"use client"

import { useEffect, useState } from "react"
const SECTIONS = [
  { id: "sitio", label: "Sitio" },
  { id: "trabajos", label: "Trabajos" },
  { id: "diario", label: "Diario" },
]

export default function PanelNav() {
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    )

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Desktop: tira flotante a la izquierda */}
      <nav
        aria-label="Secciones del panel"
        className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <div className="relative rounded-2xl border border-[#34302B] bg-[#1C1A15]/90 py-3 pl-4 pr-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          {/* perforaciones de la tira de película */}
          <div className="pointer-events-none absolute left-1.5 top-3 bottom-3 flex flex-col justify-between">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-[2px] bg-[#0A0908]" />
            ))}
          </div>

          <div className="flex flex-col gap-1 pl-3">
            {SECTIONS.map((s) => {
              const isActive = active === s.id
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-[#E3A94D]/15 text-[#E3A94D]"
                      : "text-[#9C9384] hover:bg-[#232019] hover:text-[#F3EFE6]"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      isActive ? "bg-[#E3A94D]" : "bg-[#4A443A] group-hover:bg-[#9C9384]"
                    }`}
                  />
                  <span className="tracking-wide">{s.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile / tablet: barra superior pegajosa */}
      <nav
        aria-label="Secciones del panel"
        className="sticky top-0 z-40 -mx-4 mb-6 flex gap-2 overflow-x-auto border-b border-[#34302B] bg-[#14130F]/95 px-4 py-3 backdrop-blur-sm lg:hidden"
      >
        {SECTIONS.map((s) => {
          const isActive = active === s.id
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? "border-[#E3A94D]/40 bg-[#E3A94D]/15 text-[#E3A94D]"
                  : "border-[#34302B] text-[#9C9384]"
              }`}
            >
              {s.label}
            </a>
          )
        })}
      </nav>
    </>
  )
}