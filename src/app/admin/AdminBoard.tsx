"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/booking";
import type { BoardStats } from "@/lib/booking";
import { packages, type PackageId } from "@/lib/data";
import { formatPlateDisplay, isValidRoPlate, normalizePlate } from "@/lib/plates";
import { useAdmin } from "@/components/admin/AdminShell";
import { todayBusiness, formatBusinessTime, formatBusinessDateTime } from "@/lib/time";

const FLOW: BookingStatus[] = [
  "confirmed",
  "checked_in",
  "washing",
  "ready",
  "completed",
];

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
  washing: "În spălare",
  ready: "Gata",
  completed: "Finalizat",
  cancelled: "Anulat",
  no_show: "No-show",
  pending: "Pending",
};

const nextLabel: Partial<Record<BookingStatus, string>> = {
  confirmed: "Check-in →",
  checked_in: "Start spălare →",
  washing: "Marchează gata →",
  ready: "Finalizează →",
};

type ViewMode = "kanban" | "list";
type RangeMode = "upcoming" | "day";

function timeLabel(iso: string) {
  return formatBusinessTime(iso);
}

function dateTimeLabel(iso: string) {
  return formatBusinessDateTime(iso);
}

function pkgName(id: string) {
  return packages.find((p) => p.id === id)?.name ?? id;
}

function minsLeft(endAt: string) {
  return Math.round((new Date(endAt).getTime() - Date.now()) / 60000);
}

export function AdminBoard() {
  const { secret, headers } = useAdmin();
  const [board, setBoard] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BoardStats | null>(null);
  const [day, setDay] = useState(todayBusiness());
  const [rangeMode, setRangeMode] = useState<RangeMode>("upcoming");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<"all" | PackageId>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "web" | "walkin" | "admin">("all");
  const [view, setView] = useState<ViewMode>("kanban");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(
    async (
      dayIso: string,
      silent = false,
      searchQ = "",
      mode: RangeMode = "upcoming",
    ) => {
      if (!silent) setLoading(true);
      setError(null);
      try {
        const q = searchQ.trim();
        const params = new URLSearchParams({ day: dayIso, mode });
        if (q.length >= 3) params.set("q", q);
        const res = await fetch(`/api/admin/board?${params}`, {
          headers: { "x-admin-secret": secret },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unauthorized");
        setBoard(data.board || []);
        setStats(data.stats || null);
        setLastSync(data.serverTime || new Date().toISOString());
        setSelected((prev) => {
          if (!prev) return null;
          return (data.board as Booking[]).find((b) => b.id === prev.id) ?? prev;
        });
      } catch (e) {
        if (!silent) setError(e instanceof Error ? e.message : "Eroare");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [secret],
  );

  useEffect(() => {
    load(day, false, query, rangeMode);
  }, [day, rangeMode, load]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => {
      if (query.trim().length >= 3 || query.trim().length === 0) {
        load(day, true, query, rangeMode);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query, day, rangeMode, load]);

  useEffect(() => {
    pollRef.current = setInterval(
      () => load(day, true, query, rangeMode),
      8000,
    );
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [day, load, query, rangeMode]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setWalkInOpen(true);
      }
      if (e.key === "Escape") {
        setSelected(null);
        setWalkInOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    return board.filter((b) => {
      if (serviceFilter !== "all" && b.serviceId !== serviceFilter) return false;
      if (sourceFilter !== "all" && b.source !== sourceFilter) return false;
      if (!q) return true;
      return (
        b.plateNormalized.includes(normalizePlate(q)) ||
        b.plateDisplay.toUpperCase().includes(q) ||
        b.code.includes(q) ||
        b.phone.includes(q) ||
        (b.name || "").toUpperCase().includes(q)
      );
    });
  }, [board, query, serviceFilter, sourceFilter]);

  async function patchBooking(
    id: string,
    body: { status?: BookingStatus; advance?: boolean },
  ) {
    setBusyId(id);
    // optimistic
    setBoard((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        if (body.advance) {
          const idx = FLOW.indexOf(b.status);
          const next = idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : b.status;
          return { ...b, status: next };
        }
        if (body.status) return { ...b, status: body.status };
        return b;
      }),
    );
    try {
      const res = await fetch("/api/admin/board", {
        method: "PATCH",
        headers: headers(true),
        body: JSON.stringify({ id, ...body }),
      });
      if (!res.ok) throw new Error("Update failed");
      await load(day, true, query, rangeMode);
    } catch {
      await load(day, true, query, rangeMode);
    } finally {
      setBusyId(null);
    }
  }

  const columns: BookingStatus[] = [
    "confirmed",
    "checked_in",
    "washing",
    "ready",
  ];

  return (
    <div className="pb-10">
      {error && (
        <p className="mb-4 border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      {loading && !stats && (
        <p className="mb-4 text-sm text-steel">Se încarcă board-ul…</p>
      )}
      {/* Top bar */}
      <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-white/5 bg-void/90 px-4 py-4 backdrop-blur-xl md:-mx-0 md:px-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan">
              Ops CRM · Live
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white md:text-3xl">
              Board operațional
            </h1>
            <p className="mt-1 text-xs text-steel">
              Sync{" "}
              {lastSync
                ? new Date(lastSync).toLocaleTimeString("ro-RO")
                : "—"}{" "}
              ·{" "}
              {rangeMode === "upcoming"
                ? "următoarele 14 zile"
                : `ziua ${day}`}{" "}
              · ⌘K search · ⌘N walk-in
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex border border-white/15">
              <button
                type="button"
                onClick={() => {
                  setRangeMode("upcoming");
                  setDay(todayBusiness());
                }}
                className={`px-3 py-2 text-[10px] uppercase tracking-wider ${
                  rangeMode === "upcoming"
                    ? "bg-cyan text-ink"
                    : "text-steel hover:text-white"
                }`}
              >
                14 zile
              </button>
              <button
                type="button"
                onClick={() => setRangeMode("day")}
                className={`px-3 py-2 text-[10px] uppercase tracking-wider ${
                  rangeMode === "day"
                    ? "bg-cyan text-ink"
                    : "text-steel hover:text-white"
                }`}
              >
                Pe zi
              </button>
            </div>
            <input
              type="date"
              value={day}
              onChange={(e) => {
                setDay(e.target.value);
                setRangeMode("day");
              }}
              className="border border-white/15 bg-panel px-3 py-2 text-sm text-white"
            />
            <button
              type="button"
              className="btn-ghost px-3 py-2 text-[10px] uppercase tracking-wider"
              onClick={() => {
                setDay(todayBusiness());
                setRangeMode("day");
              }}
            >
              Azi
            </button>
            <div className="flex border border-white/15">
              {(["kanban", "list"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`px-3 py-2 text-[10px] uppercase tracking-wider ${
                    view === v ? "bg-cyan text-ink" : "text-steel hover:text-white"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-ghost px-3 py-2 text-[10px] uppercase"
              onClick={() => load(day, false, query, rangeMode)}
            >
              Refresh
            </button>
            <button
              type="button"
              className="btn-primary px-4 py-2 text-[10px] uppercase tracking-wider"
              onClick={() => setWalkInOpen(true)}
            >
              + Walk-in
            </button>
          </div>
        </div>

        {/* KPIs */}
        {stats && (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {[
              { label: "Total", value: stats.total, accent: false },
              { label: "Așteaptă", value: stats.confirmed, accent: false },
              { label: "Check-in", value: stats.checked_in, accent: false },
              { label: "Spălare", value: stats.washing, accent: true },
              { label: "Gata", value: stats.ready, accent: true },
              { label: "Done", value: stats.completed, accent: false },
              {
                label: "Linii",
                value: `${stats.activeLanes}/${stats.laneCapacity}`,
                accent: false,
              },
              {
                label: "Utilizare",
                value: `${stats.utilizationPct}%`,
                accent: stats.utilizationPct >= 80,
              },
            ].map((k) => (
              <div
                key={k.label}
                className={`border px-3 py-2 ${
                  k.accent ? "border-cyan/40 bg-cyan/10" : "border-white/10 bg-panel/60"
                }`}
              >
                <p className="text-[9px] uppercase tracking-[0.18em] text-steel">
                  {k.label}
                </p>
                <p className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
                  {k.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="Caută global: număr, cod, telefon…"
            className="min-w-[220px] flex-1 border border-white/15 bg-void px-4 py-2.5 text-sm tracking-wide text-white outline-none focus:border-cyan"
          />
          <select
            value={serviceFilter}
            onChange={(e) =>
              setServiceFilter(e.target.value as "all" | PackageId)
            }
            className="border border-white/15 bg-panel px-3 py-2 text-xs text-white"
          >
            <option value="all">Toate pachetele</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) =>
              setSourceFilter(e.target.value as typeof sourceFilter)
            }
            className="border border-white/15 bg-panel px-3 py-2 text-xs text-white"
          >
            <option value="all">Toate sursele</option>
            <option value="web">Web</option>
            <option value="walkin">Walk-in</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Kanban */}
      {view === "kanban" && (
        <div className="grid gap-3 lg:grid-cols-4">
          {columns.map((col) => {
            const items = filtered.filter((b) =>
              col === "confirmed"
                ? b.status === "confirmed" || b.status === "pending"
                : b.status === col,
            );
            return (
              <div key={col} className="glass flex min-h-[320px] flex-col p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan">
                    {labels[col]}
                  </p>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-steel">
                    {items.length}
                  </span>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {items.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      busy={busyId === b.id}
                      onSelect={() => setSelected(b)}
                      onAdvance={() => patchBooking(b.id, { advance: true })}
                      onStatus={(s) => patchBooking(b.id, { status: s })}
                    />
                  ))}
                  {items.length === 0 && (
                    <p className="py-8 text-center text-xs text-steel/60">Gol</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List */}
      {view === "list" && (
        <div className="glass overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 text-[10px] uppercase tracking-[0.16em] text-steel">
              <tr>
                <th className="px-4 py-3">Oră</th>
                <th className="px-4 py-3">Număr</th>
                <th className="px-4 py-3">Serviciu</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 text-white">{dateTimeLabel(b.startAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="font-[family-name:var(--font-display)] tracking-wider text-white hover:text-cyan"
                      onClick={() => setSelected(b)}
                    >
                      {b.plateDisplay}
                    </button>
                    <p className="text-[10px] text-cyan">{b.code}</p>
                  </td>
                  <td className="px-4 py-3 text-steel">{pkgName(b.serviceId)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <a href={`tel:${b.phone}`} className="text-steel hover:text-cyan">
                      {b.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {nextLabel[b.status] && (
                      <button
                        type="button"
                        className="btn-primary px-3 py-1.5 text-[10px] uppercase"
                        disabled={busyId === b.id}
                        onClick={() => patchBooking(b.id, { advance: true })}
                      >
                        {nextLabel[b.status]}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-steel">
              {query.trim().length >= 3
                ? "Niciun rezultat pentru căutare"
                : rangeMode === "upcoming"
                  ? "Nicio programare în următoarele 14 zile"
                  : "Nicio programare în această zi — apasă „14 zile” sau caută numărul"}
            </p>
          )}
        </div>
      )}

      {/* Done / cancelled strip */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {(["completed", "cancelled", "no_show"] as BookingStatus[]).map((col) => {
          const items = filtered.filter((b) => b.status === col);
          return (
            <div key={col} className="border border-white/5 bg-panel/40 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-steel">
                {labels[col]} · {items.length}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {items.slice(0, 12).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelected(b)}
                    className="border border-white/10 px-2 py-1 text-[10px] text-steel hover:text-white"
                  >
                    {b.plateDisplay}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <DetailDrawer
          booking={selected}
          onClose={() => setSelected(null)}
          onAdvance={() => patchBooking(selected.id, { advance: true })}
          onStatus={(s) => patchBooking(selected.id, { status: s })}
        />
      )}

      {walkInOpen && (
        <WalkInModal
          secret={secret}
          onClose={() => setWalkInOpen(false)}
          onCreated={() => {
            setWalkInOpen(false);
            load(day, true, query, rangeMode);
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const hot = status === "ready" || status === "washing";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        hot ? "bg-cyan text-ink" : "border border-white/15 text-steel"
      }`}
    >
      {labels[status]}
    </span>
  );
}

function BookingCard({
  booking: b,
  busy,
  onSelect,
  onAdvance,
  onStatus,
}: {
  booking: Booking;
  busy: boolean;
  onSelect: () => void;
  onAdvance: () => void;
  onStatus: (s: BookingStatus) => void;
}) {
  const left = minsLeft(b.endAt);
  const overdue = b.status === "washing" && left < 0;

  return (
    <div
      className={`border bg-void/70 p-3 transition ${
        b.status === "ready"
          ? "border-cyan/50 shadow-[0_0_20px_rgba(46,230,255,0.15)]"
          : overdue
            ? "border-red-400/40"
            : "border-white/10"
      }`}
    >
      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <p className="font-[family-name:var(--font-display)] text-lg tracking-wider text-white">
            {b.plateDisplay}
          </p>
          <span className="shrink-0 text-[10px] font-medium text-cyan">
            {dateTimeLabel(b.startAt)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-steel">
          {pkgName(b.serviceId)}
          {b.source === "walkin" ? " · Walk-in" : ""}
          {b.status === "washing" && (
            <span className={overdue ? " text-red-300" : " text-cyan"}>
              {" "}
              · {overdue ? `${Math.abs(left)}m peste` : `${left}m`}
            </span>
          )}
        </p>
        <p className="text-[10px] text-cyan">{b.code}</p>
      </button>
      <div className="mt-3 flex gap-2">
        {nextLabel[b.status] && (
          <button
            type="button"
            disabled={busy}
            onClick={onAdvance}
            className="btn-primary flex-1 py-2 text-[10px] uppercase tracking-wider"
          >
            {nextLabel[b.status]}
          </button>
        )}
        <a
          href={`tel:${b.phone}`}
          className="btn-ghost flex items-center px-3 text-[10px]"
          title="Sună"
        >
          ☎
        </a>
      </div>
      <select
        className="mt-2 w-full border border-white/10 bg-panel px-2 py-1.5 text-[10px] text-white"
        value={b.status}
        onChange={(e) => onStatus(e.target.value as BookingStatus)}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {labels[s]}
          </option>
        ))}
      </select>
    </div>
  );
}

function DetailDrawer({
  booking: b,
  onClose,
  onAdvance,
  onStatus,
}: {
  booking: Booking;
  onClose: () => void;
  onAdvance: () => void;
  onStatus: (s: BookingStatus) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <button type="button" className="flex-1" aria-label="Închide" onClick={onClose} />
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-panel p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan">Detaliu</p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-wider text-white">
              {b.plateDisplay}
            </h2>
            <p className="text-sm text-cyan">{b.code}</p>
          </div>
          <button type="button" onClick={onClose} className="text-steel hover:text-white">
            ✕
          </button>
        </div>

        <dl className="mt-8 space-y-4 text-sm">
          <Row label="Status" value={<StatusBadge status={b.status} />} />
          <Row label="Serviciu" value={pkgName(b.serviceId)} />
          <Row
            label="Interval"
            value={`${timeLabel(b.startAt)} – ${timeLabel(b.endAt)}`}
          />
          <Row
            label="Telefon"
            value={
              <a href={`tel:${b.phone}`} className="text-cyan hover:underline">
                {b.phone}
              </a>
            }
          />
          <Row label="Nume" value={b.name || "—"} />
          <Row label="Sursă" value={b.source} />
          <Row label="Note" value={b.notes || "—"} />
          <Row
            label="Creat"
            value={new Date(b.createdAt).toLocaleString("ro-RO")}
          />
        </dl>

        <div className="mt-8 space-y-2">
          {nextLabel[b.status] && (
            <button
              type="button"
              onClick={onAdvance}
              className="btn-primary w-full py-3 text-xs uppercase tracking-[0.16em]"
            >
              {nextLabel[b.status]}
            </button>
          )}
          <select
            className="w-full border border-white/15 bg-void px-3 py-3 text-sm text-white"
            value={b.status}
            onChange={(e) => onStatus(e.target.value as BookingStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {labels[s]}
              </option>
            ))}
          </select>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
      <dt className="text-[10px] uppercase tracking-[0.16em] text-steel">{label}</dt>
      <dd className="text-right text-white">{value}</dd>
    </div>
  );
}

function WalkInModal({
  secret,
  onClose,
  onCreated,
}: {
  secret: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("07");
  const [name, setName] = useState("");
  const [serviceId, setServiceId] = useState<PackageId>("complet");
  const [notes, setNotes] = useState("");
  const [startNow, setStartNow] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValidRoPlate(plate)) {
      setError("Număr invalid");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({
          plate,
          phone,
          name: name || undefined,
          serviceId,
          notes: notes || undefined,
          startNow,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="glass w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
            Walk-in rapid
          </h2>
          <button type="button" onClick={onClose} className="text-steel">
            ✕
          </button>
        </div>
        <div className="mt-6 space-y-3">
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="B 123 ABC"
            className="w-full border border-white/15 bg-void px-4 py-3 tracking-widest text-white outline-none focus:border-cyan"
            autoFocus
          />
          {plate && isValidRoPlate(plate) && (
            <p className="text-xs text-cyan">
              {formatPlateDisplay(normalizePlate(plate))}
            </p>
          )}
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefon"
            className="w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nume (opțional)"
            className="w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
          />
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value as PackageId)}
            className="w-full border border-white/15 bg-panel px-4 py-3 text-white"
          >
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.durationMin} min
              </option>
            ))}
          </select>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Note"
            rows={2}
            className="w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
          />
          <label className="flex items-center gap-2 text-sm text-steel">
            <input
              type="checkbox"
              checked={startNow}
              onChange={(e) => setStartNow(e.target.checked)}
            />
            Check-in imediat (începe acum)
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full py-3 text-xs uppercase tracking-[0.16em]"
        >
          {loading ? "Se salvează…" : "Adaugă pe board"}
        </button>
      </form>
    </div>
  );
}
