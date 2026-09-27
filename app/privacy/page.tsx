import type { Metadata } from "next";
import { PolicyLayout } from "@/components/policy-layout";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <PolicyLayout title="Privacy Policy">
    <p>This notice explains how Kashi Aarti Wale handles information submitted through this website and during booking enquiries.</p>
    <section><h2>Information you provide</h2><p>Our booking form asks for your name, phone number, ceremony, date, city, and pincode. You may also provide an email address, venue, guest count, and special requests. Please do not include identity documents, bank details, or other sensitive information in the notes field.</p></section>
    <section><h2>How we use it</h2><p>We use these details to respond to your enquiry, check availability, prepare a quote, coordinate your ceremony, and provide booking updates. The booking reference and phone number let you retrieve your booking status. Keep them private.</p></section>
    <section><h2>Storage and service providers</h2><p>The website is hosted on Vercel and booking records are stored in Neon PostgreSQL. These providers process information as part of running the service. Booking details needed to arrange your ceremony may also be shared with the people coordinating or performing it.</p></section>
    <section><h2>Cookies and technical information</h2><p>The owner dashboard uses a session cookie for authentication. Login attempts are recorded for security using a hashed network-address identifier. Hosting providers may process technical request information to operate and protect the website.</p></section>
    <section><h2>Reviews and attachments</h2><p>If you submit a review, we store your display name, ceremony, rating, message, publication consent, and any enabled attachments. Reviews are private until approved. Approved reviews appear publicly with your display name. Do not include private contact details, and obtain permission from anyone identifiable in an attachment. Uploads, when enabled, are stored in Cloudinary; the owner can moderate and remove them. Submission limits use a hashed network identifier to reduce abuse.</p></section>
    <section><h2>External links</h2><p>WhatsApp and Instagram links take you to services with their own privacy policies. Information you share on those platforms is also handled under their policies.</p></section>
    <section><h2>Retention and your requests</h2><p>Booking information is retained for coordination, customer support, and applicable record-keeping needs. Contact us to ask about your information or request a correction or deletion. We may need to verify the request and retain information needed for an unresolved booking or applicable obligations.</p></section>
  </PolicyLayout>;
}
