"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { packages } from "@/lib/data";

export function Services() {
  return (
    <section id="servicii" className="scroll-mt-24 py-24 md:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          Servicii
        </p>
        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white md:text-5xl">
          Alege pachetul, rezervă slotul
        </h2>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`flex flex-col p-7 ${
                pkg.accent
                  ? "border border-cyan/40 bg-cyan/5"
                  : "glass"
              }`}
            >
              {pkg.accent && (
                <span className="mb-3 w-fit bg-cyan px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Popular
                </span>
              )}
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
                {pkg.subtitle} · {pkg.durationMin} min
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-white">
                {pkg.name}
              </h3>
              <p className="mt-3 flex-1 text-sm font-light text-steel">
                {pkg.description}
              </p>
              <ul className="mt-6 space-y-2 border-t border-white/8 pt-6">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/90">
                    <span className="h-px w-3 bg-cyan" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/programare?service=${pkg.id}`}
                className="btn-primary mt-8 inline-flex justify-center px-4 py-3 text-xs uppercase tracking-[0.16em]"
              >
                Programează {pkg.name}
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
