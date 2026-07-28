import Link from "next/link";
import { business } from "@/lib/data";

export function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-void/95 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="section-pad grid grid-cols-2 gap-2 py-3" style={{ minHeight: "var(--sticky-h)" }}>
        <Link
          href="/programare"
          className="btn-primary flex items-center justify-center text-xs uppercase tracking-[0.14em]"
        >
          Programează
        </Link>
        <a
          href={`tel:${business.phone}`}
          className="btn-ghost flex items-center justify-center text-xs uppercase tracking-[0.14em]"
        >
          Sună
        </a>
      </div>
    </div>
  );
}
