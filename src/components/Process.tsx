"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/lib/data";

export function Process() {
  return (
    <section className="border-y border-white/5 bg-panel/30 py-24 md:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          Cum funcționează
        </p>
        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl font-bold text-white md:text-5xl">
          De la număr la strălucire
        </h2>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass p-6"
            >
              <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-cyan/25">
                {s.step}
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-3 text-sm font-light text-steel">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
