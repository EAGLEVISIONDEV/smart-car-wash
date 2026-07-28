import { TZDate } from "@date-fns/tz";
import { addDays, format } from "date-fns";

/** Business timezone — always use this for days, hours, and board filters. */
export const BUSINESS_TZ = "Europe/Bucharest";

export function nowInBusinessTz(): TZDate {
  return TZDate.tz(BUSINESS_TZ);
}

/** Calendar date YYYY-MM-DD in Europe/Bucharest. */
export function todayBusiness(): string {
  return format(nowInBusinessTz(), "yyyy-MM-dd");
}

/** Add calendar days to a YYYY-MM-DD business date. */
export function addBusinessDays(dayIso: string, days: number): string {
  const [y, m, d] = dayIso.slice(0, 10).split("-").map(Number);
  const base = new TZDate(y, m - 1, d, 12, 0, 0, 0, BUSINESS_TZ);
  return format(addDays(base, days), "yyyy-MM-dd");
}

/** Construct a wall-clock time in Bucharest, returned as UTC ISO. */
export function businessDateTimeToUtcIso(
  dayIso: string,
  hour: number,
  minute = 0,
  second = 0,
  ms = 0,
): string {
  const [y, m, d] = dayIso.slice(0, 10).split("-").map(Number);
  const local = new TZDate(y, m - 1, d, hour, minute, second, ms, BUSINESS_TZ);
  return new Date(local.getTime()).toISOString();
}

/** Inclusive day window [00:00, 23:59:59.999] Bucharest → UTC ISO bounds. */
export function businessDayBounds(dayIso: string): { from: string; to: string } {
  return {
    from: businessDateTimeToUtcIso(dayIso, 0, 0, 0, 0),
    to: businessDateTimeToUtcIso(dayIso, 23, 59, 59, 999),
  };
}

/** Instant for Bucharest midnight of a calendar day. */
export function businessDayStart(dayIso: string): Date {
  return new Date(businessDateTimeToUtcIso(dayIso, 0, 0, 0, 0));
}

/** Format an instant as HH:mm in Bucharest. */
export function formatBusinessTime(iso: string): string {
  return format(new TZDate(parseISOSafe(iso), BUSINESS_TZ), "HH:mm");
}

/** Format an instant as dd.MM.yyyy in Bucharest. */
export function formatBusinessDay(iso: string): string {
  return format(new TZDate(parseISOSafe(iso), BUSINESS_TZ), "dd.MM.yyyy");
}

/** Format instant as "dd.MM · HH:mm" Bucharest. */
export function formatBusinessDateTime(iso: string): string {
  return format(new TZDate(parseISOSafe(iso), BUSINESS_TZ), "dd.MM · HH:mm");
}

/** Calendar YYYY-MM-DD of an instant in Bucharest. */
export function businessDayOf(iso: string): string {
  return format(new TZDate(parseISOSafe(iso), BUSINESS_TZ), "yyyy-MM-dd");
}

function parseISOSafe(iso: string): Date {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${iso}`);
  return d;
}
