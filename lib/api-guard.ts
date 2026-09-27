import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function requireOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set([new URL(request.url).origin, process.env.SITE_URL?.replace(/\/$/, "")]);
  if (!origin || !allowed.has(origin)) throw new HttpError(403, "Request rejected. Refresh this page and try again.");
}
export async function requireOwner(request: Request) {
  if (!await getAdminSession()) throw new HttpError(401, "Please sign in to the owner dashboard.");
  if (request.method !== "GET") requireOrigin(request);
}
export async function jsonBody(request: Request) {
  const text = await request.text();
  if (text.length > 16000) throw new HttpError(413, "Request is too large.");
  try { return JSON.parse(text); } catch { throw new HttpError(400, "Invalid request. Please try again."); }
}
export function apiError(error: unknown) {
  const status = error instanceof HttpError ? error.status : 503;
  return NextResponse.json({ error: error instanceof HttpError ? error.message : "This service is temporarily unavailable. Please try again." }, { status, headers: { "Cache-Control": "no-store" } });
}
