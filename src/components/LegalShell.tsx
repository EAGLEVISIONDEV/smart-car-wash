import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { business } from "@/lib/data";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pb-sticky pt-28">
        <article className="section-pad mx-auto max-w-3xl py-12">
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-cyan">
            ← Înapoi
          </Link>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold text-white">
            {title}
          </h1>
          <div className="mt-8 space-y-4 text-sm font-light leading-relaxed text-steel">
            {children}
          </div>
          <p className="mt-10 text-xs text-steel">
            Contact:{" "}
            <a href={`tel:${business.phone}`} className="text-cyan">
              {business.phoneDisplay}
            </a>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
