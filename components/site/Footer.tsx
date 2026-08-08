import { ArrowUp } from "lucide-react"
import { navLinks } from "@/lib/config"

export function Footer({ siteName, eyebrow }: { siteName: string ; eyebrow: string }) {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-6 pb-10 lg:px-10">
        <div className="h-px w-full bg-background/15" />
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-serif text-xl">{siteName}</span>
            <span className="text-sm text-background/50">{eyebrow}</span>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-background/60 transition-colors hover:text-background"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#top"
            className="group inline-flex items-center gap-2 self-start text-sm text-background/60 transition-colors hover:text-background md:self-auto"
          >
            Volver arriba
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-background/20 transition-transform duration-300 group-hover:-translate-y-0.5">
              <ArrowUp className="h-4 w-4" />
            </span>
          </a>
        </div>

        <p className="pt-4 text-xs text-background/40">
          © {new Date().getFullYear()} {siteName}. Todas las imágenes y textos son obra original.
        </p>
      </div>
    </footer>
  )
}
