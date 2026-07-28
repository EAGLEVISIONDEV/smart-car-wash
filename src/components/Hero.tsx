"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { business, images } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden mesh">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-fade opacity-70" />
      <div className="section-pad relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 pb-28 pt-28 lg:grid-cols-2 lg:gap-14 lg:pb-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan"
          >
            București · Buzești 34
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.8rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white"
          >
            SMART
            <span className="mt-1 block text-glow">CAR WASH</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-6 max-w-md text-base font-light text-steel md:text-lg"
          >
            {business.tagline} Programează cu numărul de înmatriculare — zilnic{" "}
            {business.hours[0].time}.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              href="/programare"
              className="btn-primary inline-flex px-7 py-3.5 text-xs uppercase tracking-[0.18em]"
            >
              Programează acum
            </Link>
            <Link
              href="/status"
              className="btn-ghost inline-flex px-7 py-3.5 text-xs uppercase tracking-[0.18em]"
            >
              Status după număr
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap gap-6 text-sm"
          >
            <div>
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-cyan">
                {business.rating}
              </p>
              <p className="text-xs text-steel">{business.reviewCount}+ pe Google</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-white">
                {business.lanes}
              </p>
              <p className="text-xs text-steel">linii de lucru</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-white">
                08–20
              </p>
              <p className="text-xs text-steel">zilnic</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="relative"
        >
          <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,var(--cyan-glow),transparent_65%)] blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-panel">
            <Image
              src={images.hero}
              alt="Spălare auto Smart Car Wash"
              fill
              priority
              quality={95}
              sizes="(max-width:1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan">
                Booking inteligent
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-white">
                Număr · Slot · Gata
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
