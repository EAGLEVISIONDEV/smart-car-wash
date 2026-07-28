import { getSqlClient } from "./db";

let migrated = false;

const DDL = `
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
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
  created_at TEXT NOT NULL,
  customer_id TEXT,
  bonus_id TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS bookings_code_uidx ON bookings(code);
CREATE INDEX IF NOT EXISTS idx_bookings_plate ON bookings(plate_normalized);
CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings(start_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  name TEXT,
  plate_normalized TEXT NOT NULL,
  plate_display TEXT NOT NULL,
  visits_completed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS customers_plate_uidx ON customers(plate_normalized);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

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
);

CREATE INDEX IF NOT EXISTS idx_bonuses_customer ON bonuses(customer_id);
CREATE INDEX IF NOT EXISTS idx_bonuses_status ON bonuses(status);

CREATE TABLE IF NOT EXISTS loyalty_settings (
  id TEXT PRIMARY KEY,
  visits_required INTEGER NOT NULL DEFAULT 5,
  reward_type TEXT NOT NULL DEFAULT 'free_wash',
  reward_service_id TEXT DEFAULT 'express',
  reward_label TEXT NOT NULL DEFAULT 'Spălare Express gratuită',
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TEXT NOT NULL
);

INSERT INTO loyalty_settings (
  id, visits_required, reward_type, reward_service_id, reward_label, enabled, updated_at
) VALUES (
  'default', 5, 'free_wash', 'express', 'Spălare Express gratuită', TRUE, NOW()::text
)
ON CONFLICT (id) DO NOTHING;
`;

/** Idempotent schema bootstrap for Supabase Postgres. */
export async function ensureSchema() {
  if (migrated) return;
  const sql = getSqlClient();
  await sql.unsafe(DDL);
  migrated = true;
}
