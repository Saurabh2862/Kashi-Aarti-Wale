import { and, eq, or } from "drizzle-orm";
import { getDb } from "@/db";
import { galleryVideos, mediaAssets, reviews } from "@/db/schema";
import { getAdminSession } from "@/lib/admin-auth";
import { apiError, HttpError } from "@/lib/api-guard";
import { signedMediaUrl } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const [asset] = await getDb().select().from(mediaAssets).where(and(eq(mediaAssets.id, id), eq(mediaAssets.status, "ready")));
    if (!asset) throw new HttpError(404, "Media not found.");
    let visible = false;
    if (asset.reviewId) {
      const [review] = await getDb().select({ status: reviews.status }).from(reviews).where(eq(reviews.id, asset.reviewId));
      visible = review?.status === "approved";
    } else {
      const [video] = await getDb().select({ id: galleryVideos.id }).from(galleryVideos).where(and(eq(galleryVideos.active, true), or(eq(galleryVideos.assetId, id), eq(galleryVideos.coverId, id))));
      visible = Boolean(video);
    }
    if (!visible && !await getAdminSession()) throw new HttpError(404, "Media not found.");
    return new Response(null, { status: 302, headers: { Location: signedMediaUrl(asset), "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex" } });
  } catch (e) { return apiError(e); }
}
