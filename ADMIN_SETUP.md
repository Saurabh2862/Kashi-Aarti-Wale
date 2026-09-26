# Owner dashboard setup

The private dashboard is available at `/admin`. Unauthenticated visitors are redirected to `/admin/login`.

## Required secrets

Configure both values in the production hosting environment:

- `ADMIN_PASSWORD_HASH`: PBKDF2-SHA256 value formatted as `iterations:salt:hash`.
- `ADMIN_SESSION_SECRET`: at least 32 cryptographically random bytes encoded as base64url.

Local values are stored in the ignored `.dev.vars` file. Never commit that file or a plaintext password.

## Database

Apply every SQL file in `drizzle/` to the production D1 database in filename order. Migration `0001_absurd_molecule_man.sql` adds persistent login throttling.

## Security behavior

- Owner sessions expire after eight hours.
- Session cookies are HTTP-only, SameSite Strict, and Secure in production.
- Five failed attempts lock the source address for 15 minutes.
- Admin mutations require a valid owner session and same-origin request.
