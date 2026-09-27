import { randomUUID } from "node:crypto";
import { and, eq, inArray, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { galleryVideos, mediaAssets, reviews, services } from "@/db/schema";
import { apiError, HttpError, jsonBody, requireOwner } from "@/lib/api-guard";
import { SERVICE_CATEGORIES } from "@/lib/content-types";
import { cloud } from "@/lib/cloudinary";

const serviceSchema = z.object({ id: z.number().int().positive().optional(), name: z.string().trim().min(2).max(80), description: z.string().trim().min(15).max(500), category: z.enum(SERVICE_CATEGORIES), active: z.boolean(), position: z.number().int().min(0).max(999) });
const gallerySchema = z.object({ id: z.string().max(100).optional(), title: z.string().trim().min(3).max(100), description: z.string().trim().min(5).max(500), ceremony: z.string().trim().min(2).max(100), location: z.string().trim().max(120), assetId: z.string().max(100).nullable(), coverId: z.string().max(100).nullable(), active: z.boolean(), position: z.number().int().min(0).max(999) });

async function deleteAsset(id: string) {
  const [asset] = await getDb().select().from(mediaAssets).where(eq(mediaAssets.id, id));
  if (!asset || asset.status === "deleted") return;
  await cloud().uploader.destroy(asset.publicId, { resource_type: asset.kind, type: "authenticated", invalidate: true });
  await getDb().batch([
    getDb().update(mediaAssets).set({ status: "deleted" }).where(eq(mediaAssets.id, id)),
    getDb().update(galleryVideos).set({ active: false }).where(or(eq(galleryVideos.assetId, id), eq(galleryVideos.coverId, id))),
  ]);
}

export async function POST(request: Request) {
  try {
    await requireOwner(request);
    const body = await jsonBody(request);
    if (body.entity === "service") {
      const parsed = serviceSchema.safeParse(body);
      if (!parsed.success) throw new HttpError(400, "Check the service name, description, category, and order.");
      const { id, ...values } = parsed.data;
      if (id) {
        const updated = await getDb().update(services).set(values).where(eq(services.id, id)).returning();
        if (!updated.length) throw new HttpError(404, "Service not found.");
      } else {
        const slug = `${values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "ceremony"}-${randomUUID().slice(0, 8)}`;
        await getDb().insert(services).values({ ...values, slug });
      }
    } else if (body.entity === "gallery") {
      if (body.action === "delete") {
        const parsed = z.object({ id: z.string().min(1).max(100) }).safeParse(body);
        if (!parsed.success) throw new HttpError(400, "Invalid video.");
        const [video] = await getDb().select().from(galleryVideos).where(eq(galleryVideos.id, parsed.data.id));
        if (!video) throw new HttpError(404, "Video not found.");
        await getDb().update(galleryVideos).set({ active: false }).where(eq(galleryVideos.id, video.id));
        if (video.assetId) await deleteAsset(video.assetId);
        if (video.coverId) await deleteAsset(video.coverId);
        await getDb().delete(galleryVideos).where(eq(galleryVideos.id, video.id));
      } else {
        const parsed = gallerySchema.safeParse(body);
        if (!parsed.success) throw new HttpError(400, "Check the video title, description, ceremony, and order.");
        const { id, ...values } = parsed.data;
        const [existing] = id ? await getDb().select().from(galleryVideos).where(eq(galleryVideos.id, id)) : [];
        if (id && !existing) throw new HttpError(404, "Video not found.");
        if (!values.assetId && !existing?.legacySrc) throw new HttpError(400, "Upload a video before saving.");
        for (const [assetId, kind, purpose] of [[values.assetId, "video", "gallery"], [values.coverId, "image", "cover"]]) {
          if (!assetId) continue;
          const [asset] = await getDb().select().from(mediaAssets).where(and(eq(mediaAssets.id, assetId), eq(mediaAssets.kind, kind!), eq(mediaAssets.purpose, purpose!), eq(mediaAssets.status, "ready")));
          if (!asset) throw new HttpError(400, "This media upload is unavailable or not ready.");
          const used = await getDb().select({ id: galleryVideos.id }).from(galleryVideos).where(or(eq(galleryVideos.assetId, assetId), eq(galleryVideos.coverId, assetId)));
          if (used.some(row => row.id !== id)) throw new HttpError(400, "This upload already belongs to another gallery item.");
        }
        if (id) await getDb().update(galleryVideos).set(values).where(eq(galleryVideos.id, id));
        else await getDb().insert(galleryVideos).values({ ...values, id: randomUUID() });
      }
    } else if (body.entity === "review") {
      const parsed = z.object({ id: z.string().uuid(), status: z.enum(["approved", "rejected", "hidden"]) }).safeParse(body);
      if (!parsed.success) throw new HttpError(400, "Invalid moderation action.");
      const rows = await getDb().update(reviews).set({ status: parsed.data.status }).where(and(eq(reviews.id, parsed.data.id), inArray(reviews.status, ["pending", "approved", "rejected", "hidden"]))).returning({ id: reviews.id });
      if (!rows.length) throw new HttpError(404, "Submitted review not found.");
    } else if (body.entity === "asset" && body.action === "delete") {
      const parsed = z.object({ id: z.string().min(10).max(100) }).safeParse(body);
      if (!parsed.success) throw new HttpError(400, "Invalid attachment.");
      await deleteAsset(parsed.data.id);
    } else throw new HttpError(400, "Unknown action.");
    for (const path of ["/", "/book", "/reviews", "/admin/manage"]) revalidatePath(path);
    return NextResponse.json({ ok: true });
  } catch (e) { return apiError(e); }
}
