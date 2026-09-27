"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { readApiResponse } from "@/lib/api-response";

type TrackingResult = {
  booking: { reference: string; occasion: string; eventDate: string; city: string; status: string };
  history: Array<{ id: number; status: string; note: string | null; createdAt: string }>;
};

const labels: Record<string, string> = {
  AWAITING_REVIEW: "Awaiting review", QUOTE_SENT: "Quote sent", ADVANCE_PENDING: "Advance pending",
  CONFIRMED: "Confirmed", TEAM_ASSIGNED: "Team assigned", COMPLETED: "Completed", CANCELLED: "Cancelled",
};

export function TrackingForm({ defaultReference = "" }: { defaultReference?: string }) {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError(""); setResult(null);
    const data = new FormData(event.currentTarget);
    const query = new URLSearchParams({ reference: String(data.get("reference") || ""), phone: String(data.get("phone") || "") });
    try {
      const response = await fetch(`/api/bookings/track?${query}`);
      const payload = await readApiResponse<TrackingResult>(response);
      if (!payload.booking || !Array.isArray(payload.history)) throw new Error("The booking response is incomplete. Please try again.");
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to track this booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="tracking-form" onSubmit={onSubmit}>
        <label>Booking reference<input name="reference" defaultValue={defaultReference} placeholder="KAW-260926-ABC123" required /></label>
        <label>Phone used for booking<input name="phone" type="tel" placeholder="10-digit mobile number" required /></label>
        <button disabled={loading}><Search size={17} /> {loading ? "Checking..." : "Track booking"}</button>
      </form>
      {error && <p className="form-error track-error" role="alert">{error}</p>}
      {result && (
        <section className="tracking-result">
          <div className="status-summary">
            <span>Current status</span><strong>{labels[result.booking.status] || result.booking.status}</strong>
            <p>{result.booking.occasion} · {result.booking.city} · {new Date(result.booking.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="status-timeline">
            {result.history.map((item) => <div key={item.id}><i /><div><strong>{labels[item.status] || item.status}</strong><p>{item.note || "Booking status updated"}</p><time>{new Date(item.createdAt).toLocaleString("en-IN")}</time></div></div>)}
          </div>
        </section>
      )}
    </div>
  );
}
