"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { gallery } from "@/lib/data";

export function Gallery() {
  return (
    <section id="galerie" className="scroll-mt-24 py-24 md:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          Galerie
        </p>
        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl font-bold text-white md:text-5xl">
          Atmosfera din spălătorie
        </h2>
        <p className="mt-4 max-w-md text-sm text-steel">
          Spumă, presiune, finisaj — rezultatul pe care îl vezi când ridici
          mașina.
        </p>

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-2 md:auto-rows-[220px] md:grid-cols-3 lg:auto-rows-[240px] lg:grid-cols-4 lg:gap-3">
          {gallery.map((item, i) => (
            <motion.div
              key={item.src + i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: Math.min(i * 0.04, 0.24) }}
              className={`relative overflow-hidden border border-white/10 ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                quality={100}
                sizes={item.sizes}
                className="object-cover object-center transition duration-700 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent opacity-60" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
