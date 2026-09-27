# Kashi Aarti Wale

A responsive full-stack booking website for authentic Kashi-style Ganga Aarti ceremonies at weddings, family rituals, homes, and event venues.

## Features

- Responsive ceremony and video experience
- Booking requests with reference numbers
- Customer booking tracking
- Password-protected owner dashboard
- Booking search, filters, and status workflow
- Secure sessions and login throttling
- WhatsApp booking support

## Local development

Requirements: Node.js 22.13 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

The owner dashboard is available at `/admin`. Configure the ignored `.env.local` file as described in `ADMIN_SETUP.md` and `DEPLOYMENT.md`.

## Database

Neon PostgreSQL stores bookings, booking history, and login throttling. Set
`DATABASE_URL` in `.env.local`, then run `pnpm db:migrate`. Migrations are tracked
in `drizzle-postgres/`. The old `drizzle/` folder is a legacy SQLite archive;
do not apply it to Neon. Existing D1 data is not automatically imported.

## Vercel

`pnpm build` creates the standard Next.js `.next` output. See [DEPLOYMENT.md](DEPLOYMENT.md)
for Vercel settings and the required production database and admin environment variables.

## Security

Secrets, local databases, dependencies, and build output are excluded from Git. Never commit `.dev.vars` or plaintext passwords.
