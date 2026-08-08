"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/config";
import { fadeUp, staggerParent, Reveal } from "./Reveal";

export function Services() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Reveal>
              <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
                <span className="h-px w-8 bg-border" />
                Servicios
              </p>
              <h2 className="mt-5 font-serif text-[clamp(1.9rem,4vw,3rem)] font-light leading-[1.1] text-balance">
                Formas de trabajar juntos
              </h2>
            </Reveal>
          </div>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-x-12 gap-y-px sm:grid-cols-2 md:col-span-8"
          >
            {services.map((service, i) => (
              <motion.div key={service.title} variants={fadeUp} className="group border-t border-border py-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-2xl font-light">{service.title}</h3>
                </div>
                <p className="mt-4 max-w-sm text-pretty leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
