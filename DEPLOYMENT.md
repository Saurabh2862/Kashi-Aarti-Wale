# Vercel deployment

Vercel runs the standard Next.js build (`pnpm build`) and serves `.next`.
The local `pnpm dev` preview continues to use Vinext and local Cloudflare D1.
The previous Vinext build is available as `pnpm build:cloudflare`.

## Project settings

- Framework: Next.js
- Root directory: the directory containing package.json (repository root)
- Node.js: 22.x
- Install command: pnpm install --frozen-lockfile
- Build command: pnpm run build
- Output directory: .next

## Link sharing

Share the public production domain listed under Vercel > Settings > Domains,
not the protected `-git-main-` preview URL. A protected deployment returns
Vercel's login preview to WhatsApp instead of this website's metadata.
Keep preview protection enabled and make the production domain public.
Set SITE_URL to your full public HTTPS URL if using a custom domain; otherwise
VERCEL_PROJECT_PRODUCTION_URL provides the metadata image origin automatically.
The shared JPEG is public/social/kashi-aarti-wale.jpg (1200 x 630).
Previously sent messages may retain their cached preview after redeployment.

## Production database and admin

The Vercel server accesses Cloudflare D1 through its authenticated HTTPS API.
Create a production D1 database in your Cloudflare account, or use your existing
production database. The local .wrangler database is not uploaded by Git.
Apply the SQL files in drizzle/ in filename order once to a new database using
the Cloudflare D1 console. Do not reapply migrations to existing tables.

Set these server-only values under Vercel > Settings > Environment Variables:

- CLOUDFLARE_ACCOUNT_ID: the account containing your D1 database
- CLOUDFLARE_DATABASE_ID: the production database UUID
- CLOUDFLARE_API_TOKEN: an API token with Account > D1 > Edit permission scoped to that account
- ADMIN_PASSWORD_HASH: the PBKDF2 value described in ADMIN_SETUP.md
- ADMIN_SESSION_SECRET: the random session signing secret described in ADMIN_SETUP.md

Add the values for Production and, if desired, Preview, then redeploy. Never use
NEXT_PUBLIC_ prefixes for these credentials or commit them to Git. The existing
admin values are in the ignored local .dev.vars file; enter them in Vercel privately.

Public pages can build without database credentials. Booking submission, tracking,
and authenticated dashboard operations require the database and migrations above.
Verify a real booking and status update after configuring production.

The D1 REST API shares Cloudflare account API rate limits. For higher traffic,
replace this adapter with a dedicated authenticated Worker API or a database
connection designed for application traffic.

Reference: https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/raw/
