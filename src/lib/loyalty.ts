import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import { customers, bonuses, loyaltySettings, bookings } from "./schema";
import type {
  Bonus,
  BonusStatus,
  BonusType,
  BonusSource,
  Customer,
  CustomerProfile,
  LoyaltySettings,
} from "./loyalty-types";
import {
  formatPlateDisplay,
  normalizePlate,
} from "./plates";
import { randomUUID } from "crypto";

let loyaltyMigrated = false;

export async function ensureLoyaltySchema() {
  if (loyaltyMigrated) return;
  const db = getDb();
  const client = (
    db as unknown as { $client: { execute: (s: string) => Promise<unknown> } }
  ).$client;

  await client.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      phone TEXT NOT NULL,
      name TEXT,
      plate_normalized TEXT NOT NULL,
      plate_display TEXT NOT NULL,
      visits_completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS bonuses (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      type TEXT NOT NULL,
      service_id TEXT,
      label TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      source TEXT NOT NULL DEFAULT 'manual',
      notes TEXT,
      expires_at TEXT,
      redeemed_at TEXT,
      redeemed_booking_id TEXT,
      created_at TEXT NOT NULL
    )
  `);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS loyalty_settings (
      id TEXT PRIMARY KEY,
      visits_required INTEGER NOT NULL DEFAULT 5,
      reward_type TEXT NOT NULL DEFAULT 'free_wash',
      reward_service_id TEXT DEFAULT 'express',
      reward_label TEXT NOT NULL DEFAULT 'Spălare Express gratuită',
      enabled INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    )
  `);
  // best-effort columns on bookings
  try {
    await client.execute(`ALTER TABLE bookings ADD COLUMN customer_id TEXT`);
  } catch { /* exists */ }
  try {
    await client.execute(`ALTER TABLE bookings ADD COLUMN bonus_id TEXT`);
  } catch { /* exists */ }

  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_customers_plate ON customers(plate_normalized)`,
  );
  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)`,
  );
  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_bonuses_customer ON bonuses(customer_id)`,
  );
  await client.execute(
    `CREATE INDEX IF NOT EXISTS idx_bonuses_status ON bonuses(status)`,
  );

  // seed default loyalty settings
  const existing = await db
    .select()
    .from(loyaltySettings)
    .where(eq(loyaltySettings.id, "default"))
    .limit(1);
  if (!existing[0]) {
    const now = new Date().toISOString();
    await db.insert(loyaltySettings).values({
      id: "default",
      visitsRequired: 5,
      rewardType: "free_wash",
      rewardServiceId: "express",
      rewardLabel: "Spălare Express gratuită",
      enabled: 1,
      updatedAt: now,
    });
  }

  loyaltyMigrated = true;
}

function rowCustomer(r: typeof customers.$inferSelect): Customer {
  return {
    id: r.id,
    phone: r.phone,
    name: r.name,
    plateNormalized: r.plateNormalized,
    plateDisplay: r.plateDisplay,
    visitsCompleted: r.visitsCompleted,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function rowBonus(r: typeof bonuses.$inferSelect): Bonus {
  return {
    id: r.id,
    customerId: r.customerId,
    type: r.type as BonusType,
    serviceId: r.serviceId,
    label: r.label,
    status: r.status as BonusStatus,
    source: r.source as BonusSource,
    notes: r.notes,
    expiresAt: r.expiresAt,
    redeemedAt: r.redeemedAt,
    redeemedBookingId: r.redeemedBookingId,
    createdAt: r.createdAt,
  };
}

function rowLoyalty(r: typeof loyaltySettings.$inferSelect): LoyaltySettings {
  return {
    id: r.id,
    visitsRequired: r.visitsRequired,
    rewardType: r.rewardType as BonusType,
    rewardServiceId: r.rewardServiceId,
    rewardLabel: r.rewardLabel,
    enabled: r.enabled === 1,
    updatedAt: r.updatedAt,
  };
}

export async function getLoyaltySettings(): Promise<LoyaltySettings> {
  await ensureLoyaltySchema();
  const db = getDb();
  const rows = await db
    .select()
    .from(loyaltySettings)
    .where(eq(loyaltySettings.id, "default"))
    .limit(1);
  return rowLoyalty(rows[0]!);
}

export async function updateLoyaltySettings(input: {
  visitsRequired: number;
  rewardType: BonusType;
  rewardServiceId: string | null;
  rewardLabel: string;
  enabled: boolean;
}): Promise<LoyaltySettings> {
  await ensureLoyaltySchema();
  const db = getDb();
  const now = new Date().toISOString();
  await db
    .update(loyaltySettings)
    .set({
      visitsRequired: input.visitsRequired,
      rewardType: input.rewardType,
      rewardServiceId: input.rewardServiceId,
      rewardLabel: input.rewardLabel,
      enabled: input.enabled ? 1 : 0,
      updatedAt: now,
    })
    .where(eq(loyaltySettings.id, "default"));
  return getLoyaltySettings();
}

export async function upsertCustomer(input: {
  plate: string;
  phone: string;
  name?: string | null;
}): Promise<Customer> {
  await ensureLoyaltySchema();
  const db = getDb();
  const plateNormalized = normalizePlate(input.plate);
  const phone = input.phone.replace(/\s+/g, "");
  const now = new Date().toISOString();

  const byPlate = await db
    .select()
    .from(customers)
    .where(eq(customers.plateNormalized, plateNormalized))
    .limit(1);

  if (byPlate[0]) {
    await db
      .update(customers)
      .set({
        phone,
        name: input.name?.trim() || byPlate[0].name,
        plateDisplay: formatPlateDisplay(plateNormalized),
        updatedAt: now,
      })
      .where(eq(customers.id, byPlate[0].id));
    const updated = await db
      .select()
      .from(customers)
      .where(eq(customers.id, byPlate[0].id))
      .limit(1);
    return rowCustomer(updated[0]!);
  }

  const customer: typeof customers.$inferInsert = {
    id: randomUUID(),
    phone,
    name: input.name?.trim() || null,
    plateNormalized,
    plateDisplay: formatPlateDisplay(plateNormalized),
    visitsCompleted: 0,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(customers).values(customer);
  return rowCustomer(customer as typeof customers.$inferSelect);
}

export async function listCustomers(query?: string): Promise<CustomerProfile[]> {
  await ensureLoyaltySchema();
  const db = getDb();
  let rows = await db.select().from(customers).orderBy(desc(customers.updatedAt));

  if (query?.trim()) {
    const q = query.trim().toUpperCase();
    const plate = normalizePlate(q);
    rows = rows.filter(
      (c) =>
        c.plateNormalized.includes(plate) ||
        c.plateDisplay.toUpperCase().includes(q) ||
        c.phone.includes(q) ||
        (c.name || "").toUpperCase().includes(q),
    );
  }

  const allBonuses = await db.select().from(bonuses);
  const profiles: CustomerProfile[] = rows.map((c) => {
    const custBonuses = allBonuses
      .filter((b) => b.customerId === c.id)
      .map(rowBonus);
    return {
      ...rowCustomer(c),
      availableBonuses: custBonuses.filter((b) => b.status === "available"),
      redeemedBonuses: custBonuses.filter((b) => b.status === "redeemed").length,
      recentBookings: c.visitsCompleted,
    };
  });
  return profiles;
}

export async function getCustomer(id: string): Promise<CustomerProfile | null> {
  await ensureLoyaltySchema();
  const db = getDb();
  const rows = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  if (!rows[0]) return null;
  const custBonuses = (
    await db.select().from(bonuses).where(eq(bonuses.customerId, id)).orderBy(desc(bonuses.createdAt))
  ).map(rowBonus);
  return {
    ...rowCustomer(rows[0]),
    availableBonuses: custBonuses.filter((b) => b.status === "available"),
    redeemedBonuses: custBonuses.filter((b) => b.status === "redeemed").length,
    recentBookings: rows[0].visitsCompleted,
  };
}

export async function grantBonus(input: {
  customerId: string;
  type: BonusType;
  serviceId?: string | null;
  label: string;
  source?: BonusSource;
  notes?: string;
  expiresAt?: string | null;
}): Promise<Bonus> {
  await ensureLoyaltySchema();
  const db = getDb();
  const now = new Date().toISOString();
  const bonus = {
    id: randomUUID(),
    customerId: input.customerId,
    type: input.type,
    serviceId: input.serviceId ?? null,
    label: input.label,
    status: "available" as const,
    source: input.source ?? "manual",
    notes: input.notes ?? null,
    expiresAt: input.expiresAt ?? null,
    redeemedAt: null,
    redeemedBookingId: null,
    createdAt: now,
  };
  await db.insert(bonuses).values(bonus);
  return rowBonus(bonus as typeof bonuses.$inferSelect);
}

export async function listBonuses(filter?: {
  status?: BonusStatus;
  customerId?: string;
}): Promise<(Bonus & { customer?: Customer })[]> {
  await ensureLoyaltySchema();
  const db = getDb();
  let rows = await db.select().from(bonuses).orderBy(desc(bonuses.createdAt));
  if (filter?.status) rows = rows.filter((b) => b.status === filter.status);
  if (filter?.customerId)
    rows = rows.filter((b) => b.customerId === filter.customerId);

  const custRows = await db.select().from(customers);
  const custMap = new Map(custRows.map((c) => [c.id, rowCustomer(c)]));

  return rows.map((b) => ({
    ...rowBonus(b),
    customer: custMap.get(b.customerId),
  }));
}

export async function redeemBonus(
  bonusId: string,
  bookingId?: string,
): Promise<Bonus | null> {
  await ensureLoyaltySchema();
  const db = getDb();
  const rows = await db.select().from(bonuses).where(eq(bonuses.id, bonusId)).limit(1);
  if (!rows[0] || rows[0].status !== "available") return null;

  if (rows[0].expiresAt && new Date(rows[0].expiresAt) < new Date()) {
    await db
      .update(bonuses)
      .set({ status: "expired" })
      .where(eq(bonuses.id, bonusId));
    return null;
  }

  const now = new Date().toISOString();
  await db
    .update(bonuses)
    .set({
      status: "redeemed",
      redeemedAt: now,
      redeemedBookingId: bookingId ?? null,
    })
    .where(eq(bonuses.id, bonusId));

  const updated = await db.select().from(bonuses).where(eq(bonuses.id, bonusId)).limit(1);
  return updated[0] ? rowBonus(updated[0]) : null;
}

export async function cancelBonus(bonusId: string): Promise<Bonus | null> {
  await ensureLoyaltySchema();
  const db = getDb();
  await db
    .update(bonuses)
    .set({ status: "cancelled" })
    .where(and(eq(bonuses.id, bonusId), eq(bonuses.status, "available")));
  const rows = await db.select().from(bonuses).where(eq(bonuses.id, bonusId)).limit(1);
  if (!rows[0] || rows[0].status !== "cancelled") return null;
  return rowBonus(rows[0]);
}

/** Called when a booking reaches completed — increments visits & may grant loyalty reward */
export async function onBookingCompleted(input: {
  plate: string;
  phone: string;
  name?: string | null;
  bookingId: string;
}): Promise<{ customer: Customer; awardedBonus: Bonus | null }> {
  const customer = await upsertCustomer({
    plate: input.plate,
    phone: input.phone,
    name: input.name,
  });

  const db = getDb();
  const now = new Date().toISOString();
  const nextVisits = customer.visitsCompleted + 1;
  await db
    .update(customers)
    .set({ visitsCompleted: nextVisits, updatedAt: now })
    .where(eq(customers.id, customer.id));

  await db
    .update(bookings)
    .set({ customerId: customer.id })
    .where(eq(bookings.id, input.bookingId));

  const settings = await getLoyaltySettings();
  let awardedBonus: Bonus | null = null;

  if (
    settings.enabled &&
    settings.visitsRequired > 0 &&
    nextVisits % settings.visitsRequired === 0
  ) {
    awardedBonus = await grantBonus({
      customerId: customer.id,
      type: settings.rewardType,
      serviceId: settings.rewardServiceId,
      label: settings.rewardLabel,
      source: "loyalty",
      notes: `Automat după ${nextVisits} spălări finalizate`,
    });
  }

  const refreshed = await db
    .select()
    .from(customers)
    .where(eq(customers.id, customer.id))
    .limit(1);

  return {
    customer: rowCustomer(refreshed[0]!),
    awardedBonus,
  };
}
