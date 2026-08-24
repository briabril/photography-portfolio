"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowDownRight } from "lucide-react"
import Image from "next/image"

type HeroProps = {
  eyebrow: string
  title: string
  tagline: string
  imageUrl: string | null
}

export function Hero({ eyebrow, title, tagline, imageUrl }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  const words = title.trim().split(" ")
  const titleLead = words.length > 1 ? words.slice(0, -1).join(" ") : words[0]
  const titleLast = words.length > 1 ? words[words.length - 1] : ""

  const frameVariants = {
    hidden: { opacity: 0, scale: 1.04 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.35 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section id="top" ref={ref} className="relative overflow-hidden bg-background pt-16 md:pt-20">
      {/* Imagen full-bleed, horizontal, sin recortar la composición */}
      <motion.div
        variants={frameVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full overflow-hidden bg-ink"
      >
        <div className="relative aspect-4/3 w-full sm:aspect-video lg:aspect-21/9">
          <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 will-change-transform">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center contrast-[1.03] saturate-[1.03]"
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" />

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-glow backdrop-blur-sm md:left-8 md:top-8">
            <span className="h-1.5 w-1.5 rounded-full bg-glow" />
            {eyebrow}
          </div>

          <p className="absolute inset-x-5 bottom-5 flex items-center gap-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-foreground/80 md:inset-x-8 md:bottom-6">
            <span className="h-px flex-1 bg-ink-foreground/30" />
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 pb-16 pt-10 md:grid-cols-12 md:gap-10 md:pb-24 md:pt-14 lg:px-10"
      >
        <div className="md:col-span-8">
          <motion.p
            variants={itemVariants}
            className="mb-6 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            <span className="h-px w-10 bg-accent/50" />
            {eyebrow}
          </motion.p>

          <motion.h1 className="font-serif text-[clamp(2.75rem,6.5vw,5.25rem)] font-extralight leading-[0.95] tracking-tight text-foreground text-balance">
            <motion.span variants={itemVariants} className="block">
              {titleLead}
            </motion.span>
            {titleLast && (
              <motion.span variants={itemVariants} className="block italic text-accent">
                {titleLast}
              </motion.span>
            )}
          </motion.h1>
        </div>

        <div className="flex flex-col justify-end md:col-span-4">
          <motion.p
            variants={itemVariants}
            className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {tagline}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full border border-foreground/25 py-3 pl-6 pr-5 text-xs font-semibold uppercase tracking-[0.25em] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
            >
              Ver trabajos seleccionados
              <ArrowDownRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:translate-y-1" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}