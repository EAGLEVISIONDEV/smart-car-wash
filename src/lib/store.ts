import { eq, and, gte, lte, ne, or, like, desc } from "drizzle-orm";
import { addMinutes, parseISO } from "date-fns";
import { getDb } from "./db";
import { bookings } from "./schema";
import type { Booking, BookingStatus } from "./booking";
import { serviceDuration } from "./booking";
import type { PackageId } from "./data";
import {
  formatPlateDisplay,
  generateBookingCode,
  normalizePlate,
} from "./plates";
import { randomUUID } from "crypto";

let migrated = false;

async function ensureSchema() {
  if (migrated) return;
  const db = getDb();
  // raw SQL via client
  const client = (
    db as unknown as {
      $client: { execute: (sql: string) => Promise<unknown> };
    }
  ).$client;
  await client.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      plate_normalized TEXT NOT NULL,
      plate_display TEXT NOT NULL,
      phone TEXT NOT NULL,
      name TEXT,
      service_id TEXT NOT NULL,
      start_at TEXT NOT NULL,
      end_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      notes TEXT,
      source TEXT NOT NULL DEFAULT 'web',
      created_at TEXT NOT NULL
    )
  `);
  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_bookings_plate ON bookings(plate_normalized)`,
  );
  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings(start_at)`,
  );
  migrated = true;
}

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

export async function listBookingsForDay(dayIso: string): Promise<Booking[]> {
  await ensureSchema();
  const db = getDb();
  const [y, m, d] = dayIso.slice(0, 10).split("-").map(Number);
  const day = new Date(y, m - 1, d, 0, 0, 0, 0);
  const from = day.toISOString();
  const to = new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
  const rows = await db
    .select()
    .from(bookings)
    .where(and(gte(bookings.startAt, from), lte(bookings.startAt, to)))
    .orderBy(bookings.startAt);
  return rows.map(rowToBooking);
}

export async function listTodayBoard(): Promise<Booking[]> {
  return listBookingsForDay(new Date().toISOString());
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
      ),
    )
    .orderBy(desc(bookings.startAt))
    .limit(20);
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
    status: "confirmed",
    notes: input.notes?.trim() || null,
    source: input.source ?? "web",
    createdAt: now,
  };

  await db.insert(bookings).values(booking);
  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<Booking | null> {
  await ensureSchema();
  const db = getDb();
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
  const rows = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return rows[0] ? rowToBooking(rows[0]) : null;
}

export async function getActiveForSlots(dayIso: string): Promise<Booking[]> {
  const all = await listBookingsForDay(dayIso);
  return all.filter((b) => !["cancelled", "no_show"].includes(b.status));
}
