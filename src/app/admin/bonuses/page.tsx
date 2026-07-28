"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AdminShell";
import type { Bonus, BonusStatus, Customer } from "@/lib/loyalty-types";

type BonusRow = Bonus & { customer?: Customer };

const STATUS_LABELS: Record<BonusStatus, string> = {
  available: "Disponibil",
  redeemed: "Folosit",
  expired: "Expirat",
  cancelled: "Anulat",
};

export default function BonusesPage() {
  const { headers } = useAdmin();
  const [bonuses, setBonuses] = useState<BonusRow[]>([]);
  const [status, setStatus] = useState<BonusStatus | "all">("available");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs =
        status === "all" ? "" : `?status=${encodeURIComponent(status)}`;
      const res = await fetch(`/api/admin/bonuses${qs}`, {
        headers: headers(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare");
      setBonuses(data.bonuses || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }, [headers, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: "redeem" | "cancel") {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/bonuses", {
        method: "PATCH",
        headers: headers(true),
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan">
            Loyalty
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white md:text-3xl">
            Bonusuri
          </h1>
          <p className="mt-1 text-sm text-steel">
            Folosește sau anulează bonusurile clienților
          </p>
        </div>
        <div className="flex flex-wrap gap-1 border border-white/15">
          {(["all", "available", "redeemed", "expired", "cancelled"] as const).map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`px-3 py-2 text-[10px] uppercase tracking-wider ${
                  status === s
                    ? "bg-cyan text-ink"
                    : "text-steel hover:text-white"
                }`}
              >
                {s === "all" ? "Toate" : STATUS_LABELS[s]}
              </button>
            ),
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-2">
        {loading && <p className="text-sm text-steel">Se încarcă…</p>}
        {!loading && bonuses.length === 0 && (
          <p className="border border-white/10 px-4 py-8 text-sm text-steel">
            Niciun bonus pe acest filtru.
          </p>
        )}
        {bonuses.map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-panel/30 px-4 py-4"
          >
            <div>
              <p className="font-medium text-white">{b.label}</p>
              <p className="mt-1 text-xs text-steel">
                {b.customer?.plateDisplay || "—"} · {b.customer?.phone || ""} ·{" "}
                {b.source} ·{" "}
                {new Date(b.createdAt).toLocaleDateString("ro-RO")}
                {b.expiresAt
                  ? ` · expiră ${new Date(b.expiresAt).toLocaleDateString("ro-RO")}`
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  b.status === "available"
                    ? "bg-cyan/20 text-cyan"
                    : "border border-white/15 text-steel"
                }`}
              >
                {STATUS_LABELS[b.status]}
              </span>
              {b.status === "available" && (
                <>
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => act(b.id, "redeem")}
                    className="btn-primary px-3 py-2 text-[10px] uppercase"
                  >
                    Folosește
                  </button>
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => act(b.id, "cancel")}
                    className="btn-ghost px-3 py-2 text-[10px] uppercase"
                  >
                    Anulează
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
