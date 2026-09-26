import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck, IndianRupee, LogOut, Users } from "lucide-react";
import { AdminBookings } from "@/components/admin-bookings";
import { getAdminSession } from "@/lib/admin-auth";
import { listBookings } from "@/lib/bookings";

export const metadata: Metadata = { title: "Owner Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!await getAdminSession()) redirect("/admin/login");
  let bookings: Awaited<ReturnType<typeof listBookings>> = [];
  let unavailable = false;
  try { bookings = await listBookings(); } catch (error) { console.error("Admin bookings unavailable", error); unavailable = true; }
  const confirmed = bookings.filter((item) => ["CONFIRMED", "TEAM_ASSIGNED"].includes(item.status)).length;
  const pending = bookings.filter((item) => ["AWAITING_REVIEW", "QUOTE_SENT", "ADVANCE_PENDING"].includes(item.status)).length;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link href="/" className="admin-brand">Kashi Aarti Wale <span>Owner desk</span></Link>
        <div><span>Owner</span><form action="/api/admin/logout" method="post"><button type="submit"><LogOut size={16} /> Sign out</button></form></div>
      </header>
      <section className="admin-content">
        <div className="admin-title"><div><p>Booking operations</p><h1>Good evening.</h1></div><Link href="/book">Open customer form</Link></div>
        <div className="metric-grid">
          <article><Users /><span>All requests</span><strong>{bookings.length}</strong></article>
          <article><CalendarCheck /><span>Pending action</span><strong>{pending}</strong></article>
          <article><IndianRupee /><span>Confirmed</span><strong>{confirmed}</strong></article>
        </div>
        <section className="admin-list"><div className="admin-list-heading"><div><h2>Recent bookings</h2><p>Update status as each request moves through your workflow.</p></div></div>{unavailable ? <div className="admin-empty"><strong>Booking database is unavailable.</strong><p>Try again shortly.</p></div> : <AdminBookings initialBookings={bookings} />}</section>
      </section>
    </main>
  );
}
