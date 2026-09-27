# Owner dashboard setup

The private dashboard is available at `/admin`. Unauthenticated visitors are redirected to `/admin/login`.

## Required secrets

Configure both values in the production hosting environment:

- `ADMIN_PASSWORD_HASH`: PBKDF2-SHA256 value formatted as `iterations:salt:hash`.
- `ADMIN_SESSION_SECRET`: at least 32 cryptographically random bytes encoded as base64url.

Local values are stored in the ignored `.env.local` file. Never commit that file or a plaintext password.

## Database

Set `DATABASE_URL` to your Neon connection string and run `pnpm db:migrate`.
The PostgreSQL migration creates bookings, status history, and persistent login
throttling. Configure the same database URL and both admin secrets in Vercel.

## Security behavior

- Owner sessions expire after eight hours.
- Session cookies are HTTP-only, SameSite Strict, and Secure in production.
- Five failed attempts lock the source address for 15 minutes.
- Admin mutations require a valid owner session and same-origin request.
