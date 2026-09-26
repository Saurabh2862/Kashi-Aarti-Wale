import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "./schema";

type D1Response = {
  success: boolean;
  result?: { success: boolean; results?: { rows?: unknown[][] } }[];
};

export function getDb() {
  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_API_TOKEN } = process.env;
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_DATABASE_ID || !CLOUDFLARE_API_TOKEN) {
    throw new Error("Production database is not configured. See DEPLOYMENT.md for the required D1 environment variables.");
  }
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(CLOUDFLARE_ACCOUNT_ID)}/d1/database/${encodeURIComponent(CLOUDFLARE_DATABASE_ID)}/raw`;
  return drizzle(async (sql, params, method) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql, params }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Database request failed (${response.status}).`);
    const payload = await response.json() as D1Response;
    const result = payload.result?.[0];
    if (!payload.success || !result?.success) throw new Error("Database query failed.");
    const rows = result.results?.rows ?? [];
    return { rows: method === "get" ? rows[0] : rows };
  }, { schema });
}
