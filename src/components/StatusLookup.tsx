"use client";

import { useState } from "react";
import Link from "next/link";
import { packages } from "@/lib/data";
import type { Booking } from "@/lib/booking";

const statusLabel: Record<string, string> = {
  pending: "În așteptare",
  confirmed: "Confirmată",
  checked_in: "Check-in",
  washing: "În spălare",
  ready: "Gata de ridicare",
  completed: "Finalizată",
  cancelled: "Anulată",
  no_show: "Neprezentare",
};

export function StatusLookup() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Booking[]>([]);

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/status?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare");
      setResults(data.results || []);
      if ((data.results || []).length === 0) {
        setError("Nicio programare găsită pentru acest număr/cod.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value.toUpperCase())}
          placeholder="B 123 ABC sau cod SCXXXX"
          className="flex-1 border border-white/15 bg-void px-4 py-3 text-lg tracking-wide text-white outline-none focus:border-cyan"
        />
        <button
          type="submit"
          disabled={loading || q.trim().length < 3}
          className="btn-primary px-6 py-3 text-xs uppercase tracking-[0.16em]"
        >
          {loading ? "…" : "Caută"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-steel">{error}</p>}

      <div className="mt-8 space-y-4">
        {results.map((b) => (
          <div key={b.id} className="glass p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-[family-name:var(--font-display)] text-2xl tracking-wider text-white">
                  {b.plateDisplay}
                </p>
                <p className="mt-1 text-xs text-cyan">{b.code}</p>
              </div>
              <span
                className={`shrink-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  b.status === "ready"
                    ? "bg-cyan text-ink"
                    : "border border-white/15 text-steel"
                }`}
              >
                {statusLabel[b.status] || b.status}
              </span>
            </div>
            <p className="mt-4 text-sm text-steel">
              {packages.find((p) => p.id === b.serviceId)?.name} ·{" "}
              {new Date(b.startAt).toLocaleString("ro-RO", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-steel">
        Nu ai programare?{" "}
        <Link href="/programare" className="text-cyan hover:underline">
          Rezervă acum
        </Link>
      </p>
    </div>
  );
}
