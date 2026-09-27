import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { fileURLToPath } from "node:url";

if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL before running migrations.");
try {
  const db = drizzle(neon(process.env.DATABASE_URL));
  await migrate(db, { migrationsFolder: fileURLToPath(new URL("../drizzle-postgres", import.meta.url)) });
  console.log("Neon schema migrations completed.");
} catch {
  console.error("Neon migration failed. Verify DATABASE_URL, database access, and migration state.");
  process.exitCode = 1;
}
