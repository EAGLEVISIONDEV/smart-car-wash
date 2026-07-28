"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AdminShell";
import { packages, type PackageId } from "@/lib/data";
import type { BonusType, CustomerProfile } from "@/lib/loyalty-types";

const TYPE_LABELS: Record<BonusType, string> = {
  free_wash: "Spălare gratuită",
  free_service: "Serviciu gratuit",
  custom: "Custom",
};

export default function CustomersPage() {
  const { headers } = useAdmin();
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CustomerProfile | null>(null);
  const [grantOpen, setGrantOpen] = useState(false);

  const load = useCallback(
    async (query?: string) => {
      setLoading(true);
      setError(null);
      try {
        const url = query?.trim()
          ? `/api/admin/customers?q=${encodeURIComponent(query)}`
          : "/api/admin/customers";
        const res = await fetch(url, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare");
        setCustomers(data.customers || []);
        setSelected((prev) => {
          if (!prev) return null;
          return (
            (data.customers as CustomerProfile[]).find((c) => c.id === prev.id) ??
            prev
          );
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Eroare");
      } finally {
        setLoading(false);
      }
    },
    [headers],
  );

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan">
            CRM
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white md:text-3xl">
            Clienți
          </h1>
          <p className="mt-1 text-sm text-steel">
            Fișe clienți, vizite finalizate și bonusuri disponibile
          </p>
        </div>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(q)}
            placeholder="Caută număr / telefon"
            className="border border-white/15 bg-void px-3 py-2 text-sm text-white outline-none focus:border-cyan"
          />
          <button
            type="button"
            className="btn-ghost px-3 py-2 text-[10px] uppercase"
            onClick={() => load(q)}
          >
            Caută
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-white/10 bg-panel/60 text-[10px] uppercase tracking-wider text-steel">
              <tr>
                <th className="px-4 py-3">Număr</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Vizite</th>
                <th className="px-4 py-3">Bonusuri</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-steel">
                    Se încarcă…
                  </td>
                </tr>
              )}
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-steel">
                    Niciun client încă. Se creează automat la finalizarea unei
                    spălări.
                  </td>
                </tr>
              )}
              {customers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer border-b border-white/5 transition hover:bg-white/[0.03] ${
                    selected?.id === c.id ? "bg-cyan/10" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-semibold tracking-wider text-white">
                    {c.plateDisplay}
                  </td>
                  <td className="px-4 py-3 text-steel">
                    <p className="text-white">{c.name || "—"}</p>
                    <p className="text-xs">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-white">{c.visitsCompleted}</td>
                  <td className="px-4 py-3">
                    <span className="text-cyan">
                      {c.availableBonuses.length} active
                    </span>
                    <span className="text-steel">
                      {" "}
                      · {c.redeemedBonuses} folosite
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="border border-white/10 bg-panel/40 p-5">
          {!selected ? (
            <p className="text-sm text-steel">
              Selectează un client pentru detalii și acordare bonus.
            </p>
          ) : (
            <>
              <p className="font-mono text-lg font-bold tracking-wider text-white">
                {selected.plateDisplay}
              </p>
              <p className="mt-1 text-sm text-steel">
                {selected.name || "Fără nume"} · {selected.phone}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="border border-white/10 py-3">
                  <p className="text-2xl font-bold text-white">
                    {selected.visitsCompleted}
                  </p>
                  <p className="text-[10px] uppercase text-steel">Vizite</p>
                </div>
                <div className="border border-white/10 py-3">
                  <p className="text-2xl font-bold text-cyan">
                    {selected.availableBonuses.length}
                  </p>
                  <p className="text-[10px] uppercase text-steel">Bonusuri</p>
                </div>
              </div>

              <h3 className="mt-6 text-[10px] font-bold uppercase tracking-wider text-steel">
                Bonusuri disponibile
              </h3>
              <ul className="mt-2 space-y-2">
                {selected.availableBonuses.length === 0 && (
                  <li className="text-sm text-steel">Niciun bonus activ</li>
                )}
                {selected.availableBonuses.map((b) => (
                  <li
                    key={b.id}
                    className="border border-cyan/20 bg-cyan/5 px-3 py-2 text-sm text-white"
                  >
                    <p className="font-medium">{b.label}</p>
                    <p className="text-[10px] text-steel">
                      {TYPE_LABELS[b.type]} · {b.source}
                    </p>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="btn-primary mt-6 w-full py-3 text-[10px] uppercase tracking-wider"
                onClick={() => setGrantOpen(true)}
              >
                + Acordă bonus
              </button>
            </>
          )}
        </aside>
      </div>

      {grantOpen && selected && (
        <GrantBonusModal
          customer={selected}
          onClose={() => setGrantOpen(false)}
          onDone={() => {
            setGrantOpen(false);
            load(q);
          }}
        />
      )}
    </div>
  );
}

function GrantBonusModal({
  customer,
  onClose,
  onDone,
}: {
  customer: CustomerProfile;
  onClose: () => void;
  onDone: () => void;
}) {
  const { headers } = useAdmin();
  const [type, setType] = useState<BonusType>("free_wash");
  const [serviceId, setServiceId] = useState<PackageId | "">("express");
  const [label, setLabel] = useState("Spălare Express gratuită");
  const [notes, setNotes] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type === "free_wash") {
      setLabel(
        serviceId
          ? `Spălare ${packages.find((p) => p.id === serviceId)?.name ?? ""} gratuită`
          : "Spălare gratuită",
      );
    } else if (type === "free_service") {
      setLabel(
        serviceId
          ? `${packages.find((p) => p.id === serviceId)?.name ?? "Serviciu"} gratuit`
          : "Serviciu gratuit",
      );
    }
  }, [type, serviceId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: headers(true),
        body: JSON.stringify({
          action: "grant",
          customerId: customer.id,
          type,
          serviceId: serviceId || null,
          label,
          notes: notes || undefined,
          expiresAt: expiresAt
            ? new Date(expiresAt + "T23:59:59").toISOString()
            : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare");
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        className="glass w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
          Acordă bonus
        </h2>
        <p className="mt-1 font-mono text-sm text-cyan">{customer.plateDisplay}</p>

        <div className="mt-6 space-y-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BonusType)}
            className="w-full border border-white/15 bg-panel px-4 py-3 text-white"
          >
            <option value="free_wash">Spălare gratuită</option>
            <option value="free_service">Serviciu gratuit</option>
            <option value="custom">Custom</option>
          </select>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value as PackageId | "")}
            className="w-full border border-white/15 bg-panel px-4 py-3 text-white"
          >
            <option value="">Orice serviciu</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Etichetă bonus"
            className="w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
            required
          />
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
          />
          <p className="text-[10px] text-steel">Expiră la (opțional)</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Note interne"
            rows={2}
            className="w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full py-3 text-xs uppercase tracking-[0.16em]"
        >
          {loading ? "Se salvează…" : "Acordă bonus"}
        </button>
      </form>
    </div>
  );
}
