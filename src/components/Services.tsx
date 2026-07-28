"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { images, packages } from "@/lib/data";

export function Services() {
  return (
    <section id="servicii" className="scroll-mt-24 py-24 md:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          Servicii
        </p>
        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white md:text-5xl">
          Pachete clare. Rezervare în un minut.
        </h2>
        <p className="mt-4 max-w-lg text-sm text-steel">
          Compară ce include fiecare pachet, alege durata și rezervă slotul pe
          numărul tău.
        </p>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`flex flex-col overflow-hidden ${
                pkg.accent
                  ? "border border-cyan/40 bg-cyan/5"
                  : "border border-white/10 bg-panel/40"
              }`}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={images[pkg.imageKey]}
                  alt={pkg.name}
                  fill
                  quality={85}
                  sizes="(max-width:1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 to-transparent" />
                {pkg.accent && (
                  <span className="absolute left-4 top-4 bg-cyan px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                    Popular
                  </span>
                )}
                <p className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
                  {pkg.durationMin} min
                </p>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-steel">
                  {pkg.subtitle}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-white">
                  {pkg.name}
                </h3>
                <p className="mt-3 flex-1 text-sm font-light text-steel">
                  {pkg.description}
                </p>
                <ul className="mt-5 space-y-2 border-t border-white/8 pt-5">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-white/90"
                    >
                      <span className="h-px w-3 bg-cyan" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/programare?service=${pkg.id}`}
                  className="btn-primary mt-7 inline-flex justify-center px-4 py-3 text-xs uppercase tracking-[0.16em]"
                >
                  Programează {pkg.name}
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
