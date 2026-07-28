"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ro } from "date-fns/locale";
import { todayBusiness } from "@/lib/time";

const WEEKDAYS = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];

type Props = {
  value: string; // yyyy-MM-dd
  onChange: (iso: string) => void;
  /** How many days ahead can be booked (inclusive of today) */
  horizonDays?: number;
};

export function BookingCalendar({
  value,
  onChange,
  horizonDays = 14,
}: Props) {
  const todayIso = todayBusiness();
  const today = startOfDay(
    new Date(
      +todayIso.slice(0, 4),
      +todayIso.slice(5, 7) - 1,
      +todayIso.slice(8, 10),
    ),
  );
  const maxDate = addDays(today, horizonDays - 1);
  const selected = startOfDay(
    new Date(+value.slice(0, 4), +value.slice(5, 7) - 1, +value.slice(8, 10)),
  );

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [viewMonth]);

  const prevMonth = subMonths(viewMonth, 1);
  const nextMonth = addMonths(viewMonth, 1);
  const showPrev =
    endOfMonth(prevMonth) >= today && startOfMonth(prevMonth) <= maxDate;
  const showNext = startOfMonth(nextMonth) <= maxDate;

  function selectDay(d: Date) {
    const day = startOfDay(d);
    if (isBefore(day, today) || day > maxDate) return;
    onChange(format(day, "yyyy-MM-dd"));
  }

  function isBookable(d: Date) {
    const day = startOfDay(d);
    return !isBefore(day, today) && day <= maxDate;
  }

  return (
    <div className="overflow-hidden border border-white/10 bg-panel/60">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
        <button
          type="button"
          aria-label="Luna anterioară"
          disabled={!showPrev}
          onClick={() => setViewMonth(startOfMonth(prevMonth))}
          className="flex h-9 w-9 items-center justify-center border border-white/10 text-white transition hover:border-cyan/50 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-25"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-[family-name:var(--font-display)] text-lg font-bold capitalize text-white">
            {format(viewMonth, "LLLL yyyy", { locale: ro })}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-steel">
            Selectează ziua
          </p>
        </div>
        <button
          type="button"
          aria-label="Luna următoare"
          disabled={!showNext}
          onClick={() => setViewMonth(startOfMonth(nextMonth))}
          className="flex h-9 w-9 items-center justify-center border border-white/10 text-white transition hover:border-cyan/50 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-25"
        >
          ›
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-px border-b border-white/5 bg-white/[0.03] px-2 pt-3 pb-1 sm:px-3">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="py-1 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-steel"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={format(viewMonth, "yyyy-MM")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="grid grid-cols-7 gap-1 p-2 sm:gap-1.5 sm:p-3"
        >
          {days.map((d) => {
            const inMonth = isSameMonth(d, viewMonth);
            const bookable = isBookable(d);
            const isToday = isSameDay(d, today);
            const isSelected = isSameDay(d, selected);
            const disabled = !bookable;

            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => selectDay(d)}
                className={[
                  "relative aspect-square rounded-sm text-sm font-medium transition",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan",
                  !inMonth && "opacity-25",
                  disabled && "cursor-not-allowed text-steel/40",
                  !disabled && !isSelected && "text-white hover:bg-cyan/10 hover:text-cyan",
                  isSelected && "bg-cyan text-ink shadow-[0_0_24px_var(--cyan-glow)]",
                  isToday && !isSelected && "ring-1 ring-cyan/50",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="relative z-10">
                  {format(d, "d")}
                </span>
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan" />
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Footer hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-steel">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-cyan" />
          Selectat
        </span>
        <span>
          {format(selected, "EEEE, d MMMM", { locale: ro })}
        </span>
        <span>Max. {horizonDays} zile</span>
      </div>
    </div>
  );
}
