"use client";

import { motion } from "framer-motion";
import { whyUs } from "@/lib/data";

export function WhyUs() {
  return (
    <section className="border-y border-white/5 bg-panel/30 py-24 md:py-28">
      <div className="section-pad mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          De ce Smart
        </p>
        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl font-bold text-white md:text-5xl">
          Rapid. Clar. Fără surprize.
        </h2>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <p className="font-[family-name:var(--font-display)] text-sm font-bold text-cyan">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-steel">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
