import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";
import { apiError, HttpError, jsonBody, requireOrigin, requireOwner } from "@/lib/api-guard";
import { cloud, uploadPolicy, uploadSignature } from "@/lib/cloudinary";
import { requireReviewDraft } from "@/lib/review-security";
import { consumeLimit, visitorKey } from "@/lib/submission-limits";

const prepareSchema = z.object({ action: z.literal("prepare"), purpose: z.enum(["gallery", "cover", "review"]), kind: z.enum(["image", "video"]), reviewId: z.string().uuid().optional(), token: z.string().max(100).optional(), slot: z.number().int().min(0).max(1).optional() });
export async function POST(request: Request) {
  try {
    requireOrigin(request);
    const body = await jsonBody(request);
    if (body.action === "complete") {
      const data = z.object({ id: z.string().min(10).max(100), token: z.string().max(100).optional() }).safeParse(body);
      if (!data.success) throw new HttpError(400, "Invalid upload.");
      const [asset] = await getDb().select().from(mediaAssets).where(eq(mediaAssets.id, data.data.id));
      if (!asset || asset.status === "deleted") throw new HttpError(404, "Upload not found.");
      if (asset.reviewId) await requireReviewDraft(asset.reviewId, data.data.token || ""); else await requireOwner(request);
      if (asset.status === "ready") return NextResponse.json({ id: asset.id });
      // Fetch trusted metadata from Cloudinary, never trust a browser-supplied URL or size.
      const remote = await cloud().api.resource(asset.publicId, { resource_type: asset.kind, type: "authenticated" });
      const limit = uploadPolicy(asset.purpose, asset.kind);
      const formats = asset.kind === "image" ? ["jpg", "jpeg", "png", "webp"] : ["mp4", "webm"];
      if (!formats.includes(remote.format) || remote.bytes > limit.bytes || (asset.kind === "video" && (!Number.isFinite(remote.duration) || remote.duration > limit.duration + .5))) {
        await cloud().uploader.destroy(asset.publicId, { resource_type: asset.kind, type: "authenticated", invalidate: true });
        await getDb().update(mediaAssets).set({ status: "deleted" }).where(eq(mediaAssets.id, asset.id));
        throw new HttpError(400, `The uploaded file exceeds the allowed format, size, or ${limit.duration}-second video limit. Start again with a smaller file.`);
      }
      await getDb().update(mediaAssets).set({ status: "ready", bytes: remote.bytes, format: remote.format, version: remote.version }).where(and(eq(mediaAssets.id, asset.id), eq(mediaAssets.status, "reserved")));
      return NextResponse.json({ id: asset.id });
    }
    const parsed = prepareSchema.safeParse(body);
    if (!parsed.success) throw new HttpError(400, "Invalid upload request.");
    const input = parsed.data;
    cloud();
    let id = randomUUID() as string;
    if (input.purpose === "review") {
      const review = await requireReviewDraft(input.reviewId || "", input.token || "");
      if (input.slot === undefined || review.attachmentKinds[input.slot] !== input.kind) throw new HttpError(400, "This attachment is not part of your review.");
      id = `${review.id}-${input.slot}`;
    } else {
      await requireOwner(request);
      if ((input.purpose === "gallery" && input.kind !== "video") || (input.purpose === "cover" && input.kind !== "image")) throw new HttpError(400, "Choose the correct media type.");
    }
    let [asset] = await getDb().select().from(mediaAssets).where(eq(mediaAssets.id, id));
    if (!asset) {
      await consumeLimit(`upload:${visitorKey(request)}`, input.purpose === "review" ? 6 : 30);
      await consumeLimit("upload-bytes-global", 160 * 1024 * 1024, uploadPolicy(input.purpose, input.kind).bytes);
      await getDb().insert(mediaAssets).values({ id, publicId: `kashi-aarti/${id}`, purpose: input.purpose, kind: input.kind, reviewId: input.purpose === "review" ? input.reviewId : null, createdAt: new Date().toISOString() }).onConflictDoNothing();
      [asset] = await getDb().select().from(mediaAssets).where(eq(mediaAssets.id, id));
    }
    if (asset.status === "deleted") throw new HttpError(400, "Upload was removed. Start a new submission.");
    return NextResponse.json({ id, ...uploadSignature(asset) }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) { return apiError(e); }
}
