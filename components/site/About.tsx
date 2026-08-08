import { Reveal } from "./Reveal"
import { stats } from "@/lib/config"
import Image from "next/image"

type AboutProps = {
  heading: string
  bio: string
  imageUrl: string | null
  siteName: string
}

export function About({ heading, bio, imageUrl, siteName }: AboutProps) {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:py-32 lg:px-10">
      <Reveal>
        <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
          <span className="h-px w-8 bg-border" />
          Sobre mí
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <Reveal>
            <div className="relative w-full aspect-4/5 overflow-hidden bg-muted">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`Retrato de ${siteName}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 42vw, 400px"
                  className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                />
              ) : (
                null
              )}
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center md:col-span-7">
          <Reveal delay={0.1}>
            <h2 className="font-serif text-[clamp(1.9rem,4vw,3.25rem)] font-light leading-[1.1] text-balance">
              {heading}
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 max-w-xl space-y-5 whitespace-pre-line text-pretty leading-relaxed text-muted-foreground">
              {bio}
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.1}>
        <dl className="mt-20 grid grid-cols-2 gap-y-10 border-t border-border pt-12 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-serif text-4xl font-light md:text-5xl">{stat.value}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
