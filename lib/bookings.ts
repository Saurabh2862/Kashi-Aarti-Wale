import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bookings, bookingStatusHistory } from "@/db/schema";

export const BOOKING_STATUSES = [
  "AWAITING_REVIEW",
  "QUOTE_SENT",
  "ADVANCE_PENDING",
  "CONFIRMED",
  "TEAM_ASSIGNED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export async function createBooking(input: {
  customerName: string;
  phone: string;
  email?: string;
  occasion: string;
  eventDate: string;
  city: string;
  pincode: string;
  venue?: string;
  guestCount?: number;
  notes?: string;
}) {
  const db = getDb();
  const now = new Date().toISOString();
  const reference = createReference();

  const [booking] = await db
    .insert(bookings)
    .values({ ...input, reference, status: "AWAITING_REVIEW", createdAt: now, updatedAt: now })
    .returning();

  await db.insert(bookingStatusHistory).values({
    bookingId: booking.id,
    status: "AWAITING_REVIEW",
    note: "Booking request received",
    changedBy: "customer",
    createdAt: now,
  });

  return booking;
}

export async function findBooking(reference: string, phone: string) {
  const db = getDb();
  const [booking] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.reference, reference), eq(bookings.phone, phone)))
    .limit(1);

  if (!booking) return null;

  const history = await db
    .select()
    .from(bookingStatusHistory)
    .where(eq(bookingStatusHistory.bookingId, booking.id))
    .orderBy(desc(bookingStatusHistory.createdAt));

  return { booking, history };
}

export async function listBookings() {
  return getDb().select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function updateBookingStatus(id: number, status: BookingStatus, changedBy: string) {
  const db = getDb();
  const now = new Date().toISOString();

  const [booking] = await db
    .update(bookings)
    .set({ status, updatedAt: now })
    .where(eq(bookings.id, id))
    .returning();

  if (!booking) return null;

  await db.insert(bookingStatusHistory).values({
    bookingId: id,
    status,
    changedBy,
    createdAt: now,
  });

  return booking;
}

function createReference() {
  const date = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const suffix = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `KAW-${date}-${suffix}`;
}
