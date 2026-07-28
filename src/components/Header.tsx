"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { business } from "@/lib/data";

const links = [
  { href: "/#servicii", label: "Servicii" },
  { href: "/programare", label: "Programare" },
  { href: "/status", label: "Status" },
  { href: "/#vizita", label: "Vizită" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled || open
          ? "border-b border-white/5 bg-void/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
      style={{ height: "var(--header-h)" }}
    >
      <div className="section-pad mx-auto flex h-full max-w-7xl items-center justify-between">
        <Link href="/" className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.18em] text-white md:text-base">
          SMART <span className="text-cyan">CAR WASH</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-steel transition hover:text-cyan"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/programare"
            className="btn-primary rounded-sm px-4 py-2 text-xs uppercase tracking-[0.14em]"
          >
            Programează
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden"
          aria-label="Meniu"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex w-5 flex-col gap-1.5">
            <span className={`h-px bg-white transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-px bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-px bg-white transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-void/95 px-5 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-[family-name:var(--font-display)] text-2xl text-white"
              >
                {l.label}
              </Link>
            ))}
            <a href={`tel:${business.phone}`} className="text-cyan">
              {business.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
