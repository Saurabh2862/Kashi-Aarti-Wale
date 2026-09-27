import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { reviews } from "@/db/schema";
import { HttpError } from "@/lib/api-guard";

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
function sign(value: string) {
  if (!process.env.ADMIN_SESSION_SECRET) throw new HttpError(503, "Security configuration is unavailable.");
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(value).digest("hex");
}
export function newReviewChallenge() {
  const value = `${Date.now()}.${randomBytes(16).toString("hex")}`;
  return `${value}.${sign(value)}`;
}
export function verifyReviewChallenge(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new HttpError(400, "Refresh the review form and try again.");
  const expected = sign(`${parts[0]}.${parts[1]}`);
  const actual = parts[2];
  if (actual.length !== expected.length || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) throw new HttpError(400, "Invalid form session.");
  const age = Date.now() - Number(parts[0]);
  if (!Number.isFinite(age) || age < 3000 || age > 3600000) throw new HttpError(400, "Please take a moment to complete the form, or refresh it if it has expired.");
}
export async function requireReviewDraft(id: string, token: string) {
  const [review] = await getDb().select().from(reviews).where(and(eq(reviews.id, id), eq(reviews.tokenHash, hashToken(token)), eq(reviews.status, "draft")));
  if (!review || Date.now() - new Date(review.createdAt).getTime() > 3600000) throw new HttpError(403, "This review upload session has expired. Please start again.");
  return review;
}
