import { randomBytes, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaAssets, reviews } from "@/db/schema";
import { apiError, HttpError, jsonBody, requireOrigin } from "@/lib/api-guard";
import { consumeLimit, visitorKey } from "@/lib/submission-limits";
import { hashToken, newReviewChallenge, requireReviewDraft, verifyReviewChallenge } from "@/lib/review-security";
import { cloudinaryReady } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ challenge: newReviewChallenge(), uploadsEnabled: cloudinaryReady() }, { headers: { "Cache-Control": "no-store" } }); } catch (e) { return apiError(e); }
}
const schema = z.object({ name: z.string().trim().min(2).max(80), ceremony: z.string().trim().min(2).max(100), rating: z.number().int().min(1).max(5), message: z.string().trim().min(15).max(1500), consent: z.literal(true), challenge: z.string().max(250), website: z.string().max(0), attachments: z.array(z.enum(["image", "video"])).max(2) });
export async function POST(request: Request) {
  try {
    requireOrigin(request);
    const body = await jsonBody(request);
    if (body.action === "finish") {
      const input = z.object({ id: z.string().uuid(), token: z.string().min(40).max(100) }).safeParse(body);
      if (!input.success) throw new HttpError(400, "Invalid review session.");
      const review = await requireReviewDraft(input.data.id, input.data.token);
      const assets = await getDb().select().from(mediaAssets).where(and(eq(mediaAssets.reviewId, review.id), eq(mediaAssets.status, "ready")));
      if (assets.length !== review.attachmentKinds.length) throw new HttpError(400, "Finish uploading your attachments before submitting.");
      await getDb().update(reviews).set({ status: "pending" }).where(and(eq(reviews.id, review.id), eq(reviews.status, "draft")));
      return NextResponse.json({ ok: true, message: "Your review is awaiting approval. Thank you." });
    }
    const result = schema.safeParse(body);
    if (!result.success) throw new HttpError(400, "Enter your name, ceremony, rating, message, and permission to publish.");
    const input = result.data;
    if (input.attachments.includes("video") && input.attachments.length !== 1) throw new HttpError(400, "Choose up to two photos OR one video, not both.");
    if (input.attachments.length && !cloudinaryReady()) throw new HttpError(503, "Attachments are temporarily unavailable. You can submit a text review.");
    verifyReviewChallenge(input.challenge);
    await consumeLimit(`review:${visitorKey(request)}`, 3);
    await consumeLimit(`challenge:${hashToken(input.challenge)}`, 1);
    await consumeLimit("reviews-global", 40);
    const id = randomUUID(), token = randomBytes(32).toString("hex"), now = new Date().toISOString();
    await getDb().insert(reviews).values({ id, name: input.name, ceremony: input.ceremony, rating: input.rating, message: input.message, tokenHash: hashToken(token), attachmentKinds: input.attachments, consentAt: now, createdAt: now });
    return NextResponse.json({ id, token }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (e) { return apiError(e); }
}
