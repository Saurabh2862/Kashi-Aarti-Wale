"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { readApiResponse } from "@/lib/api-response";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

type BookingPayload = {
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
};

type ModelContext = {
  registerTool?: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: Record<string, unknown>;
      annotations: Record<string, boolean>;
      execute: (input: BookingPayload) => Promise<{ reference: string; status: string }>;
    },
    options: { signal: AbortSignal },
  ) => unknown;
};

export function BookingForm({ defaults }: { defaults?: Record<string, string | undefined> }) {
  const occasions: Record<string, string> = {
    wedding: "Wedding Ganga Aarti", "Wedding Aarti": "Wedding Ganga Aarti",
    namkaran: "Namkaran / Mundan", "Namkaran & Mundan": "Namkaran / Mundan",
    "griha-pravesh": "Griha Pravesh", "Griha Pravesh": "Griha Pravesh",
    anniversary: "Anniversary", "Anniversary Aarti": "Anniversary",
    "durga-puja": "Durga Puja", "Durga Puja Aarti": "Durga Puja",
    other: "Other occasion", "Community & Corporate": "Other occasion",
  };
  const selectedOccasion = occasions[defaults?.occasion || ""] || defaults?.occasion || "";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  async function submitBooking(payload: BookingPayload) {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await readApiResponse<{ reference?: string; error?: string }>(response);
    if (!response.ok || !data.reference) throw new Error(data.error || "Unable to create booking");
    setReference(data.reference);
    return { reference: data.reference, status: "AWAITING_REVIEW" };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    try {
      await submitBooking({
        customerName: String(data.get("customerName") || ""),
        phone: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        occasion: String(data.get("occasion") || ""),
        eventDate: String(data.get("eventDate") || ""),
        city: String(data.get("city") || ""),
        pincode: String(data.get("pincode") || ""),
        venue: String(data.get("venue") || ""),
        guestCount: Number(data.get("guestCount") || 0) || undefined,
        notes: String(data.get("notes") || ""),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "create_ganga_aarti_booking",
      title: "Create Ganga Aarti booking request",
      description: "Submit a new Kashi Aarti Wale booking request using customer, occasion, date, and location details.",
      inputSchema: {
        type: "object",
        properties: {
          customerName: { type: "string" }, phone: { type: "string" }, email: { type: "string" },
          occasion: { type: "string" }, eventDate: { type: "string" }, city: { type: "string" },
          pincode: { type: "string" }, venue: { type: "string" }, guestCount: { type: "number" }, notes: { type: "string" },
        },
        required: ["customerName", "phone", "occasion", "eventDate", "city", "pincode"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input: BookingPayload) => submitBooking(input),
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  if (reference) {
    return (
      <div className="booking-success" role="status">
        <CheckCircle2 size={42} />
        <p className="form-kicker">Request received</p>
        <h2>Your booking reference is<br /><strong>{reference}</strong></h2>
        <p>Our team will review your date and location, then contact you with the ceremony plan and quote.</p>
        <div className="success-actions">
          <Link href={`/track?reference=${encodeURIComponent(reference)}`}>Track booking <ArrowRight size={16} /></Link>
          <a href={`https://wa.me/917007667996?text=${encodeURIComponent(`Namaste, my booking reference is ${reference}.`)}`}>Continue on WhatsApp</a>
        </div>
      </div>
    );
  }

  return (
    <form className="full-booking-form" onSubmit={handleSubmit}>
      <div className="form-section-heading"><span>01</span><div><strong>Ceremony details</strong><p>Tell us what you are planning.</p></div></div>
      <div className="booking-fields two-columns">
        <label>Occasion<select name="occasion" defaultValue={selectedOccasion} required><option value="" disabled>Select ceremony</option><option>Wedding Ganga Aarti</option><option>Namkaran / Mundan</option><option>Griha Pravesh</option><option>Anniversary</option><option>Durga Puja</option><option>Other occasion</option></select></label>
        <label>Event date<input name="eventDate" type="date" defaultValue={defaults?.date} required /></label>
        <label>City<input name="city" defaultValue={defaults?.location?.replace(/\d/g, "").trim()} placeholder="City" required /></label>
        <label>Pincode<input name="pincode" inputMode="numeric" defaultValue={defaults?.location?.match(/\d{6}/)?.[0]} placeholder="6-digit pincode" pattern="[0-9]{6}" required /></label>
        <label className="wide">Venue / locality<input name="venue" placeholder="Home, banquet, temple, or venue address" /></label>
        <label>Expected guests<input name="guestCount" type="number" min="1" placeholder="Approximate count" /></label>
      </div>

      <div className="form-section-heading"><span>02</span><div><strong>Your details</strong><p>We use these only for booking coordination.</p></div></div>
      <div className="booking-fields two-columns">
        <label>Full name<input name="customerName" autoComplete="name" required /></label>
        <label>Phone number<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" required /></label>
        <label className="wide">Email (optional)<input name="email" type="email" autoComplete="email" /></label>
        <label className="wide">Special requests<textarea name="notes" rows={4} placeholder="Family customs, preferred timing, media requirements, or anything else" /></label>
      </div>

      {error && <div className="form-error" role="alert"><p>{error}</p><a href="https://wa.me/917007667996" target="_blank" rel="noopener noreferrer">Contact our team on WhatsApp</a></div>}
      <button className="booking-submit" type="submit" disabled={submitting}>
        {submitting ? <><LoaderCircle className="spin" size={18} /> Saving your request</> : <>Submit booking request <ArrowRight size={18} /></>}
      </button>
      <p className="form-privacy">Submitting this form does not require payment and does not confirm a booking. We verify availability first.</p>
    </form>
  );
}
