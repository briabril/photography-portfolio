"use client"

import React, { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { socials } from "@/lib/config"
import { Reveal } from "./Reveal"

type ContactProps = {
  heading: string
  text: string
  email: string
}

export function Contact({ heading, text, email }: ContactProps) {
  const [name, setName] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const body = `${message}\n\n- ${name}${fromEmail ? ` (${fromEmail})` : ""}`
    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject || "Consulta desde el sitio"
    )}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <section id="contact" className="border-t border-ink-soft bg-ink text-ink-foreground select-none">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 lg:px-10">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 flex flex-col justify-between">
            <Reveal>
              <div>
                <p className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-glow">
                  <span className="h-px w-10 bg-linear-to-r from-glow/60 to-transparent" />
                  Contacto
                </p>
                <h2 className="mt-8 font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-extralight tracking-tight leading-[1.05] text-balance">
                  {heading}
                </h2>
                {text && (
                  <p className="mt-6 max-w-sm text-pretty text-sm md:text-base font-light leading-relaxed text-ink-foreground/60 antialiased">
                    {text}
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-12 space-y-8 border-t border-ink-foreground/10 pt-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-foreground/40">Email directo</p>
                  <a
                    href={`mailto:${email}`}
                    className="group mt-2 inline-flex items-center gap-2 font-serif text-xl font-light text-ink-foreground/90 transition-colors hover:text-glow"
                  >
                    {email}
                    <ArrowUpRight className="h-4 w-4 text-ink-foreground/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-glow" />
                  </a>
                </div>
                
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        className="group inline-flex items-center gap-1 text-xs uppercase tracking-wider text-ink-foreground/50 transition-colors hover:text-glow"
                      >
                        {s.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <Field label="Nombre" value={name} onChange={setName} placeholder="Tu nombre" />
                  <Field
                    label="Email"
                    type="email"
                    value={fromEmail}
                    onChange={setFromEmail}
                    placeholder="tu@email.com"
                  />
                </div>
                <Field
                  label="Asunto"
                  value={subject}
                  onChange={setSubject}
                  placeholder="¿En qué puedo ayudarte?"
                />
                <div className="group flex flex-col border-b border-ink-foreground/10 pb-2 transition-colors duration-300 focus-within:border-glow">
                  <label htmlFor="message" className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-foreground/40 transition-colors duration-300 group-focus-within:text-ink-foreground/80">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Contame sobre tu proyecto..."
                    className="mt-4 w-full resize-none bg-transparent text-sm font-light text-ink-foreground placeholder:text-ink-foreground/20 focus:outline-none antialiased"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="group relative inline-flex items-center gap-8 overflow-hidden rounded-full bg-glow px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-transform active:scale-[0.98]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Enviar mensaje
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    <div className="absolute inset-0 z-0 bg-ink-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-15" />
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}

function Field({ label, value, onChange, type = "text", placeholder }: FieldProps) {
  return (
    <div className="group flex flex-col border-b border-ink-foreground/10 pb-2 transition-colors duration-300 focus-within:border-glow">
      <label className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink-foreground/40 transition-colors duration-300 group-focus-within:text-ink-foreground/80">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-4 w-full bg-transparent text-sm font-light text-ink-foreground placeholder:text-ink-foreground/20 focus:outline-none antialiased"
      />
    </div>
  )
}