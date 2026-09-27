import { index, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    customerName: text("customer_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    occasion: text("occasion").notNull(),
    eventDate: text("event_date").notNull(),
    city: text("city").notNull(),
    pincode: text("pincode").notNull(),
    venue: text("venue"),
    guestCount: integer("guest_count"),
    notes: text("notes"),
    status: text("status").notNull().default("AWAITING_REVIEW"),
    quoteAmount: integer("quote_amount"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("idx_bookings_phone_reference").on(table.phone, table.reference),
    index("idx_bookings_status_created_at").on(table.status, table.createdAt),
    index("idx_bookings_event_date").on(table.eventDate),
  ],
);

export const bookingStatusHistory = pgTable(
  "booking_status_history",
  {
    id: serial("id").primaryKey(),
    bookingId: integer("booking_id").notNull().references(() => bookings.id),
    status: text("status").notNull(),
    note: text("note"),
    changedBy: text("changed_by").notNull().default("system"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("idx_booking_history_booking_id").on(table.bookingId)],
);

export const adminLoginAttempts = pgTable("admin_login_attempts", {
  key: text("key").primaryKey(),
  failedCount: integer("failed_count").notNull().default(0),
  lockedUntil: text("locked_until"),
  updatedAt: text("updated_at").notNull(),
});
