import { business, packages, type PackageId } from "./data";
import { addMinutes, isBefore } from "date-fns";
import { TZDate } from "@date-fns/tz";
import {
  BUSINESS_TZ,
  businessDayStart,
  formatBusinessDay,
  formatBusinessTime,
} from "./time";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "washing"
  | "ready"
  | "completed"
  | "cancelled"
  | "no_show";

export type Booking = {
  id: string;
  code: string;
  plateNormalized: string;
  plateDisplay: string;
  phone: string;
  name: string | null;
  serviceId: PackageId;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  notes: string | null;
  source: "web" | "walkin" | "admin";
  createdAt: string;
};

export type BoardStats = {
  total: number;
  confirmed: number;
  checked_in: number;
  washing: number;
  ready: number;
  completed: number;
  cancelled: number;
  no_show: number;
  activeLanes: number;
  laneCapacity: number;
  utilizationPct: number;
  nextSlot: string | null;
};

export function serviceDuration(id: PackageId): number {
  return packages.find((p) => p.id === id)?.durationMin ?? business.slotMinutes;
}

export function generateSlotsForDay(
  dayIso: string,
  existing: Booking[],
  serviceId: PackageId,
): string[] {
  const duration = serviceDuration(serviceId);
  const slots: string[] = [];
  const [y, m, d] = dayIso.slice(0, 10).split("-").map(Number);

  let cursor = new TZDate(
    y,
    m - 1,
    d,
    business.openHour,
    0,
    0,
    0,
    BUSINESS_TZ,
  );
  const close = new TZDate(
    y,
    m - 1,
    d,
    business.closeHour,
    0,
    0,
    0,
    BUSINESS_TZ,
  );
  const now = Date.now();

  while (
    isBefore(addMinutes(cursor, duration), close) ||
    +addMinutes(cursor, duration) === +close
  ) {
    const start = cursor;
    const end = addMinutes(start, duration);
    if (+end > +close) break;

    if (start.getTime() >= now - 30_000) {
      const overlapCount = existing.filter((b) => {
        if (["cancelled", "no_show", "completed"].includes(b.status)) return false;
        const bs = new Date(b.startAt).getTime();
        const be = new Date(b.endAt).getTime();
        return bs < end.getTime() && be > start.getTime();
      }).length;

      if (overlapCount < business.lanes) {
        slots.push(new Date(start.getTime()).toISOString());
      }
    }

    cursor = addMinutes(cursor, business.slotMinutes) as TZDate;
  }
  return slots;
}

export function formatSlotLabel(iso: string): string {
  return formatBusinessTime(iso);
}

export function formatDayLabel(iso: string): string {
  return formatBusinessDay(iso);
}

export { businessDayStart };
