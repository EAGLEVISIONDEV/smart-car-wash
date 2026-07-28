"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/lib/data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-24 md:py-32">
      <div className="section-pad mx-auto max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          Întrebări
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-white md:text-5xl">
          Răspunsuri rapide
        </h2>
        <p className="mt-4 text-sm text-steel">
          Tot ce trebuie să știi înainte să programezi.
        </p>

        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-white md:text-xl">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 text-cyan transition ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-steel">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
