import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
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
});

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  name: text("name"),
  plateNormalized: text("plate_normalized").notNull(),
  plateDisplay: text("plate_display").notNull(),
  visitsCompleted: integer("visits_completed").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const bonuses = sqliteTable("bonuses", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull(),
  type: text("type").notNull(), // free_wash | free_service | custom
  serviceId: text("service_id"), // express|complet|detail or null = any
  label: text("label").notNull(),
  status: text("status").notNull().default("available"), // available|redeemed|expired|cancelled
  source: text("source").notNull().default("manual"), // manual|loyalty|promo
  notes: text("notes"),
  expiresAt: text("expires_at"),
  redeemedAt: text("redeemed_at"),
  redeemedBookingId: text("redeemed_booking_id"),
  createdAt: text("created_at").notNull(),
});

export const loyaltySettings = sqliteTable("loyalty_settings", {
  id: text("id").primaryKey(), // always "default"
  visitsRequired: integer("visits_required").notNull().default(5),
  rewardType: text("reward_type").notNull().default("free_wash"),
  rewardServiceId: text("reward_service_id").default("express"),
  rewardLabel: text("reward_label").notNull().default("Spălare Express gratuită"),
  enabled: integer("enabled").notNull().default(1),
  updatedAt: text("updated_at").notNull(),
});
