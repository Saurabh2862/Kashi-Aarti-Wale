import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { InnerHeader, SiteFooter } from "@/components/site-shell";

export const metadata: Metadata = { title: "Book a Ceremony" };

export default async function BookPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const defaults = await searchParams;
  return (
    <main className="inner-page">
      <InnerHeader />
      <section className="page-heading">
        <p className="eyebrow dark">Reserve your preferred date</p>
        <h1>Plan your sacred ceremony.</h1>
        <p>Share the essentials. Our team will confirm pandit availability, ceremony format, travel, and the exact quote.</p>
      </section>
      <section className="booking-layout">
        <div className="booking-form-shell"><BookingForm defaults={defaults} /></div>
        <aside className="booking-assurance">
          <span>What happens next</span>
          <ol>
            <li><strong>We review your date</strong><p>Our coordinator checks the right pandit team and travel plan.</p></li>
            <li><strong>You receive the plan</strong><p>We share ceremony scope, inclusions, timing, and a transparent quote.</p></li>
            <li><strong>Confirm with advance</strong><p>Your slot is locked only after you approve the plan and advance.</p></li>
          </ol>
          <div className="support-card"><strong>Need help before booking?</strong><a href="tel:+917007667996">Call +91 70076 67996</a><a href="https://wa.me/917007667996">Ask on WhatsApp</a></div>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}
