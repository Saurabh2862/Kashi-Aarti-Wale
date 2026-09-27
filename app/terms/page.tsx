import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy-layout";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <PolicyLayout title="Terms & Conditions">
    <p>These terms describe the enquiry and booking process for Ganga Aarti, Rudrabhishek, Puja Path, and other ceremonies arranged through Kashi Aarti Wale.</p>
    <section><h2>Enquiries and confirmation</h2><p>Submitting a form creates an enquiry, not a confirmed reservation. The team must check availability and agree the ceremony plan with you. Your booking is confirmed only when you receive explicit confirmation after the agreed requirements are met.</p></section>
    <section><h2>Ceremony scope and pricing</h2><p>Your quote should specify the rituals, date, venue, team, samagri, travel, setup, and any additional services. Only agreed items are included. Please confirm the total price and any advance-payment requirements before paying.</p></section>
    <section><h2>Changes, cancellations, and refunds</h2><p>Contact us as soon as your plans change. Availability, travel arrangements, and preparation may affect changes. Ask for the cancellation, rescheduling, and refund terms applicable to your quote in writing before confirming or paying. This website does not promise an automatic refund or a fixed refund percentage.</p></section>
    <section><h2>Venue and safety</h2><p>Share accurate venue details and obtain any permissions needed for flame, incense, sound, and gatherings. The setup and timing must allow for safe access and appropriate precautions. Discuss indoor restrictions, weather, and guest needs with the team before the event.</p></section>
    <section><h2>Rituals and personal expectations</h2><p>Ceremonies are religious services performed with care. Practices may vary by family tradition and agreed format. We do not promise specific health, financial, or other personal outcomes from a ritual.</p></section>
    <section><h2>Website use and photographs</h2><p>Provide accurate contact and event information. Do not misuse the forms or attempt to access bookings belonging to someone else. Website photographs are presented to show our ceremony work; ask permission before reusing them. Any photography of your event or permission to publish it should be agreed separately.</p></section>
  </PolicyLayout>;
}
