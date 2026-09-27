import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking } from "@/lib/bookings";

const bookingSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(16).regex(/^[+0-9\s-]+$/),
  email: z.string().trim().email().optional().or(z.literal("")),
  occasion: z.string().trim().min(2).max(100),
  eventDate: z.string().date(),
  city: z.string().trim().min(2).max(100),
  pincode: z.string().trim().regex(/^[0-9]{6}$/),
  venue: z.string().trim().max(240).optional(),
  guestCount: z.number().int().positive().max(100000).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = bookingSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the required booking details." }, { status: 400 });
    }

    const booking = await createBooking(parsed.data);
    return NextResponse.json({ reference: booking.reference, status: booking.status }, { status: 201 });
  } catch (error) {
    console.error("Booking creation failed", error);
    return NextResponse.json({ error: "Booking service is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
