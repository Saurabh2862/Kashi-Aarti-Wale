import { NextResponse } from "next/server";
import { findBooking } from "@/lib/bookings";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference")?.trim().toUpperCase() || "";
    const phone = searchParams.get("phone")?.trim() || "";

    if (!reference || phone.length < 10) {
      return NextResponse.json({ error: "Enter your booking reference and phone number." }, { status: 400 });
    }

    const result = await findBooking(reference, phone);
    if (!result) return NextResponse.json({ error: "No matching booking was found." }, { status: 404 });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Booking lookup failed", error);
    return NextResponse.json({ error: "Tracking is temporarily unavailable." }, { status: 503 });
  }
}
