import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";
import { getAdminSession } from "@/lib/admin-auth";
import { getGallery, getReviews, getServices } from "@/lib/content";
import { cloudinaryReady } from "@/lib/cloudinary";
import { AdminContent } from "@/components/admin-content";

export const metadata: Metadata = { title: "Manage Website" };
export const dynamic = "force-dynamic";
export default async function ManagePage() {
  if (!await getAdminSession()) redirect("/admin/login");
  let content;
  try {
    const services = await getServices(true), videos = await getGallery(true), reviews = await getReviews(true);
    const assets = await getDb().select({ id: mediaAssets.id, purpose: mediaAssets.purpose, kind: mediaAssets.kind, status: mediaAssets.status, bytes: mediaAssets.bytes, createdAt: mediaAssets.createdAt }).from(mediaAssets).where(ne(mediaAssets.status, "deleted")).orderBy(desc(mediaAssets.createdAt)).limit(100);
    content = <AdminContent services={services} videos={videos} reviews={reviews} assets={assets} uploadsEnabled={cloudinaryReady()} />;
  } catch { content = <div className="content-empty">Website management is temporarily unavailable. Please try again shortly.</div>; }
  return <main className="admin-page"><header className="admin-header"><Link className="admin-brand" href="/admin">Kashi Aarti Wale <span>Owner desk</span></Link><div><Link href="/admin">Bookings</Link><Link href="/">View website</Link><form method="post" action="/api/admin/logout"><button>Sign out</button></form></div></header><section className="admin-content"><div className="admin-title"><div><p>Website management</p><h1>Your services, stories, and reviews.</h1></div></div>{content}</section></main>;
}
