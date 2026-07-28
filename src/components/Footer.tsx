import Link from "next/link";
import { business } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-panel/40 pb-sticky">
      <div className="section-pad mx-auto grid max-w-7xl gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.18em] text-white">
            SMART <span className="text-cyan">CAR WASH</span>
          </p>
          <p className="mt-4 max-w-xs text-sm font-light text-steel">
            {business.description}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/90">
            <li>
              <a href={`tel:${business.phone}`} className="hover:text-cyan">
                {business.phoneDisplay}
              </a>
            </li>
            <li>{business.address.full}</li>
            <li>
              <Link href="/programare" className="hover:text-cyan">
                Programare online
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
            Legal
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/confidentialitate" className="hover:text-cyan">
                Confidențialitate
              </Link>
            </li>
            <li>
              <Link href="/termeni" className="hover:text-cyan">
                Termeni
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-cyan">
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="section-pad mx-auto max-w-7xl border-t border-white/5 py-6 text-[11px] uppercase tracking-[0.14em] text-steel">
        © {year} {business.name}
      </div>
    </footer>
  );
}
