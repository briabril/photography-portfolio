import { Reveal } from "./Reveal"
import Image from "next/image"

type AboutProps = {
  heading: string
  bio: string
  imageUrl: string | null
  siteName: string
}

export function About({ heading, bio, imageUrl, siteName }: AboutProps) {


  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-5">
      <Reveal>
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span className="h-px w-8 bg-border" />
          Sobre mí
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-12">
        <div className="md:col-span-6">
          <Reveal>
            <div className="relative mx-auto aspect-3/4 w-full max-w-sm overflow-hidden bg-muted ring-1 ring-border md:mx-0 md:max-w-none">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`Retrato de ${siteName}`}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 46vw, 520px"
                  className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                />
              ) : (
                null
              )}
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center md:col-span-6">
          <Reveal delay={0.1}>
            <h2 className="font-serif text-[clamp(1.9rem,4vw,3.25rem)] font-light leading-[1.1] text-balance">
              {heading}
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-6 max-w-xl space-y-5 whitespace-pre-line text-pretty leading-relaxed text-muted-foreground">
              {bio}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}