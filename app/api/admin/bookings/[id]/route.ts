import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession, isSameOrigin } from "@/lib/admin-auth";
import { BOOKING_STATUSES, updateBookingStatus } from "@/lib/bookings";

const updateSchema = z.object({ status: z.enum(BOOKING_STATUSES) });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Request rejected" }, { status: 403 });
  if (!await getAdminSession()) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id } = await context.params;
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }

  const booking = await updateBookingStatus(numericId, parsed.data.status, "owner");
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ booking });
}
