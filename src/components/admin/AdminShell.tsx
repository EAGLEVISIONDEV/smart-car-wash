"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { business } from "@/lib/data";

type AdminCtx = {
  secret: string;
  authed: boolean;
  headers: (json?: boolean) => HeadersInit;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
};

const Ctx = createContext<AdminCtx | null>(null);

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin outside provider");
  return ctx;
}

const NAV = [
  { href: "/admin", label: "Board", desc: "Coadă live" },
  { href: "/admin/customers", label: "Clienți", desc: "Fișe & istoric" },
  { href: "/admin/bonuses", label: "Bonusuri", desc: "Active & folosite" },
  { href: "/admin/loyalty", label: "Loyalty", desc: "Reguli recompense" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [secret, setSecret] = useState("");
  const [input, setInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const headers = useCallback(
    (json = false): HeadersInit => ({
      "x-admin-secret": secret,
      ...(json ? { "Content-Type": "application/json" } : {}),
    }),
    [secret],
  );

  const login = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/board?day=" + new Date().toISOString().slice(0, 10), {
        headers: { "x-admin-secret": key },
      });
      if (!res.ok) throw new Error("Cheie invalidă");
      setSecret(key);
      setAuthed(true);
      document.cookie = `scw_admin=${key}; path=/; max-age=86400; SameSite=Lax`;
      return true;
    } catch (e) {
      setAuthed(false);
      setError(e instanceof Error ? e.message : "Eroare");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthed(false);
    setSecret("");
    document.cookie = "scw_admin=; path=/; max-age=0";
    router.push("/admin");
  }, [router]);

  useEffect(() => {
    const match = document.cookie.match(/scw_admin=([^;]+)/);
    if (match?.[1]) {
      const key = decodeURIComponent(match[1]);
      setInput(key);
      login(key);
    }
  }, [login]);

  const value = useMemo(
    () => ({ secret, authed, headers, login, logout }),
    [secret, authed, headers, login, logout],
  );

  if (!authed) {
    return (
      <div className="mesh flex min-h-screen items-center justify-center px-4">
        <div className="glass w-full max-w-md p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan">
            Ops CRM
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-white">
            Smart Car Wash Admin
          </h1>
          <p className="mt-2 text-sm text-steel">
            Board · Clienți · Bonusuri · Loyalty
          </p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && input && login(input)}
            className="mt-8 w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
            placeholder="ADMIN_SECRET"
            autoFocus
          />
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          <button
            type="button"
            className="btn-primary mt-4 w-full py-3 text-xs uppercase tracking-[0.16em]"
            disabled={loading || !input}
            onClick={() => login(input)}
          >
            {loading ? "Se conectează…" : "Intră"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Ctx.Provider value={value}>
      <div className="mesh flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-panel/80 backdrop-blur-xl lg:flex">
          <div className="border-b border-white/5 px-5 py-5">
            <p className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.14em] text-white">
              SMART <span className="text-cyan">ADMIN</span>
            </p>
            <p className="mt-1 text-[10px] text-steel">{business.address.line1}</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block border px-3 py-3 transition ${
                    active
                      ? "border-cyan/40 bg-cyan/10 text-white"
                      : "border-transparent text-steel hover:border-white/10 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-[10px] opacity-70">{item.desc}</p>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/5 p-4">
            <Link href="/" className="text-xs text-steel hover:text-cyan">
              ← Site public
            </Link>
            <button
              type="button"
              onClick={logout}
              className="mt-3 block text-xs text-steel hover:text-white"
            >
              Delogare
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top */}
          <div className="flex items-center justify-between border-b border-white/10 bg-panel/80 px-4 py-3 lg:hidden">
            <button
              type="button"
              className="text-xs uppercase tracking-wider text-cyan"
              onClick={() => setMobileNav((v) => !v)}
            >
              Meniu
            </button>
            <p className="font-[family-name:var(--font-display)] text-sm font-bold text-white">
              ADMIN
            </p>
            <button type="button" onClick={logout} className="text-xs text-steel">
              Exit
            </button>
          </div>
          {mobileNav && (
            <div className="border-b border-white/10 bg-panel p-3 lg:hidden">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNav(false)}
                  className="block border-b border-white/5 py-3 text-sm text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          <div className="section-pad flex-1 py-6 md:py-8">{children}</div>
        </div>
      </div>
    </Ctx.Provider>
  );
}
