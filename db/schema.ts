import { boolean, index, integer, jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";

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

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  active: boolean("active").notNull().default(true),
  position: integer("position").notNull().default(0),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ceremony: text("ceremony").notNull(),
  rating: integer("rating").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("draft"),
  tokenHash: text("token_hash").notNull(),
  attachmentKinds: jsonb("attachment_kinds").$type<Array<"image" | "video">>().notNull().default([]),
  consentAt: text("consent_at").notNull(),
  createdAt: text("created_at").notNull(),
}, (t) => [index("idx_reviews_status_created").on(t.status, t.createdAt)]);

export const mediaAssets = pgTable("media_assets", {
  id: text("id").primaryKey(),
  publicId: text("public_id").notNull().unique(),
  kind: text("kind").notNull(),
  purpose: text("purpose").notNull(),
  reviewId: text("review_id").references(() => reviews.id),
  status: text("status").notNull().default("reserved"),
  bytes: integer("bytes"),
  format: text("format"),
  version: integer("version"),
  createdAt: text("created_at").notNull(),
}, (t) => [index("idx_assets_review").on(t.reviewId)]);

export const galleryVideos = pgTable("gallery_videos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ceremony: text("ceremony").notNull().default("Ganga Aarti"),
  location: text("location").notNull().default(""),
  legacySrc: text("legacy_src"),
  assetId: text("asset_id").references(() => mediaAssets.id),
  coverId: text("cover_id").references(() => mediaAssets.id),
  active: boolean("active").notNull().default(false),
  position: integer("position").notNull().default(0),
});

export const submissionLimits = pgTable("submission_limits", {
  key: text("key").primaryKey(),
  used: integer("used").notNull().default(0),
  expiresAt: text("expires_at").notNull(),
});
