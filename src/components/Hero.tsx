"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { business, images } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src={images.hero}
        alt=""
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/50" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-fade opacity-40"
      />

      <div className="section-pad relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end pb-24 pt-28 md:justify-center md:pb-20">
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
          transition={{ delay: 0.08 }}
          className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(3rem,10vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-white"
        >
          SMART
          <span className="mt-1 block text-glow">CAR WASH</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-5 max-w-lg text-base font-light text-steel md:text-lg"
        >
          {business.tagline} Slot online pe numărul de înmatriculare — zilnic{" "}
          {business.hours[0].time}.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Link
            href="/programare"
            className="btn-primary inline-flex px-7 py-3.5 text-xs uppercase tracking-[0.18em]"
          >
            Programează acum
          </Link>
          <a
            href={`tel:${business.phone}`}
            className="btn-ghost inline-flex px-7 py-3.5 text-xs uppercase tracking-[0.18em]"
          >
            Sună {business.phoneDisplay}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
