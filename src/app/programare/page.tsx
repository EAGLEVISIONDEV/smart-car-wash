import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { BookingWizard } from "@/components/BookingWizard";

export const metadata = {
  title: "Programare — Smart Car Wash",
};

export default function ProgramarePage() {
  return (
    <>
      <Header />
      <main className="mesh pb-sticky min-h-screen pt-28">
        <div className="section-pad mx-auto max-w-3xl py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
            Programare
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold text-white md:text-5xl">
            Rezervă un slot
          </h1>
          <p className="mt-3 max-w-lg text-sm text-steel">
            Serviciu → oră → număr de înmatriculare. Primești un cod de confirmare pe ecran.
          </p>
          <div className="mt-10">
            <Suspense fallback={<p className="text-steel">Se încarcă…</p>}>
              <BookingWizard />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
