import { eq, and, gte, lte, or, like, desc, asc } from "drizzle-orm";
import { addMinutes, parseISO } from "date-fns";
import { getDb } from "./db";
import { ensureSchema } from "./migrate";
import { bookings } from "./schema";
import type { Booking, BookingStatus, BoardStats } from "./booking";
import { generateSlotsForDay, serviceDuration } from "./booking";
import type { PackageId } from "./data";
import { business } from "./data";
import {
  formatPlateDisplay,
  generateBookingCode,
  normalizePlate,
} from "./plates";
import { randomUUID } from "crypto";
import { onBookingCompleted } from "./loyalty";

function rowToBooking(r: typeof bookings.$inferSelect): Booking {
  return {
    id: r.id,
    code: r.code,
    plateNormalized: r.plateNormalized,
    plateDisplay: r.plateDisplay,
    phone: r.phone,
    name: r.name,
    serviceId: r.serviceId as PackageId,
    startAt: r.startAt,
    endAt: r.endAt,
    status: r.status as BookingStatus,
    notes: r.notes,
    source: r.source as Booking["source"],
    createdAt: r.createdAt,
  };
}

function dayBounds(dayIso: string) {
  const [y, m, d] = dayIso.slice(0, 10).split("-").map(Number);
  const from = new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
  const to = new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
  return { from, to };
}

export function computeStats(board: Booking[]): BoardStats {
  const count = (s: BookingStatus) => board.filter((b) => b.status === s).length;
  const activeLanes = board.filter((b) =>
    ["checked_in", "washing"].includes(b.status),
  ).length;
  const laneCapacity = business.lanes;
  return {
    total: board.filter((b) => !["cancelled"].includes(b.status)).length,
    confirmed: count("confirmed") + count("pending"),
    checked_in: count("checked_in"),
    washing: count("washing"),
    ready: count("ready"),
    completed: count("completed"),
    cancelled: count("cancelled"),
    no_show: count("no_show"),
    activeLanes,
    laneCapacity,
    utilizationPct: Math.min(
      100,
      Math.round((activeLanes / Math.max(1, laneCapacity)) * 100),
    ),
    nextSlot: null,
  };
}

export async function listBookingsForDay(dayIso: string): Promise<Booking[]> {
  await ensureSchema();
  const db = getDb();
  const { from, to } = dayBounds(dayIso);
  const rows = await db
    .select()
    .from(bookings)
    .where(and(gte(bookings.startAt, from), lte(bookings.startAt, to)))
    .orderBy(asc(bookings.startAt));
  return rows.map(rowToBooking);
}

export async function listTodayBoard(): Promise<Booking[]> {
  const today = new Date();
  const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return listBookingsForDay(day);
}

export async function getBoardPayload(dayIso: string) {
  const board = await listBookingsForDay(dayIso);
  const stats = computeStats(board);
  const active = board.filter(
    (b) => !["cancelled", "no_show", "completed"].includes(b.status),
  );
  const slots = generateSlotsForDay(dayIso, active, "express");
  stats.nextSlot = slots[0] ?? null;
  return { board, stats, day: dayIso.slice(0, 10) };
}

export async function findByPlateOrCode(query: string): Promise<Booking[]> {
  await ensureSchema();
  const db = getDb();
  const plate = normalizePlate(query);
  const q = query.trim().toUpperCase();
  const rows = await db
    .select()
    .from(bookings)
    .where(
      or(
        eq(bookings.plateNormalized, plate),
        eq(bookings.code, q),
        like(bookings.plateDisplay, `%${q}%`),
        like(bookings.phone, `%${q}%`),
      ),
    )
    .orderBy(desc(bookings.startAt))
    .limit(30);
  return rows.map(rowToBooking);
}

export async function createBooking(input: {
  plate: string;
  phone: string;
  name?: string;
  serviceId: PackageId;
  startAt: string;
  notes?: string;
  source?: Booking["source"];
  status?: BookingStatus;
}): Promise<Booking> {
  await ensureSchema();
  const db = getDb();
  const plateNormalized = normalizePlate(input.plate);
  const duration = serviceDuration(input.serviceId);
  const start = parseISO(input.startAt);
  const end = addMinutes(start, duration);
  const now = new Date().toISOString();

  const booking: Booking = {
    id: randomUUID(),
    code: generateBookingCode(),
    plateNormalized,
    plateDisplay: formatPlateDisplay(plateNormalized),
    phone: input.phone.replace(/\s+/g, ""),
    name: input.name?.trim() || null,
    serviceId: input.serviceId,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    status: input.status ?? "confirmed",
    notes: input.notes?.trim() || null,
    source: input.source ?? "web",
    createdAt: now,
  };

  await db.insert(bookings).values(booking);
  return booking;
}

export async function createWalkIn(input: {
  plate: string;
  phone: string;
  name?: string;
  serviceId: PackageId;
  notes?: string;
  startNow?: boolean;
}): Promise<Booking> {
  const today = new Date();
  const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const existing = await getActiveForSlots(day);
  const slots = generateSlotsForDay(day, existing, input.serviceId);
  const startAt =
    input.startNow || slots.length === 0
      ? new Date().toISOString()
      : slots[0];

  return createBooking({
    ...input,
    startAt,
    source: "walkin",
    status: input.startNow ? "checked_in" : "confirmed",
  });
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<Booking | null> {
  await ensureSchema();
  const db = getDb();
  const before = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  if (!before[0]) return null;

  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
  const rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  const updated = rows[0] ? rowToBooking(rows[0]) : null;

  if (updated && status === "completed" && before[0].status !== "completed") {
    try {
      await onBookingCompleted({
        plate: updated.plateNormalized,
        phone: updated.phone,
        name: updated.name,
        bookingId: updated.id,
      });
    } catch (e) {
      console.error("loyalty award failed", e);
    }
  }

  return updated;
}

const FLOW: BookingStatus[] = [
  "confirmed",
  "checked_in",
  "washing",
  "ready",
  "completed",
];

export async function advanceBookingStatus(
  id: string,
): Promise<Booking | null> {
  await ensureSchema();
  const db = getDb();
  const rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  if (!rows[0]) return null;
  const current = rows[0].status as BookingStatus;
  const idx = FLOW.indexOf(current);
  const next = idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : current;
  return updateBookingStatus(id, next);
}

export async function getActiveForSlots(dayIso: string): Promise<Booking[]> {
  const all = await listBookingsForDay(dayIso);
  return all.filter((b) => !["cancelled", "no_show"].includes(b.status));
}

export async function getBookingById(id: string): Promise<Booking | null> {
  await ensureSchema();
  const db = getDb();
  const rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  return rows[0] ? rowToBooking(rows[0]) : null;
}
