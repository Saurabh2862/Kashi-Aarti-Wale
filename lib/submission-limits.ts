import { createHmac } from "node:crypto";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { submissionLimits } from "@/db/schema";
import { HttpError } from "@/lib/api-guard";

export function visitorKey(request: Request) {
  const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!process.env.ADMIN_SESSION_SECRET) throw new HttpError(503, "Security configuration is unavailable.");
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(ip).digest("hex");
}
export async function consumeLimit(key: string, maximum: number, amount = 1) {
  const day = new Date().toISOString().slice(0, 10);
  const [result] = await getDb().insert(submissionLimits).values({ key: `${day}:${key}`, used: amount, expiresAt: new Date(Date.now() + 2 * 86400000).toISOString() })
    .onConflictDoUpdate({ target: submissionLimits.key, set: { used: sql`${submissionLimits.used} + ${amount}` }, setWhere: sql`${submissionLimits.used} + ${amount} <= ${maximum}` }).returning();
  if (!result || amount > maximum) throw new HttpError(429, "Today's submission or upload allowance has been reached. Please try tomorrow or contact us on WhatsApp.");
}
