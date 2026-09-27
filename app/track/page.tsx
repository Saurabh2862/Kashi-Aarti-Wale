import type { Metadata } from "next";
import { InnerHeader, SiteFooter } from "@/components/site-shell";
import { TrackingForm } from "@/components/tracking-form";

export const metadata: Metadata = { title: "Track Booking", robots: { index: false, follow: false } };

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference } = await searchParams;
  return (
    <main className="inner-page">
      <InnerHeader />
      <section className="page-heading compact">
        <p className="eyebrow dark">Booking support</p>
        <h1>Track your ceremony.</h1>
        <p>Use the booking reference and phone number from your request to see the latest status.</p>
      </section>
      <section className="tracking-shell"><TrackingForm defaultReference={reference} /></section>
      <SiteFooter />
    </main>
  );
}
