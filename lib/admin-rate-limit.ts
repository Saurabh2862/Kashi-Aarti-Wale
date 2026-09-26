import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminLoginAttempts } from "@/db/schema";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function getLoginLimit(key: string) {
  const [attempt] = await getDb().select().from(adminLoginAttempts).where(eq(adminLoginAttempts.key, key)).limit(1);
  if (!attempt?.lockedUntil) return { blocked: false, retryAfter: 0 };
  const retryAfter = Math.ceil((new Date(attempt.lockedUntil).getTime() - Date.now()) / 1000);
  return { blocked: retryAfter > 0, retryAfter: Math.max(0, retryAfter) };
}

export async function recordLoginFailure(key: string) {
  const db = getDb();
  const [existing] = await db.select().from(adminLoginAttempts).where(eq(adminLoginAttempts.key, key)).limit(1);
  const failedCount = (existing?.failedCount ?? 0) + 1;
  const now = new Date();
  const lockedUntil = failedCount >= MAX_ATTEMPTS
    ? new Date(now.getTime() + LOCK_MINUTES * 60 * 1000).toISOString()
    : null;

  await db.insert(adminLoginAttempts).values({
    key,
    failedCount,
    lockedUntil,
    updatedAt: now.toISOString(),
  }).onConflictDoUpdate({
    target: adminLoginAttempts.key,
    set: { failedCount, lockedUntil, updatedAt: now.toISOString() },
  });
}

export async function clearLoginFailures(key: string) {
  await getDb().delete(adminLoginAttempts).where(eq(adminLoginAttempts.key, key));
}

export async function createLoginKey(request: Request) {
  const address = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "local";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(address));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
