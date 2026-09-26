import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  createAdminSessionToken,
  isSameOrigin,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import {
  clearLoginFailures,
  createLoginKey,
  getLoginLimit,
  recordLoginFailure,
} from "@/lib/admin-rate-limit";

const loginSchema = z.object({ password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Request rejected" }, { status: 403 });

  try {
    const parsed = loginSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Enter your password." }, { status: 400 });

    const loginKey = await createLoginKey(request);
    const limit = await getLoginLimit(loginKey);
    if (limit.blocked) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    if (!await verifyAdminPassword(parsed.data.password)) {
      await recordLoginFailure(loginKey);
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    await clearLoginFailures(loginKey);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, await createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_SECONDS,
    });
    return response;
  } catch (error) {
    console.error("Admin login unavailable", error);
    return NextResponse.json({ error: "Owner login is temporarily unavailable." }, { status: 503 });
  }
}
