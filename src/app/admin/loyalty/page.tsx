"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AdminShell";
import { packages, type PackageId } from "@/lib/data";
import type { BonusType, LoyaltySettings } from "@/lib/loyalty-types";

export default function LoyaltyPage() {
  const { headers } = useAdmin();
  const [settings, setSettings] = useState<LoyaltySettings | null>(null);
  const [visitsRequired, setVisitsRequired] = useState(5);
  const [rewardType, setRewardType] = useState<BonusType>("free_wash");
  const [rewardServiceId, setRewardServiceId] = useState<PackageId | "">(
    "express",
  );
  const [rewardLabel, setRewardLabel] = useState("Spălare Express gratuită");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/loyalty", { headers: headers() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare");
      const s = data.settings as LoyaltySettings;
      setSettings(s);
      setVisitsRequired(s.visitsRequired);
      setRewardType(s.rewardType);
      setRewardServiceId((s.rewardServiceId as PackageId) || "");
      setRewardLabel(s.rewardLabel);
      setEnabled(s.enabled);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/loyalty", {
        method: "PUT",
        headers: headers(true),
        body: JSON.stringify({
          visitsRequired,
          rewardType,
          rewardServiceId: rewardServiceId || null,
          rewardLabel,
          enabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare");
      setSettings(data.settings);
      setMessage("Regulile de loyalty au fost salvate.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-steel">Se încarcă setările…</p>;
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan">
        Loyalty
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white md:text-3xl">
        Reguli recompense
      </h1>
      <p className="mt-2 text-sm text-steel">
        La fiecare N spălări finalizate, clientul primește automat un bonus.
        Default: 5 vizite → spălare Express gratuită.
      </p>

      <form onSubmit={save} className="mt-8 space-y-4 border border-white/10 bg-panel/30 p-6">
        <label className="flex items-center gap-3 text-sm text-white">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Sistem loyalty activ
        </label>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-steel">
            Vizite necesare
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={visitsRequired}
            onChange={(e) => setVisitsRequired(Number(e.target.value))}
            className="mt-1 w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-steel">
            Tip recompensă
          </label>
          <select
            value={rewardType}
            onChange={(e) => setRewardType(e.target.value as BonusType)}
            className="mt-1 w-full border border-white/15 bg-panel px-4 py-3 text-white"
          >
            <option value="free_wash">Spălare gratuită</option>
            <option value="free_service">Serviciu gratuit</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-steel">
            Serviciu recompensă
          </label>
          <select
            value={rewardServiceId}
            onChange={(e) => setRewardServiceId(e.target.value as PackageId | "")}
            className="mt-1 w-full border border-white/15 bg-panel px-4 py-3 text-white"
          >
            <option value="">Orice serviciu</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-steel">
            Etichetă afișată
          </label>
          <input
            value={rewardLabel}
            onChange={(e) => setRewardLabel(e.target.value)}
            className="mt-1 w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
            required
          />
        </div>

        {settings && (
          <p className="text-xs text-steel">
            Ultima actualizare:{" "}
            {new Date(settings.updatedAt).toLocaleString("ro-RO")}
          </p>
        )}

        {error && <p className="text-sm text-red-300">{error}</p>}
        {message && <p className="text-sm text-cyan">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-3 text-xs uppercase tracking-[0.16em]"
        >
          {saving ? "Se salvează…" : "Salvează regulile"}
        </button>
      </form>

      <div className="mt-6 border border-white/10 px-4 py-4 text-sm text-steel">
        <p className="font-medium text-white">Cum funcționează</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>La finalizarea unei programări, clientul e creat/actualizat după număr.</li>
          <li>Contorul de vizite crește cu 1.</li>
          <li>
            Dacă vizitele ÷ N = 0 (ex. 5, 10, 15), se acordă automat bonusul
            configurat.
          </li>
          <li>
            Poți acorda și bonusuri manuale din Clienți (promoții, compensări).
          </li>
        </ol>
      </div>
    </div>
  );
}
