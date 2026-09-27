import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { galleryVideos, mediaAssets, reviews, services } from "@/db/schema";
import type { GalleryVideo, Review } from "@/lib/content-types";

export async function getServices(includeDisabled = false) {
  return getDb().select().from(services).where(includeDisabled ? undefined : eq(services.active, true)).orderBy(asc(services.position), asc(services.id));
}

export async function getGallery(includeHidden = false): Promise<GalleryVideo[]> {
  const rows = await getDb().select().from(galleryVideos).where(includeHidden ? undefined : eq(galleryVideos.active, true)).orderBy(asc(galleryVideos.position), asc(galleryVideos.id));
  return rows.map(({ legacySrc, ...row }) => ({ ...row, src: row.assetId ? `/api/media/${row.assetId}` : legacySrc || "", poster: row.coverId ? `/api/media/${row.coverId}` : undefined }));
}

export async function getReviews(includePending = false): Promise<Review[]> {
  const rows = await getDb().select({ id: reviews.id, name: reviews.name, ceremony: reviews.ceremony, rating: reviews.rating, message: reviews.message, status: reviews.status, createdAt: reviews.createdAt }).from(reviews)
    .where(includePending ? inArray(reviews.status, ["pending", "approved", "rejected", "hidden"]) : eq(reviews.status, "approved"))
    .orderBy(desc(reviews.createdAt)).limit(includePending ? 200 : 50);
  const assets = rows.length ? await getDb().select({ id: mediaAssets.id, reviewId: mediaAssets.reviewId, kind: mediaAssets.kind }).from(mediaAssets)
    .where(and(inArray(mediaAssets.reviewId, rows.map(r => r.id)), eq(mediaAssets.status, "ready"))) : [];
  return rows.map(row => ({ ...row, attachments: assets.filter(a => a.reviewId === row.id).map(a => ({ id: a.id, kind: a.kind, url: `/api/media/${a.id}` })) }));
}

export async function reviewSummary() {
  const [row] = await getDb().select({ count: sql<number>`count(*)::int`, average: sql<string>`coalesce(round(avg(${reviews.rating}), 1), 0)::text` }).from(reviews).where(eq(reviews.status, "approved"));
  return row;
}
