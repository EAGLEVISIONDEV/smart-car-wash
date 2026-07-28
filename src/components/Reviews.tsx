"use client";

import { motion } from "framer-motion";
import { business, reviews } from "@/lib/data";

function Stars({ n }: { n: number }) {
  return (
    <span className="tracking-tight text-cyan" aria-label={`${n} stele`}>
      {"★".repeat(n)}
      <span className="text-white/20">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export function Reviews() {
  return (
    <section id="recenzii" className="scroll-mt-24 border-y border-white/5 bg-panel/30 py-24 md:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
              Google Reviews
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-white md:text-5xl">
              Ce spun șoferii
            </h2>
            <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-steel">
              <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-cyan">
                {business.rating}
              </span>
              <Stars n={5} />
              <span>
                bazat pe {business.reviewCount}+ recenzii Google
              </span>
            </p>
          </div>
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex px-6 py-3 text-xs uppercase tracking-[0.16em]"
          >
            Vezi pe Google
          </a>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.blockquote
              key={r.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-white/10 bg-void/40 p-6"
            >
              <Stars n={r.stars} />
              <p className="mt-4 text-sm leading-relaxed text-white/90">
                „{r.text}”
              </p>
              <footer className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-steel">
                {r.name}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
