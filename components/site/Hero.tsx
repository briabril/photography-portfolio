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

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  const words = title.trim().split(" ")
  const titleLead = words.length > 1 ? words.slice(0, -1).join(" ") : words[0]
  const titleLast = words.length > 1 ? words[words.length - 1] : ""

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const frameVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 },
    },
  }

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden bg-background pt-28 pb-20 md:pt-40 md:pb-28"
    >
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-12 md:gap-8 lg:gap-16 lg:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-6 lg:col-span-6"
        >
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

          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {tagline}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10">
            <a
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full border border-foreground/25 py-3 pl-6 pr-5 text-xs font-semibold uppercase tracking-[0.25em] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
            >
              Ver trabajos seleccionados
              <ArrowDownRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:translate-y-1" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={frameVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-6 lg:col-span-6"
        >
          <div className="relative mx-auto max-w-sm md:max-w-none">
            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 h-full w-full border border-border bg-accent/10 md:-bottom-5 md:-right-5"
            />

            <div className="relative aspect-4/5 w-full overflow-hidden bg-muted ring-1 ring-border">
              <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 will-change-transform">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    priority
                    sizes="(min-width: 768px) 42vw, 88vw"
                    className="object-cover object-center contrast-[1.03] saturate-[1.03]"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </motion.div>
            </div>
          </div>

          <p className="mt-5 flex max-w-sm items-center gap-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground md:max-w-none">
            <span>{eyebrow}</span>
            <span className="h-px flex-1 bg-border" />
            <span>2026</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}