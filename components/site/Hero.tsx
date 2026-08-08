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
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const overlay = useTransform(scrollYProgress, [0, 1], [0.3, 0.65])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section id="top" ref={ref} className="relative h-svh min-h-160 w-full overflow-hidden bg-zinc-950 select-none">
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform z-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center contrast-[1.05] brightness-[0.9]"
          />
        ) : (
          <div className="h-full w-full bg-zinc-900" />
        )}
        <motion.div 
          style={{ opacity: overlay }} 
          className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent mix-blend-multiply" 
        />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-16 md:pb-24 lg:px-10"
      >
        <motion.p
          variants={itemVariants}
          className="mb-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
        >
          <span className="h-px w-10 bg-linear-to-r from-white/60 to-transparent" />
          {eyebrow}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="max-w-5xl font-serif text-[clamp(2.5rem,7.5vw,6.5rem)] font-extralight tracking-tight leading-[0.95] text-white text-balance"
        >
          {title}
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-t border-white/10 pt-8"
        >
          <p className="max-w-md text-pretty text-sm md:text-base font-light leading-relaxed text-white/70 antialiased">
            {tagline}
          </p>
          
          <a
            href="#work"
            className="group relative inline-flex items-center gap-3 self-start text-xs font-semibold uppercase tracking-[0.25em] text-white py-1"
          >
            <span className="relative z-10 flex items-center gap-2">
              Ver trabajos seleccionados
              <ArrowDownRight className="h-4 w-4 transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:scale-110 text-white/80" />
            </span>
            <span className="absolute bottom-0 left-0 h-px w-full bg-white/30 transition-all duration-500 group-hover:bg-white group-hover:h-[1.5px]" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
