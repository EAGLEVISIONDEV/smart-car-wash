"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { business } from "@/lib/data";

const pain = [
  {
    title: "Coadă la intrare",
    text: "Clienții sună sau vin pe neașteptate. Linii blocate, nervi, timp pierdut.",
  },
  {
    title: "Zero vizibilitate",
    text: "Nu știi câte spălări ai mâine, cine e în lucru, cine e gata — până întrebi pe sală.",
  },
  {
    title: "Clienți care nu revin",
    text: "Fără reminder, fără status, fără loialitate. Concurența e la un click distanță.",
  },
];

const wins = [
  {
    k: "01",
    title: "Programare online pe număr",
    text: "Clientul alege pachetul, ora și introduce numărul. Tu primești rezervarea pe board — fără telefon în buclă.",
  },
  {
    k: "02",
    title: "Ops CRM pe 8 linii",
    text: "Kanban live: Confirmat → Check-in → Spălare → Gata. Walk-in în 10 secunde. Sync automat la 8s.",
  },
  {
    k: "03",
    title: "Loyalty & bonusuri",
    text: "La fiecare N spălări — recompensă automată. Promoții manuale. Clienți care revin pentru că merită.",
  },
  {
    k: "04",
    title: "Date pe Supabase",
    text: "Programări, clienți, bonusuri — persistente, pe cloud. Nu se pierd la redeploy.",
  },
];

const roadmap = [
  {
    phase: "Acum · Live",
    items: [
      "Website + booking pe număr",
      "Admin board 14 zile",
      "Status live după placă",
      "Loyalty & Google trust",
    ],
  },
  {
    phase: "Urmează · App mobilă",
    items: [
      "App iOS / Android",
      "Push: confirmat / în spălare / gata",
      "Remindere cu 1h înainte",
      "Istoric spălări & bonusuri în app",
    ],
  },
  {
    phase: "Scalare",
    items: [
      "Abonamente / pachete lunare",
      "SMS + WhatsApp fallback",
      "Rapoarte venit pe zi / linie",
      "Multi-locație (dacă extinzi)",
    ],
  },
];

const stats = [
  { v: "4.5★", l: `${business.reviewCount}+ pe Google` },
  { v: "8", l: "linii de lucru" },
  { v: "<1 min", l: "programare online" },
  { v: "24/7", l: "booking pe site" },
];

export function PitchDeck() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative min-h-[88svh] overflow-hidden">
        <Image
          src="/pitch/pitch-ops-duo.png"
          alt="Website + admin Smart Car Wash"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/90 to-void/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/60" />
        <div className="section-pad relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end pb-16 pt-28 md:justify-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan"
          >
            Pitch pentru proprietar · Buzești 34
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white"
          >
            SMART CAR WASH
            <span className="mt-2 block text-glow text-[clamp(1.4rem,3.5vw,2.2rem)] font-semibold tracking-[0.02em]">
              nu mai e doar o spălătorie — e un sistem.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-6 max-w-xl text-base text-steel md:text-lg"
          >
            Website live, programări pe număr, board operațional, loyalty —
            și următorul pas: aplicație mobilă cu notificări smart pentru fiecare
            client.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a
              href="#beneficii"
              className="btn-primary inline-flex px-7 py-3.5 text-xs uppercase tracking-[0.18em]"
            >
              Vezi beneficiile
            </a>
            <Link
              href="/"
              className="btn-ghost inline-flex px-7 py-3.5 text-xs uppercase tracking-[0.18em]"
            >
              Deschide site-ul live
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-panel/40">
        <div className="section-pad mx-auto grid max-w-6xl grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-cyan md:text-4xl">
                {s.v}
              </p>
              <p className="mt-1 text-xs text-steel">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain */}
      <section className="section-pad mx-auto max-w-6xl py-20 md:py-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          Realitatea fără sistem
        </p>
        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-5xl">
          Trei probleme care costă bani în fiecare zi
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pain.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border border-white/10 bg-panel/30 p-6"
            >
              <p className="font-[family-name:var(--font-display)] text-sm font-bold text-cyan">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Wins */}
      <section
        id="beneficii"
        className="scroll-mt-24 border-y border-white/5 bg-panel/30 py-20 md:py-28"
      >
        <div className="section-pad mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
            Ce ai deja live
          </p>
          <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-5xl">
            Controlul operațiunii — pe telefon și pe desktop
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden border border-white/10">
              <Image
                src="/pitch/pitch-ops-duo.png"
                alt="Admin board + status client"
                fill
                quality={100}
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              {wins.map((w) => (
                <div key={w.k} className="border-b border-white/5 pb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan">
                    {w.k}
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-sm text-steel">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile app future */}
      <section className="section-pad mx-auto max-w-6xl py-20 md:py-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          Roadmap · Aplicație mobilă
        </p>
        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-5xl">
          Clientul nu mai sună. Primește notificări.
        </h2>
        <p className="mt-4 max-w-xl text-sm text-steel">
          Următorul strat: app nativă cu push smart — confirmare, „în spălare”,
          „gata de ridicare”, reminder înainte de slot. Mai puțin call-center,
          mai mulți clienți care revin.
        </p>

        <div className="mt-14 grid items-end gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden border border-white/10 bg-panel"
          >
            <Image
              src="/pitch/pitch-app-booking.png"
              alt="Mockup app — programare"
              fill
              quality={100}
              sizes="280px"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void to-transparent p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan">
                App · Booking
              </p>
              <p className="text-sm text-white">Slot + număr în 30 secunde</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden border border-white/10 bg-panel"
          >
            <Image
              src="/pitch/pitch-app-notifications.png"
              alt="Mockup app — notificări smart"
              fill
              quality={100}
              sizes="280px"
              className="object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void to-transparent p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan">
                App · Push smart
              </p>
              <p className="text-sm text-white">Confirmat · În lucru · Gata</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-4 border border-cyan/20 bg-cyan/5 p-6 md:grid-cols-3 md:p-8">
          {[
            {
              t: "Mai puține apeluri",
              d: "Statusul pleacă automat pe telefonul clientului.",
            },
            {
              t: "Mai puțin no-show",
              d: "Reminder cu 60 min înainte crește prezența.",
            },
            {
              t: "Mai multă retenție",
              d: "Bonusuri și istoric în app — motiv să revină.",
            },
          ].map((x) => (
            <div key={x.t}>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
                {x.t}
              </p>
              <p className="mt-2 text-sm text-steel">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="border-y border-white/5 bg-panel/30 py-20 md:py-28">
        <div className="section-pad mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
            Plan
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-5xl">
            De la live → app → scalare
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {roadmap.map((r, i) => (
              <div
                key={r.phase}
                className={`border p-6 ${
                  i === 1
                    ? "border-cyan/40 bg-cyan/5"
                    : "border-white/10 bg-void/40"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan">
                  {r.phase}
                </p>
                <ul className="mt-5 space-y-3">
                  {r.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-white/90"
                    >
                      <span className="mt-2 h-px w-3 shrink-0 bg-cyan" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI narrative */}
      <section className="section-pad mx-auto max-w-3xl py-20 text-center md:py-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          De ce merită
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-4xl">
          Mai multe mașini pe zi. Mai puțin haos. Clienți care revin.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-steel">
          Sistemul transformă spălătoria într-un flux previzibil: sloturi
          rezervate, board clar pe linii, status pentru client, loyalty care
          aduce retur. App-ul mobil închide cercul cu notificări — exact când
          contează.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/admin"
            className="btn-primary inline-flex px-8 py-4 text-xs uppercase tracking-[0.18em]"
          >
            Deschide Admin
          </Link>
          <Link
            href="/programare"
            className="btn-ghost inline-flex px-8 py-4 text-xs uppercase tracking-[0.18em]"
          >
            Testează o programare
          </Link>
          <a
            href={`tel:${business.phone}`}
            className="btn-ghost inline-flex px-8 py-4 text-xs uppercase tracking-[0.18em]"
          >
            Sună {business.phoneDisplay}
          </a>
        </div>
        <p className="mt-8 text-xs text-steel">
          Live: smart-car-wash-theta.vercel.app · Date pe Supabase · Timezone
          București
        </p>
      </section>
    </div>
  );
}
