"use client";

import { motion } from "framer-motion";
import { business } from "@/lib/data";

const items = [
  {
    value: String(business.rating),
    label: `${business.reviewCount}+ pe Google`,
    accent: true,
  },
  { value: String(business.lanes), label: "linii de lucru", accent: false },
  { value: "08–20", label: "zilnic deschis", accent: false },
  { value: "<1 min", label: "programare online", accent: false },
];

export function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-panel/50">
      <div className="section-pad mx-auto grid max-w-7xl grid-cols-2 gap-6 py-10 md:grid-cols-4 md:gap-4 md:py-12">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="text-center md:text-left"
          >
            <p
              className={`font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl ${
                item.accent ? "text-cyan" : "text-white"
              }`}
            >
              {item.value}
            </p>
            <p className="mt-1 text-xs text-steel">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
