import Link from "next/link";
import { business } from "@/lib/data";

export function MidCta() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 py-20 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,230,255,0.12),transparent_65%)]"
      />
      <div className="section-pad relative mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
          Gata de strălucire?
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-white md:text-5xl">
          Rezervă slotul acum
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-steel">
          Alegi pachetul, ora și numărul — fără telefon, fără așteptare la coadă.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/programare"
            className="btn-primary inline-flex px-8 py-4 text-xs uppercase tracking-[0.18em]"
          >
            Programează online
          </Link>
          <a
            href={`tel:${business.phone}`}
            className="btn-ghost inline-flex px-8 py-4 text-xs uppercase tracking-[0.18em]"
          >
            Sau sună
          </a>
        </div>
      </div>
    </section>
  );
}
