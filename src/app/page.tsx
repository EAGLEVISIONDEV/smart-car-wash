import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import Link from "next/link";
import { business } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <section className="border-y border-white/5 py-20">
          <div className="section-pad mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
              Status live
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-white">
              Verifică după numărul de înmatriculare
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-steel">
              Introduci numărul sau codul de rezervare și vezi dacă mașina e în lucru sau gata de ridicare.
            </p>
            <Link
              href="/status"
              className="btn-primary mt-8 inline-flex px-8 py-4 text-xs uppercase tracking-[0.18em]"
            >
              Caută status
            </Link>
            <p className="mt-6 text-xs text-steel">
              Rating Google {business.rating} · {business.reviewCount}+ recenzii
            </p>
          </div>
        </section>
        <Visit />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
