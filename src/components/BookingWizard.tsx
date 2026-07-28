"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { packages, type PackageId } from "@/lib/data";
import { formatPlateDisplay, isValidRoPlate, normalizePlate } from "@/lib/plates";
import { formatSlotLabel } from "@/lib/booking";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { BookingCalendar } from "@/components/BookingCalendar";

type BookingResult = {
  code: string;
  plateDisplay: string;
  startAt: string;
  serviceId: string;
};

function groupSlots(slots: string[]) {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];
  for (const s of slots) {
    const h = new Date(s).getHours();
    if (h < 12) morning.push(s);
    else if (h < 17) afternoon.push(s);
    else evening.push(s);
  }
  return [
    { key: "dimineata", label: "Dimineață", slots: morning },
    { key: "dupa-amiaza", label: "După-amiază", slots: afternoon },
    { key: "seara", label: "Seară", slots: evening },
  ].filter((g) => g.slots.length > 0);
}

export function BookingWizard() {
  const params = useSearchParams();
  const initialService = (params.get("service") as PackageId) || "complet";

  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<PackageId>(
    packages.some((p) => p.id === initialService) ? initialService : "complet",
  );
  const [day, setDay] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState<string[]>([]);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<BookingResult | null>(null);

  const plateOk = plate.trim().length === 0 || isValidRoPlate(plate);
  const slotGroups = useMemo(() => groupSlots(slots), [slots]);

  const dayLabel = useMemo(() => {
    const [y, m, d] = day.split("-").map(Number);
    return format(new Date(y, m - 1, d), "EEEE, d MMMM", { locale: ro });
  }, [day]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setStartAt(null);
      try {
        const res = await fetch(
          `/api/slots?day=${day}&serviceId=${serviceId}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare sloturi");
        if (!cancelled) setSlots(data.slots || []);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Eroare la încărcare");
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [day, serviceId]);

  async function submit() {
    setError(null);
    if (!isValidRoPlate(plate)) {
      setError("Număr de înmatriculare invalid");
      return;
    }
    if (!startAt) {
      setError("Alege un interval orar");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("Telefon invalid");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plate,
          phone,
          name: name || undefined,
          serviceId,
          startAt,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Nu am putut salva");
      setDone({
        code: data.booking.code,
        plateDisplay: data.booking.plateDisplay,
        startAt: data.booking.startAt,
        serviceId: data.booking.serviceId,
      });
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eroare");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="glass mx-auto max-w-lg p-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan">
          Confirmat
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-white">
          Programare înregistrată
        </h2>
        <p className="mt-6 font-[family-name:var(--font-display)] text-4xl tracking-widest text-cyan">
          {done.code}
        </p>
        <p className="mt-4 text-sm text-steel">
          {done.plateDisplay} ·{" "}
          {new Date(done.startAt).toLocaleString("ro-RO", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <p className="mt-2 text-sm text-steel">
          Pachet: {packages.find((p) => p.id === done.serviceId)?.name}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/status" className="btn-primary px-6 py-3 text-xs uppercase tracking-[0.16em]">
            Vezi status
          </Link>
          <Link href="/" className="btn-ghost px-6 py-3 text-xs uppercase tracking-[0.16em]">
            Acasă
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex gap-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 ${n <= step ? "bg-cyan" : "bg-white/10"}`}
          />
        ))}
      </div>

      {error && (
        <p className="mb-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
            1. Alege serviciul
          </h2>
          {packages.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setServiceId(p.id)}
              className={`w-full border p-5 text-left transition ${
                serviceId === p.id
                  ? "border-cyan bg-cyan/10"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-display)] text-xl text-white">
                  {p.name}
                </span>
                <span className="text-xs text-cyan">{p.durationMin} min</span>
              </div>
              <p className="mt-1 text-sm text-steel">{p.description}</p>
            </button>
          ))}
          <button
            type="button"
            className="btn-primary mt-4 w-full py-3 text-xs uppercase tracking-[0.16em]"
            onClick={() => setStep(2)}
          >
            Continuă
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
              2. Alege ziua și ora
            </h2>
            <p className="mt-2 text-sm text-steel">
              Pachet{" "}
              <span className="text-cyan">
                {packages.find((p) => p.id === serviceId)?.name}
              </span>{" "}
              · calendar pe următoarele 14 zile
            </p>
          </div>

          <BookingCalendar value={day} onChange={setDay} horizonDays={14} />

          <div>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan">
                  Interval orar
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-lg capitalize text-white">
                  {dayLabel}
                </p>
              </div>
              {startAt && (
                <p className="text-sm text-cyan">
                  Selectat: {formatSlotLabel(startAt)}
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex items-center gap-3 border border-white/10 px-4 py-8 text-sm text-steel">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
                Se încarcă intervalele…
              </div>
            ) : slots.length === 0 ? (
              <p className="border border-white/10 px-4 py-8 text-sm text-steel">
                Niciun slot liber în această zi. Alege altă dată.
              </p>
            ) : (
              <div className="space-y-5">
                {slotGroups.map((group) => (
                  <div key={group.key}>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-steel">
                      {group.label}
                    </p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {group.slots.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStartAt(s)}
                          className={`border py-2.5 text-sm font-medium transition ${
                            startAt === s
                              ? "border-cyan bg-cyan text-ink shadow-[0_0_20px_var(--cyan-glow)]"
                              : "border-white/10 text-white hover:border-cyan/40 hover:bg-cyan/5"
                          }`}
                        >
                          {formatSlotLabel(s)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="btn-ghost flex-1 py-3 text-xs uppercase"
              onClick={() => setStep(1)}
            >
              Înapoi
            </button>
            <button
              type="button"
              className="btn-primary flex-1 py-3 text-xs uppercase"
              disabled={!startAt}
              onClick={() => setStep(3)}
            >
              Continuă
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
            3. Număr & contact
          </h2>
          <label className="block text-xs uppercase tracking-[0.16em] text-steel">
            Număr înmatriculare
            <input
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="B 123 ABC"
              className={`mt-2 w-full border bg-void px-4 py-3 text-lg tracking-widest text-white outline-none ${
                plateOk ? "border-white/15 focus:border-cyan" : "border-red-400"
              }`}
            />
          </label>
          {plate && plateOk && (
            <p className="text-sm text-cyan">
              Format: {formatPlateDisplay(normalizePlate(plate))}
            </p>
          )}
          <label className="block text-xs uppercase tracking-[0.16em] text-steel">
            Telefon
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xx xxx xxx"
              className="mt-2 w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.16em] text-steel">
            Nume (opțional)
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.16em] text-steel">
            Note (opțional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="SUV, ceramică, las cheile…"
              className="mt-2 w-full border border-white/15 bg-void px-4 py-3 text-white outline-none focus:border-cyan"
            />
          </label>
          <p className="text-xs text-steel">
            Prin confirmare ești de acord cu prelucrarea numărului de înmatriculare și a telefonului
            pentru programare.{" "}
            <Link href="/confidentialitate" className="text-cyan underline">
              Politica de confidențialitate
            </Link>
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-ghost flex-1 py-3 text-xs uppercase"
              onClick={() => setStep(2)}
            >
              Înapoi
            </button>
            <button
              type="button"
              className="btn-primary flex-1 py-3 text-xs uppercase"
              disabled={loading}
              onClick={submit}
            >
              {loading ? "Se salvează…" : "Confirmă"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
