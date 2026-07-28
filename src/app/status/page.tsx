import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { StatusLookup } from "@/components/StatusLookup";

export const metadata = {
  title: "Status — Smart Car Wash",
};

export default function StatusPage() {
  return (
    <>
      <Header />
      <main className="mesh pb-sticky min-h-screen pt-28">
        <div className="section-pad mx-auto max-w-3xl py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan">
            Status
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold text-white md:text-5xl">
            Verifică după număr
          </h1>
          <p className="mt-3 text-sm text-steel">
            Introdu numărul de înmatriculare sau codul primit la programare.
          </p>
          <div className="mt-10">
            <StatusLookup />
          </div>
        </div>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
