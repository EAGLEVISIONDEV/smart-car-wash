"use client";

import { useCallback, useEffect, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/booking";
import { packages } from "@/lib/data";

const STATUSES: BookingStatus[] = [
  "confirmed",
  "checked_in",
  "washing",
  "ready",
  "completed",
  "cancelled",
  "no_show",
];

const labels: Record<string, string> = {
  confirmed: "Confirmat",
  checked_in: "Check-in",
  washing: "Spălare",
  ready: "Gata",
  completed: "Done",
  cancelled: "Anulat",
  no_show: "No-show",
  pending: "Pending",
};

export function AdminBoard() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [board, setBoard] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/board", {
        headers: { "x-admin-secret": key },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unauthorized");
      setBoard(data.board || []);
      setAuthed(true);
      document.cookie = `scw_admin=${key}; path=/; max-age=86400; SameSite=Lax`;
    } catch (e) {
      setAuthed(false);
      setError(e instanceof Error ? e.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const match = document.cookie.match(/scw_admin=([^;]+)/);
    if (match?.[1]) {
      setSecret(match[1]);
      load(match[1]);
    }
  }, [load]);

  async function updateStatus(id: string, status: BookingStatus) {
    const res = await fetch("/api/admin/board", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) load(secret);
  }

  if (!authed) {
    return (
      <div className="glass mx-auto max-w-md p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
          Admin Smart Car Wash
        </h1>
        <p className="mt-2 text-sm text-steel">
          Introdu cheia de acces (ADMIN_SECRET).
        </p>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-6 w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
          placeholder="Secret"
        />
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <button
          type="button"
          className="btn-primary mt-4 w-full py-3 text-xs uppercase"
          disabled={loading || !secret}
          onClick={() => load(secret)}
        >
          Intră
        </button>
      </div>
    );
  }

  const columns: BookingStatus[] = ["confirmed", "checked_in", "washing", "ready"];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white">
            Board azi
          </h1>
          <p className="text-sm text-steel">{board.length} programări</p>
        </div>
        <button
          type="button"
          className="btn-ghost px-4 py-2 text-xs uppercase"
          onClick={() => load(secret)}
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col} className="glass min-h-[200px] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan">
              {labels[col]}
            </p>
            <div className="mt-4 space-y-3">
              {board
                .filter((b) => b.status === col)
                .map((b) => (
                  <div key={b.id} className="border border-white/10 bg-void/60 p-3">
                    <p className="font-[family-name:var(--font-display)] text-xl tracking-wider text-white">
                      {b.plateDisplay}
                    </p>
                    <p className="mt-1 text-[11px] text-steel">
                      {packages.find((p) => p.id === b.serviceId)?.name} ·{" "}
                      {new Date(b.startAt).toLocaleTimeString("ro-RO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-[10px] text-cyan">{b.code}</p>
                    <select
                      className="mt-3 w-full border border-white/10 bg-panel px-2 py-1.5 text-xs text-white"
                      value={b.status}
                      onChange={(e) =>
                        updateStatus(b.id, e.target.value as BookingStatus)
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {labels[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
