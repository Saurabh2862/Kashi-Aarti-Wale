import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "kaw_admin_session";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

type AdminEnvironment = {
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
};

type SessionPayload = {
  sub: "owner";
  exp: number;
};

function getAdminEnvironment() {
  const runtime = env as unknown as AdminEnvironment;
  if (!runtime.ADMIN_PASSWORD_HASH || !runtime.ADMIN_SESSION_SECRET) {
    throw new Error("Admin authentication secrets are not configured.");
  }
  return runtime as Required<AdminEnvironment>;
}

export async function verifyAdminPassword(password: string) {
  const { ADMIN_PASSWORD_HASH } = getAdminEnvironment();
  const [iterationsValue, saltValue, expectedValue] = ADMIN_PASSWORD_HASH.split(":");
  const iterations = Number(iterationsValue);
  if (!iterations || !saltValue || !expectedValue) return false;

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const actual = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: decodeBase64Url(saltValue), iterations },
    keyMaterial,
    256,
  ));
  return constantTimeEqual(actual, decodeBase64Url(expectedValue));
}

export async function createAdminSessionToken() {
  const payload: SessionPayload = {
    sub: "owner",
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
  };
  const encodedPayload = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  return `${encodedPayload}.${await sign(encodedPayload)}`;
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const [payloadValue, signatureValue] = token.split(".");
  if (!payloadValue || !signatureValue) return null;

  let expected: string;
  try {
    expected = await sign(payloadValue);
  } catch {
    return null;
  }
  if (!constantTimeEqual(decodeBase64Url(signatureValue), decodeBase64Url(expected))) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(payloadValue))) as SessionPayload;
    if (payload.sub !== "owner" || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

async function sign(value: string) {
  const { ADMIN_SESSION_SECRET } = getAdminEnvironment();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return encodeBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  let mismatch = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) mismatch |= (left[index] ?? 0) ^ (right[index] ?? 0);
  return mismatch === 0;
}

function encodeBase64Url(value: Uint8Array) {
  let binary = "";
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(normalized);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
