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
});
