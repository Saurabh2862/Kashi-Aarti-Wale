# Deployment and search visibility

Production website: https://kashi-aarti-wale.vercel.app/

## Vercel

- Framework: Next.js; repository root; Node.js 22.x.
- Install: `pnpm install --frozen-lockfile`.
- Build: `pnpm run build`; output: `.next`.
- Local development: `pnpm dev` runs Next.js on port 5173.

Configure these server-only Production environment variables, then redeploy:

- `DATABASE_URL`: the Neon PostgreSQL connection string.
- `ADMIN_PASSWORD_HASH`: existing PBKDF2 hash from the ignored `.env.local`.
- `ADMIN_SESSION_SECRET`: existing random signing secret from `.env.local`.
- `SITE_URL`: `https://kashi-aarti-wale.vercel.app`.
- Optional `GOOGLE_SITE_VERIFICATION`: Search Console verification token.
- Instagram profile: edit `lib/social-links.ts` to update the visible link and structured data.

Never prefix secrets with `NEXT_PUBLIC_`. Never commit credentials. Do not give
preview deployments production database credentials; use a separate Neon branch.
The retired Cloudflare D1 settings are not needed for this Vercel deployment.

## Neon

Project: `little-field-88883906`, branch: `production`.
Run `pnpm db:migrate` with `.env.local` configured before accepting bookings.
The migration runner records applied migrations and can be rerun safely.
`neon deploy` deploys Neon configuration, not the Next.js website.
Bookings and status-history changes are written in database transactions.
Legacy D1/local SQLite records are not imported by this schema migration.

After deployment, verify booking submission, tracking with the reference and
phone, owner login at `/admin`, and an authenticated status update.

For an automated smoke test, start the app and run
`node --env-file=.env.local scripts/test-bookings.mjs`. It creates and removes
only its UUID-tagged synthetic booking. The app and test must use the same
database. `TEST_BASE_URL` defaults to `http://localhost:5173`; optionally set
`TEST_ADMIN_PASSWORD` to also test password login. Otherwise the script signs a
short-lived owner session using the configured secret to test authorization.

## Google and social sharing

1. Add the production URL as a URL-prefix property in Google Search Console.
2. Set `GOOGLE_SITE_VERIFICATION` to its HTML-tag verification token and redeploy.
3. Verify ownership and submit `https://kashi-aarti-wale.vercel.app/sitemap.xml`.
4. Use URL Inspection to request indexing of the homepage and `/book`.
5. Add the production URL to your Instagram profile's Links section. Set
   `INSTAGRAM_URL` when the business profile is available.

The site includes canonical URLs, a sitemap, robots rules, Organization JSON-LD,
and Open Graph/Twitter image metadata. Admin and tracking pages are noindex.
Search engines control indexing and ranking; neither is immediate or guaranteed.

Share the public production URL, not a protected `-git-main-` preview URL.
Social crawlers cannot read metadata behind Vercel authentication. The preview
image lives at `public/social/kashi-aarti-wale.jpg`; already-sent messages may
retain old cached previews.

References:
- https://vercel.com/docs/environment-variables
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## Brand and policy configuration

Set `SITE_URL` to your custom domain after connecting it in Vercel. Keep the
branded icon at `public/favicon.svg` and the share card in `public/social/`.
No builder attribution badge is part of the application UI.

Privacy and terms templates are in `app/privacy/page.tsx` and `app/terms/page.tsx`.
The business owner should review them for actual retention practices, service
providers, and booking/refund terms, with qualified legal advice where needed.
Update the policies whenever those practices change. Education copy in
`components/about-section.tsx` is supplied by the owner, not independently verified.
