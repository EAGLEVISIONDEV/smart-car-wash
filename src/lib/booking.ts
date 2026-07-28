import { business, packages, type PackageId } from "./data";
import { addMinutes, format, isBefore, parseISO, setHours, setMinutes } from "date-fns";

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

export function serviceDuration(id: PackageId): number {
  return packages.find((p) => p.id === id)?.durationMin ?? business.slotMinutes;
}

function localDayStart(dayIso: string): Date {
  const [y, m, d] = dayIso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function generateSlotsForDay(
  dayIso: string,
  existing: Booking[],
  serviceId: PackageId,
): string[] {
  const day = localDayStart(dayIso);
  const duration = serviceDuration(serviceId);
  const slots: string[] = [];
  let cursor = setMinutes(setHours(day, business.openHour), 0);
  const close = setMinutes(setHours(day, business.closeHour), 0);
  const now = new Date();

  while (
    isBefore(addMinutes(cursor, duration), close) ||
    +addMinutes(cursor, duration) === +close
  ) {
    const start = cursor;
    const end = addMinutes(start, duration);
    if (+end > +close) break;

    if (start.getTime() >= now.getTime() - 30_000) {
      const overlapCount = existing.filter((b) => {
        if (["cancelled", "no_show", "completed"].includes(b.status)) return false;
        const bs = parseISO(b.startAt);
        const be = parseISO(b.endAt);
        return bs < end && be > start;
      }).length;

      if (overlapCount < business.lanes) {
        slots.push(start.toISOString());
      }
    }

    cursor = addMinutes(cursor, business.slotMinutes);
  }
  return slots;
}

export function formatSlotLabel(iso: string): string {
  return format(parseISO(iso), "HH:mm");
}

export function formatDayLabel(iso: string): string {
  return format(parseISO(iso), "dd.MM.yyyy");
}
