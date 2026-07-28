import {
  pgTable,
  text,
  integer,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const bookings = pgTable(
  "bookings",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    plateNormalized: text("plate_normalized").notNull(),
    plateDisplay: text("plate_display").notNull(),
    phone: text("phone").notNull(),
    name: text("name"),
    serviceId: text("service_id").notNull(),
    startAt: text("start_at").notNull(),
    endAt: text("end_at").notNull(),
    status: text("status").notNull().default("confirmed"),
    notes: text("notes"),
    source: text("source").notNull().default("web"),
    createdAt: text("created_at").notNull(),
    customerId: text("customer_id"),
    bonusId: text("bonus_id"),
  },
  (t) => [
    uniqueIndex("bookings_code_uidx").on(t.code),
    index("idx_bookings_plate").on(t.plateNormalized),
    index("idx_bookings_start").on(t.startAt),
    index("idx_bookings_status").on(t.status),
    index("idx_bookings_customer").on(t.customerId),
  ],
);

export const customers = pgTable(
  "customers",
  {
    id: text("id").primaryKey(),
    phone: text("phone").notNull(),
    name: text("name"),
    plateNormalized: text("plate_normalized").notNull(),
    plateDisplay: text("plate_display").notNull(),
    visitsCompleted: integer("visits_completed").notNull().default(0),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    uniqueIndex("customers_plate_uidx").on(t.plateNormalized),
    index("idx_customers_phone").on(t.phone),
  ],
);

export const bonuses = pgTable(
  "bonuses",
  {
    id: text("id").primaryKey(),
    customerId: text("customer_id").notNull(),
    type: text("type").notNull(),
    serviceId: text("service_id"),
    label: text("label").notNull(),
    status: text("status").notNull().default("available"),
    source: text("source").notNull().default("manual"),
    notes: text("notes"),
    expiresAt: text("expires_at"),
    redeemedAt: text("redeemed_at"),
    redeemedBookingId: text("redeemed_booking_id"),
    createdAt: text("created_at").notNull(),
  },
  (t) => [
    index("idx_bonuses_customer").on(t.customerId),
    index("idx_bonuses_status").on(t.status),
  ],
);

export const loyaltySettings = pgTable("loyalty_settings", {
  id: text("id").primaryKey(),
  visitsRequired: integer("visits_required").notNull().default(5),
  rewardType: text("reward_type").notNull().default("free_wash"),
  rewardServiceId: text("reward_service_id").default("express"),
  rewardLabel: text("reward_label")
    .notNull()
    .default("Spălare Express gratuită"),
  enabled: boolean("enabled").notNull().default(true),
  updatedAt: text("updated_at").notNull(),
});
