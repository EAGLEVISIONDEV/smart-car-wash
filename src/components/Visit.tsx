"use client";

import Image from "next/image";
import Link from "next/link";
import { business, images } from "@/lib/data";

export function Visit() {
  return (
    <section id="vizita" className="scroll-mt-24 py-24 md:py-32">
      <div className="section-pad mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          Vizită
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-white md:text-5xl">
          Ne găsești pe Buzești
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <dl className="space-y-6">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
                  Adresă
                </dt>
                <dd className="mt-2 text-lg text-white">{business.address.full}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
                  Program
                </dt>
                <dd className="mt-2 text-white">
                  {business.hours[0].days}: {business.hours[0].time}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
                  Telefon
                </dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${business.phone}`}
                    className="text-xl text-white hover:text-cyan"
                  >
                    {business.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
                  Facilități
                </dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {business.amenities.map((a) => (
                    <span
                      key={a}
                      className="border border-white/10 px-3 py-1.5 text-[11px] text-steel"
                    >
                      {a}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex px-6 py-3 text-xs uppercase tracking-[0.16em]"
              >
                Deschide Maps
              </a>
              <Link
                href="/programare"
                className="btn-ghost inline-flex px-6 py-3 text-xs uppercase tracking-[0.16em]"
              >
                Programează
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="relative min-h-[240px] overflow-hidden border border-white/10 md:min-h-[280px]">
              <iframe
                title="Smart Car Wash pe hartă"
                src={business.mapsEmbed}
                className="absolute inset-0 h-full w-full grayscale contrast-125 invert-[0.92] filter"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="relative min-h-[160px] overflow-hidden border border-white/10">
              <Image
                src={images.garage}
                alt="Spațiu spălătorie"
                fill
                quality={85}
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/70 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
