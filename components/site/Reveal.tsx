"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: "div" | "section" | "span" | "li"
}

// Envuelve cualquier bloque para que aparezca con un leve fade + desplazamiento hacia arriba la primera vez que entra en pantalla al hacer scroll.
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: RevealProps) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

export const easeOut = [0.22, 1, 0.36, 1] as const

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
}

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
